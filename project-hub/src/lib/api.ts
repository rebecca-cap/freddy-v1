// Machine identity resolved server-side (git config / gh) — no login system.
export interface Identity {
  name: string;
  email?: string;
  githubLogin?: string;
  avatarUrl?: string;
}

export interface ProjectSummary {
  slug: string;
  name: string;
  description?: string;
  product?: string; // one of sdi|pe|ss; absent on legacy records
  branch: string;
  port: number;
  createdAt: string;
  prototypePath: string;
  projectPath: string;
  status: "running" | "stopped";
  devUrl: string;
  lofiRoundCount: number;
  variantCount?: number;
  pinned?: boolean;
  coverUrl?: string; // real screenshot cover when <projectDir>/cover.png exists
  // Stamped at creation from the machine identity; absent on legacy records.
  creator?: { name: string; githubLogin?: string; avatarUrl?: string };
  // Lifecycle phase, derived server-side from on-disk artifacts (only the
  // archived flag is stored). Distinct from the running/stopped dev status.
  phase: "kickoff" | "lofi" | "hifi" | "handoff" | "archived";
  phaseDetail?: string; // lofi only, e.g. "R2 in review"
  latestVersion?: string; // label of the last stamped version, e.g. "v3"
  archived?: boolean;
}

export type LofiStatus = "drafted" | "built" | "documented";

export interface LofiOption {
  name: string; // folder slug (display + identity; same as slug)
  slug: string; // folder slug
  path: string; // abs filesystem path
  indexHtmlPath: string; // abs path to the option's index.html (Launch target)
  claudeMdPath: string; // abs path to the option's CLAUDE.md
  status: LofiStatus; // derived from wireframes/ + WIREFRAME-GUIDE.html
  wireframeCount: number;
}

export interface LofiRound {
  round: number;
  name: string; // "round-1" (in-tree) | "external-0"
  label?: string; // only set for external rounds
  path: string; // abs filesystem path
  indexHtmlPath: string; // abs path to index.html (Launch target)
  notesPath: string; // abs path to notes.md; "" for externals
  claudeMdPath: string; // abs path to round CLAUDE.md; "" for externals
  briefPath: string; // abs path to brief.md; "" for externals
  parentRound: number; // previous in-tree round number; 0 if none/external
  status: LofiStatus; // "drafted" | "built" | "documented"; externals report "built"
  wireframeCount: number; // real files in wireframes/ (ignores dotfiles/.gitkeep)
  guidePath: string | null; // abs path to WIREFRAME-GUIDE.html if present, else null
  createdAt: string; // ISO; in-tree = folder birthtime, external = index.html mtime
  options: LofiOption[]; // parallel branch-options; [] for externals
  external?: boolean;
  previewUrl?: string; // http preview path; externals only
}

export type ResourceType = "docs" | "interviews" | "competitive" | "screenshots";

export interface ResourceFile {
  name: string;
  size: number;
  path: string; // absolute filesystem path on disk
  type: ResourceType; // subfolder name if in a typed subfolder; else by extension
  sub: string; // subfolder WITH trailing slash ("docs/"), or "" for resources root
  mtime: string; // ISO timestamp (file mtime)
}

export interface RuntimeStatus {
  running: boolean;
  url?: string;
  startedAt?: string;
  pid?: number;
}

export interface ProjectDetail {
  project: ProjectSummary & { resourcesCount: number; kickoffPath: string };
  rounds: LofiRound[];
  resources: ResourceFile[];
  runtime: RuntimeStatus;
}

export type ResourceCategory =
  | "links"
  | "docs"
  | "loom"
  | "competitive"
  | "interviews"
  | "screenshots";

export interface ExternalResource {
  id: string;
  category: ResourceCategory;
  title: string;
  url: string;
  note?: string;
  createdAt: string;
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

export interface VersionRecord {
  label: string;
  hash: string;
  createdAt: string;
}

export interface VariantInfo {
  slug: string;
  name: string;
  description?: string;
  branch: string;
  port: number;
  createdAt: string;
  devUrl: string;
  claudeMdPath: string;
  prototypePath: string;
  running: boolean;
  ahead: number;
  behind: number;
  head: GitCommit | null;
  recent: GitCommit[];
  label: string;
  parentVersion: string;
  promotedTo?: string;
}

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body?.error ?? JSON.stringify(body);
    } catch {
      detail = await res.text().catch(() => "");
    }
    throw new Error(`${res.status} ${res.statusText}: ${detail}`);
  }
  return (await res.json()) as T;
}

/**
 * Build the GET .../resources/file URL for an inline image/file preview.
 * `relPath` is the path RELATIVE to resources/, computed as `${f.sub}${f.name}`
 * (e.g. "docs/grizmo-brief.md", or just "loose-file.md" for root files).
 */
export function resourceFileUrl(slug: string, relPath: string): string {
  return `/api/projects/${encodeURIComponent(slug)}/resources/file?path=${encodeURIComponent(relPath)}`;
}

/**
 * Build the GET .../lofi/files/<relPath> URL for opening in-tree lo-fi files
 * (round index.html galleries, WIREFRAME-GUIDE.html, KICKOFF.md) over HTTP —
 * browsers block file:// links clicked from an http page. Path-style (not a
 * query param) so relative assets inside the HTML resolve naturally.
 */
export function lofiFileUrl(slug: string, relPath: string): string {
  const rel = relPath.split("/").map(encodeURIComponent).join("/");
  return `/api/projects/${encodeURIComponent(slug)}/lofi/files/${rel}`;
}

export const api = {
  health: () => request<{ ok: boolean }>("/api/health"),

  getIdentity: () =>
    request<{ identity: Identity }>("/api/identity").then((r) => r.identity),

  listProjects: () =>
    request<{ projects: ProjectSummary[] }>("/api/projects").then(
      (r) => r.projects,
    ),

  getProject: (slug: string) =>
    request<ProjectDetail>(`/api/projects/${encodeURIComponent(slug)}`),

  getGitInfo: (slug: string) =>
    request<{ git: GitInfo }>(
      `/api/projects/${encodeURIComponent(slug)}/git`,
    ).then((r) => r.git),

  createProject: (name: string, description?: string, product?: string) =>
    request<{ project: ProjectSummary }>("/api/projects", {
      method: "POST",
      body: JSON.stringify({ name, description, product }),
    }).then((r) => r.project),

  deleteProject: (slug: string) =>
    request<{ ok: true }>(`/api/projects/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    }),

  setPinned: (slug: string, pinned: boolean) =>
    request<{ ok: true; pinned: boolean }>(
      `/api/projects/${encodeURIComponent(slug)}/pin`,
      { method: "PATCH", body: JSON.stringify({ pinned }) },
    ),

  setArchived: (slug: string, archived: boolean) =>
    request<{ ok: true; archived: boolean }>(
      `/api/projects/${encodeURIComponent(slug)}/archive`,
      { method: "PATCH", body: JSON.stringify({ archived }) },
    ),

  startDev: (slug: string) =>
    request<{ ok: true; url: string }>(
      `/api/projects/${encodeURIComponent(slug)}/start`,
      { method: "POST" },
    ),

  stopDev: (slug: string) =>
    request<{ ok: true }>(
      `/api/projects/${encodeURIComponent(slug)}/stop`,
      { method: "POST" },
    ),

  // proto-base dev servers — managed like a project, keyed by proto-base id
  // ('pe' -> :5173, 'ss' -> :5175). Defaults to 'pe' for back-compat.
  protoBaseStatus: (id: string = "pe") =>
    request<RuntimeStatus>(`/api/proto-base/${encodeURIComponent(id)}/status`),
  startProtoBase: (id: string = "pe") =>
    request<{ ok: true; url: string; status: RuntimeStatus }>(
      `/api/proto-base/${encodeURIComponent(id)}/start`,
      { method: "POST" },
    ),
  stopProtoBase: (id: string = "pe") =>
    request<{ ok: true; status: RuntimeStatus }>(
      `/api/proto-base/${encodeURIComponent(id)}/stop`,
      { method: "POST" },
    ),

  listLofi: (slug: string) =>
    request<{ rounds: LofiRound[] }>(
      `/api/projects/${encodeURIComponent(slug)}/lofi`,
    ).then((r) => r.rounds),

  createLofi: (slug: string) =>
    request<{ round: LofiRound }>(
      `/api/projects/${encodeURIComponent(slug)}/lofi`,
      { method: "POST" },
    ).then((r) => r.round),

  createBranchOption: (slug: string, round: number, name: string) =>
    request<{ option: LofiOption }>(
      `/api/projects/${encodeURIComponent(slug)}/lofi/${round}/options`,
      { method: "POST", body: JSON.stringify({ name }) },
    ).then((r) => r.option),

  listExternalResources: (slug: string, category?: ResourceCategory) =>
    request<{ items: ExternalResource[] }>(
      `/api/projects/${encodeURIComponent(slug)}/resources/external${
        category ? `?category=${encodeURIComponent(category)}` : ""
      }`,
    ).then((r) => r.items),

  addExternalResource: (
    slug: string,
    input: {
      category: ResourceCategory;
      title: string;
      url: string;
      note?: string;
    },
  ) =>
    request<{ item: ExternalResource }>(
      `/api/projects/${encodeURIComponent(slug)}/resources/external`,
      { method: "POST", body: JSON.stringify(input) },
    ).then((r) => r.item),

  deleteExternalResource: (slug: string, id: string) =>
    request<{ ok: true }>(
      `/api/projects/${encodeURIComponent(slug)}/resources/external/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    ),

  uploadResource: (
    slug: string,
    input: { type: ResourceType; name: string; dataBase64: string },
  ) =>
    request<{ file: ResourceFile }>(
      `/api/projects/${encodeURIComponent(slug)}/resources/upload`,
      { method: "POST", body: JSON.stringify(input) },
    ).then((r) => r.file),

  revealResources: (slug: string, path?: string) =>
    request<{ ok: true; target: string }>(
      `/api/projects/${encodeURIComponent(slug)}/resources/reveal`,
      { method: "POST", body: JSON.stringify(path ? { path } : {}) },
    ),

  listVariants: (slug: string) =>
    request<{ variants: VariantInfo[] }>(
      `/api/projects/${encodeURIComponent(slug)}/variants`,
    ).then((r) => r.variants),

  createVariant: (
    slug: string,
    name: string,
    description?: string,
    version?: string,
  ) =>
    request<{ variant: VariantInfo }>(
      `/api/projects/${encodeURIComponent(slug)}/variants`,
      { method: "POST", body: JSON.stringify({ name, description, version }) },
    ).then((r) => r.variant),

  deleteVariant: (slug: string, vSlug: string) =>
    request<{ ok: true }>(
      `/api/projects/${encodeURIComponent(slug)}/variants/${encodeURIComponent(vSlug)}`,
      { method: "DELETE" },
    ),

  startVariantDev: (slug: string, vSlug: string) =>
    request<{ ok: true; url: string }>(
      `/api/projects/${encodeURIComponent(slug)}/variants/${encodeURIComponent(vSlug)}/start`,
      { method: "POST" },
    ),

  stopVariantDev: (slug: string, vSlug: string) =>
    request<{ ok: true }>(
      `/api/projects/${encodeURIComponent(slug)}/variants/${encodeURIComponent(vSlug)}/stop`,
      { method: "POST" },
    ),

  mergeIntoVariant: (slug: string, vSlug: string, source?: string) =>
    request<{ ok: true; merged: boolean; conflicts?: string[]; pulled?: number }>(
      `/api/projects/${encodeURIComponent(slug)}/variants/${encodeURIComponent(vSlug)}/merge`,
      { method: "POST", body: JSON.stringify({ source }) },
    ),

  listVersions: (slug: string) =>
    request<{ versions: VersionRecord[] }>(
      `/api/projects/${encodeURIComponent(slug)}/versions`,
    ).then((r) => r.versions),

  stampVersion: (slug: string) =>
    request<{ version: VersionRecord }>(
      `/api/projects/${encodeURIComponent(slug)}/versions`,
      { method: "POST" },
    ).then((r) => r.version),

  promoteVariant: (slug: string, vSlug: string) =>
    request<{
      ok: true;
      merged: boolean;
      conflicts?: string[];
      version?: VersionRecord;
    }>(
      `/api/projects/${encodeURIComponent(slug)}/variants/${encodeURIComponent(vSlug)}/promote`,
      { method: "POST" },
    ),
};
