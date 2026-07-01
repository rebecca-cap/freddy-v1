import { ChildProcess, spawn } from "node:child_process";
import { getProjectBySlug } from "./projects.js";
import { getVariant } from "./store.js";
import { ensureNodeModulesInstalled } from "./node-modules.js";
import { protoBaseFor, protoBasePathForProduct, type ProtoBaseId } from "./paths.js";

/**
 * Each product's proto-base is a managed RunTarget too, so the hub can
 * start/stop it like any project. Reserved key (double-underscore + id) so it
 * can never collide with a project slug — one key per proto-base
 * (`__proto-base-pe__`, `__proto-base-ss__`). The path + port for each id come
 * from the PROTO_BASES registry in paths.ts (pe -> :5173, ss -> :5175).
 */
function protoBaseKey(id: ProtoBaseId): string {
  return `__proto-base-${id}__`;
}

/**
 * A unit the dev-server machinery can run: identified by a unique in-memory
 * `key`, booting `yarn start` from `prototypePath` on `port`.
 *
 * Projects use a bare slug as the key; variants use a composite
 * `${slug}#${vSlug}` so the two namespaces never collide.
 */
export interface RunTarget {
  key: string;
  prototypePath: string;
  port: number;
  // Proto-base repo to install node_modules from on first start (pe vs ss/OSP).
  // Resolved from the project/variant's product; defaults to the PE base.
  baseRepo?: string;
}

function variantKey(slug: string, vSlug: string): string {
  return `${slug}#${vSlug}`;
}

interface RunningProcess {
  child: ChildProcess;
  startedAt: string;
  port: number;
  url: string;
  logs: string[]; // ring buffer
}

const MAX_LOG_LINES = 200;
const running = new Map<string, RunningProcess>();

function pushLog(slug: string, line: string): void {
  const proc = running.get(slug);
  if (!proc) return;
  proc.logs.push(line);
  if (proc.logs.length > MAX_LOG_LINES) {
    proc.logs.splice(0, proc.logs.length - MAX_LOG_LINES);
  }
}

export function isRunning(slug: string): boolean {
  return running.has(slug);
}

export function statusFor(slug: string): {
  running: boolean;
  url?: string;
  startedAt?: string;
  pid?: number;
} {
  const proc = running.get(slug);
  if (!proc) return { running: false };
  return {
    running: true,
    url: proc.url,
    startedAt: proc.startedAt,
    pid: proc.child.pid,
  };
}

export function getRecentLogs(slug: string): string[] {
  return running.get(slug)?.logs.slice() ?? [];
}

/**
 * Boot a dev server for a generic RunTarget. Keyed by `t.key` in the in-memory
 * `running` Map. Idempotent: if the key is already running, returns the live url.
 */
async function startTarget(t: RunTarget): Promise<{
  url: string;
  pid?: number;
}> {
  if (running.has(t.key)) {
    const cur = running.get(t.key)!;
    return { url: cur.url, pid: cur.child.pid };
  }

  await ensureNodeModulesInstalled(t.prototypePath, t.baseRepo);

  const child = spawn("yarn", ["start"], {
    cwd: t.prototypePath,
    env: {
      ...process.env,
      VITE_PORT: String(t.port),
      PORT: String(t.port),
    },
    detached: false,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const url = `http://localhost:${t.port}`;
  const proc: RunningProcess = {
    child,
    startedAt: new Date().toISOString(),
    port: t.port,
    url,
    logs: [],
  };
  running.set(t.key, proc);

  child.stdout?.on("data", (buf) => pushLog(t.key, buf.toString()));
  child.stderr?.on("data", (buf) => pushLog(t.key, buf.toString()));
  child.on("exit", (code, signal) => {
    pushLog(t.key, `\n[process exited code=${code} signal=${signal}]\n`);
    running.delete(t.key);
  });
  child.on("error", (err) => {
    pushLog(t.key, `\n[spawn error] ${err.message}\n`);
    running.delete(t.key);
  });

  // Surface immediate spawn failures (port taken, missing sibling, vite blow-up)
  // to the API caller. Vite typically binds in ~400ms; 1500ms is plenty of headroom.
  const earlyExit = await Promise.race<
    { code: number | null; signal: NodeJS.Signals | null } | null
  >([
    new Promise((resolve) => {
      child.once("exit", (code, signal) => resolve({ code, signal }));
    }),
    new Promise((resolve) => setTimeout(() => resolve(null), 1500)),
  ]);

  if (earlyExit) {
    const tail = proc.logs.slice(-15).join("").trim();
    running.delete(t.key);
    const detail = tail || `exit code ${earlyExit.code}`;
    throw new Error(`Dev server exited immediately:\n${detail}`);
  }

  return { url, pid: child.pid };
}

async function stopTarget(key: string): Promise<void> {
  const proc = running.get(key);
  if (!proc) return;
  try {
    proc.child.kill("SIGTERM");
  } catch {
    /* ignore */
  }
  // Give it a moment, then SIGKILL if still alive.
  await new Promise((r) => setTimeout(r, 800));
  if (running.has(key)) {
    try {
      proc.child.kill("SIGKILL");
    } catch {
      /* ignore */
    }
    running.delete(key);
  }
}

export async function startDevServer(slug: string): Promise<{
  url: string;
  pid?: number;
}> {
  const record = await getProjectBySlug(slug);
  if (!record) throw new Error(`No project with slug "${slug}"`);
  return startTarget({
    key: slug,
    prototypePath: record.prototypePath,
    port: record.port,
    baseRepo: protoBasePathForProduct(record.product),
  });
}

export async function stopDevServer(slug: string): Promise<void> {
  await stopTarget(slug);
}

export function isVariantRunning(slug: string, vSlug: string): boolean {
  return running.has(variantKey(slug, vSlug));
}

export function statusForVariant(
  slug: string,
  vSlug: string,
): ReturnType<typeof statusFor> {
  return statusFor(variantKey(slug, vSlug));
}

export async function startVariantDevServer(
  slug: string,
  vSlug: string,
): Promise<{ url: string; pid: number }> {
  const variant = await getVariant(slug, vSlug);
  if (!variant) {
    throw Object.assign(
      new Error(`No variant "${vSlug}" on project "${slug}"`),
      { status: 404 },
    );
  }
  // A variant lives in the same base repo as its parent project — resolve the
  // install baseRepo from the parent's product (variants don't carry product).
  const parent = await getProjectBySlug(slug);
  const { url, pid } = await startTarget({
    key: variantKey(slug, vSlug),
    prototypePath: variant.prototypePath,
    port: variant.port,
    baseRepo: protoBasePathForProduct(parent?.product),
  });
  return { url, pid: pid! };
}

export async function stopVariantDevServer(
  slug: string,
  vSlug: string,
): Promise<void> {
  await stopTarget(variantKey(slug, vSlug));
}

// --- proto-base dev servers (one per product) ---
// All four wrappers take a proto-base id, defaulting to 'pe' so existing
// no-arg callers (the back-compat unparameterized routes) keep hitting PE.
// protoBaseFor() resolves the id (defaulting unknown -> pe) plus its path+port.

export function statusForProtoBase(
  id: string = "pe",
): ReturnType<typeof statusFor> {
  return statusFor(protoBaseKey(protoBaseFor(id).id));
}

export function getProtoBaseLogs(id: string = "pe"): string[] {
  return getRecentLogs(protoBaseKey(protoBaseFor(id).id));
}

export async function startProtoBase(
  id: string = "pe",
): Promise<{ url: string; pid?: number }> {
  const b = protoBaseFor(id);
  return startTarget({
    key: protoBaseKey(b.id),
    prototypePath: b.path,
    port: b.port,
  });
}

export async function stopProtoBase(id: string = "pe"): Promise<void> {
  await stopTarget(protoBaseKey(protoBaseFor(id).id));
}

export async function stopAll(): Promise<void> {
  const keys = Array.from(running.keys());
  await Promise.all(keys.map((k) => stopTarget(k)));
}
