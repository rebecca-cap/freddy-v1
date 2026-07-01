import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { PROTO_BASE_PATH } from "./paths.js";

const exec = promisify(execFile);

/**
 * Add a worktree of a proto-base repo at `worktreePath` on a new branch `branch`.
 * Equivalent to: git worktree add <worktreePath> -b <branch> [startPoint]
 *
 * When `startPoint` is given, the new branch forks from it (otherwise it
 * forks from the base repo's current HEAD). `baseRepo` selects WHICH proto-base
 * repo the worktree is created from (pe vs the OSP/ss clone); defaults to the
 * PE proto-base for back-compat.
 */
export async function addWorktree(
  worktreePath: string,
  branch: string,
  startPoint?: string,
  baseRepo: string = PROTO_BASE_PATH,
): Promise<void> {
  const args = ["worktree", "add", worktreePath, "-b", branch];
  if (startPoint) args.push(startPoint);
  await exec("git", args, { cwd: baseRepo });
}

/**
 * Resolve the current HEAD commit hash for the worktree at `worktreePath`.
 * Equivalent to: git rev-parse HEAD
 */
export async function getHeadHash(worktreePath: string): Promise<string> {
  const { stdout } = await exec("git", ["rev-parse", "HEAD"], {
    cwd: worktreePath,
  });
  return stdout.trim();
}

/**
 * Remove the worktree at `worktreePath`. Uses --force to handle dirty trees.
 * `baseRepo` must be the repo that OWNS the worktree (the same proto-base the
 * worktree was created from) — running this against the wrong repo silently
 * no-ops and leaves a dangling worktree. Defaults to the PE proto-base.
 */
export async function removeWorktree(
  worktreePath: string,
  baseRepo: string = PROTO_BASE_PATH,
): Promise<void> {
  try {
    await exec("git", ["worktree", "remove", "--force", worktreePath], {
      cwd: baseRepo,
    });
  } catch (err) {
    // Best effort — if worktree was already gone or never created, swallow.
    // The caller will still try to remove the folder.
  }
}

/**
 * Delete a local branch from a proto-base repo. Best effort. `baseRepo` must be
 * the repo the branch lives in (pe vs ss/OSP); defaults to the PE proto-base.
 */
export async function deleteBranch(
  branch: string,
  baseRepo: string = PROTO_BASE_PATH,
): Promise<void> {
  try {
    await exec("git", ["branch", "-D", branch], { cwd: baseRepo });
  } catch {
    /* ignore */
  }
}

/**
 * Returns true if the proto-base path looks like a usable git repo.
 */
export async function protoBaseLooksHealthy(): Promise<boolean> {
  try {
    await exec("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: PROTO_BASE_PATH,
    });
    return true;
  } catch {
    return false;
  }
}

export interface MergeResult {
  ok: boolean;
  merged: boolean;
  conflicts?: string[];
}

/**
 * Merge `source` into the branch checked out at `worktreePath`.
 * Equivalent to: git merge --no-ff --no-edit <source>
 *
 * On a clean merge returns `{ ok: true, merged: true }`. If the merge fails
 * (conflicts), the conflicting paths are captured via `git diff --diff-filter=U`,
 * the merge is aborted (best effort), and `{ ok: true, merged: false, conflicts }`
 * is returned.
 */
export async function mergeInto(
  worktreePath: string,
  source: string,
): Promise<MergeResult> {
  try {
    await exec("git", ["merge", "--no-ff", "--no-edit", source], {
      cwd: worktreePath,
    });
    return { ok: true, merged: true };
  } catch {
    let conflicts: string[] = [];
    try {
      const { stdout } = await exec(
        "git",
        ["diff", "--name-only", "--diff-filter=U"],
        { cwd: worktreePath },
      );
      conflicts = stdout
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    } catch {
      /* leave conflicts empty */
    }
    try {
      await exec("git", ["merge", "--abort"], { cwd: worktreePath });
    } catch {
      /* best effort */
    }
    return { ok: true, merged: false, conflicts };
  }
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  subject: string;
  author: string;
  authoredAt: string;
}

export interface GitInfo {
  branch: string;
  baseBranch: string;
  ahead: number;
  behind: number;
  head: GitCommit | null;
  recent: GitCommit[];
  workingTreeClean: boolean;
}

const LOG_FORMAT = "%H%x09%s%x09%an%x09%aI";

function parseLog(stdout: string): GitCommit[] {
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [hash, subject, author, authoredAt] = line.split("\t");
      return {
        hash,
        shortHash: hash.slice(0, 7),
        subject,
        author,
        authoredAt,
      };
    });
}

/**
 * Snapshot of branch state for a worktree. Best-effort — any sub-call
 * failure falls back to safe defaults so the UI can still render.
 */
export async function getGitInfo(
  worktreePath: string,
  branch: string,
  baseBranch = "main",
): Promise<GitInfo> {
  const at = (args: string[]) =>
    exec("git", args, { cwd: worktreePath, maxBuffer: 4 * 1024 * 1024 });

  let recent: GitCommit[] = [];
  try {
    const { stdout } = await at(["log", `-25`, `--format=${LOG_FORMAT}`]);
    recent = parseLog(stdout);
  } catch {
    /* leave empty */
  }

  let ahead = 0;
  let behind = 0;
  try {
    const { stdout } = await at([
      "rev-list",
      "--left-right",
      "--count",
      `${baseBranch}...HEAD`,
    ]);
    const [b, a] = stdout.trim().split(/\s+/).map((n) => Number(n) || 0);
    behind = b ?? 0;
    ahead = a ?? 0;
  } catch {
    /* base branch may not exist locally — leave zeros */
  }

  let workingTreeClean = true;
  try {
    const { stdout } = await at(["status", "--porcelain"]);
    workingTreeClean = stdout.trim().length === 0;
  } catch {
    /* assume clean if status fails */
  }

  return {
    branch,
    baseBranch,
    ahead,
    behind,
    head: recent[0] ?? null,
    recent,
    workingTreeClean,
  };
}
