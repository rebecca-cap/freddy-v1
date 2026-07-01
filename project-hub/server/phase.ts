import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { ProjectRecord } from "./store.js";
import type { LofiRound } from "./projects.js";

const execFileAsync = promisify(execFile);

// Lifecycle phase, DERIVED from on-disk artifacts at read time — never stored,
// with one exception: "archived" comes from the record's stored flag, because
// archival is a human decision with no filesystem footprint to infer it from.
export type ProjectPhase = "kickoff" | "lofi" | "hifi" | "handoff" | "archived";

async function exists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Handoff signal: a handoff artifact existing means design work has been
 * packaged for engineering, which only happens at the end of the lifecycle.
 * Two shapes count: the lo-fi-tree HANDOFF.md, or any *.html dropped into the
 * project's handoff/ folder (the /handoff-doc skill's output location).
 */
async function hasHandoffArtifact(record: ProjectRecord): Promise<boolean> {
  if (
    await exists(
      path.join(record.projectPath, "design-system", "lofi", "HANDOFF.md"),
    )
  ) {
    return true;
  }
  try {
    const entries = await fs.readdir(path.join(record.projectPath, "handoff"), {
      withFileTypes: true,
    });
    return entries.some(
      (e) => e.isFile() && e.name.toLowerCase().endsWith(".html"),
    );
  } catch {
    // No handoff/ dir (or unreadable) — simply means no handoff yet.
    return false;
  }
}

/**
 * Hi-fi signal #3: commits landed on the prototype branch since v1 was
 * stamped. v1 marks "prototype scaffolded"; anything after it is real build
 * work, i.e. hi-fi activity. Failure (missing worktree — e.g. a broken record
 * whose prototype/ was deleted — or an unknown hash) is treated as 0 so one
 * bad project can never break phase derivation.
 */
async function commitsSinceFirstVersion(record: ProjectRecord): Promise<number> {
  const first = record.versions?.[0];
  if (!first?.hash) return 0;
  try {
    const { stdout } = await execFileAsync(
      "git",
      ["rev-list", "--count", `${first.hash}..HEAD`],
      { cwd: record.prototypePath },
    );
    const n = Number(stdout.trim());
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

/**
 * Derive the lifecycle phase for a project. Order matters — each check is a
 * strictly "later" lifecycle signal than the ones below it:
 *
 *   archived flag → handoff artifact → hi-fi activity → lo-fi rounds → kickoff
 *
 * phaseDetail is only produced for "lofi", describing the LATEST in-tree
 * round's progress (drafted → built → documented/in review).
 */
export async function derivePhase(
  record: ProjectRecord,
  rounds: LofiRound[],
): Promise<{ phase: ProjectPhase; phaseDetail?: string }> {
  // Archival is explicit and trumps everything — the artifacts still exist on
  // disk, but the human has shelved the project.
  if (record.archived) return { phase: "archived" };

  if (await hasHandoffArtifact(record)) return { phase: "handoff" };

  // Hi-fi means real prototype build work has happened. Any of: a variant was
  // forked (variants only make sense off a working prototype), more than one
  // version was stamped (v2+ implies iteration), or commits landed since v1.
  if ((record.variants?.length ?? 0) > 0) return { phase: "hifi" };
  if ((record.versions?.length ?? 0) > 1) return { phase: "hifi" };
  if ((await commitsSinceFirstVersion(record)) > 0) return { phase: "hifi" };

  // Lo-fi means wireframe rounds exist in the project tree. External rounds
  // (pointed-at folders elsewhere on disk) don't count — they predate the
  // project's own lifecycle and say nothing about its progress.
  const inTree = rounds.filter((r) => !r.external);
  if (inTree.length > 0) {
    const latest = inTree.reduce((a, b) => (b.round > a.round ? b : a));
    const phaseDetail =
      latest.status === "documented"
        ? `R${latest.round} in review` // guide exists → awaiting feedback
        : latest.status === "built"
          ? `R${latest.round} built` // wireframes exist, no guide yet
          : `R${latest.round} drafted`; // scaffolded, no wireframes yet
    return { phase: "lofi", phaseDetail };
  }

  // Nothing else on disk — the project is still in kickoff/discovery.
  return { phase: "kickoff" };
}
