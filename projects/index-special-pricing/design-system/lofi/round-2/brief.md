# Round 2 brief

What this round resolves (from the PM). Iterates on round 1 — see `./context/insights.md`.

## Focus

- **Rebuild the price formula** as the real model: a formula = **3 variables**, each with **7 columns**
  (name, publisher, instrument, type, date rule, operator, weight). Quick build = **pick a saved
  formula** (card / list view), see the 3×7 lines populated for an instant sanity check, **add the
  differential**, and **Edit in a drawer** if it's 90% right. Product drives which formulas show.
- **Reorder the flow**: first selection is **Product & location → Volume**, then Price formula,
  Timing, Invite. Defer the top "start with a template" row.
- **Progressive, intent-based Invite**: a **mode** switch — Groups (chips + search + **pin**),
  Authorized to lift, Credit (ranked), and an All-customers search fallback.
- **Timing custom** uses the **day-deal date/time picker** ("now / 1 / 2 / 6") for the custom case.
- **Entry = New → Fast or Full**, with a **toggle to full setup** from the quick page.
- **Rename "template"** → **Preset** (the saved offer config: "my good stuff," named, one-click),
  distinct from **create-from-prior**. Formula pick list = **saved formulas / Formula library**.
- Carry forward the round-1 **Create New Offer** chrome (one page, no scroll, no stepper).

## Out of scope

- Final naming sign-off for "Preset" (candidate; PM to confirm).
- The full prescriptive wizard itself (only referenced via the New-Full / "toggle to full" path).
- Customer auth / credit data sources, real index feeds, offer execution beyond "sent."
- The separate **price-notification email content** screen Reece queued — not this round.
- Mobile was explored in round 1; not re-cut this round unless the desktop pattern settles first.
