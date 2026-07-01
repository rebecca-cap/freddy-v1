import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { EXCALIBRR_PATH, PROTO_BASE_PATH } from "./paths.js";

const execFileP = promisify(execFile);

/**
 * Give a prototype its OWN node_modules, frozen to the proto-base's current
 * dependency resolution, so it is fully independent of every other prototype.
 *
 * Why not symlink node_modules to proto-base (the old approach)? Sharing one
 * node_modules across all prototypes coupled them: a base dependency bump (e.g.
 * react-router 6.16 → 6.28) silently reached every prototype regardless of its
 * own lockfile, and a shared Vite cache let one dev server corrupt another's.
 * That's the grizmo :5181 break. A real per-project install makes it impossible.
 *
 * Recipe (proven across all existing prototypes + variants):
 *   1. If a real node_modules already exists, do nothing (fast + idempotent —
 *      this is what the pre-run caller hits every time after the first install).
 *   2. Drop any legacy shared-proto-base symlink.
 *   3. Repoint the @gravitate-js/excalibrr dep at the REAL excalibrr dir. The
 *      package.json pins `file:../excalibrr-freddy`, but that is itself a symlink
 *      to the shared lib, and Yarn's file: fetcher can't pack a symlinked dir
 *      ("Manifest not found"). Pointing at the real path packs it correctly and
 *      nests excalibrr's own deps exactly like the proto-base does.
 *   4. Seed .yarn/cache from the proto-base so the install is offline and the
 *      git-fork checksums (react-virtualized) match — a fresh worktree has none.
 *   5. Ensure a yarn.lock is present (a worktree inherits the committed one).
 *   6. yarn install.
 *
 * Lives in its own module (rather than dev-server.ts) so projects.ts can use it
 * without importing dev-server.ts — that would form an ESM import cycle.
 */
export async function ensureNodeModulesInstalled(
  prototypePath: string,
  baseRepo: string = PROTO_BASE_PATH,
): Promise<void> {
  const target = path.join(prototypePath, "node_modules");

  // 1 + 2. Already installed? Or a legacy symlink to remove?
  try {
    const st = await fs.lstat(target);
    if (st.isSymbolicLink()) {
      await fs.rm(target); // drop the legacy shared symlink, then install
    } else {
      return; // real node_modules already present — independent, nothing to do
    }
  } catch {
    /* ENOENT — proceed to install */
  }

  // 3. Repoint excalibrr at the real path (avoids the symlinked-file: pack bug).
  await pointExcalibrrAtRealPath(prototypePath);

  // 4. Seed the Yarn cache from the matching proto-base (offline + matching
  // checksums). baseRepo selects pe vs ss/OSP so the resolution graph is right.
  await seedYarnCache(prototypePath, baseRepo);

  // 5. A worktree inherits the proto-base's committed yarn.lock; copy if absent.
  const lock = path.join(prototypePath, "yarn.lock");
  try {
    await fs.access(lock);
  } catch {
    await fs.copyFile(path.join(baseRepo, "yarn.lock"), lock);
  }

  // 6. Install (non-immutable: the local file: excalibrr hash is allowed to
  // settle; all registry deps stay pinned to the seeded lockfile resolution).
  console.log(`[node-modules] installing deps for ${prototypePath} …`);
  await execFileP("yarn", ["install"], {
    cwd: prototypePath,
    maxBuffer: 64 * 1024 * 1024,
    env: process.env,
  });
  console.log(`[node-modules] done: ${prototypePath}`);
}

async function pointExcalibrrAtRealPath(prototypePath: string): Promise<void> {
  const pkgPath = path.join(prototypePath, "package.json");
  const pkg = JSON.parse(await fs.readFile(pkgPath, "utf8"));
  pkg.dependencies = pkg.dependencies ?? {};
  const want = `file:${EXCALIBRR_PATH}`;
  if (pkg.dependencies["@gravitate-js/excalibrr"] === want) return;
  pkg.dependencies["@gravitate-js/excalibrr"] = want;
  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

async function seedYarnCache(
  prototypePath: string,
  baseRepo: string = PROTO_BASE_PATH,
): Promise<void> {
  const src = path.join(baseRepo, ".yarn", "cache");
  try {
    await fs.access(src);
  } catch {
    return; // proto-base has no cache to seed from — install will hit the registry
  }
  const destCache = path.join(prototypePath, ".yarn", "cache");
  await fs.mkdir(destCache, { recursive: true });
  // APFS clonefile (cp -Rc) makes this near-instant; fall back to a real copy.
  try {
    await execFileP("cp", ["-Rc", `${src}/.`, destCache]);
  } catch {
    await execFileP("cp", ["-R", `${src}/.`, destCache]);
  }
}
