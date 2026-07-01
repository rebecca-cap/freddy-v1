#!/usr/bin/env node
// Validate design-ref content JSON against the RefEntry schema
// (src/lib/designRefs.ts) and check every referenced specimen image exists.
//
//   node scripts/validate-design-refs.mjs                 # validate everything
//   node scripts/validate-design-refs.mjs <file.json>...  # validate specific files
//
// Exit 0 = all valid. Exit 1 = problems, listed one per line as
//   <file>: <problem>

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HUB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOTS = {
  system: path.join(HUB_ROOT, "resources", "excalibrr-design-system"),
  patterns: path.join(HUB_ROOT, "resources", "excalibrr-design-patterns"),
  wireframe: path.join(HUB_ROOT, "resources", "wireframe-design-system-ref"),
};

const BLOCK_VALIDATORS = {
  specimen(b, root) {
    const problems = [];
    if (!isNonEmptyString(b.title)) problems.push("specimen.title required");
    if (!isNonEmptyString(b.image)) problems.push("specimen.image required");
    else {
      if (path.isAbsolute(b.image) || b.image.includes(".."))
        problems.push(`specimen.image must be relative within the resource dir: ${b.image}`);
      else if (!fs.existsSync(path.join(root, b.image)))
        problems.push(`specimen image missing on disk: ${b.image}`);
    }
    if (b.caption !== undefined && !isNonEmptyString(b.caption))
      problems.push("specimen.caption must be a non-empty string when present");
    return problems;
  },
  usage(b) {
    return isNonEmptyString(b.body) ? [] : ["usage.body required"];
  },
  props(b) {
    return rowsProblems(b, ["prop", "type", "notes"], { optional: ["default"] });
  },
  variants(b) {
    return rowsProblems(b, ["name", "when"], { optional: ["code"] });
  },
  tokens(b) {
    return rowsProblems(b, ["token", "value", "use"]);
  },
  code(b) {
    return isNonEmptyString(b.code) ? [] : ["code.code required"];
  },
  dosdonts(b) {
    if (!Array.isArray(b.items) || b.items.length === 0) return ["dosdonts.items required"];
    return b.items.flatMap((item, i) => {
      const p = [];
      if (!isNonEmptyString(item.do)) p.push(`dosdonts.items[${i}].do required`);
      if (!isNonEmptyString(item.dont)) p.push(`dosdonts.items[${i}].dont required`);
      return p;
    });
  },
  gotchas(b) {
    if (!Array.isArray(b.items) || b.items.length === 0) return ["gotchas.items required"];
    return b.items.flatMap((item, i) => {
      const p = [];
      if (!isNonEmptyString(item.title)) p.push(`gotchas.items[${i}].title required`);
      if (!isNonEmptyString(item.detail)) p.push(`gotchas.items[${i}].detail required`);
      return p;
    });
  },
  rules(b) {
    if (!isNonEmptyString(b.title)) return ["rules.title required"];
    if (!Array.isArray(b.items) || b.items.length === 0) return ["rules.items required"];
    return b.items.flatMap((item, i) =>
      isNonEmptyString(item.rule) ? [] : [`rules.items[${i}].rule required`],
    );
  },
};

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function rowsProblems(b, required, { optional = [] } = {}) {
  const problems = [];
  if (!isNonEmptyString(b.title)) problems.push(`${b.type}.title required`);
  if (!Array.isArray(b.rows) || b.rows.length === 0) {
    problems.push(`${b.type}.rows required`);
    return problems;
  }
  b.rows.forEach((row, i) => {
    for (const key of required) {
      if (!isNonEmptyString(row[key])) problems.push(`${b.type}.rows[${i}].${key} required`);
    }
    for (const key of optional) {
      if (row[key] !== undefined && typeof row[key] !== "string")
        problems.push(`${b.type}.rows[${i}].${key} must be a string when present`);
    }
  });
  return problems;
}

function validateEntry(filePath, root) {
  const problems = [];
  let entry;
  try {
    entry = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    return [`invalid JSON: ${err.message}`];
  }

  if (!isNonEmptyString(entry.slug)) problems.push("slug required");
  else if (!/^[a-z0-9-]+$/.test(entry.slug)) problems.push(`slug must be kebab-case: ${entry.slug}`);
  else if (path.basename(filePath) !== `${entry.slug}.json`)
    problems.push(`filename must match slug (${entry.slug}.json)`);

  if (!isNonEmptyString(entry.title)) problems.push("title required");
  if (typeof entry.order !== "number") problems.push("order (number) required");
  if (!isNonEmptyString(entry.group)) problems.push("group required");
  if (!isNonEmptyString(entry.intro)) problems.push("intro required");
  if (entry.demoPath !== undefined && !/^\/[A-Za-z0-9/_-]+$/.test(entry.demoPath ?? ""))
    problems.push(`demoPath must be a /route path: ${entry.demoPath}`);
  if (entry.searchTerms !== undefined && !Array.isArray(entry.searchTerms))
    problems.push("searchTerms must be an array when present");

  if (!Array.isArray(entry.blocks) || entry.blocks.length === 0) {
    problems.push("blocks (non-empty array) required");
    return problems;
  }

  entry.blocks.forEach((block, i) => {
    const validate = BLOCK_VALIDATORS[block?.type];
    if (!validate) {
      problems.push(`blocks[${i}]: unknown type "${block?.type}"`);
      return;
    }
    for (const p of validate(block, root)) problems.push(`blocks[${i}]: ${p}`);
  });

  const specimenCount = entry.blocks.filter((b) => b?.type === "specimen").length;
  if (specimenCount === 0) problems.push("at least one specimen block required");

  return problems;
}

function targetFiles() {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    return args.map((a) => {
      const abs = path.resolve(a);
      const kind = abs.includes("wireframe-design-system-ref")
        ? "wireframe"
        : abs.includes("excalibrr-design-system")
          ? "system"
          : "patterns";
      return { file: abs, root: ROOTS[kind] };
    });
  }
  const out = [];
  for (const root of Object.values(ROOTS)) {
    const contentDir = path.join(root, "content");
    if (!fs.existsSync(contentDir)) continue;
    for (const f of fs.readdirSync(contentDir).filter((f) => f.endsWith(".json"))) {
      out.push({ file: path.join(contentDir, f), root });
    }
  }
  return out;
}

const targets = targetFiles();
if (targets.length === 0) {
  console.log("No content files found.");
  process.exit(0);
}

let failed = false;
for (const { file, root } of targets) {
  const problems = validateEntry(file, root);
  const rel = path.relative(HUB_ROOT, file);
  if (problems.length === 0) {
    console.log(`OK ${rel}`);
  } else {
    failed = true;
    for (const p of problems) console.error(`FAIL ${rel}: ${p}`);
  }
}
process.exit(failed ? 1 : 0);
