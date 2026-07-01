#!/usr/bin/env node
// Generate the Claude-consumable markdown layer of the design references FROM
// the content JSON (the single source of truth that also drives the Hub UI at
// /design-system and /design-patterns).
//
//   node scripts/build-design-refs-md.mjs
//
// Per resource dir it writes:
//   <root>/<entriesDir>/<slug>.md   — one doc per entry
//   <root>/CLAUDE.md                — entry point: how to consume + index
//
// Everything generated is overwritten on each run — never hand-edit the md;
// edit the JSON and re-run.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HUB_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const TARGETS = [
  {
    kind: "system",
    root: path.join(HUB_ROOT, "resources", "excalibrr-design-system"),
    entriesDir: "components",
    title: "Excalibrr Design System — component reference",
    hubPath: "/design-system",
    preamble: `This is the component reference for **Excalibrr** (\`@gravitate-js/excalibrr\`) —
the React component library every Gravitate prototype is built with. One doc
per component area: what it is, captured specimens of its real rendered states,
the props that matter, correct usage code, and the gotchas that bite.

How to use this reference when building prototype UI:

1. Find the component area in the index below and read its doc BEFORE writing
   code that uses those components — copy the usage snippets rather than
   guessing props.
2. The specimen images under \`specimens/\` are captures of the REAL components
   rendered in the Excalibrr demo — read them to see exact visual states.
3. Treat the Gotchas sections as hard constraints; they encode real bugs
   previous sessions hit.
4. For layout-level questions (how to compose these into forms, pages,
   drawers, spacing) use the sibling rulebook:
   \`../excalibrr-design-patterns/CLAUDE.md\`.

Browse the same content visually in the Project Hub at
http://localhost:5174/design-system.`,
  },
  {
    kind: "patterns",
    root: path.join(HUB_ROOT, "resources", "excalibrr-design-patterns"),
    entriesDir: "patterns",
    title: "Excalibrr Design Patterns — layout rulebook",
    hubPath: "/design-patterns",
    preamble: `This is the layout rulebook for Gravitate prototype UI — how Excalibrr
components compose into real screens. One doc per pattern: the rules (stated as
laws with the "why"), spacing tokens, captured examples from the live demo, and
do's/don'ts.

How to use this rulebook when designing or building a screen:

1. Start from the pattern that matches what you're building (a form, a page
   layout, a drawer, a card grid) and follow its rules — they exist so every
   prototype lands consistent without re-deriving decisions.
2. Spacing/token tables are normative: use the named token, not a raw px value.
3. Some production screens violate these rules; the rulebook is the idealized
   standard. When a production screen and this doc disagree, FOLLOW THIS DOC.
4. For what an individual component is and its props, use the sibling
   component reference: \`../excalibrr-design-system/CLAUDE.md\`.

Browse the same content visually in the Project Hub at
http://localhost:5174/design-patterns.`,
  },
  {
    kind: "wireframe",
    root: path.join(HUB_ROOT, "resources", "wireframe-design-system-ref"),
    entriesDir: "entries",
    title: "Gravitate Wireframe Design System — lo-fi component reference",
    hubPath: "/wireframe-system",
    preamble: `This is the component reference for the **Gravitate Wireframe Design System** —
the plain HTML + CSS kit lo-fi prototype rounds are built with (the \`wf-\`
class system, vendored at \`../wireframe-design-system/\`). One doc per area:
what it is, captured specimens of its real rendered states, the CSS class API,
correct HTML usage, and the gotchas that bite.

How to use this reference when building a lo-fi wireframe round:

1. Find the area below and read its doc BEFORE writing markup — copy the HTML
   snippets and use the documented \`wf-\` classes rather than inventing styles.
2. The specimen images under \`specimens/\` are captures of the REAL components
   rendered from the wireframe kit — read them to see exact visual states.
3. The Variants tables ARE the API: there are no React props here, only CSS
   modifier classes. Use the named class, never an ad-hoc style.
4. Treat the Rules and Gotchas as hard constraints — they encode the system's
   density, color-intent, and accessibility laws (full rationale lives in the
   raw source's \`../wireframe-design-system/DESIGN.md\`).

This is the lo-fi sibling of the hi-fi Excalibrr references
(\`../excalibrr-design-system/CLAUDE.md\`, \`../excalibrr-design-patterns/CLAUDE.md\`).
Browse the same content visually in the Project Hub at
http://localhost:5174/wireframe-system.`,
  },
];

function escapeCell(text) {
  return String(text).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function table(head, rows) {
  const lines = [
    `| ${head.join(" | ")} |`,
    `| ${head.map(() => "---").join(" | ")} |`,
    ...rows.map((cells) => `| ${cells.map(escapeCell).join(" | ")} |`),
  ];
  return lines.join("\n");
}

function renderBlock(block) {
  switch (block.type) {
    case "specimen": {
      const lines = [`### ${block.title}`, "", `![${block.title}](../${block.image})`];
      if (block.caption) lines.push("", `*${block.caption}*`);
      return lines.join("\n");
    }
    case "usage":
      return [block.title ? `### ${block.title}\n` : null, block.body]
        .filter(Boolean)
        .join("\n");
    case "props":
      return [
        `### ${block.title}`,
        block.intro ? `\n${block.intro}` : null,
        "",
        table(
          ["Prop", "Type", "Default", "Notes"],
          block.rows.map((r) => [`\`${r.prop}\``, `\`${r.type}\``, r.default ? `\`${r.default}\`` : "—", r.notes]),
        ),
      ]
        .filter((x) => x !== null)
        .join("\n");
    case "variants":
      return [
        `### ${block.title}`,
        block.intro ? `\n${block.intro}` : null,
        "",
        table(
          ["Variant", "When to use", "Code"],
          block.rows.map((r) => [`\`${r.name}\``, r.when, r.code ? `\`${r.code}\`` : "—"]),
        ),
      ]
        .filter((x) => x !== null)
        .join("\n");
    case "tokens":
      return [
        `### ${block.title}`,
        block.intro ? `\n${block.intro}` : null,
        "",
        table(
          ["Token", "Value", "Use for"],
          block.rows.map((r) => [`\`${r.token}\``, `\`${r.value}\``, r.use]),
        ),
      ]
        .filter((x) => x !== null)
        .join("\n");
    case "code": {
      const lines = [];
      if (block.title) lines.push(`### ${block.title}`, "");
      lines.push("```" + (block.lang ?? "tsx"), block.code, "```");
      if (block.note) lines.push("", block.note);
      return lines.join("\n");
    }
    case "dosdonts": {
      const lines = [`### ${block.title ?? "Do's & Don'ts"}`, ""];
      for (const item of block.items) {
        lines.push(`- **Do:** ${item.do}`);
        lines.push(`  **Don't:** ${item.dont}`);
        if (item.why) lines.push(`  **Why:** ${item.why}`);
      }
      return lines.join("\n");
    }
    case "gotchas": {
      const lines = [`### ${block.title ?? "Gotchas"}`, ""];
      for (const item of block.items) {
        lines.push(`- **${item.title}** — ${item.detail}`);
      }
      return lines.join("\n");
    }
    case "rules": {
      const lines = [`### ${block.title}`];
      if (block.intro) lines.push("", block.intro);
      lines.push("");
      block.items.forEach((item, i) => {
        lines.push(`${i + 1}. **${item.rule}**${item.why ? ` — ${item.why}` : ""}`);
      });
      return lines.join("\n");
    }
    default:
      return "";
  }
}

function renderEntry(entry, target) {
  const parts = [
    `# ${entry.title}`,
    "",
    entry.intro,
    "",
    `> Part of the ${target.title}. Index: \`../CLAUDE.md\`.` +
      (entry.demoPath
        ? ` Live page in the Excalibrr demo: \`${entry.demoPath}\` (demo runs at http://localhost:3000).`
        : ""),
    "",
  ];
  for (const block of entry.blocks) {
    parts.push(renderBlock(block), "");
  }
  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function renderIndex(entries, target) {
  const groups = [];
  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && last.group === entry.group) last.items.push(entry);
    else groups.push({ group: entry.group, items: [entry] });
  }
  const lines = [
    `# ${target.title}`,
    "",
    "<!-- GENERATED by scripts/build-design-refs-md.mjs from content/*.json — do not hand-edit. -->",
    "",
    target.preamble,
    "",
    "## Index",
    "",
  ];
  for (const { group, items } of groups) {
    lines.push(`### ${group}`, "");
    for (const entry of items) {
      lines.push(`- [${entry.title}](${target.entriesDir}/${entry.slug}.md) — ${entry.intro}`);
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}

for (const target of TARGETS) {
  const contentDir = path.join(target.root, "content");
  if (!fs.existsSync(contentDir)) {
    console.log(`skip ${target.kind}: no content dir`);
    continue;
  }
  const entries = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(contentDir, f), "utf8")))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title));

  const entriesDir = path.join(target.root, target.entriesDir);
  fs.rmSync(entriesDir, { recursive: true, force: true });
  fs.mkdirSync(entriesDir, { recursive: true });

  for (const entry of entries) {
    fs.writeFileSync(path.join(entriesDir, `${entry.slug}.md`), renderEntry(entry, target), "utf8");
  }
  fs.writeFileSync(path.join(target.root, "CLAUDE.md"), renderIndex(entries, target), "utf8");
  console.log(`${target.kind}: wrote ${entries.length} entry docs + CLAUDE.md`);
}
