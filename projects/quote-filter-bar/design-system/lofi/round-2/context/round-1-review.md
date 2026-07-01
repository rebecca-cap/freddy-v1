# Round 1 review — PM + desk feedback (drives Round 2)

**Date:** 2026-06-12 · **Reviewers:** Priya N. (PM), Marcus T. (desk)
Reviewed: `round-1/wireframes/quote-filter-bar.html` (Frames A & B).

## What's landing — keep it

- **Status-as-chips / Product+Date-as-dropdowns split.** Marcus: "Chips for status is exactly right — that's the one I'm always toggling." Lock it.
- **Additive (AND) model** reads clearly from Frame B.
- **"1 of 24" count + Clear all** anchor — Priya: "This is the safety net. Keep it dead center of attention."

## Change for Round 2

1. **Zero-results is the real risk, and R1 didn't show it.** Marcus stacked Pending + Biodiesel + Today and got a blank table that "looked broken." → R2 must design an explicit **zero-results state**: plain-language message, the active filters echoed, and a one-click **Clear all** / "remove last filter". (Resolves Open Q2.)
2. **Surface active filters as removable tokens.** When 2–3 filters are set, Marcus couldn't tell at a glance what was on without re-reading each control. → Add a row of **removable filter tokens** ("Pending ✕", "Gasoline 87 ✕", "Today ✕") under the bar. Each ✕ removes just that one. (Resolves Open Q3.)
3. **Stick the bar on scroll.** With 200 rows, the bar scrolled away and Marcus lost his filters' context. → **Pin the filter bar** to the top of the list region on scroll. (Resolves Open Q1.)
4. **Minor:** the sort control felt lost on the far right next to the count. Consider grouping sort with the filters, leaving count + Clear all alone on the right.

## Still out of scope

Saved views, per-column grid filters, multi-sort — unchanged, not this project.

## Decision

Round 2 = the same bar, plus: active-filter token row, sticky-on-scroll, and a designed zero-results state. If R2 lands, promote it to hi-fi.
