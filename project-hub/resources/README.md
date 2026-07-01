# Project Hub — Shared Resources

These resources are **vendored into the repo** so they travel with a `git clone` — anyone working on a Hub project gets the same lo-fi design system and documentation skill without hunting for files on the original author's machine.

```
resources/
├── wireframe-design-system/   # the lo-fi component & token source (build wireframes FROM this)
└── skills/
    └── wireframe-index/       # the documentation skill (document each round WITH this)
```

## The two pieces

### 1. `wireframe-design-system/` — build *from* this
The Gravitate **WireframeDesignSystem**: `--wf-` design tokens, `wf-` HTML/CSS components, layout patterns, and a `reference-guide.html` visual index. Lo-fi wireframes are built **from** these — copy component markup verbatim, reference tokens by name, never invent class names. Start at `wireframe-design-system/CLAUDE.md` → `DESIGN.md`.

### 2. `skills/wireframe-index/` — document *with* this
Frank's **`wireframe-index`** skill (Cowork skill `skill_01YHMa5pJKmfipgkaLNFkZVY`). After a round of wireframes it generates a `WIREFRAME-GUIDE.html` cataloging every screen with round context, per-screen docs, *Changes from Previous Round*, *Design Decisions Reflected*, and *Open Questions* — the transparency / changelog layer.

> **A skill file in the repo is not auto-installed.** To *use* it as a Claude skill, copy it into your skills directory:
> ```bash
> cp -R resources/skills/wireframe-index ~/.claude/skills/
> ```
> Or, on Cowork/claude.ai, import it from the shared-skills library. Once installed, invoke it with `/wireframe-index` (or it triggers automatically when documenting a wireframe round).

## How the Hub uses them

When the Hub scaffolds a project's lo-fi workspace, each round's `CLAUDE.md` points Claude at **both**: build wireframes from `wireframe-design-system/`, then run `/wireframe-index` to produce the round's `WIREFRAME-GUIDE.html`. See `docs/lofi-workflow.md` for the full model.

## Source of truth

This repo copy **is** the design system's home. The Hub is the only thing that uses it, so edits happen right here — `resources/wireframe-design-system/` — and get committed like any other file. There's no separate upstream to sync and no submodule to manage.

> An older copy may still sit at `~/Documents/WireframeDesignSystem/` from before the design system moved into the Hub. It is **no longer canonical** — make changes here, not there.
