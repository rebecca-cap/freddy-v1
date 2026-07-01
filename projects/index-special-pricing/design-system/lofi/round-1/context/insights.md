# Insights — Index Special Offers (from 2026-06-15 sync)

Distilled from `2026-06-15-product-design-sync-transcript.md`. Scope: **Index Special Offers
quick-create only.** Tooling tangents (Project Hub, Obsidian, Fable) are excluded.

## The problem
The selling platform's "create new setup" wizard is thorough but long — lots of clicks, lots of
time. An earlier "quick create" drawer made the same selections faster, but it **falls apart for
index offers** because index pricing needs choices the drawer doesn't represent. Two fields in
today's quick create — **"price index"** and **"terms template"** — don't map to anything real.

## The persona / trigger
A **sales rep at lunch**. The market moves. They want to **fire off an index offer fast** from
muscle memory, often cloning something they sent before.

## The ask
A **fresh lo-fi pass** at a **Quick Create workflow for an index special** — *not* the old drawer
("don't make it a cousin in a drawer"). Everything in **one view**, no wizard step-paging. True
lo-fi from a clean slate; treat requirements as exploratory ("more a feedback canvas than ready
requirements").

## Success markers (explicit)
- Today's best case: **~25 clicks, ~1 minute.**
- Target: **~10–12 essential clicks** (cut in half).
- **Routinely completable in ≤ 30 seconds.**
- Single scrollless view; power-user-first.

## What the flow must cover
1. **Pricing — the meat.** Index-based price formula = **index + differential**, **invoiced at
   lift time**. Get this right above all else.
2. **Templates.** Template-driven path should be fast and clean. *No template* → fall back to the
   prescriptive detailed flow (acceptable, but the template path is the hero).
3. **Create-from-prior** (Abdul's pattern) intersecting with quick create: prepopulate product →
   template → product/location → volume → formula → kept dates/times → customers who got it last
   time. User tweaks, not authors.
4. **Timing as durations.** Prefer **duration of visibility** and **duration of pickup** over
   explicit days/dates. Timing/"seeing the time" is an important decision.
5. **Customers via groups.** Reuse existing **groups / group-tags** ("give me the three Gulf Coast
   customers"). Product context: **Group 3 gas.**
6. **Power-user affordances.** Hotkeys, templates, keyboard-first.

## Constraints / non-goals
- **No AI** in this design (explicit).
- Field **sequence should ideally also work on mobile** — possibly becoming the mobile pattern;
  desktop/mobile segmentation is acceptable if it serves the flow better.
- Static lo-fi only; build from the vendored WireframeDesignSystem.

## Open questions (for PM across rounds)
- Which fields are truly the "essential 10–12 clicks" vs. deferrable?
- Same flow desktop + mobile, or segmented?
- No-template branch: how prescriptive does the fallback need to be, and how is it surfaced?
- How do duration controls map onto real visibility/pickup windows (presets? custom?)?
- Are business requirements defined enough for a confident output, or is round 1 purely a
  direction-finding canvas?

## Process note
Frank to refresh the **OSP protobase** (latest selling platform) before hi-fi; the platform changed
since the MCP-server work. Lo-fi round 1 does not depend on that.
