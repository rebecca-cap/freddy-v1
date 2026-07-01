import fs from "node:fs/promises";
import path from "node:path";
import { HUB_DATA_DIR, HUB_PROJECTS_FILE } from "./paths.js";

export interface VersionRecord {
  label: string; // "v1", "v2", …
  hash: string; // commit hash the version points at
  createdAt: string; // ISO
  // Monotonic high-water mark for variation letter suffixes anchored to this
  // version. charCode of the NEXT suffix to hand out (starts at "b" = 98).
  // Persisted so deleting a variation never frees its letter for reuse.
  nextSuffix?: number;
}

export interface VariantRecord {
  slug: string;
  name: string;
  description?: string;
  branch: string;
  port: number;
  createdAt: string; // ISO
  prototypePath: string;
  variantPath: string;
  label: string; // "v1b" — version letter-suffixed
  parentVersion: string; // "v1" — version this variation forked from
  promotedTo?: string; // "v3" — version stamped when this variation was promoted
}

export interface ProjectRecord {
  slug: string;
  name: string;
  description?: string;
  product?: string; // one of sdi|pe|ss
  branch: string;
  port: number;
  createdAt: string; // ISO
  prototypePath: string;
  projectPath: string;
  variants?: VariantRecord[];
  versions?: VersionRecord[];
  pinned?: boolean;
  // The ONLY stored lifecycle flag — every other phase is derived at read time
  // (see phase.ts). Absent on records created before the field existed.
  archived?: boolean;
  // Stamped from the machine identity (git config / gh) at creation.
  // Absent on records created before the field existed.
  creator?: { name: string; githubLogin?: string; avatarUrl?: string };
}

export interface StoreShape {
  projects: ProjectRecord[];
}

const EMPTY: StoreShape = { projects: [] };

async function ensureDir(): Promise<void> {
  await fs.mkdir(HUB_DATA_DIR, { recursive: true });
}

export async function readStore(): Promise<StoreShape> {
  await ensureDir();
  try {
    const raw = await fs.readFile(HUB_PROJECTS_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoreShape;
    if (!parsed.projects) return { projects: [] };
    return parsed;
  } catch (err: any) {
    if (err && err.code === "ENOENT") return { ...EMPTY };
    throw err;
  }
}

export async function writeStore(data: StoreShape): Promise<void> {
  await ensureDir();
  const tmp = path.join(HUB_DATA_DIR, "projects.tmp.json");
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, HUB_PROJECTS_FILE);
}

export async function listProjects(): Promise<ProjectRecord[]> {
  const s = await readStore();
  return s.projects.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProject(slug: string): Promise<ProjectRecord | undefined> {
  const s = await readStore();
  return s.projects.find((p) => p.slug === slug);
}

export async function upsertProject(p: ProjectRecord): Promise<void> {
  const s = await readStore();
  const i = s.projects.findIndex((x) => x.slug === p.slug);
  if (i === -1) s.projects.push(p);
  else s.projects[i] = p;
  await writeStore(s);
}

export async function setProjectPinned(slug: string, pinned: boolean): Promise<void> {
  const s = await readStore();
  const p = s.projects.find((x) => x.slug === slug);
  if (!p) return;
  p.pinned = pinned;
  await writeStore(s);
}

export async function setProjectArchived(slug: string, archived: boolean): Promise<void> {
  const s = await readStore();
  const p = s.projects.find((x) => x.slug === slug);
  if (!p) return;
  p.archived = archived;
  await writeStore(s);
}

export async function deleteProject(slug: string): Promise<void> {
  const s = await readStore();
  s.projects = s.projects.filter((p) => p.slug !== slug);
  await writeStore(s);
}

export async function getVariant(
  slug: string,
  vSlug: string,
): Promise<VariantRecord | undefined> {
  const s = await readStore();
  const p = s.projects.find((x) => x.slug === slug);
  return p?.variants?.find((v) => v.slug === vSlug);
}

export async function upsertVariant(slug: string, v: VariantRecord): Promise<void> {
  const s = await readStore();
  const p = s.projects.find((x) => x.slug === slug);
  if (!p) return;
  if (!p.variants) p.variants = [];
  const i = p.variants.findIndex((x) => x.slug === v.slug);
  if (i === -1) p.variants.push(v);
  else p.variants[i] = v;
  await writeStore(s);
}

export async function addVersion(slug: string, v: VersionRecord): Promise<void> {
  const s = await readStore();
  const p = s.projects.find((x) => x.slug === slug);
  if (!p) return;
  if (!p.versions) p.versions = [];
  // Dedupe guard: skip push if a version already points at this hash.
  if (p.versions.some((x) => x.hash === v.hash)) return;
  p.versions.push(v);
  await writeStore(s);
}

/**
 * Atomically reserve the next variation letter-suffix charCode for the version
 * labeled `versionLabel`, advancing the persisted high-water mark so deleted
 * letters are never reused. Seeds from existing live siblings the first time
 * (covers records created before nextSuffix existed). Returns the reserved code.
 */
export async function reserveVariantSuffix(
  slug: string,
  versionLabel: string,
): Promise<number> {
  const s = await readStore();
  const p = s.projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`No project with slug "${slug}"`);
  const version = (p.versions ?? []).find((v) => v.label === versionLabel);
  if (!version) throw new Error(`No version "${versionLabel}" on "${slug}"`);

  let code = version.nextSuffix ?? "b".charCodeAt(0);
  // Backfill seed from any live siblings whose suffix is past the stored mark.
  for (const v of p.variants ?? []) {
    if (v.parentVersion !== versionLabel) continue;
    const suffix = v.label.slice(versionLabel.length);
    if (suffix.length === 1) {
      const c = suffix.charCodeAt(0);
      if (c >= code) code = c + 1;
    }
  }
  version.nextSuffix = code + 1;
  await writeStore(s);
  return code;
}

export async function setVariantPromoted(
  slug: string,
  vSlug: string,
  label: string,
): Promise<void> {
  const s = await readStore();
  const p = s.projects.find((x) => x.slug === slug);
  const v = p?.variants?.find((x) => x.slug === vSlug);
  if (!v) return;
  v.promotedTo = label;
  await writeStore(s);
}

export async function deleteVariant(slug: string, vSlug: string): Promise<void> {
  const s = await readStore();
  const p = s.projects.find((x) => x.slug === slug);
  if (!p || !p.variants) return;
  p.variants = p.variants.filter((v) => v.slug !== vSlug);
  await writeStore(s);
}

export async function usedPorts(): Promise<number[]> {
  const s = await readStore();
  return s.projects.flatMap((p) => [p.port, ...(p.variants ?? []).map((v) => v.port)]);
}
