# Round 3 — second-pass review edits (Frank, Jun 23 2026)

Refinements after seeing the first round-3 build. Reference prototype: `~/freddy/proto-base-osp/SpecialOffers` (`SelectTimingWindows.tsx`).

## Preset
- Save paths reduce to **two**: "Update preset" and "Save as new preset."
- Drop the "you changed this preset" label and the "Continue as one-off" option.
- Clicking "Save as new preset" **progressively discloses** the new-preset-name input.

## Structure
- A and B become a **two-step stepper** (not sections): Step 1 = **Offer details**, Step 2 = **Time frame**. Step one / step two with Previous / Next.
- **No offer-type dropdown** — every deal is an Index Special.

## Chips / tiles contrast
- Selected customer chips (e.g. QuikTrip) were blue background + black text = unreadable. Make them **white** (white surface, blue border, dark text). Same fix for any selected tiles.

## Timing — rebuild to match the prototype
- Mirror `proto-base-osp` `SelectTimingWindows`: a **Visibility Window** ("When customers can see and bid on your deal") and a **Pickup Window** ("When customers can pickup their product").
- Each window: a **Start Now** checkbox; **Start** = date *at* time + timezone tag (America/Chicago); **End** = date *at* time + timezone tag.
- Time dropdowns list **real clock times at 15-minute intervals** (1:00, 1:15, 1:30 …), NOT durations. The **quick-starts** (Now / +1h / +6h / 6 PM / Midnight) live inside that same dropdown and **do the math** to produce a clock time.
- **Calendar View** that **visualizes the windows**: month nav, legend (Visibility blue, Pickup green), week grid, range highlighting (overlap = diagonal split), and "Click any date to quickly fill the next empty field: <field>" (sequence: Visibility start → end → Pickup start → end → reset).
- Inline validation: "Pickup start must be at or after Visibility start." (Prototype also validates start ≥ now+1min and end > start.)
- Window/calendar colors from the prototype CSS: `--visibility-bg #dbeafe`, `--visibility-border #4386f6`, `--pickup-bg #dcfce7`, `--pickup-border #32ae5e`.
