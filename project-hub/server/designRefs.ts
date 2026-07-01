import fs from "node:fs/promises";
import path from "node:path";
import {
  EXCALIBRR_DESIGN_PATTERNS_PATH,
  EXCALIBRR_DESIGN_SYSTEM_PATH,
  WIREFRAME_DESIGN_REF_PATH,
} from "./paths.js";

// Server twin of src/lib/designRefs.ts. The API treats entries as opaque
// JSON — only the fields needed for listing/sorting are typed here; full
// shape validation belongs to scripts/validate-design-refs.mjs.
export type RefKind = "system" | "patterns" | "wireframe";

interface RefEntryLike {
  slug?: unknown;
  title?: unknown;
  order?: unknown;
  [key: string]: unknown;
}

export function designRefRoot(kind: string): string | null {
  if (kind === "system") return EXCALIBRR_DESIGN_SYSTEM_PATH;
  if (kind === "patterns") return EXCALIBRR_DESIGN_PATTERNS_PATH;
  if (kind === "wireframe") return WIREFRAME_DESIGN_REF_PATH;
  return null;
}

/**
 * Read every content/*.json under the resource root, sorted by `order` then
 * title. A malformed file is skipped and reported in `warnings` rather than
 * failing the whole listing — one bad agent-written JSON must never blank the
 * page.
 */
export async function listDesignRefEntries(
  kind: RefKind,
): Promise<{ entries: RefEntryLike[]; warnings: string[] }> {
  const root = designRefRoot(kind);
  if (!root) return { entries: [], warnings: [] };
  const contentDir = path.join(root, "content");

  let files: string[] = [];
  try {
    files = (await fs.readdir(contentDir)).filter((f) => f.endsWith(".json"));
  } catch {
    return { entries: [], warnings: [] };
  }

  const entries: RefEntryLike[] = [];
  const warnings: string[] = [];
  for (const file of files) {
    try {
      const raw = await fs.readFile(path.join(contentDir, file), "utf8");
      const parsed = JSON.parse(raw) as RefEntryLike;
      if (typeof parsed?.slug !== "string" || typeof parsed?.title !== "string") {
        warnings.push(`${file}: missing slug/title`);
        continue;
      }
      entries.push(parsed);
    } catch (err: any) {
      warnings.push(`${file}: ${err?.message ?? "unreadable"}`);
    }
  }

  entries.sort((a, b) => {
    const ao = typeof a.order === "number" ? a.order : 999;
    const bo = typeof b.order === "number" ? b.order : 999;
    if (ao !== bo) return ao - bo;
    return String(a.title).localeCompare(String(b.title));
  });

  return { entries, warnings };
}

/**
 * Resolve a file inside a design-ref resource dir (specimen images, generated
 * markdown). Rejects path traversal outside the resource root.
 */
export async function resolveDesignRefFile(
  kind: string,
  rel: string,
): Promise<string | null> {
  const root = designRefRoot(kind);
  if (!root) return null;
  const abs = path.resolve(root, rel);
  if (abs !== root && !abs.startsWith(root + path.sep)) return null;
  try {
    const stat = await fs.stat(abs);
    if (!stat.isFile()) return null;
  } catch {
    return null;
  }
  return abs;
}
