# Resources Tab — Feasibility Write-up

> Companion to `resources-tab-wireframe.html`. This is the "what can / can't actually be done" analysis for making the Resources tab real. No hub code is written yet.

---

## Where it stands today (real vs fictional)

| Section | File | Real? |
|---|---|---|
| Lo-fi rounds | `src/components/LofiRounds.tsx` | ✅ Real — New round / Open (`file://`) / Preview (iframe) all wired |
| Project files | `src/components/ProjectDetail.tsx:231` | ⚠️ Lists `resources/` files (live), but **display-only** — no add/open/delete; files appear only if dropped on disk |
| External resources | `src/components/projects/ExternalResources.tsx` | ⚠️ 6 category tabs, **only 🔗 Links wired** (add/delete → `external.json`). 📷 Screenshots, 📝 Interviews, 🧭 Competitive, 📄 Docs, 🎥 Loom are disabled "coming soon" |
| Search bar | header of External resources | ❌ Disabled "coming soon" |

So the tab is ~70% real surface, ~30% scaffolding.

---

## The model we're moving to — two intake tracks

The clean line is **files vs URLs**, not "files vs forms". Both tracks live behind **one context-aware `+ Add resource` modal** that defaults to the active category's mode:

- **Files track** — Docs, Interviews, Competitive, Screenshots. Add via **drag-drop upload** in the modal (multipart POST → `resources/<type>/`) for one-offs, **or** drop a batch straight into the folder on disk (the modal offers a "reveal folder" shortcut). The tab scans, classifies by subfolder/extension, previews, and references them. No auto-pull.
- **URL track** — Links, Loom, any hosted doc/video. The modal's **URL field** → `external.json` (already wired). A URL has no natural file form, so this stays a form. **Loom folds into this track** (a hosted URL with a 🎥 type) — it is *not* its own category.

```
resources/
├── docs/          → 📄 briefs, specs, PRDs (.md .pdf .docx .txt)   ┐
├── interviews/    → 📝 transcripts (.md .txt) via /meetings, /pd-syncs │ files track
├── competitive/   → 🧭 competitor screenshots + notes               │ (drop on disk)
├── screenshots/   → 📷 UI screenshots (.png .jpg)                   ┘
└── external.json  → 🔗 URL track: Links · 🎥 Loom · hosted docs (one "Add link" form)
```

**Decision (locked):** keep `external.json` as the URL store for now — it works. Only migrate links to `.url` files later if "the folder is the single source of truth" ever becomes a real need (it isn't today).

**Feeds lo-fi:** each resource has an "include in context" toggle. Included resources' paths are written into `KICKOFF.md` and composed into each round's **Send to Claude** prompt. The hub *references*; Claude (which has filesystem access to the project) *ingests* the text.

---

## Per-type verdicts

| Type | Make-it-real verdict | How | Issue |
|---|---|---|---|
| 📄 Docs | ✅ Easy | scan `resources/docs/`, list, Open via `file://` | PDF/docx render inline only with a static-serve route; else open externally |
| 📝 Interviews | ✅ Easy | list `.md/.txt`, Open, include-in-context (text inlines cleanly) | content must first *land on disk* — see boundary below |
| 🧭 Competitive | ✅ Easy | list screenshots + notes, thumbnail | same image-preview note as Screenshots |
| 📷 Screenshots | ✅ Easy | thumbnail grid | inline preview needs static-serve; referenced (not inlined) in context |
| 🔗 Links | ✅ Already works | keep `external.json` GET/POST/DELETE — the **URL track** | the one URL-entry affordance; deliberately separate from the files track |
| 🎥 Loom | ✅ Resolved | a 🎥-typed entry **under the Links/URL track**, not its own category | for text-in-context, drop its transcript as a Doc/Interview |

---

## Easy wins (all reuse existing patterns)

- **`+ Add resource` modal — file upload** — a small multipart `POST /api/projects/:slug/resources/upload?type=<t>` that writes into `resources/<type>/`. (Per the latest decision we *do* build a real upload, alongside the OS-folder drop — both supported.)
- **Scan & classify** — extend `listResources()` (`server/projects.ts:737`) to recurse into subfolders and tag a `type` (by subfolder, extension as fallback). Today it's flat + excludes `external.json`.
- **Open a file** — `file://` link, exactly as `LofiRounds.tsx` "Open" already does.
- **Inline preview** — add a small static-serve route for `resources/` modeled on the lo-fi external-file route (`server/index.ts:378`, `res.sendFile` with path-traversal guard). Images render directly; without the route, fall back to `file://` open.
- **Search / filter** — client-side over the scanned list. Replaces the disabled search bar; no backend.
- **Reveal in Finder / open folder** — `spawn("open", [path])` on macOS. `spawn` is already used in `server/dev-server.ts:82`. New endpoint, trivial.
- **"Include in lo-fi context"** — a small JSON store (mirror `external.json`); the round prompt is string-building over included file paths.

## Issues to figure out

1. **The architecture boundary (the big one).** The hub is a local Express server: filesystem + `spawn` + git, but **no access to claude.ai MCP tools** (Drive, Notion, Loom, Slack). So it **cannot pull external content**. External docs/transcripts reach `resources/` one of two ways:
   - **Claude Code skills** drop them in — `/meetings` / `/pd-syncs` save Gemini transcripts; future skills could save Drive/Notion exports.
   - **Manual drop** by the user.
   Framing to hold onto: **the hub organizes; Claude ingests.** Don't build Drive/Notion/Loom fetchers into the hub.
2. **Type ambiguity.** A `.png` could be Screenshot or Competitive → **subfolder is the source of truth**, extension the fallback.
3. **Binaries in context.** Only text resources (briefs, transcripts) inline as context; images/PDFs are *referenced by path*. Make this explicit in the composed prompt.

### Resolved decisions
- **One `+ Add resource` modal, context-aware** → defaults to the active tab's mode: file-upload on file tabs, URL field on Links.
- **URLs vs files** → two tracks (see above). Files: **upload via the modal AND drop-on-disk** (both supported — updated from the earlier disk-only call). URLs: the modal's URL field → `external.json`. No `.url`-file forcing.
- **🎥 Loom** → not its own category; it's a 🎥-typed entry on the URL track. Drop its transcript as a Doc/Interview if you need the text in context.
- **Link store** → keep `external.json` as-is for now.

---

## Recommended build order (later pass — not now)

1. **Scan + classify** — recurse + type in `listResources()`; return `{name,size,path,type,sub}`.
2. **Static-serve route** for `resources/` (preview) + **reveal-in-Finder** endpoint (`spawn open`).
3. **`+ Add resource` modal** — context-aware: multipart upload endpoint (`POST …/resources/upload?type=`) for file tabs; the existing add-external (URL) route for Links. Defaults to the active category.
4. **Reframe `ExternalResources.tsx`** into the two-track view: file categories (Docs/Interviews/Competitive/Screenshots) as filters over scanned files, plus the Links/URL track (keep the URL form; fold Loom in as a 🎥-typed URL).
5. **Search** — client-side filter (delete the "coming soon").
6. **Include-in-context** — JSON store + surface in the Prototypes-tab round "Send to Claude" prompt + `KICKOFF.md` composition (ties into the lo-fi workflow spec, `lofi-workflow.md`).

Each step is independently shippable and low-risk; nothing requires a network integration.
