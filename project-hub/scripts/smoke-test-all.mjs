#!/usr/bin/env node
// Fleet smoke test: boot every prototype + the proto-base and confirm each one
// actually renders (HTTP 200, real DOM content, no uncaught page errors). Run
// this after any change to the proto-base or the Hub's install logic so a
// regression (like the grizmo react-router break) surfaces immediately.
//
//   node scripts/smoke-test-all.mjs            # all targets
//   node scripts/smoke-test-all.mjs grizmo     # only matching names
//
// Read-only: it does not install or modify anything; it just runs each
// prototype's existing `yarn start`. Exits non-zero if any target fails.

import { execFileSync, spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const FREDDY_ROOT = process.env.FREDDY_ROOT ?? "/Users/frankoverland/freddy";
const PROTO_BASE = path.join(FREDDY_ROOT, "proto-base");
const PROJECTS = path.join(FREDDY_ROOT, "projects");
const GLOBAL_MODULES = execFileSync("npm", ["root", "-g"]).toString().trim();
const { chromium } = await import(`${GLOBAL_MODULES}/playwright/index.js`).then(
  (m) => m.default ?? m,
);
const filter = process.argv.slice(2);

function hasProto(dir) {
  return existsSync(path.join(dir, "package.json"));
}

function discoverTargets() {
  const out = [{ name: "proto-base", dir: PROTO_BASE }];
  for (const slug of readdirSync(PROJECTS)) {
    const proj = path.join(PROJECTS, slug);
    const proto = path.join(proj, "prototype");
    if (hasProto(proto)) out.push({ name: slug, dir: proto });
    const variantsDir = path.join(proj, "variants");
    if (existsSync(variantsDir)) {
      for (const v of readdirSync(variantsDir)) {
        const vproto = path.join(variantsDir, v, "prototype");
        if (hasProto(vproto)) out.push({ name: `${slug}/${v}`, dir: vproto });
      }
    }
  }
  return filter.length
    ? out.filter((t) => filter.some((f) => t.name.includes(f)))
    : out;
}

function killPort(port) {
  try {
    const pids = execFileSync("lsof", ["-ti", `tcp:${port}`]).toString().trim();
    if (pids) execFileSync("kill", pids.split("\n"));
  } catch {
    /* nothing listening */
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function check(target, port) {
  killPort(port);
  const child = spawn("yarn", ["start"], {
    cwd: target.dir,
    env: { ...process.env, VITE_PORT: String(port), PORT: String(port) },
    stdio: "ignore",
  });
  try {
    // wait for the dev server to answer
    let up = false;
    for (let i = 0; i < 60; i++) {
      try {
        const res = await fetch(`http://localhost:${port}/`);
        if (res.ok) { up = true; break; }
      } catch { /* not ready */ }
      await sleep(1000);
    }
    if (!up) return { ...target, ok: false, reason: "never responded" };

    const browser = await chromium.launch();
    const page = await browser.newPage();
    const pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));
    let httpOk = false;
    try {
      const resp = await page.goto(`http://localhost:${port}/`, {
        waitUntil: "networkidle",
        timeout: 45000,
      });
      httpOk = !!resp && resp.status() === 200;
    } catch (e) {
      pageErrors.push("goto: " + e.message);
    }
    await page.waitForTimeout(2500);
    const info = await page.evaluate(() => {
      const root = document.getElementById("root") || document.body.firstElementChild;
      return {
        rootChildren: root ? root.childElementCount : 0,
        bodyTextLen: (document.body.innerText || "").trim().length,
      };
    });
    await browser.close();
    const ok = httpOk && info.rootChildren > 0 && info.bodyTextLen > 200 && pageErrors.length === 0;
    return { ...target, ok, httpOk, ...info, pageErrors: pageErrors.slice(0, 3) };
  } finally {
    try { child.kill(); } catch { /* already gone */ }
    killPort(port);
  }
}

const targets = discoverTargets();
console.log(`Smoke-testing ${targets.length} target(s)…\n`);
const results = [];
let port = 5300;
for (const t of targets) {
  process.stdout.write(`  ${t.name.padEnd(28)} `);
  const r = await check(t, port++);
  results.push(r);
  console.log(
    r.ok
      ? `✓ render ok (${r.bodyTextLen} chars)`
      : `✗ FAIL (${r.reason ?? `http=${r.httpOk} children=${r.rootChildren} errors=${(r.pageErrors || []).join("; ")}`})`,
  );
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed.`);
if (failed.length) {
  console.log("FAILED: " + failed.map((f) => f.name).join(", "));
  process.exit(1);
}
