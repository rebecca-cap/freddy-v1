# Lo-fi kickoff — Quote Filter Bar

> Kickoff meeting notes that seed Round 1. Initiative: add a filter + sort bar to the QuoteBook quotes list so traders can quickly narrow by status, product, and date.

**Date:** 2026-06-12 · **Duration:** 28 min
**Attendees:** Priya N. (PM), Frank O. (Design), Marcus T. (Trading desk lead, stakeholder)

---

## Transcript (lightly edited)

**Priya (PM):** Thanks for jumping on. Quick one. QuoteBook's main list is the screen the desk lives in all day, and right now there's no way to narrow it down. Marcus, you raised this — want to set it up?

**Marcus (desk):** Yeah. On a busy morning I've got 200-plus quote rows. I only care about three things at any moment: which ones are still *pending* my action, what *product* they're on, and whether they're *today's*. Today I scroll. I literally scroll and eyeball. We lose quotes that way.

**Frank (design):** When you say "pending your action" — is that a real status on the row, or is that in your head?

**Marcus:** It's on the row. Status column already exists — Pending, Quoted, Accepted, Expired. I just can't filter by it.

**Priya:** So the ask is narrow: a filter bar above the list. Status, product, date. Not a full saved-views system, not per-column filters in the grid header. We're time-boxed.

**Frank:** Got it. My instinct is a horizontal bar that sits between the page header and the table. Status as quick chips because that's the one you change constantly — one click, no dropdown. Product and date as dropdowns since there are more options and you set them less often.

**Marcus:** Status as one-click chips, yes. That's the 80% case.

**Frank:** And I want a clear "X active filters · Clear all" affordance, plus a result count, so you always know the list is filtered and not just empty. The scariest thing is a trader thinking quotes vanished when they're really just filtered out.

**Priya:** Good. That's a hard requirement — never let the filtered state look like an empty dataset.

**Marcus:** Can I combine them? Pending *and* gasoline *and* today?

**Frank:** Yes, filters are additive (AND). I'll show that in Round 1.

**Priya:** Sort — in scope?

**Frank:** Light version. A single sort control on the bar — by date, by product, by status. Multi-sort is out.

**Priya:** Agree. Two lo-fi rounds. Round 1 is the layout and the interaction model — chips vs dropdowns, where the count and clear-all live. Round 2 we react to it: empty/zero-results state, the active-filter summary, and whether the bar should stick on scroll. Then we promote the chosen direction to hi-fi.

**Frank:** Works. I'll build Round 1 against the Wireframe DS so it reads as lo-fi and nobody argues about colors.

**Marcus:** As long as I can stop scrolling.

---

## Goal

Let a QuoteBook trader narrow a long quotes list to what they care about *right now* — by status, product, and date — and sort it, without leaving the list. Success = the common "show me today's pending gasoline quotes" task takes one or two clicks instead of scrolling 200 rows.

## Constraints

- **Scope:** filter bar only. No saved views, no per-column grid filters, no multi-sort. (Explicit non-goals — revisit later.)
- **Filters:** Status, Product, Date. Additive (AND) logic.
- **Status = one-click chips** (the high-frequency control); Product + Date = dropdowns.
- **Never let a filtered list look like an empty dataset** — always show active-filter count + "Clear all", and a distinct zero-results state (Round 2).
- Built against the shared **WireframeDesignSystem** (`wf-*` classes, grayscale, compact density). No invented classes, no hi-fi color.
- Must map cleanly onto the existing QuoteBook list + Status column (Pending / Quoted / Accepted / Expired).

## References

- Description / brief on the Hub project card.
- Existing QuoteBook list view in the prototype (`prototype/src/freddy/...` QuoteBook surface).
- WireframeDesignSystem `DataTablePage` pattern + `controls` (chips, select) — `resources/wireframe-design-system/`.

## Open questions (to resolve across rounds)

1. Should the filter bar **stick** to the top when the table scrolls? (Lean yes — decide in R2.)
2. Zero-results state: empty message + "Clear all", or auto-relax the last filter? (R2.)
3. Do we surface the **active filters as removable tokens**, or is the chip/dropdown state enough? (R2.)
4. Default sort on load — newest date first? (Assume yes for R1.)
