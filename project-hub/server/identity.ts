import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { HUB_ROOT } from "./paths.js";

const exec = promisify(execFile);

export interface Identity {
  name: string;
  email?: string;
  githubLogin?: string;
  avatarUrl?: string;
}

// Resolved once per process — git config and gh auth don't change mid-session,
// and the gh call costs a network round-trip we don't want on every request.
let cached: Identity | null = null;

/**
 * Resolve the machine's identity, dependency-free and login-free:
 *   (a) git config user.name / user.email
 *   (b) gh api user → GitHub login + avatar (only if gh is installed AND authed)
 * Every probe is best-effort — a missing/unauthed gh or unset git config must
 * never break the API. name falls back git → gh login → "Unknown".
 */
export async function getIdentity(): Promise<Identity> {
  if (cached) return cached;

  let gitName: string | undefined;
  let gitEmail: string | undefined;
  try {
    const { stdout } = await exec("git", ["config", "user.name"], {
      cwd: HUB_ROOT,
    });
    gitName = stdout.trim() || undefined;
  } catch {
    /* unset git config — fall through */
  }
  try {
    const { stdout } = await exec("git", ["config", "user.email"], {
      cwd: HUB_ROOT,
    });
    gitEmail = stdout.trim() || undefined;
  } catch {
    /* unset git config — fall through */
  }

  let githubLogin: string | undefined;
  let avatarUrl: string | undefined;
  try {
    const { stdout } = await exec("gh", ["api", "user"], { timeout: 3000 });
    const user = JSON.parse(stdout) as { login?: string; avatar_url?: string };
    if (typeof user.login === "string" && user.login) githubLogin = user.login;
    if (typeof user.avatar_url === "string" && user.avatar_url) {
      avatarUrl = user.avatar_url;
    }
  } catch {
    /* gh missing, unauthed, or slow — identity still resolves from git */
  }

  cached = {
    name: gitName ?? githubLogin ?? "Unknown",
    email: gitEmail,
    githubLogin,
    avatarUrl,
  };
  return cached;
}
