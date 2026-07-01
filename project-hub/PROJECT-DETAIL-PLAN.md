# Wire up Project Detail page features in the Hub

---

## 🆕 START HERE — copy this into the fresh session verbatim

> Read this plan in full before doing anything: `/Users/frankoverland/.claude/plans/can-we-make-some-serene-hare.md`. Also read the user's auto-memory at `/Users/frankoverland/.claude/projects/-Users-frankoverland-Documents-Project-Eddie-Project-Eddie/memory/MEMORY.md` and the linked memory files there — they contain Frank's profile, the Freddy project history, and the Hub's recent state.
>
> Working directory: `/Users/frankoverland/freddy/project-hub/` (Vite + React 18 + Tailwind 3.4, served at http://localhost:5174). The Vite dev server and Node API server were running at the end of the prior session.
>
> What the prior session shipped (real code on disk, not pending):
> - Three OKLCH themes — **Pitfield** (warm dark, default), **Bone & Ink** (paper light), **Steelyard** (cool dark with patina-green) — defined in `src/theme.css`, `src/index.css`, and `tailwind.config.js`. A floating `<ThemeSwitcher>` is mounted in `src/components/AppShell.tsx`; it persists choice to `localStorage["hub.theme"]`.
> - Tailwind config was migrated from `hsl(var(--*))` to a `withAlpha()` helper that emits `color-mix()` so the opacity modifiers (`bg-card/80`, `bg-primary/10`, etc.) work with any color format. Don't undo this — every shadcn opacity class in the codebase depends on it.
> - `.impeccable.md` exists in the project root with Frank's Design Context.
>
> What you're being asked to do: **execute Phase 1 of this plan** (sections "Phase 1 — 1a / 1b / 1c" below) on the Hub code, then **produce the HTML deliverable** at `/Users/frankoverland/freddy/projects/grizmo/implementation-plan.html` via the `make-implementation-plan` skill. Phases 2 and 3 are for later — do not auto-roll into them.
>
> Hard constraints:
> - The Hub shell stays on shadcn + the OKLCH themes. **Never import** `~/Documents/WireframeDesignSystem/wireframe.css` into the React app. Render lo-fi files in **sandboxed iframes** (`sandbox="allow-same-origin"`) so their `wf-*` styling is intact with zero leakage.
> - **Filesystem-first.** Persist via JSON files inside `~/freddy/projects/{slug}/` — no SQLite, no new DB. `projects.json` already proves the pattern; mirror it.
> - **External lo-fi via pointer files**, not copies or symlinks. Pointer file: `~/freddy/projects/{slug}/design-system/lofi/externals.json`. The Grizmo lo-fis live at `/Users/frankoverland/Documents/Claude/Projects/Ai Opportunities/` (Kit Round 4 - Gizmo Option A, Wireframe 5 - Cell Selection Constraint, Response Cards UI Spec, Admin Wireframes - Internal).
> - Frank is a designer who optimizes for visible wins — do Phase 1 in order (1a → 1b → 1c) and verify each works in the browser before moving on. He will check the screen, not the test runner.
> - When you've finished Phase 1 code, generate the HTML plan via `/make-implementation-plan` skill — style it like the existing `/Users/frankoverland/freddy/projects/grizmo/` plan.html archetype (sticky sidebar nav, phase cards, per-step prompts with Copy buttons).
>
> Confirm you've read this plan and the memory, then start Phase 1a (Hi-Fi version timeline).

---

## Context (the why, in plain English)

The Project Hub at `~/freddy/project-hub/` is Frank's daily driver for managing prototype branches at Gravitate Energy. When he clicks into a project — like `grizmo` — he lands on the Project Detail page (`/p/:slug`). Most of that page works (start/stop dev server, branch panel, lo-fi rounds, project files), but a meaningful chunk is **stubbed out** with "coming soon" placeholders:

- The **Hi-Fi timeline** under the Prototypes tab — a grey box that does nothing.
- The **Lo-Fi timeline** — also a grey box. Frank's actual Grizmo lo-fi work lives **outside** the project folder at `~/Documents/Claude/Projects/Ai Opportunities/...` (Kit Round 4, Wireframe 5, Response Cards, Admin Wireframes), and the Hub has no way to surface those wireframes today.
- **External Resources** — six chips (Screenshots, Links, Interviews, Competitive, Docs, Loom) all disabled.
- **Sync from main / Merge to main** buttons in BranchPanel — disabled.
- **Scoped search** in the page header — inert.

Frank just shipped a real Hi-Fi demo (4 committed phases of Grizmo work) in `~/freddy/projects/grizmo/prototype/` (branch `project/grizmo`). When he opens `/p/grizmo` in the Hub right now, **none of that progress shows up** — the page looks the same as an empty project. This plan wires up the inert features so the Hub actually surfaces the work he's done.

The Wireframe DS at `~/Documents/WireframeDesignSystem/` stays at arm's length — we **render lo-fi files in iframes** so their `wf-*` styling renders untouched, but we never import `wireframe.css` into the Hub shell.

The deliverable is **two artifacts**: code changes that wire up the features, and a polished HTML implementation plan at `~/freddy/projects/grizmo/implementation-plan.html` mirroring the existing Grizmo `plan.html` archetype.

---

## Inventory snapshot (so the next session doesn't re-explore)

**Routing.** App.tsx mounts `/p/:slug` → `src/pages/ProjectPage.tsx` → `src/components/ProjectDetail.tsx`.

**Backend.** File-based JSON. Storage: `~/freddy/project-hub/data/projects.json` for Hub metadata; per-project at `~/freddy/projects/{slug}/` with subfolders `prototype/` (git worktree of proto-base), `design-system/lofi/`, `resources/`, `CLAUDE.md`, `README.md`, `.freddy-project.json`.

**Existing endpoints** in `server/index.ts`:
- `GET /api/projects/:slug` → ProjectDetail
- `GET /api/projects/:slug/git` → GitInfo (ahead/behind, recent commits)
- `POST /api/projects/:slug/start` and `/stop` → dev server lifecycle
- `GET /api/projects/:slug/logs` → unused
- `GET /api/projects/:slug/lofi` → list rounds
- `POST /api/projects/:slug/lofi` → create round

**Project data shape** (from `src/lib/api.ts`):
```
ProjectSummary { slug, name, description?, branch, port, createdAt, prototypePath, projectPath, status, devUrl, lofiRoundCount }
ProjectDetail  { project: ProjectSummary & { resourcesCount }, rounds: LofiRound[], resources: ResourceFile[], runtime: { running, url?, startedAt?, pid? } }
LofiRound      { round, name, path, indexHtmlPath, notesPath, createdAt }
ResourceFile   { name, size, path }
GitInfo        { branch, baseBranch, ahead, behind, head: GitCommit | null, recent: GitCommit[], workingTreeClean }
```

**What's inert (P1 targets in bold):**
- **Hi-Fi `<TimelinePlaceholder>` at ProjectDetail.tsx:212–223**
- **Lo-Fi external rounds (no UI surface today)**
- **External Resources card at ProjectDetail.tsx:262–293**
- Sync / Merge buttons at BranchPanel.tsx:159–168 — Phase 2
- Scoped search input at ProjectDetail.tsx:98 — Phase 2
- "📓 changelog" / "Send to Claude" / "New version" chips in `TimelinePlaceholder.tsx` — Phase 2

---

## Phase 1 — "See the Grizmo work" (highest leverage, ~1–2 days)

### 1a. Hi-Fi version timeline

Replace the disabled `<TimelinePlaceholder>` for Hi-Fi with a real component.

- **New file:** `src/components/projects/HifiTimeline.tsx`
  - Calls `api.getGitInfo(slug)` — already exists, returns `GitInfo.recent: GitCommit[]`
  - Renders one card per commit: subject, short hash, author, relative time
  - HEAD badge on the topmost commit; "active" pill when `runtime.running`
  - "↗ Launch" button per card → opens `project.devUrl` in new tab. Disabled with hint "Start dev server first" when `runtime.running === false`. (All Launch buttons go to the same live URL in P1; per-commit checkout is Phase 3.)
  - "New version" stays visually disabled with copy: "Commit in your worktree, then refresh."
- **Edit:** `src/components/ProjectDetail.tsx` lines 212–223 — swap the second `<TimelinePlaceholder>` for `<HifiTimeline slug={...} devUrl={...} running={...} />`.
- **Backend:** no new endpoint. Optional: bump `-10` to `-25` in `server/git.ts`.
- **Data:** no shape changes.

### 1b. Lo-Fi external rounds — `externals.json` approach

Pointer file beats copies (go stale) and symlinks (break Finder previews and confuse "what's mine" inside the project tree).

- **New file (hand-edited initially):** `~/freddy/projects/grizmo/design-system/lofi/externals.json`
  ```
  [
    { "label": "Round 4 — Gizmo Option A", "path": "/Users/frankoverland/Documents/Claude/Projects/Ai Opportunities/Kit Round 4 - Gizmo Option A", "indexHtml": "gizmo-demo.html" },
    { "label": "Wireframe 5 — Cell Selection Constraint", "path": ".../Wireframe 5 - Cell Selection Constraint", "indexHtml": "wireframe-5.html" },
    { "label": "Response Cards UI Spec", "path": ".../Response Cards UI Spec", "indexHtml": "response-cards-spec.html" },
    { "label": "Admin Wireframes — Internal", "path": ".../Admin Wireframes - Internal", "indexHtml": "index.html" }
  ]
  ```
- **Backend edit:** `server/projects.ts` `listLofiRounds()` — after building in-tree rounds, read `externals.json` if present, `fs.access()` each path, append entries marked `external: true`.
- **Type edit:** add `external?: boolean` and `label?: string` to `LofiRound` in both `server/projects.ts` and `src/lib/api.ts`.
- **Frontend edit:** `src/components/LofiRounds.tsx` — when `r.external`, show an "External" pill + `r.label` as title; keep the `file://` open link; add a collapsed iframe preview toggle (`sandbox="allow-same-origin"`, ~600px tall when expanded).

### 1c. External Resources — Links tab live

Links ships first because it's cheapest end-to-end and most useful for the Grizmo demo (Notion brief, Drive, plan.html). Once Links works, Docs/Loom/Competitive are the same shape with a different `category`.

- **New endpoints in `server/index.ts` + new `server/resources.ts`:**
  - `GET /api/projects/:slug/resources/external` → `{ items: ExternalResource[] }`
  - `POST /api/projects/:slug/resources/external` body `{ category, title, url, note? }` → appends with UUID + ISO date
  - `DELETE /api/projects/:slug/resources/external/:id`
- **Shape:** `ExternalResource = { id, category, title, url, note?, createdAt }`. Stored in `~/freddy/projects/{slug}/resources/external.json`.
- **New file:** `src/components/projects/ExternalResources.tsx` — 6 tab chips at top; only Links is active in P1, the other 5 keep their existing "coming soon" treatment but live inside the same component so P3 just flips flags. "Add link" inline form (title + URL + optional note) → POST → optimistic update.
- **Edit:** `src/components/ProjectDetail.tsx` lines 262–293 — swap the disabled chip card for `<ExternalResources slug={project.slug} />`.
- **Type + client:** add `ExternalResource` type and `listExternalResources/addExternalResource/deleteExternalResource` clients to `src/lib/api.ts`.

---

## Phase 2 — "Make it editable + search" (~2–3 days) — DO NOT START WITHOUT EXPLICIT GO-AHEAD

- **2a. "Link external lo-fi…" dialog** next to "New round". Backed by `POST/DELETE /api/projects/:slug/lofi/externals` editing the same `externals.json`.
- **2b. Hi-Fi changelog** — "📓 changelog" chip becomes a modal showing commit bodies. New endpoint `GET /api/projects/:slug/git/changelog`. "Copy as markdown" button.
- **2c. Sync from main / Merge to main** in BranchPanel:
  - `POST /api/projects/:slug/git/sync-from-main` — `git fetch && git merge main --no-edit` in worktree. Returns updated GitInfo + `conflicts: boolean`. 409 if dirty.
  - `POST /api/projects/:slug/git/merge-to-main` — `git checkout main && git merge --no-ff project/<slug> && git checkout project/<slug>` in PROTO_BASE_PATH. **Confirmation dialog required** showing the commits about to be merged.
  - Replace disabled rows at BranchPanel.tsx:159–168.
- **2d. Scoped search** (header input ProjectDetail.tsx:98) — client-side only. Index: rounds (incl. externals), commit subjects, external resource titles+notes, project files. P3 promotes to server-side ripgrep.
- **2e. "Send to Claude"** chip → clipboard prompt template per commit.

---

## Phase 3 — Optional ~3–4 days — DO NOT START WITHOUT EXPLICIT GO-AHEAD

- **Screenshots** category — drag-drop upload, thumbnails (sharp or CSS aspect-ratio).
- **Docs / Loom / Competitive / Interviews** activated (~30 min each).
- **Advanced Launch** — `POST /api/projects/:slug/checkout` body `{ ref }` with working-tree-clean pre-flight + auto-restart.
- **Server-side search** (ripgrep).

---

## Critical files

- `src/components/ProjectDetail.tsx` — swap 2 stubs in Prototypes tab (212–223) + Resources tab (262–293).
- `src/components/LofiRounds.tsx` — render external rounds + iframe preview toggle.
- `src/components/projects/BranchPanel.tsx` — Phase 2 sync/merge (159–168).
- `src/components/projects/HifiTimeline.tsx` — **new**, P1.
- `src/components/projects/ExternalResources.tsx` — **new**, P1.
- `server/projects.ts` — extend `listLofiRounds()` to merge `externals.json`; add resource helpers.
- `server/resources.ts` — **new**, P1, CRUD for `external.json`.
- `server/index.ts` — 3 new routes in P1 (resources GET/POST/DELETE); 4 more in P2.
- `src/lib/api.ts` — extend `LofiRound` type, add `ExternalResource` type, add CRUD clients.

---

## Verification (per phase, concrete)

**Phase 1** — from `~/freddy/project-hub/`, run `./start.sh` (or check ports 5174 and 3030 are already listening), open `http://localhost:5174/p/grizmo`:
1. Confirm 4 commit cards under Hi-Fi (top one: "Grizmo: mini bubble above G + UX copy audit pass"). Click Start dev server → Launch buttons enable → click one → new tab opens to dev URL.
2. Hand-edit `~/freddy/projects/grizmo/design-system/lofi/externals.json` with 4 entries. Refresh. Confirm 4 "External" rows. Expand "Round 4 — Gizmo Option A" iframe preview — `gizmo-demo.html` should render in its native styling.
3. Click "Add link" under External Resources → Links tab → paste a Notion URL titled "Grizmo brief". Verify it persists across refresh and shows up on disk in `resources/external.json`. Add 4 more. Delete one.

**Phase 2/3 verification** lives in the HTML deliverable.

---

## HTML deliverable (final step of Phase 1)

After Phase 1 code is verified working in the browser, invoke the `make-implementation-plan` skill to produce:

- **Path:** `/Users/frankoverland/freddy/projects/grizmo/implementation-plan.html`
- **Style:** sticky sidebar nav · phase cards · per-step prompts with Copy buttons · outcome bullets · verify checklists per phase · critical files appendix
- **Sections:** Overview & guiding principles · Phase 1 (1a Hi-Fi timeline, 1b Lo-Fi externals, 1c Links) · Phase 2 (2a–2e) · Phase 3 (optional) · Verification checklists · Critical files
- **Archetype reference:** the existing `~/freddy/projects/grizmo/` plan.html (find it via `ls ~/freddy/projects/grizmo/*.html` — the prior session's `make-implementation-plan` output)

The HTML is a read-only handoff doc. Frank opens it in a browser, scans Phase 1, copies prompts step-by-step into a Claude Code session if he wants to redo the work elsewhere.

---

## Cross-cutting decisions (briefly argued)

- **Filesystem-first over a database.** `projects.json` already proves the pattern; `externals.json` and `external.json` follow it. Frank is a designer running this locally — he wants files he can `ls`, `git diff`, and edit by hand.
- **Wireframe DS via iframe only.** Hub stays on shadcn + OKLCH themes. Wireframes render in sandboxed iframes so `wf-*` styling is intact with zero leakage into the host app.
- **Pointer files over copies/symlinks** for external lo-fi. Copies go stale silently; symlinks break Finder previews and confuse provenance.
- **Per-commit Launch is Phase 3.** P1 keeps Launch dumb (opens the live dev URL). Per-commit checkout is risky (dirty trees, uncommitted work) and gated behind a confirmation flow.
