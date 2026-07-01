import cors from "cors";
import express, {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";
import fs from "node:fs/promises";
import { HUB_API_PORT, projectCoverPath } from "./paths.js";
import {
  createProject,
  createVariant,
  createVersion,
  ensureVariantClaudeMd,
  getProjectBySlug,
  listAllProjects,
  listResources,
  listVersions,
  promoteVariant,
  removeProject,
  removeVariant,
  syncVariant,
} from "./projects.js";
import {
  createBranchOption,
  createLofiRound,
  ensureKickoff,
  listLofiRounds,
} from "./lofi.js";
import {
  resolveExternalLofiFile,
  resolveLofiFile,
  resolveResourceFile,
  resolveRevealTarget,
  uploadResource,
} from "./projects.js";
import { spawn } from "node:child_process";
import {
  addExternalResource,
  deleteExternalResource,
  listExternalResources,
  type ResourceCategory,
} from "./resources.js";
import {
  getProtoBaseLogs,
  getRecentLogs,
  isRunning,
  isVariantRunning,
  startDevServer,
  startProtoBase,
  startVariantDevServer,
  statusFor,
  statusForProtoBase,
  statusForVariant,
  stopAll,
  stopDevServer,
  stopProtoBase,
  stopVariantDevServer,
} from "./dev-server.js";
import { getGitInfo } from "./git.js";
import { getIdentity } from "./identity.js";
import { derivePhase } from "./phase.js";
import { setProjectArchived, setProjectPinned } from "./store.js";
import {
  listDesignRefEntries,
  resolveDesignRefFile,
  type RefKind,
} from "./designRefs.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Base64-encoded file uploads can run large; the global 1mb parser would reject
// them. A dedicated 25mb json parser is mounted ONLY on the upload route so
// every other route keeps the tight 1mb cap.
const uploadJson = express.json({ limit: "25mb" });

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Machine identity (git config / gh) — no login system. Used as the creator
// fallback for records that predate the creator field.
app.get("/api/identity", async (_req, res, next) => {
  try {
    res.json({ identity: await getIdentity() });
  } catch (err) {
    next(err);
  }
});

app.get("/api/projects", async (_req, res, next) => {
  try {
    const projects = await listAllProjects();
    const enriched = await Promise.all(
      projects.map(async (p) => {
        const rounds = await listLofiRounds(p.slug).catch(() => []);
        // Real screenshot cover, if the project has one. The ?v= mtime busts
        // the browser cache whenever the screenshot is refreshed.
        let coverUrl: string | undefined;
        try {
          const stat = await fs.stat(projectCoverPath(p.slug));
          coverUrl = `/api/projects/${encodeURIComponent(p.slug)}/cover?v=${stat.mtimeMs}`;
        } catch {
          coverUrl = undefined;
        }
        // Derived lifecycle phase. Guarded so one broken record (e.g. a
        // missing prototype worktree) can never 500 the whole list.
        let phaseInfo: Awaited<ReturnType<typeof derivePhase>> = {
          phase: "kickoff",
        };
        try {
          phaseInfo = await derivePhase(p, rounds);
        } catch {
          /* fall back to kickoff */
        }
        return {
          ...p,
          status: isRunning(p.slug) ? "running" : "stopped",
          devUrl: `http://localhost:${p.port}`,
          lofiRoundCount: rounds.length,
          variantCount: (p.variants ?? []).length,
          coverUrl,
          ...phaseInfo,
          latestVersion: p.versions?.at(-1)?.label,
          archived: p.archived,
        };
      }),
    );
    res.json({ projects: enriched });
  } catch (err) {
    next(err);
  }
});

app.post("/api/projects", async (req, res, next) => {
  try {
    const { name, description, product } = req.body ?? {};
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name is required" });
    }
    const record = await createProject({ name, description, product });
    res.status(201).json({ project: record });
  } catch (err) {
    next(err);
  }
});

app.get("/api/projects/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const record = await getProjectBySlug(slug);
    if (!record) return res.status(404).json({ error: "not found" });
    const [rounds, resources, kickoffPath] = await Promise.all([
      listLofiRounds(slug).catch(() => []),
      listResources(slug).catch(() => []),
      ensureKickoff(slug).catch(() => ""),
    ]);
    // Same phase enrichment (and the same broken-record guard) as the list.
    let phaseInfo: Awaited<ReturnType<typeof derivePhase>> = {
      phase: "kickoff",
    };
    try {
      phaseInfo = await derivePhase(record, rounds);
    } catch {
      /* fall back to kickoff */
    }
    res.json({
      project: {
        ...record,
        status: isRunning(slug) ? "running" : "stopped",
        devUrl: `http://localhost:${record.port}`,
        lofiRoundCount: rounds.length,
        resourcesCount: resources.length,
        kickoffPath,
        ...phaseInfo,
        latestVersion: record.versions?.at(-1)?.label,
        archived: record.archived,
      },
      rounds,
      resources,
      runtime: statusFor(slug),
    });
  } catch (err) {
    next(err);
  }
});

app.patch("/api/projects/:slug/pin", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { pinned } = req.body ?? {};
    if (typeof pinned !== "boolean") {
      return res.status(400).json({ error: "pinned must be a boolean" });
    }
    const record = await getProjectBySlug(slug);
    if (!record) return res.status(404).json({ error: "not found" });
    await setProjectPinned(slug, pinned);
    res.json({ ok: true, pinned });
  } catch (err) {
    next(err);
  }
});

app.patch("/api/projects/:slug/archive", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { archived } = req.body ?? {};
    if (typeof archived !== "boolean") {
      return res.status(400).json({ error: "archived must be a boolean" });
    }
    const record = await getProjectBySlug(slug);
    if (!record) return res.status(404).json({ error: "not found" });
    await setProjectArchived(slug, archived);
    res.json({ ok: true, archived });
  } catch (err) {
    next(err);
  }
});

// Serve the project's card cover screenshot (<projectDir>/cover.png). The
// file lives OUTSIDE prototype/ so it never dirties the project branch;
// agents drop it there after UI milestones and the Hub picks it up.
app.get("/api/projects/:slug/cover", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const coverPath = projectCoverPath(slug);
    try {
      await fs.stat(coverPath);
    } catch {
      return res.status(404).json({ error: "not found" });
    }
    res.sendFile(coverPath, (err: any) => {
      if (err && !res.headersSent) {
        res.status(err.status ?? 404).json({ error: "not found" });
      }
    });
  } catch (err) {
    next(err);
  }
});

app.get("/api/projects/:slug/git", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const record = await getProjectBySlug(slug);
    if (!record) return res.status(404).json({ error: "not found" });
    // Guard before getGitInfo: a half-created record with no worktree on disk
    // would otherwise surface as a raw "spawn git ENOENT" 500.
    try {
      await fs.stat(record.prototypePath);
    } catch {
      return res
        .status(404)
        .json({ error: "prototype worktree missing on disk" });
    }
    const info = await getGitInfo(record.prototypePath, record.branch);
    res.json({ git: info });
  } catch (err) {
    next(err);
  }
});

app.get("/api/projects/:slug/versions", async (req, res, next) => {
  try {
    const { slug } = req.params;
    res.json({ versions: await listVersions(slug) });
  } catch (err) {
    next(err);
  }
});

app.post("/api/projects/:slug/versions", async (req, res, next) => {
  try {
    const { slug } = req.params;
    res.status(201).json({ version: await createVersion(slug) });
  } catch (err) {
    next(err);
  }
});

app.get("/api/projects/:slug/variants", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const project = await getProjectBySlug(slug);
    if (!project) return res.status(404).json({ error: "not found" });
    const variants = await Promise.all(
      (project.variants ?? []).map(async (v) => {
        const git = await getGitInfo(v.prototypePath, v.branch, project.branch);
        statusForVariant(slug, v.slug);
        // Backfills CLAUDE.md for variants created before it existed.
        const claudeMdPath = await ensureVariantClaudeMd(project, v);
        return {
          slug: v.slug,
          name: v.name,
          description: v.description,
          label: v.label,
          parentVersion: v.parentVersion,
          promotedTo: v.promotedTo,
          branch: v.branch,
          port: v.port,
          createdAt: v.createdAt,
          devUrl: `http://localhost:${v.port}`,
          claudeMdPath,
          prototypePath: v.prototypePath,
          running: isVariantRunning(slug, v.slug),
          ahead: git.ahead,
          behind: git.behind,
          head: git.head,
          recent: git.recent,
        };
      }),
    );
    res.json({ variants });
  } catch (err) {
    next(err);
  }
});

app.post("/api/projects/:slug/variants", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name, description, version } = req.body ?? {};
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "name is required" });
    }
    const project = await getProjectBySlug(slug);
    if (!project) return res.status(404).json({ error: "not found" });
    const v = await createVariant(slug, { name, description, version });
    const git = await getGitInfo(v.prototypePath, v.branch, project.branch);
    res.status(201).json({
      variant: {
        slug: v.slug,
        name: v.name,
        description: v.description,
        label: v.label,
        parentVersion: v.parentVersion,
        promotedTo: v.promotedTo,
        branch: v.branch,
        port: v.port,
        createdAt: v.createdAt,
        devUrl: `http://localhost:${v.port}`,
        claudeMdPath: `${v.variantPath}/CLAUDE.md`,
        prototypePath: v.prototypePath,
        running: false,
        ahead: git.ahead,
        behind: git.behind,
        head: git.head,
        recent: git.recent,
      },
    });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/projects/:slug/variants/:vSlug", async (req, res, next) => {
  try {
    const { slug, vSlug } = req.params;
    await stopVariantDevServer(slug, vSlug);
    await removeVariant(slug, vSlug);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.post(
  "/api/projects/:slug/variants/:vSlug/start",
  async (req, res, next) => {
    try {
      const { slug, vSlug } = req.params;
      const result = await startVariantDevServer(slug, vSlug);
      res.json({ ok: true, url: result.url });
    } catch (err) {
      next(err);
    }
  },
);

app.post("/api/projects/:slug/variants/:vSlug/stop", async (req, res, next) => {
  try {
    const { slug, vSlug } = req.params;
    await stopVariantDevServer(slug, vSlug);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.post(
  "/api/projects/:slug/variants/:vSlug/merge",
  async (req, res, next) => {
    try {
      const { slug, vSlug } = req.params;
      const { source } = req.body ?? {};
      const result = await syncVariant(slug, vSlug, source);
      res.json({
        ok: true,
        merged: result.merged,
        conflicts: result.conflicts,
        pulled: result.behind,
      });
    } catch (err) {
      next(err);
    }
  },
);

app.post(
  "/api/projects/:slug/variants/:vSlug/promote",
  async (req, res, next) => {
    try {
      const { slug, vSlug } = req.params;
      res.json(await promoteVariant(slug, vSlug));
    } catch (err) {
      next(err);
    }
  },
);

app.delete("/api/projects/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    // Stop-then-remove: the project's own dev server, plus every variant's,
    // before removeProject() cascades the worktree/branch teardown. projects.ts
    // deliberately cannot import dev-server (ESM cycle), so the orchestration
    // lives here.
    const project = await getProjectBySlug(slug);
    await stopDevServer(slug);
    for (const v of project?.variants ?? []) {
      await stopVariantDevServer(slug, v.slug);
    }
    await removeProject(slug);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.post("/api/projects/:slug/start", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await startDevServer(slug);
    res.json({ ok: true, ...result, status: statusFor(slug) });
  } catch (err) {
    next(err);
  }
});

app.post("/api/projects/:slug/stop", async (req, res, next) => {
  try {
    const { slug } = req.params;
    await stopDevServer(slug);
    res.json({ ok: true, status: statusFor(slug) });
  } catch (err) {
    next(err);
  }
});

app.get("/api/projects/:slug/logs", async (req, res, next) => {
  try {
    const { slug } = req.params;
    res.json({ logs: getRecentLogs(slug) });
  } catch (err) {
    next(err);
  }
});

// --- proto-base dev servers (one per product, keyed by id pe|ss) ---

// Back-compat: the original unparameterized routes default to 'pe' (the
// wrappers' default arg). The :id form below drives a specific proto-base.
// The two route shapes differ in segment count, so they never collide.
app.get("/api/proto-base/status", (_req, res) => {
  res.json(statusForProtoBase());
});

app.post("/api/proto-base/start", async (_req, res, next) => {
  try {
    const result = await startProtoBase();
    res.json({ ok: true, ...result, status: statusForProtoBase() });
  } catch (err) {
    next(err);
  }
});

app.post("/api/proto-base/stop", async (_req, res, next) => {
  try {
    await stopProtoBase();
    res.json({ ok: true, status: statusForProtoBase() });
  } catch (err) {
    next(err);
  }
});

app.get("/api/proto-base/logs", (_req, res) => {
  res.json({ logs: getProtoBaseLogs() });
});

// id-parameterized routes (id in {pe, ss}; unknown ids default to pe in the
// wrappers, so no explicit validation is required here).
app.get("/api/proto-base/:id/status", (req, res) => {
  const { id } = req.params;
  res.json(statusForProtoBase(id));
});

app.post("/api/proto-base/:id/start", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await startProtoBase(id);
    res.json({ ok: true, ...result, status: statusForProtoBase(id) });
  } catch (err) {
    next(err);
  }
});

app.post("/api/proto-base/:id/stop", async (req, res, next) => {
  try {
    const { id } = req.params;
    await stopProtoBase(id);
    res.json({ ok: true, status: statusForProtoBase(id) });
  } catch (err) {
    next(err);
  }
});

app.get("/api/proto-base/:id/logs", (req, res) => {
  const { id } = req.params;
  res.json({ logs: getProtoBaseLogs(id) });
});

app.get("/api/projects/:slug/lofi", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const rounds = await listLofiRounds(slug);
    res.json({ rounds });
  } catch (err) {
    next(err);
  }
});

app.post("/api/projects/:slug/lofi", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const round = await createLofiRound(slug);
    res.status(201).json({ round });
  } catch (err) {
    next(err);
  }
});

// Create a parallel branch-option off a round (sibling folder, not a git branch).
app.post("/api/projects/:slug/lofi/:round/options", async (req, res, next) => {
  try {
    const { slug, round } = req.params;
    const { name } = req.body ?? {};
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }
    const n = Number(round);
    if (!Number.isInteger(n) || n <= 0) {
      return res.status(400).json({ error: "bad round" });
    }
    const option = await createBranchOption(slug, n, name);
    res.status(201).json({ option });
  } catch (err) {
    next(err);
  }
});

// Serve files from an external lo-fi directory (pointed at by externals.json)
// over HTTP so the UI can preview them in a sandboxed iframe — browsers block
// file:// iframes loaded from an http origin. Relative assets resolve through
// the trailing splat. Path traversal outside the pointed-at dir is rejected.
const firstParam = (v: string | string[] | undefined): string =>
  Array.isArray(v) ? v[0] ?? "" : v ?? "";

const serveExternalLofi: RequestHandler = async (req, res, next) => {
  try {
    const slug = firstParam(req.params.slug);
    const rel = firstParam((req.params as Record<string, string | string[]>)[0]);
    const n = Number(firstParam(req.params.idx));
    if (!Number.isInteger(n) || n < 0) {
      return res.status(400).json({ error: "bad index" });
    }
    const resolved = await resolveExternalLofiFile(slug, n, rel);
    if (!resolved) return res.status(404).json({ error: "not found" });
    res.sendFile(resolved.absPath, (err: any) => {
      if (err && !res.headersSent) {
        res.status(err.status ?? 404).json({ error: "not found" });
      }
    });
  } catch (err) {
    next(err);
  }
};

app.get("/api/projects/:slug/lofi/external/:idx", serveExternalLofi);
app.get("/api/projects/:slug/lofi/external/:idx/*", serveExternalLofi);

// Serve IN-TREE lo-fi files (round index.html galleries, wireframes, guides,
// KICKOFF.md) over HTTP. Browsers block file:// navigation from an http page,
// so the Launch / Decisions buttons can't use file:// links — same reason the
// external route above exists. Relative assets inside a round resolve through
// the splat. Path traversal outside design-system/lofi/ is rejected.
app.get("/api/projects/:slug/lofi/files/*", async (req, res, next) => {
  try {
    const slug = firstParam(req.params.slug);
    const rel = firstParam((req.params as Record<string, string | string[]>)[0]);
    if (!rel) return res.status(400).json({ error: "path is required" });
    const resolved = await resolveLofiFile(slug, rel);
    if (!resolved) return res.status(404).json({ error: "not found" });
    // Markdown (KICKOFF.md) should display inline as text, not download.
    if (rel.toLowerCase().endsWith(".md")) res.type("text/plain");
    res.sendFile(resolved.absPath, (err: any) => {
      if (err && !res.headersSent) {
        res.status(err.status ?? 404).json({ error: "not found" });
      }
    });
  } catch (err) {
    next(err);
  }
});

// Design references — the vendored Excalibrr component reference ("system")
// and layout-pattern rulebook ("patterns") rendered at /design-system and
// /design-patterns. Entries are one JSON file each under the resource dir's
// content/; a malformed file is skipped (reported in warnings), never fatal.
app.get("/api/design-refs/:kind", async (req, res, next) => {
  try {
    const kind = firstParam(req.params.kind);
    if (kind !== "system" && kind !== "patterns" && kind !== "wireframe") {
      return res.status(404).json({ error: "unknown design-ref kind" });
    }
    const { entries, warnings } = await listDesignRefEntries(kind as RefKind);
    res.json({ entries, warnings });
  } catch (err) {
    next(err);
  }
});

// Serve files inside a design-ref resource dir (specimen PNGs, generated
// markdown) over HTTP. Same traversal guard + md-as-text behavior as the
// lo-fi files route.
app.get("/api/design-refs/:kind/files/*", async (req, res, next) => {
  try {
    const kind = firstParam(req.params.kind);
    const rel = firstParam((req.params as Record<string, string | string[]>)[0]);
    if (!rel) return res.status(400).json({ error: "path is required" });
    const resolved = await resolveDesignRefFile(kind, rel);
    if (!resolved) return res.status(404).json({ error: "not found" });
    if (rel.toLowerCase().endsWith(".md")) res.type("text/plain");
    res.sendFile(resolved, (err: any) => {
      if (err && !res.headersSent) {
        res.status(err.status ?? 404).json({ error: "not found" });
      }
    });
  } catch (err) {
    next(err);
  }
});

// Serve a file from the project's resources/ directory over HTTP so the UI can
// render image thumbnails/previews. Path traversal outside resources/ is
// rejected via the same guard as the lo-fi external-file route.
app.get("/api/projects/:slug/resources/file", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const rel = firstParam(req.query.path as string | string[] | undefined);
    if (!rel) return res.status(400).json({ error: "path is required" });
    const resolved = await resolveResourceFile(slug, rel);
    if (!resolved) return res.status(404).json({ error: "not found" });
    res.sendFile(resolved.absPath, (err: any) => {
      if (err && !res.headersSent) {
        res.status(err.status ?? 404).json({ error: "not found" });
      }
    });
  } catch (err) {
    next(err);
  }
});

// Reveal a file/subfolder (or the resources/ dir itself) in Finder via
// `open`. The target is guarded within the project's resources/ root.
app.post("/api/projects/:slug/resources/reveal", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { path: rel } = req.body ?? {};
    const target = await resolveRevealTarget(slug, rel);
    if (!target) return res.status(404).json({ error: "not found" });
    const child = spawn("open", [target], {
      detached: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.on("error", () => {
      /* surfaced via the 500 path only if it throws synchronously */
    });
    res.json({ ok: true, target });
  } catch (err) {
    next(err);
  }
});

// Upload a file into resources/<type>/ from a base64 JSON body (no multer).
// Mounts the 25mb parser so larger base64 payloads fit.
app.post(
  "/api/projects/:slug/resources/upload",
  uploadJson,
  async (req, res, next) => {
    try {
      const { slug } = req.params;
      const { type, name, dataBase64 } = req.body ?? {};
      const file = await uploadResource(slug, { type, name, dataBase64 });
      res.status(201).json({ file });
    } catch (err) {
      next(err);
    }
  },
);

app.get("/api/projects/:slug/resources/external", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { category } = req.query as { category?: string };
    let items = await listExternalResources(slug);
    if (category) items = items.filter((i) => i.category === category);
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

app.post("/api/projects/:slug/resources/external", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { category, title, url, note } = req.body ?? {};
    if (!category || !title || !url) {
      return res
        .status(400)
        .json({ error: "category, title and url are required" });
    }
    const item = await addExternalResource(slug, {
      category: category as ResourceCategory,
      title,
      url,
      note,
    });
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
});

app.delete(
  "/api/projects/:slug/resources/external/:id",
  async (req, res, next) => {
    try {
      const { slug, id } = req.params;
      await deleteExternalResource(slug, id);
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  },
);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error("[api error]", err);
  res.status(err?.status ?? 500).json({ error: err?.message ?? String(err) });
});

const server = app.listen(HUB_API_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[hub api] listening on http://localhost:${HUB_API_PORT}`);
});

async function shutdown(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("\n[hub api] shutting down — stopping any running prototype dev servers...");
  await stopAll();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
