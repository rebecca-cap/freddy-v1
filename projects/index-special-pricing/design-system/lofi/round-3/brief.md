# Round 3 brief

What this round resolves (from the PM). Iterates on round 2 — full rationale in `./context/2026-06-23-frank-round3-edits.md`.

## Focus

- **Four sections → two.** Collapse the one-page Create New Offer into **Side A — "What / for who"** (offer type/formula + product + customers) and **Side B — "When"** (timing on its own focused surface). Tighten enough that one page stays feasible.
- **Preset model that starts blank.** Default = no preset, everything empty. Select a preset → populate. Edit a populated preset → three save paths: **update preset**, **save as new preset**, or **continue one-off**. "Preset" + "update" are locked-in terms.
- **Price formula: differential below the grid; fix the display label.** Differential is the *last* formula decision (after the variable grid and Argus/rack basis). The read-only result field is labelled **"Price formula (display)"**, not "resulting price."
- **Consolidated, tab-agnostic customer chips.** Selections from any invite tab (Groups / Authorized / Credit / All) stack into one always-visible chip list that persists across tab switches. Group CRUD stays out (managed externally).
- **Timing: keep fields, add quick-components.** Date/time fields + interval quick-component (15-min + 1/2/6h) + day-deal picker (now / 6 PM / midnight hotkeys, midnight a possible default). Quick-strokes live inside the dropdown only; one menu open at a time.
- **Start times for both windows + offset.** Visibility and Lifting each get a start. Express three scenarios: (a) live now + runs X, (b) scheduled start + runs X, (c) offset — lifting decoupled from visibility.

## Out of scope

- Final button labels/arrangement for the preset save paths (interaction must read correctly; exact treatment still open).
- Group management/CRUD (external group manager; this screen only consumes/selects).
- The fat-finger "go back" recovery on the calendar picker (front-end logic to revisit later).
- Price-notification email content screen and Scout exploration (next in the priority order, not this round).
- Customer testing of timing (on hold until hi-fi; customers still on the original version).
