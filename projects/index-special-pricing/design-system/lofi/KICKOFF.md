# Lo-fi kickoff — Index Special Offers (Quick Create)

Seeded from the 2026-06-15 Product–Design sync. Full transcript and distilled insights live in
`round-1/context/`.

## Goal
Design a **Quick Create workflow for an index special offer** in the selling platform — a fresh,
true lo-fi exploration, not a reuse of the existing quick-create drawer. A sales rep should be able
to fire off an index offer fast, from one scrollless view.

Success looks like:
- **~10–12 essential clicks** (down from ~25 today).
- **Routinely completable in ≤ 30 seconds** (down from ~1 minute).
- Everything in **one view** — no wizard step-paging.
- The **index price formula** (index + differential, invoiced at lift time) is unmistakably the
  centerpiece and is fast to set.

## Constraints
- **Platform:** Gravitate selling platform (OSP). Enterprise, keyboard-first, data-dense.
- **Audience:** power-user sales reps; speed and muscle memory over hand-holding.
- **No AI** in this design (explicit).
- **Templates + create-from-prior** are the primary speed levers; the no-template path falls back
  to the prescriptive detailed flow.
- **Timing = durations** (visibility, pickup), not explicit days/dates where possible.
- **Customers = existing groups / group-tags** (e.g. Gulf Coast); product context is Group 3 gas.
- **Mobile:** field sequence should ideally translate to mobile, or be sensibly segmented.
- Build every wireframe from the vendored `WireframeDesignSystem` (`wf-` components, `--wf-`
  tokens). Lo-fi = static HTML only.

## References
- `round-1/context/2026-06-15-product-design-sync-transcript.md` — kickoff transcript
- `round-1/context/insights.md` — distilled brief
- `~/freddy/project-hub/resources/wireframe-design-system/` — design system (build from this)
- `~/freddy/projects/index-special-pricing/resources/` — project briefs/screenshots (currently empty)

## Open questions
- Which fields are the truly-essential 10–12 clicks vs. deferrable?
- One flow for desktop + mobile, or segmented?
- How prescriptive must the no-template fallback be, and how is it surfaced?
- How do duration controls map to real visibility/pickup windows (presets vs custom)?
- Are requirements defined enough for a confident output, or is round 1 a direction-finding canvas?
