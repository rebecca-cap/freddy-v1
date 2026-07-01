# Insights — Round 2 (from 2026-06-18 round-1 review)

Distilled from `2026-06-18-round-1-review-transcript.md`. Scope: Index Special Offers only.

## What round 1 got right (keep)
- **One page, no scroll, no multi-step.** Confirmed. Carry the round-1 "Create New Offer" production chrome forward (top bar + ✕, Back to Offers, left content card + right "What customers will see" preview, footer actions).
- **Product / location / volume** — "that's good." Keep.
- **Timing as durations** (how long visible, how long to lift) — "probably right." Keep presets.
- **Create-from-prior** and **the fast-vs-full entry** idea — keep.

## What round 1 got wrong (fix — this is the round)
**The price formula was over-simplified.** Round 1 reduced it to Index + Index product + Differential. That is *not correct*. The real model:

- A price formula is made of **variables — usually three**.
- Each variable line has **~7 columns**: a **name**, a **publisher** (which price table), an **instrument** (a row in that table), a **type** (high / low / average / settle), a **date rule** (which price on the timeline — same day / prior day / 2-day…), plus an operator/weight to combine them.
- Quick build = **don't author from scratch**. **Pick from your saved formulas** (a pick list), reusing the **existing card / list view** UX. The picked formula **shows its 3 variable lines with all 7 columns populated** so the seller gets an instant "yes / no, this is right."
- Then **add the formula differential** (important).
- If the formula is **90% right but not exact**, an **Edit button opens a drawer** for fast granular edits, shown right there. Reuse the **pre-existing formula-edit drawer UI** ("same as last time").
- **Product drives which formulas are offered** (filter the pick list by the selected product).

## Other round-2 changes
- **Entry = "New → Fast or Full."** Quick page assumes fast intent and builds off a saved formula; always offer a **toggle to the full version** if it's not where you expected.
- **Invite → progressive, intent-based.** Don't assume everyone is grouped. Seller picks a **mode**:
  - **Groups** — chips for a few; for many (25+) add **free-text search** and let users **pin** favorite groups to float to the top.
  - **Authorized to lift** — list of customers authorized for this product + location (a known property).
  - **Credit** — customers **ranked by credit / financial capacity** to lift.
  - **All customers** (the 20% fallback) — search and pick from everyone.
  Focus on the 80/20; the mode is a progressive disclosure that gets you to customers fast.
- **Timing custom** — wire in the **day-deal date/time picker** ("now / 1 / 2 / 6") that exists on the MCP day-deal bulk-entry page for the custom case.
- **Rename "template."** The word is overloaded (a real template sets offer/auction + fixed/index). The saved-offer-configuration concept = "my good stuff / the way I do business," named and one-click reusable, distinct from create-from-prior ("the one I did before") though they feed each other. **Pick a synonym** — round 2 uses **"Preset"** (alternatives: Playbook / Starting point) pending PM confirmation. The price-formula pick list is called **saved formulas / Formula library**, not "templates."

## Open questions (for PM across rounds)
- Final name for the saved-offer-configuration concept (Preset? Playbook? Starting point?).
- Preset vs create-from-prior — keep both, or does one subsume the other? (Lean: keep both; Preset = deliberate/repeated, Prior = one-off recall.)
- Formula edit drawer — confirm we can reuse the existing component as-is in this context.
- Invite modes — is the mode an explicit switch, or inferred? Default mode per seller?
- Do we want a couple of variants to take to customer feedback (Reece asked for this on the formula step)?

## Process note
Reece also queued a separate future task — a price-notification email content management screen. **Not part of this round.**
