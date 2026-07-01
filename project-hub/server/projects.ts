import fs from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import {
  EXCALIBRR_PATH,
  PORT_RANGE_END,
  PORT_RANGE_START,
  PROJECTS_PATH,
  projectClaudeMd,
  projectDir,
  projectExcalibrrSymlink,
  projectKickoffPath,
  projectLofiDir,
  projectMetaFile,
  projectPrototypeDir,
  projectReadme,
  projectResourcesDir,
  projectWireframeIndexSkillDir,
  protoBasePathForProduct,
  variantClaudeMd,
  variantDir,
  variantExcalibrrSymlink,
  variantPrototypeDir,
  WIREFRAME_INDEX_SKILL_PATH,
} from "./paths.js";
import {
  ProjectRecord,
  VariantRecord,
  VersionRecord,
  addVersion,
  deleteProject,
  deleteVariant,
  getProject,
  getVariant,
  listProjects,
  reserveVariantSuffix,
  setVariantPromoted,
  upsertProject,
  upsertVariant,
  usedPorts,
} from "./store.js";
import {
  MergeResult,
  addWorktree,
  deleteBranch,
  getGitInfo,
  getHeadHash,
  mergeInto,
  removeWorktree,
} from "./git.js";
import { getIdentity } from "./identity.js";
import {
  renderClaudeMd,
  renderOptionClaudeMd,
  renderProjectReadme,
  renderRoundClaudeMd,
  renderVariantClaudeMd,
} from "./claudemd.js";

export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

async function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once("error", () => resolve(false));
    srv.once("listening", () => {
      srv.close(() => resolve(true));
    });
    srv.listen(port, "127.0.0.1");
  });
}

export async function allocatePort(): Promise<number> {
  const taken = new Set(await usedPorts());
  for (let p = PORT_RANGE_START; p <= PORT_RANGE_END; p++) {
    if (taken.has(p)) continue;
    if (await isPortFree(p)) return p;
  }
  throw new Error(
    `No free ports in range ${PORT_RANGE_START}-${PORT_RANGE_END}`,
  );
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.lstat(p);
    return true;
  } catch {
    return false;
  }
}

// Valid values for ProjectRecord.product (labels live in the web app's
// ProductChip component).
const PRODUCT_KINDS = ["sdi", "pe", "ss"];

export interface CreateProjectInput {
  name: string;
  description?: string;
  product?: string; // one of sdi|pe|ss
}

/**
 * Copy the hub-vendored wireframe-index skill into the project's lofi dir
 * (`design-system/lofi/wireframe-index-skill/`). This makes the CLAUDE.md
 * backup path portable: a round CLAUDE.md points at `../wireframe-index-skill/`,
 * which resolves even when the project is opened without the hub repo present
 * (Cowork, a clone, a teammate's machine). Idempotent — overwrites so the
 * bundled copy stays in sync with the vendored source.
 */
export async function ensureProjectWireframeIndexSkill(
  slug: string,
): Promise<void> {
  const dest = projectWireframeIndexSkillDir(slug);
  await fs.cp(WIREFRAME_INDEX_SKILL_PATH, dest, {
    recursive: true,
    force: true,
  });
}

export async function createProject(
  input: CreateProjectInput,
): Promise<ProjectRecord> {
  const trimmed = (input.name ?? "").trim();
  if (!trimmed) throw new Error("Project name is required");

  if (input.product !== undefined && !PRODUCT_KINDS.includes(input.product)) {
    throw Object.assign(
      new Error(`product must be one of: ${PRODUCT_KINDS.join(", ")}`),
      { status: 400 },
    );
  }

  const slug = slugify(trimmed);
  if (!slug) throw new Error("Project name produced an empty slug");

  const existing = await getProject(slug);
  if (existing) throw new Error(`A project with slug "${slug}" already exists`);

  const dir = projectDir(slug);
  if (await pathExists(dir)) {
    throw new Error(`Folder already exists: ${dir}`);
  }

  const port = await allocatePort();
  const branch = `project/${slug}`;
  const isoDate = new Date().toISOString();

  // 1. Folder skeleton (resources/, design-system/lofi/)
  await fs.mkdir(projectResourcesDir(slug), { recursive: true });
  await fs.mkdir(projectLofiDir(slug), { recursive: true });
  // Bundle the wireframe-index skill into the project so the CLAUDE.md backup
  // path is portable (works in Cowork / a clone without the hub repo).
  await ensureProjectWireframeIndexSkill(slug);

  // The proto-base repo to fork from is selected by the project's product
  // (pe -> PE proto-base, ss -> OSP proto-base; unknown/absent -> pe).
  const baseRepo = protoBasePathForProduct(input.product);

  // 2. git worktree → ./prototype on branch project/<slug>, forked from the
  // product's base repo current HEAD (startPoint undefined).
  await addWorktree(projectPrototypeDir(slug), branch, undefined, baseRepo);

  // 2b. node_modules install is DEFERRED to the first dev-server start
  // (startTarget → ensureNodeModulesInstalled with the product's baseRepo).
  // Installing here (~90s for an independent install) blocked the create HTTP
  // response, so the New Project modal appeared to hang. The install is
  // idempotent and the start path already runs it lazily with a loading state.

  // 3. excalibrr-freddy symlink (sibling required by the prototype's package.json)
  try {
    await fs.symlink(EXCALIBRR_PATH, projectExcalibrrSymlink(slug), "dir");
  } catch (err: any) {
    if (err?.code !== "EEXIST") throw err;
  }

  // 4. README.md, CLAUDE.md, .freddy-project.json
  const claudeIn = { name: trimmed, slug, port, isoDate };
  await fs.writeFile(
    projectClaudeMd(slug),
    renderClaudeMd(claudeIn),
    "utf8",
  );
  await fs.writeFile(
    projectReadme(slug),
    renderProjectReadme(claudeIn, input.description),
    "utf8",
  );

  const meta = {
    slug,
    name: trimmed,
    description: input.description ?? "",
    product: input.product,
    branch,
    port,
    createdAt: isoDate,
    paths: {
      project: dir,
      prototype: projectPrototypeDir(slug),
      lofi: projectLofiDir(slug),
      resources: projectResourcesDir(slug),
    },
  };
  await fs.writeFile(
    projectMetaFile(slug),
    JSON.stringify(meta, null, 2),
    "utf8",
  );

  // 5. Stamp v1 at the worktree's current HEAD (set directly on the record
  // before upsert — no separate addVersion round-trip needed at creation).
  const v1Hash = await getHeadHash(projectPrototypeDir(slug));

  // 6. Persist Hub-side record. Creator = the machine identity (git config /
  // gh) at creation time — name + GitHub bits only, no email on the record.
  const identity = await getIdentity();
  const record: ProjectRecord = {
    slug,
    name: trimmed,
    description: input.description,
    product: input.product,
    branch,
    port,
    createdAt: isoDate,
    prototypePath: projectPrototypeDir(slug),
    projectPath: dir,
    versions: [{ label: "v1", hash: v1Hash, createdAt: isoDate }],
    creator: {
      name: identity.name,
      githubLogin: identity.githubLogin,
      avatarUrl: identity.avatarUrl,
    },
  };
  await upsertProject(record);

  return record;
}

export async function removeProject(slug: string): Promise<void> {
  const record = await getProject(slug);
  if (!record) throw new Error(`No project with slug "${slug}"`);

  // CASCADE: tear down every variant's worktree + branch first. Their folders
  // live under the project dir and die with the rm -rf below, so we only need
  // to detach worktrees and delete branches here. Running variant dev servers
  // are stopped by the index.ts DELETE route before this is called (same policy
  // as the project-level stopDevServer-before-removeProject sequencing) — see
  // the import-cycle note on removeVariant.
  // Variants share the project's base repo (they fork from the project's own
  // version commit), so resolve it once from the project's product and use it
  // for every worktree/branch teardown. Tearing down against the wrong repo
  // silently leaks dangling worktrees/branches.
  const baseRepo = protoBasePathForProduct(record.product);
  for (const v of record.variants ?? []) {
    await removeWorktree(v.prototypePath, baseRepo);
    await deleteBranch(v.branch, baseRepo);
  }

  const dir = projectDir(slug);
  await removeWorktree(projectPrototypeDir(slug), baseRepo);
  await deleteBranch(record.branch, baseRepo);

  // Remove the project folder regardless of worktree result.
  if (await pathExists(dir)) {
    await fs.rm(dir, { recursive: true, force: true });
  }

  await deleteProject(slug);
}

/** Parse the numeric N out of a "vN" label, or null if it doesn't match. */
function parseVersionNum(label: string): number | null {
  const m = /^v(\d+)$/.exec(label);
  return m ? Number(m[1]) : null;
}

/**
 * List a project's versions. Lazily backfills v1 = current HEAD the first time
 * (when the record predates the versions feature), persists it, and returns the
 * refreshed list.
 */
export async function listVersions(slug: string): Promise<VersionRecord[]> {
  const project = await getProject(slug);
  if (!project) {
    throw Object.assign(new Error(`No project with slug "${slug}"`), {
      status: 404,
    });
  }
  const existing = project.versions ?? [];
  if (existing.length > 0) return existing;

  // Half-created records can lack the prototype worktree entirely — the v1
  // backfill below would die with spawn-git ENOENT on the missing cwd. No
  // worktree means there is genuinely nothing to version.
  if (!(await pathExists(project.prototypePath))) return [];

  const hash = await getHeadHash(project.prototypePath);
  await addVersion(slug, {
    label: "v1",
    hash,
    createdAt: new Date().toISOString(),
  });
  const refreshed = await getProject(slug);
  return refreshed?.versions ?? [];
}

/**
 * Stamp the next version (v{N+1}) at the project worktree's current HEAD.
 * 409 if the working tree is dirty, or if HEAD hasn't moved since the last
 * stamped version.
 */
export async function createVersion(slug: string): Promise<VersionRecord> {
  const project = await getProject(slug);
  if (!project) {
    throw Object.assign(new Error(`No project with slug "${slug}"`), {
      status: 404,
    });
  }

  const info = await getGitInfo(project.prototypePath, project.branch);
  if (info.workingTreeClean === false) {
    throw Object.assign(
      new Error(
        "There are unsaved changes from your last session. Ask Claude to commit them, then stamp this version.",
      ),
      { status: 409 },
    );
  }

  const head = await getHeadHash(project.prototypePath);
  const versions = await listVersions(slug); // ensures backfill
  const last = versions[versions.length - 1];
  if (last && head === last.hash) {
    throw Object.assign(
      new Error(
        `Nothing new since ${last.label} — the prototype hasn't changed.`,
      ),
      { status: 409 },
    );
  }

  // Derive next label from the max numeric label (robust to dedupe edge),
  // not array length.
  const maxNum = versions.reduce((max, v) => {
    const n = parseVersionNum(v.label);
    return n !== null && n > max ? n : max;
  }, 0);
  const record: VersionRecord = {
    label: `v${maxNum + 1}`,
    hash: head,
    createdAt: new Date().toISOString(),
  };
  await addVersion(slug, record);
  return record;
}

export interface CreateVariantInput {
  name: string;
  description?: string;
  version?: string;
}

export async function createVariant(
  slug: string,
  input: { name: string; description?: string; version?: string },
): Promise<VariantRecord> {
  const parent = await getProject(slug);
  if (!parent) {
    throw Object.assign(new Error(`No project with slug "${slug}"`), {
      status: 404,
    });
  }

  const trimmed = (input.name ?? "").trim();
  if (!trimmed) throw new Error("Variant name is required");

  const vSlug = slugify(trimmed);
  if (!vSlug) throw new Error("Variant name produced an empty slug");

  if ((parent.variants ?? []).some((v) => v.slug === vSlug)) {
    throw Object.assign(
      new Error(`A variant with slug "${vSlug}" already exists`),
      { status: 409 },
    );
  }

  // Resolve the anchor version (explicit label or latest) and fork from its
  // commit hash.
  const versions = await listVersions(slug);
  const target = input.version
    ? versions.find((v) => v.label === input.version)
    : versions[versions.length - 1];
  if (!target) {
    throw Object.assign(
      new Error(`unknown version "${input.version}"`),
      { status: 404 },
    );
  }

  // Compute the monotonic letter suffix for this version. Suffixes start at "b"
  // and never reuse a deleted letter — the high-water mark is PERSISTED on the
  // version record (reserveVariantSuffix), so deleting v1b still yields v1c next.
  const reservedCode = await reserveVariantSuffix(slug, target.label);
  const label = `${target.label}${String.fromCharCode(reservedCode)}`;

  const port = await allocatePort();
  const branch = `variant/${slug}/${vSlug}`;
  const isoDate = new Date().toISOString();

  // 1. Folder skeleton (.../variants/<vSlug>)
  await fs.mkdir(variantDir(slug, vSlug), { recursive: true });

  // A variant forks in the SAME base repo as its parent project — the
  // target.hash commit + the new branch live there. Resolve it from the
  // parent's product.
  const baseRepo = protoBasePathForProduct(parent.product);

  // 2. git worktree → ./prototype on branch variant/<slug>/<vSlug>, forked
  // from the anchor version's commit hash (so the variation captures exactly
  // that save-point).
  await addWorktree(
    variantPrototypeDir(slug, vSlug),
    branch,
    target.hash,
    baseRepo,
  );

  // 2b. node_modules install DEFERRED to first dev-server start (same reason as
  // createProject — keeps variant creation fast; startVariantDevServer installs
  // lazily with the parent product's baseRepo).

  // 3. excalibrr-freddy symlink (sibling required by the prototype's package.json)
  try {
    await fs.symlink(
      EXCALIBRR_PATH,
      variantExcalibrrSymlink(slug, vSlug),
      "dir",
    );
  } catch (err: any) {
    if (err?.code !== "EEXIST") throw err;
  }

  // 4. CLAUDE.md — sits OUTSIDE ./prototype/ so it never dirties the branch
  // (a dirty tree would block the Hub's stamp/pull/promote guards). It scopes
  // Claude Code sessions to THIS variation's worktree only.
  await fs.writeFile(
    variantClaudeMd(slug, vSlug),
    renderVariantClaudeMd({
      projectName: parent.name,
      projectSlug: slug,
      projectDescription: parent.description,
      variantName: trimmed,
      variantSlug: vSlug,
      variantDescription: input.description,
      label,
      parentVersion: target.label,
      port,
      isoDate,
    }),
    "utf8",
  );

  const record: VariantRecord = {
    slug: vSlug,
    name: trimmed,
    description: input.description,
    branch,
    port,
    createdAt: isoDate,
    prototypePath: variantPrototypeDir(slug, vSlug),
    variantPath: variantDir(slug, vSlug),
    label,
    parentVersion: target.label,
  };
  await upsertVariant(slug, record);

  return record;
}

/**
 * Backfill guard for variants created before variant CLAUDE.md existed:
 * writes the file if missing and returns its path. Cheap (one stat) on the
 * happy path, so the variants list route calls it per variant.
 */
export async function ensureVariantClaudeMd(
  parent: ProjectRecord,
  variant: VariantRecord,
): Promise<string> {
  const file = variantClaudeMd(parent.slug, variant.slug);
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(
      file,
      renderVariantClaudeMd({
        projectName: parent.name,
        projectSlug: parent.slug,
        projectDescription: parent.description,
        variantName: variant.name,
        variantSlug: variant.slug,
        variantDescription: variant.description,
        label: variant.label,
        parentVersion: variant.parentVersion,
        port: variant.port,
        isoDate: variant.createdAt,
      }),
      "utf8",
    );
  }
  return file;
}

export async function removeVariant(slug: string, vSlug: string): Promise<void> {
  const variant = await getVariant(slug, vSlug);
  if (!variant) {
    throw Object.assign(
      new Error(`No variant "${vSlug}" on project "${slug}"`),
      { status: 404 },
    );
  }

  // The variant's dev server is stopped by the index.ts DELETE route BEFORE
  // this is called (stop-then-remove orchestration), so the running vite
  // process no longer holds the folder open. projects.ts deliberately does
  // NOT import dev-server.ts — that would close an ESM import cycle
  // (dev-server imports getProjectBySlug/getVariant) and yield undefined
  // bindings at module-load time.
  // The variant lives in the same base repo as its parent project — resolve it
  // from the parent's product so teardown runs against the owning repo.
  const parent = await getProject(slug);
  const baseRepo = protoBasePathForProduct(parent?.product);
  await removeWorktree(variant.prototypePath, baseRepo);
  await deleteBranch(variant.branch, baseRepo);
  await fs.rm(variant.variantPath, { recursive: true, force: true });
  await deleteVariant(slug, vSlug);
}

export async function syncVariant(
  slug: string,
  vSlug: string,
  source?: string,
): Promise<MergeResult & { behind: number }> {
  const parent = await getProject(slug);
  if (!parent) {
    throw Object.assign(new Error(`No project with slug "${slug}"`), {
      status: 404,
    });
  }
  const variant = await getVariant(slug, vSlug);
  if (!variant) {
    throw Object.assign(
      new Error(`No variant "${vSlug}" on project "${slug}"`),
      { status: 404 },
    );
  }

  const src = source ?? parent.branch;

  // Guard the MAINLINE worktree clean. Pull merges the mainline BRANCH into
  // the variant, but uncommitted mainline edits aren't on the branch yet — so
  // a pull would silently merge nothing useful and still report success. Mirror
  // promote's guard so the user commits first instead of chasing a phantom no-op.
  const mainlineInfo = await getGitInfo(parent.prototypePath, parent.branch);
  if (mainlineInfo.workingTreeClean === false) {
    throw Object.assign(
      new Error(
        "There are unsaved changes on the mainline. Ask Claude to commit them, then pull.",
      ),
      { status: 409 },
    );
  }

  // behind = how many commits the source has that the variant doesn't. This is
  // exactly the number of commits a clean merge will pull, so capture it before
  // merging to distinguish "Pulled N commits" from "Already up to date".
  const info = await getGitInfo(variant.prototypePath, variant.branch, src);
  if (info.workingTreeClean === false) {
    throw Object.assign(
      new Error("variant working tree is not clean"),
      { status: 409 },
    );
  }

  const result = await mergeInto(variant.prototypePath, src);
  return { ...result, behind: info.behind };
}

/**
 * Promote a variation: merge its branch INTO the project worktree, then stamp
 * the next version. The variation stays alive and gains a `promotedTo` badge.
 *
 * Guards the PROJECT worktree clean first (409). On a clean merge, auto-stamps
 * the next version via createVersion — its dirty/no-change guards can't trip
 * here (the merge just committed and moved HEAD). On conflicts, leaves the
 * variation untouched and reports the conflicting paths.
 */
export async function promoteVariant(
  slug: string,
  vSlug: string,
): Promise<{ ok: boolean; merged: boolean; conflicts?: string[]; version?: VersionRecord }> {
  const parent = await getProject(slug);
  if (!parent) {
    throw Object.assign(new Error(`No project with slug "${slug}"`), {
      status: 404,
    });
  }
  const variant = await getVariant(slug, vSlug);
  if (!variant) {
    throw Object.assign(
      new Error(`No variant "${vSlug}" on project "${slug}"`),
      { status: 404 },
    );
  }

  const info = await getGitInfo(parent.prototypePath, parent.branch);
  if (info.workingTreeClean === false) {
    throw Object.assign(
      new Error(
        "There are unsaved changes on the mainline. Ask Claude to commit them, then promote.",
      ),
      { status: 409 },
    );
  }

  const result = await mergeInto(parent.prototypePath, variant.branch);
  if (!result.merged) {
    return { ok: true, merged: false, conflicts: result.conflicts };
  }

  const version = await createVersion(slug);
  await setVariantPromoted(slug, vSlug, version.label);
  return { ok: true, merged: true, conflicts: undefined, version };
}

export type LofiStatus = "drafted" | "built" | "documented";

export interface LofiOption {
  name: string; // display name as entered
  slug: string; // folder slug
  path: string;
  indexHtmlPath: string;
  claudeMdPath: string;
  status: LofiStatus;
  wireframeCount: number;
}

export interface LofiRound {
  round: number;
  name: string; // "round-1"
  label?: string;
  path: string;
  indexHtmlPath: string;
  notesPath: string;
  claudeMdPath: string; // "" for external rounds
  briefPath: string; // "" for external rounds
  parentRound: number; // previous in-tree round number, 0 if none
  status: LofiStatus;
  wireframeCount: number;
  guidePath: string | null; // WIREFRAME-GUIDE.html if present, else null
  createdAt: string;
  options: LofiOption[];
  external?: boolean;
  previewUrl?: string; // http path the UI can load in a sandboxed iframe
}

interface ExternalLofiEntry {
  label: string;
  path: string;
  indexHtml: string;
}

async function ensureLofiBase(slug: string): Promise<void> {
  await fs.mkdir(projectLofiDir(slug), { recursive: true });
}

/**
 * Count "real" wireframe files in a wireframes/ dir, ignoring scaffolding like
 * .gitkeep and dotfiles. Used to derive drafted vs built status.
 */
async function countWireframes(wireframesDir: string): Promise<number> {
  try {
    const entries = await fs.readdir(wireframesDir, { withFileTypes: true });
    return entries.filter((e) => e.isFile() && !e.name.startsWith(".")).length;
  } catch {
    return 0;
  }
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Derive a round/option status from folder contents (no stored flag):
 *   documented  — WIREFRAME-GUIDE.html present
 *   built       — wireframes/ has real files
 *   drafted     — folder + CLAUDE.md exist, wireframes/ empty
 */
function deriveStatus(wireframeCount: number, hasGuide: boolean): LofiStatus {
  if (hasGuide) return "documented";
  if (wireframeCount > 0) return "built";
  return "drafted";
}

async function listRoundOptions(roundDir: string): Promise<LofiOption[]> {
  const optionsDir = path.join(roundDir, "options");
  let entries: import("node:fs").Dirent[];
  try {
    entries = await fs.readdir(optionsDir, { withFileTypes: true });
  } catch {
    return [];
  }
  const options: LofiOption[] = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const optDir = path.join(optionsDir, e.name);
    const wireframeCount = await countWireframes(path.join(optDir, "wireframes"));
    const hasGuide = await exists(path.join(optDir, "WIREFRAME-GUIDE.html"));
    options.push({
      name: e.name,
      slug: e.name,
      path: optDir,
      indexHtmlPath: path.join(optDir, "index.html"),
      claudeMdPath: path.join(optDir, "CLAUDE.md"),
      status: deriveStatus(wireframeCount, hasGuide),
      wireframeCount,
    });
  }
  options.sort((a, b) => a.slug.localeCompare(b.slug));
  return options;
}

/**
 * Create design-system/lofi/KICKOFF.md if missing. Returns its absolute path.
 * Seeds round 1; the round CLAUDE.md points Claude back at it.
 */
export async function ensureKickoff(slug: string): Promise<string> {
  await ensureLofiBase(slug);
  const kickoffPath = projectKickoffPath(slug);
  if (!(await exists(kickoffPath))) {
    const body = `# Lo-fi kickoff

The brief / kickoff-meeting notes that seed round 1. Fill these in before (or while) building the first round.

## Goal

What is this exploration trying to achieve? What does success look like?

## Constraints

Known constraints — platform, audience, scope, must-keep patterns, non-goals.

## References

Links and files that inform the design (drop supporting docs in \`../../resources/\`).

## Open questions

Unresolved questions to work through with the PM across rounds.
`;
    await fs.writeFile(kickoffPath, body, "utf8");
  }
  return kickoffPath;
}

function externalsConfigPath(slug: string): string {
  return path.join(projectLofiDir(slug), "externals.json");
}

/**
 * Read & validate the externals.json pointer file. Returns [] when absent or
 * malformed so the in-tree rounds still render.
 */
export async function readExternalsConfig(
  slug: string,
): Promise<ExternalLofiEntry[]> {
  try {
    const raw = await fs.readFile(externalsConfigPath(slug), "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is ExternalLofiEntry =>
        e && typeof e.path === "string" && typeof e.indexHtml === "string",
    );
  } catch {
    return [];
  }
}

export async function listLofiRounds(slug: string): Promise<LofiRound[]> {
  await ensureLofiBase(slug);
  const base = projectLofiDir(slug);
  const entries = await fs.readdir(base, { withFileTypes: true });

  // Collect in-tree round numbers first so we can compute each round's parent
  // (the previous in-tree round, monotonic with gaps preserved).
  const dirEntries = entries
    .filter((e) => e.isDirectory())
    .map((e) => ({ e, m: /^round-(\d+)$/.exec(e.name) }))
    .filter((x) => x.m)
    .map((x) => ({ name: x.e.name, round: Number(x.m![1]) }))
    .sort((a, b) => a.round - b.round);

  const rounds: LofiRound[] = [];
  for (let idx = 0; idx < dirEntries.length; idx++) {
    const { name, round } = dirEntries[idx];
    const dir = path.join(base, name);
    const stat = await fs.stat(dir);
    const wireframeCount = await countWireframes(path.join(dir, "wireframes"));
    const guideAbs = path.join(dir, "WIREFRAME-GUIDE.html");
    const hasGuide = await exists(guideAbs);
    const options = await listRoundOptions(dir);
    rounds.push({
      round,
      name,
      path: dir,
      indexHtmlPath: path.join(dir, "index.html"),
      notesPath: path.join(dir, "notes.md"),
      claudeMdPath: path.join(dir, "CLAUDE.md"),
      briefPath: path.join(dir, "brief.md"),
      parentRound: idx > 0 ? dirEntries[idx - 1].round : 0,
      status: deriveStatus(wireframeCount, hasGuide),
      wireframeCount,
      guidePath: hasGuide ? guideAbs : null,
      createdAt: stat.birthtime.toISOString(),
      options,
    });
  }

  // Append external rounds from the externals.json pointer file. Each entry
  // points at a directory living OUTSIDE the project tree; we never copy it.
  const externals = await readExternalsConfig(slug);
  for (let i = 0; i < externals.length; i++) {
    const entry = externals[i];
    const indexHtmlPath = path.join(entry.path, entry.indexHtml);
    let createdAt = new Date().toISOString();
    try {
      const stat = await fs.stat(indexHtmlPath);
      createdAt = stat.mtime.toISOString();
    } catch {
      continue; // pointer is stale / file missing — skip silently
    }
    rounds.push({
      round: 1000 + i, // keep externals after in-tree rounds when sorted
      name: `external-${i}`,
      label: entry.label,
      path: entry.path,
      indexHtmlPath,
      notesPath: "",
      claudeMdPath: "",
      briefPath: "",
      parentRound: 0,
      // externals point at a live, already-built wireframe set we don't own
      status: "built",
      wireframeCount: 0,
      guidePath: null,
      createdAt,
      options: [],
      external: true,
      previewUrl: `/api/projects/${encodeURIComponent(slug)}/lofi/external/${i}/`,
    });
  }

  return rounds;
}

/**
 * Resolve a request for a file inside an external lo-fi directory to a safe
 * absolute path. Guards against path traversal outside the pointed-at dir.
 * Returns null when the index is out of range or the path escapes the base.
 */
export async function resolveExternalLofiFile(
  slug: string,
  idx: number,
  relPath: string,
): Promise<{ absPath: string; root: string } | null> {
  const externals = await readExternalsConfig(slug);
  const entry = externals[idx];
  if (!entry) return null;
  const root = path.resolve(entry.path);
  const rel = relPath && relPath.length > 0 ? relPath : entry.indexHtml;
  const absPath = path.resolve(root, rel);
  if (absPath !== root && !absPath.startsWith(root + path.sep)) return null;
  return { absPath, root };
}

function lofiGalleryHtml(title: string, hint: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body { font-family: -apple-system, system-ui, sans-serif; padding: 32px; color: #111; }
      h1 { margin: 0 0 8px; }
      .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); margin-top: 24px; }
      .placeholder { aspect-ratio: 4/3; border: 1px dashed #c9c9c9; border-radius: 8px; display:flex; align-items:center; justify-content:center; color:#888; font-size: 14px; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <p>${hint}</p>
    <div class="grid">
      <div class="placeholder">empty</div>
    </div>
  </body>
</html>
`;
}

export async function createLofiRound(slug: string): Promise<LofiRound> {
  await ensureLofiBase(slug);
  // Round 1 (and beyond) gets a kickoff to seed the exploration.
  await ensureKickoff(slug);

  const existing = await listLofiRounds(slug);
  const inTree = existing.filter((r) => !r.external);
  const parentRound = inTree.at(-1)?.round ?? 0;
  const next = parentRound + 1;
  const name = `round-${next}`;
  const dir = path.join(projectLofiDir(slug), name);

  await fs.mkdir(path.join(dir, "wireframes"), { recursive: true });
  await fs.writeFile(path.join(dir, "wireframes", ".gitkeep"), "", "utf8");
  await fs.mkdir(path.join(dir, "context"), { recursive: true });
  await fs.writeFile(path.join(dir, "context", ".gitkeep"), "", "utf8");

  await fs.writeFile(
    path.join(dir, "index.html"),
    lofiGalleryHtml(
      `${name} — wireframes`,
      "Drop wireframe files into <code>./wireframes/</code> and link them here.",
    ),
    "utf8",
  );
  await fs.writeFile(
    path.join(dir, "notes.md"),
    `# Round ${next} notes\n`,
    "utf8",
  );
  await fs.writeFile(
    path.join(dir, "brief.md"),
    `# Round ${next} brief

What this round resolves (from the PM).

## Focus

-

## Out of scope

-
`,
    "utf8",
  );

  const project = await getProject(slug);
  const projectName = project?.name ?? slug;
  await fs.writeFile(
    path.join(dir, "CLAUDE.md"),
    renderRoundClaudeMd({
      projectName,
      slug,
      roundN: next,
      parentRoundN: parentRound,
      isoDate: new Date().toISOString(),
    }),
    "utf8",
  );

  const stat = await fs.stat(dir);
  return {
    round: next,
    name,
    path: dir,
    indexHtmlPath: path.join(dir, "index.html"),
    notesPath: path.join(dir, "notes.md"),
    claudeMdPath: path.join(dir, "CLAUDE.md"),
    briefPath: path.join(dir, "brief.md"),
    parentRound,
    status: "drafted",
    wireframeCount: 0,
    guidePath: null,
    createdAt: stat.birthtime.toISOString(),
    options: [],
  };
}

/**
 * Create a parallel branch-option off a round:
 *   design-system/lofi/round-<n>/options/<slug-of-name>/
 * with index.html (gallery stub), wireframes/, and a CLAUDE.md that references
 * the parent round. Branch-options are sibling folders, NOT git branches.
 */
export async function createBranchOption(
  slug: string,
  round: number,
  name: string,
): Promise<LofiOption> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("option name is required");
  const roundDir = path.join(projectLofiDir(slug), `round-${round}`);
  if (!(await exists(roundDir))) {
    throw new Error(`round-${round} does not exist`);
  }
  const optSlug = slugify(trimmed);
  if (!optSlug) throw new Error("option name produced an empty slug");
  const optDir = path.join(roundDir, "options", optSlug);
  if (await exists(optDir)) {
    throw new Error(`option "${optSlug}" already exists`);
  }

  await fs.mkdir(path.join(optDir, "wireframes"), { recursive: true });
  await fs.writeFile(path.join(optDir, "wireframes", ".gitkeep"), "", "utf8");
  await fs.writeFile(
    path.join(optDir, "index.html"),
    lofiGalleryHtml(
      `Round ${round} — option “${trimmed}”`,
      "Drop this option's wireframes into <code>./wireframes/</code> and link them here.",
    ),
    "utf8",
  );

  const project = await getProject(slug);
  const projectName = project?.name ?? slug;
  await fs.writeFile(
    path.join(optDir, "CLAUDE.md"),
    renderOptionClaudeMd({
      projectName,
      slug,
      roundN: round,
      optionName: trimmed,
      optionSlug: optSlug,
      isoDate: new Date().toISOString(),
    }),
    "utf8",
  );

  return {
    name: optSlug,
    slug: optSlug,
    path: optDir,
    indexHtmlPath: path.join(optDir, "index.html"),
    claudeMdPath: path.join(optDir, "CLAUDE.md"),
    status: "drafted",
    wireframeCount: 0,
  };
}

export type ResourceType = "docs" | "interviews" | "competitive" | "screenshots";

export interface ResourceFile {
  name: string;
  size: number;
  path: string;
  type: ResourceType;
  sub: string; // subfolder with trailing slash ("docs/") or "" for the resources root
  mtime: string; // ISO
}

// Typed subfolders we recurse ONE level into. A file's `type` is the subfolder
// name when it lives in one of these; otherwise it's classified by extension.
const RESOURCE_SUBFOLDERS: ResourceType[] = [
  "docs",
  "interviews",
  "competitive",
  "screenshots",
];

const DOC_EXTS = new Set([".md", ".markdown", ".pdf", ".docx", ".txt"]);
const IMAGE_EXTS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
]);

/** Classify a file by extension when no subfolder dictates the type. */
function classifyByExt(name: string): ResourceType {
  const ext = path.extname(name).toLowerCase();
  if (IMAGE_EXTS.has(ext)) return "screenshots";
  if (DOC_EXTS.has(ext)) return "docs";
  return "docs"; // sensible default for unknown file kinds
}

function isInternalResourceFile(name: string): boolean {
  // external.json is the External Resources store, not a user-facing file.
  return name === "external.json" || name === "external.tmp.json";
}

/**
 * List resources under resources/, scanning the root plus ONE level into the
 * typed subfolders (docs/, interviews/, competitive/, screenshots/). Each file
 * is tagged with a `type` (subfolder name first, extension as fallback) and
 * `sub` (the subfolder with trailing slash, or "" at the root). Internal store
 * files (external.json / external.tmp.json) are excluded.
 */
export async function listResources(slug: string): Promise<ResourceFile[]> {
  const dir = projectResourcesDir(slug);
  const out: ResourceFile[] = [];

  const scan = async (
    absDir: string,
    sub: string,
    forcedType: ResourceType | null,
  ): Promise<void> => {
    let entries: import("node:fs").Dirent[];
    try {
      entries = await fs.readdir(absDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (!e.isFile()) continue;
      if (sub === "" && isInternalResourceFile(e.name)) continue;
      const full = path.join(absDir, e.name);
      let stat: import("node:fs").Stats;
      try {
        stat = await fs.stat(full);
      } catch {
        continue;
      }
      out.push({
        name: e.name,
        size: stat.size,
        path: full,
        type: forcedType ?? classifyByExt(e.name),
        sub,
        mtime: stat.mtime.toISOString(),
      });
    }
  };

  // Root (untyped — classify by extension).
  await scan(dir, "", null);
  // One level into each typed subfolder.
  for (const t of RESOURCE_SUBFOLDERS) {
    await scan(path.join(dir, t), `${t}/`, t);
  }

  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Resolve a request for a file inside the project's resources/ directory to a
 * safe absolute path. Guards against path traversal outside resources/ using
 * the exact two-condition guard from resolveExternalLofiFile. Returns null when
 * the resolved path escapes the resources root.
 */
export async function resolveResourceFile(
  slug: string,
  relPath: string,
): Promise<{ absPath: string; root: string } | null> {
  const root = path.resolve(projectResourcesDir(slug));
  const rel = relPath ?? "";
  const absPath = path.resolve(root, rel);
  if (absPath !== root && !absPath.startsWith(root + path.sep)) return null;
  return { absPath, root };
}

/**
 * Resolve a request for a file inside the project's design-system/lofi/
 * directory (round galleries, wireframes, guides, KICKOFF.md) to a safe
 * absolute path. Same two-condition traversal guard as resolveResourceFile.
 */
export async function resolveLofiFile(
  slug: string,
  relPath: string,
): Promise<{ absPath: string; root: string } | null> {
  const root = path.resolve(projectLofiDir(slug));
  const rel = relPath ?? "";
  const absPath = path.resolve(root, rel);
  if (absPath !== root && !absPath.startsWith(root + path.sep)) return null;
  return { absPath, root };
}

/**
 * Resolve a reveal-in-Finder target (a file or subfolder) within resources/,
 * guarded against path traversal. An empty/missing relPath reveals the
 * resources/ dir itself. Returns null when the target escapes the root.
 */
export async function resolveRevealTarget(
  slug: string,
  relPath?: string,
): Promise<string | null> {
  const resolved = await resolveResourceFile(slug, relPath ?? "");
  if (!resolved) return null;
  // Ensure the resources/ dir exists so `open` has something to reveal.
  await fs.mkdir(resolved.root, { recursive: true });
  return resolved.absPath;
}

export interface UploadResourceInput {
  type: string;
  name: string;
  dataBase64: string;
}

/**
 * Write an uploaded file into resources/<type>/. Validates the type against the
 * typed subfolders, sanitizes the name to a bare basename (rejecting path
 * separators / traversal), decodes the base64 payload, and returns the new
 * ResourceFile. Dependency-free — the base64 body arrives via express.json().
 */
export async function uploadResource(
  slug: string,
  input: UploadResourceInput,
): Promise<ResourceFile> {
  const type = input.type as ResourceType;
  if (!RESOURCE_SUBFOLDERS.includes(type)) {
    throw Object.assign(
      new Error(
        `type must be one of: ${RESOURCE_SUBFOLDERS.join(", ")}`,
      ),
      { status: 400 },
    );
  }

  const rawName = (input.name ?? "").trim();
  if (!rawName) {
    throw Object.assign(new Error("name is required"), { status: 400 });
  }
  // Basename only — reject anything with a path separator or traversal.
  const base = path.basename(rawName);
  if (
    base !== rawName ||
    base === "." ||
    base === ".." ||
    base.includes("/") ||
    base.includes("\\")
  ) {
    throw Object.assign(
      new Error("name must be a bare filename (no path separators)"),
      { status: 400 },
    );
  }

  if (typeof input.dataBase64 !== "string" || input.dataBase64.length === 0) {
    throw Object.assign(new Error("dataBase64 is required"), { status: 400 });
  }
  // Strip an optional data: URL prefix (e.g. "data:image/png;base64,").
  const b64 = input.dataBase64.replace(/^data:[^;]*;base64,/, "");
  const buffer = Buffer.from(b64, "base64");

  const subDir = path.join(projectResourcesDir(slug), type);
  await fs.mkdir(subDir, { recursive: true });
  const full = path.join(subDir, base);
  await fs.writeFile(full, buffer);

  const stat = await fs.stat(full);
  return {
    name: base,
    size: stat.size,
    path: full,
    type,
    sub: `${type}/`,
    mtime: stat.mtime.toISOString(),
  };
}

export async function listAllProjects(): Promise<ProjectRecord[]> {
  return listProjects();
}

export async function getProjectBySlug(slug: string): Promise<ProjectRecord | undefined> {
  return getProject(slug);
}

export { PROJECTS_PATH };
