---
name: wireframe-index
description: "Create comprehensive wireframe index and guide documents that catalog every screen in a wireframe project with full rationale, design decisions, and transparency. Use this skill whenever you are creating wireframes, building HTML prototypes, working on a multi-screen wireframe project, finishing a round of wireframe revisions, or when the user asks for an index, guide, catalog, summary, or documentation of wireframe files. Also trigger when the user mentions 'wireframe guide', 'project index', 'document the wireframes', 'what changed', 'design rationale', or asks to create a reference doc for a set of wireframes or prototypes. Even if the user just says 'make an index page' or 'document this round' in the context of a wireframe project, use this skill."
---

# Wireframe Index & Guide Generator

This skill creates comprehensive index documents for wireframe projects — the kind of artifact that lets anyone (a designer, PM, developer, or stakeholder who wasn't in the room) open a folder of HTML prototypes and understand exactly what they're looking at, why each decision was made, and how to navigate through the screens.

## Why This Matters

Wireframe projects accumulate complexity fast. By round 2 or 3 you've got multiple HTML files, shared CSS, interactive JavaScript, and a trail of design decisions that only exist in meeting transcripts and people's heads. Without a guide, the wireframes become opaque artifacts that only their creator can explain. The index document is the project's institutional memory — it captures not just *what* was built, but *why*, making the work reviewable, transferable, and durable.

## When to Create the Index

Generate or update the index document:

- **After completing a new round of wireframes** — This is the most common trigger. The user finishes R1, R2, R3, etc. and needs everything cataloged.
- **When consolidating multiple wireframes** — Files get merged, retired, or restructured. The index tracks what happened.
- **When the user asks for documentation** — "Document these wireframes," "make a guide," "create an index page," "summarize what we built."
- **When handing off to developers or stakeholders** — The index becomes the bridge between design intent and implementation.

## How to Build the Index

### Step 1: Inventory the Project

Before writing anything, scan the wireframe directory to understand what exists:

1. List all HTML files, noting their names, sizes, and modification dates
2. Identify the shared CSS file(s) and any design system tokens
3. Look for existing documentation (previous guides, PRDs, project context docs, meeting transcripts). These are gold — they contain the rationale and design decisions that make the guide valuable. If a meeting transcript exists, mine it for decisions, feedback, and the "why" behind changes.
4. Check if there are multiple rounds (wireframes/, wireframes-r2/, wireframes-r3/) to understand evolution. Read previous round guides if they exist — they provide the baseline for documenting what changed.
5. Read the first ~50 lines of each HTML file to extract the `<title>` tag and understand the screen's purpose

### Step 2: Read Each Screen Thoroughly

For each wireframe HTML file, read enough to document:

- **What the screen shows** — The primary purpose and user scenario
- **Layout structure** — Major zones (header, grid, drawer, footer, panels)
- **Key UI components** — Every significant interactive element: drawers, modals, tabs, toggles, grids, charts, forms
- **Data and content** — What sample data is shown, how many rows, what columns, what states
- **Interactive behaviors** — What happens on click, toggle, select, hover. What JavaScript drives the interactivity.
- **States and modes** — Different views the screen can be in (empty state, loaded state, edit mode, multi-select mode, etc.)

### Step 3: Write the Guide Document

**The guide MUST be an HTML file named `WIREFRAME-GUIDE.html`. Never `.md`. Never `INDEX.md`.** Place it in the wireframe directory alongside the other HTML wireframes and link the shared `wireframe.css`. The outline below uses Markdown formatting for readability, but the actual deliverable is HTML.

**Use Frank's standing template.** The canonical layout is the AI Competitor Price Profiling R1 guide — copy its structure verbatim:

- **Fixed dark left sidebar (260px wide, `#0f172a` background)** with a "Guide contents" Table of Contents grouped into sections: *Introduction* (Overview / Shared layout / Color & status language / File inventory), *Per-file docs* (one anchored link per screen), *Rationale* (Design decisions / Open for R2 / How to view), and *Wireframes* (mono-font links that open each `.html` in a new tab).
- **Main content (`margin-left: 260px`, max-width 1040px, padding `56px 72px 120px`).**
- **Document header** with: an uppercase blue eyebrow ("Wireframe Index & Guide · Round N"), a 34px H1 title, a 15px lead paragraph, and a 4-column meta grid (Project / Round / Designer / Date). Bottom-bordered with a 3px black rule.
- **Sections** (`<h2>`) with a 2px bottom border under the heading, generous `52px 0 16px` margins, `scroll-margin-top: 24px` so anchor links land cleanly.
- **`.file-card` per-screen blocks** — white card, 1px border, 8px radius, with a header row containing: monospace filename `<h3>` (in primary blue), a tertiary "— Screen title" label, and a right-aligned `Open wireframe →` link button (1px primary outline, fills primary on hover).
- **Tables** — bordered, rounded, with uppercase `<thead>` styling on `--wf-color-neutral-100`, `vertical-align: top` cells, hover row highlight.
- **Callouts** — three flavors via shared base + modifier: default blue (`#f0f9ff` bg, primary left-border), `.callout.decision` green (`#ecfdf5` / `#16a34a`), `.callout.warn` amber (`#fffbeb` / `#d97706`). Each has a small uppercase `.callout-label` followed by a `<p>`.
- **`ol.decisions`** — design-decision list with `12px` vertical spacing per item and `line-height: 1.55`.
- **`ol.open-questions`** — open-questions list where each `<li>` has its own amber-left-border treatment (`#fffbeb` bg, `3px` left border in `#d97706`, marker bold in `#92400e`).
- **Color swatches** — small inline `.swatch` (14×14px rounded) and `.swatch-line` (28×2px, `.dashed` modifier for dashed reference lines) used inline next to color descriptions.
- **Responsive** — `@media (max-width: 900px)` hides the sidebar, removes the left margin, drops meta grid to 2 columns.

Reference the wireframe-system tokens (`--wf-color-*`, `--wf-text-*`, `--wf-space-*`, `--wf-radius-*`, `--wf-font-mono`) throughout so the guide visually matches the wireframes it documents. Page-specific accent colors (status pills, severity tints) are declared in the `<style>` block as `--<project-prefix>-*` tokens.

Use this structure:

#### Header Block

```markdown
# [Project Name] — Round [N] Wireframes

**Project:** [Full project path, e.g., "Pricing Engine — Quote Book Exception Thresholds"]
**Round:** [N] ([context — what prompted this round, e.g., "post-PM feedback from Reece + Agustin, Feb 26"])
**Designer:** [Name]
**Date:** [Month Year]
```

The round context line is important — it tells the reader *why* this round exists. Reference the meeting, feedback session, or decision that kicked it off.

#### Overview

A 2-3 sentence paragraph explaining what these wireframes represent and where they fit in the product. Mention the technology (interactive HTML prototypes, shared CSS design system, etc.) and the user flow they cover.

#### Shared Layout Structure

Document the common page skeleton that repeats across screens. This prevents redundant descriptions in each file section and gives the reader a mental model upfront. Call out each persistent zone (tab bars, control bars, grids, footers) with enough detail that someone could identify them in the wireframe.

#### Design System / Color Language

If the wireframes establish a visual language (severity colors, state colors, badge meanings), document it here. This is especially valuable for projects with semantic color coding — exception states, status indicators, severity levels. Include the actual hex values and CSS class names so developers can reference them directly.

#### File Inventory Table

A quick-reference table with one row per file:

```markdown
| File | Screen | Purpose |
|------|--------|---------|
| `wireframe.css` | — | Shared design system (tokens, utilities, components) |
| `01-setup.html` | Setup Wizard | First-run configuration experience |
| `02-active.html` | Active View | Daily-use view with analytics panel |
```

If any files have been retired or redirect to others, note that explicitly (e.g., "~~Retired~~ — Redirects to `04.html?tab=profiles`").

#### Per-File Deep Documentation

This is the core of the guide. For each wireframe file, write a section that covers:

**Screen purpose** — What this screen shows and when a user would see it. Not just "the settings page" but "what a user sees the first time they configure exception thresholds, before any data has been loaded."

**Initial state** — What the screen looks like on load, before any interaction. What's visible, what's hidden, what's disabled.

**Component breakdown** — Walk through every significant UI element. For complex components like drawers, wizards, or multi-tab panels, document each sub-section. Include:
  - The exact content (button labels, heading text, placeholder values)
  - Dimensions and layout details (drawer width, panel height)
  - State variations (selected, disabled, active, error)

**Data description** — What sample data appears. How many rows in a grid, what columns exist, what terminals/products/entities are represented. This matters because the sample data demonstrates the feature's range.

**Interactive behaviors** — What JavaScript-driven interactions exist. Clicking X does Y. Toggling Z shows/hides W. Be specific: "Clicking a profile card toggles selection. The stepper navigates forward/back between steps. The drawer animates open/closed with a width transition."

**Cover enough that someone could rebuild the screen from your description** — every component, state, and behavior accounted for. This is a completeness bar, not a word-count bar. List everything, but keep each line short and plain (see Writing Style below). Thorough coverage and verbose prose are not the same thing.

#### Changes from Previous Round

If this isn't the first round, include a section documenting what changed and why. Reference the specific screens that were modified and what was added, removed, or restructured. This creates a clear audit trail across rounds.

```markdown
## Changes from Round [N-1]

### [filename] — [Brief change title]
[What changed and why. Reference the feedback or decision that drove it.]
```

#### Design Decisions

This is the rationale section — the "why" behind the "what." List the key decisions the wireframes encode, written as clear declarative statements with brief explanations:

```markdown
## Design Decisions Reflected

1. **Setup lives inside the Quote Book page** — Not a separate settings screen.
   The right-side drawer keeps the user in context.
2. **Hard vs Soft severity** — Hard blocks publishing, Soft records but doesn't
   block. Each component can be independently set to either.
3. **Profile system uses Organization + Personal tiers** — Org profiles are
   admin-locked, Personal profiles are user-editable. This enforces governance
   while allowing flexibility.
```

These decisions are the most valuable part of the guide. They transform the wireframes from "a bunch of screens" into "a documented design strategy." Write them as things a developer or PM could reference months later to understand why something works the way it does.

#### How to View

Brief instructions on how to open and interact with the wireframes. Include:
- Technical requirements (just a browser, no build step needed)
- Recommended viewing sequence (the order that tells the story)
- Key interactions to try in each screen

```markdown
## How to View

Open any `.html` file directly in a browser. Each is a self-contained prototype.
No build step or server needed.

Recommended sequence:
1. `01-setup.html` — Start here. Click "Set Up" and walk through the wizard.
2. `02-active.html` — Daily view. Toggle Analytics. Try the filter chips.
3. `03-drilldown.html` — Click different rows. Explore all three tabs.
```

## Writing Style — Thorough Coverage, Plain Prose

The guide documents *everything* but says each thing in plain words. Cover every screen, state, and behavior; write each one the way you'd explain it to a smart friend who wasn't in the room — not the way you'd write a spec to prove how much you know. If a sentence is there to sound impressive instead of to inform, cut it.

These rules apply the `clarify` (plain UX writing) and `stop-slop` (no AI tells) techniques. Apply them every time you write guide prose.

### Say it plainly (from `clarify`)

- **Lead with the point.** First sentence says what the screen is and when a user sees it. No wind-up.
- **Active voice, real subject.** "The drawer shows the row's details," not "details are shown in the drawer."
- **One idea per sentence.** If you're stacking three clauses, split them.
- **Use the UI's own words.** If the screen says "Quote Config Defaults," write that — don't paraphrase it as "default settings." Explain any term the first time it appears, then reuse it consistently.
- **Real values, not placeholders.** "$0.0500 floor," "1,247 rows," "92% Publish Ready." Concrete numbers make the guide verifiable.
- **Cut words that don't change the meaning.** Shorter is clearer. A reader who gets it in five words shouldn't have to read fifteen.

### Kill the AI tells (from `stop-slop`)

- **No throat-clearing openers.** Drop "It's worth noting that," "This screen serves to," "Essentially." Start with the fact.
- **No "not just X, but Y" contrasts.** State Y directly. "The setup lives in the drawer" beats "This isn't a separate settings page — it's an inline drawer."
- **No dramatic em-dashes.** A period or comma usually works. (Em-dashes are fine in labels like `filename — Screen title`; just don't use them for rhetorical pauses in prose.)
- **Drop the adverbs.** "seamlessly," "robustly," "simply," "elegantly" add nothing. Delete them.
- **Things don't act like people.** Not "the layout decides" or "the drawer wants to" — name what actually happens.
- **Vary the rhythm.** Don't write three medium sentences in a row. Mix a short one in.
- **No pull-quote grandiosity.** Skip lines like "This is the project's institutional memory." Just document the screens.
- **Trust the reader.** State each fact once. Skip the justification padding and the recap.

### Don't make me sound smart (Frank's standing rule)

- The guide is read by designers, PMs, and devs who are busy, not dumb. Fancy words slow them down. Swap them for common ones: **uses** over "leverages," **shows** over "surfaces," **lets you** over "enables you to," **about** over "approximately," **so** over "in order to."
- Never pad to seem rigorous. A short, correct sentence beats a long, hedged one.
- The goal is a guide that's easy to read on the first pass, not one that sounds clever.

### Still non-negotiable (coverage)

- **Be specific, not abstract.** "A 440px right-side drawer shows the row's exception details across three tabs: Exceptions, Thresholds, and History" — not "the drawer shows details." Plain prose still names every part.
- **Document the invisible.** Hidden-by-default states (collapsed panels, empty states, confirmation dialogs, error messages) are easy to miss and matter most. If a user can trigger it, it's in the guide.
- **Capture the "why."** Every decision that came from a meeting, Slack thread, or sync call goes in the guide. The transcript disappears; the guide stays.

### Quick before / after

- **Bloated:** "This screen serves as the foundational entry point, seamlessly guiding the user through the initial configuration experience before any data has been surfaced."
  **Plain:** "The first screen a user sees when setting up exception thresholds, before any data is loaded."

- **Bloated:** "The drawer leverages a three-tab architecture to elegantly surface the row's exception details, empowering users to drill into the underlying violations."
  **Plain:** "A 440px drawer on the right shows the row's exception details in three tabs: Exceptions, Thresholds, and History. Each tab drills into the violations behind that row."

- **Bloated:** "It's worth noting that this isn't merely a settings page — rather, it's an inline experience that keeps the user firmly within their existing context."
  **Plain:** "Setup happens in a drawer, not a separate settings page, so the user stays on the Quote Book."

Before you ship a section, reread it once and cut anything that's there to impress rather than inform.

## For Consolidated / Single-File Wireframes

When a project consolidates multiple screens into a single wireframe (common in later rounds), the guide should still document each "view" or "mode" as if it were a separate screen. Use the page tabs, drawer states, or URL parameters as the organizing principle:

```markdown
## 00-consolidated.html — All-in-One Wireframe

### Configuration View (default)
[Grid + drawer documentation...]

### Exception Profiles View (tab: "Exception Profiles")
[Split-panel profile management documentation...]

### Single-Row Drawer State
[What shows when one checkbox is selected...]

### Multi-Row Drawer State
[What shows when 2+ checkboxes are selected...]
```

## Reference

For a complete example of this skill's output, see `references/example-guide.md` — a real guide generated for a pricing exceptions wireframe project that went through 3 rounds of iteration. Copy its *structure*, but follow the Writing Style rules above for *prose*. If any line in the example reads wordier than those rules allow, write the plainer version.
