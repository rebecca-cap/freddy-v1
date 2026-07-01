# Round 3 edits — Frank's action items (from the round-2 review w/ Reece)

Deeper breakdown of each action item: what the change is, why it came up, and what "done" looks like for the hi-fi prototype.

## 1. Restructure the flow: four sections → two
**What:** Collapse the current four-section single-page form into two conceptual groupings.
- **Side A — "What / for who":** offer type (formula), products, and customer selection all live together.
- **Side B — "When":** timing and scheduling becomes its own focused step.

**Why:** The consolidated single page works mentally but has gotten too long and heavy as fields accumulate. Reece's original instinct was that the full form was "just too much." The two-section split keeps cognitive load manageable without fragmenting into a full wizard.

**Done looks like:** Two sections rendered. If you can tighten fields enough to fit comfortably on one page, collapse back to one. Otherwise ship as two, with the "thinking" (timing decisions) isolated on its own surface and sensible field defaults applied. Reece: "We'll go from four to two… and then if we can find ways to make it shorter then maybe it gets moved in and it's one page."

## 2. Rework the preset model
**What:** Three behaviors:
- **Default** = no preset selected, everything underneath blank.
- **Select a preset** → all fields populate from it.
- **After editing a populated preset**, offer three paths: update the existing preset, save as new preset, or one-off (proceed without touching any preset).

**Why:** Frank realized the original design assumed a preset. Reece agreed you shouldn't presume which preset the user wants — start clean. The save-back logic surfaced once Frank walked through "what if I tweak a populated preset?" "Preset" is the locked-in term (replacing rejected "template"; Reece endorsed "preset" and "update" as the verb for the resave path).

**Done looks like:** Empty state, populated state, and the three save options all expressed. Frank flagged the button treatment as still open — the interaction needs to read correctly even if exact labels/arrangement aren't final.

## 3. Move the differential; fix the price-display label
**What:** Two adjustments in the price-formula area.
- Relocate the differential field to **below** the formula variable grid (Frank had it above).
- Correctly label the "resulting price" field as the **price formula display**.

**Why:** Reece's mental model: build the formula first, then decide Argus vs. rack, then the differential — so the differential is "mentally subordinate to the rest of the price formula" and belongs last. Frank had it on top, worried the variable grid could grow tall and push it down; Reece preferred the logical sequence. These fields largely exist already — reuse, not net-new.

**Done looks like:** Differential sits beneath the variable grid as the final formula decision; the resulting-price/formula display is labeled properly and pulls the existing component.

## 4. Consolidated customer chips, visible across tabs
**What:** As customers are selected, accumulate chips per row so the complete selected-customer list is always visible — independent of which invite tab is active.

**Why:** Reece's hardest requirement. The invite flow is tabbed (groups / authorized-to-lift / credit). If he picks someone under "authorized to lift" and someone else under "credit," he has two customers selected but can only see them by bouncing between tabs. "I need to see the output selection of people agnostic of tabs." Frank's solution — chips that add up as each row is selected, persisting even when the underlying table isn't showing.

**Done looks like:** A running, tab-agnostic display of every selected customer (chips), updating live. (Groups themselves are managed in an external group manager — this screen only consumes and selects them, no group-CRUD here.)

## 5. Rebuild timing: keep fields, add quick-components
**What:** Don't strip the date/time fields — augment them.
- Keep existing date/time fields plus an interval quick-component (15-min intervals + 1/2/6-hour quick choices).
- Integrate the day-deal time-picker Frank already built — hotkeys for now / 6 p.m. / midnight (the times prices almost always change), with midnight as a possible default.
- Keep quick-strokes inside the dropdown only.

**Why:** Frank's pitch: "repurpose these but add the interval quick component… so we can have the benefits of both," which Reece accepted. Dropdown placement is deliberate: Frank tried pinning quick-submit buttons at the top but realized two sets would show simultaneously and conflict (e.g., a "1hr/2hr" for one field colliding with "1hr/2hr" for another). Keeping them in the dropdown means only one menu is open at a time and quick-strokes apply only to the open field. Reece also wants to keep the calendar view (fast once learned) but is aware of the fat-finger problem — no clean way to go back if you mis-tap the first field — front-end logic to revisit.

**Done looks like:** Date/time fields present, interval quick-component and day-deal time-picker wired in, quick-strokes confined to the dropdown, one menu open at a time. "Make the interactions with the fields really good" rather than removing fields.

## 6. Add start times for visibility AND lifting/pickup, including offset
**What:** Add a start date/time for two distinct windows:
- **Visibility** — how long orders are being taken.
- **Lifting / pickup** — once an order is confirmed, the date-time range the customer has to lift it.
Support the offset case: take orders today (e.g., until midnight) but lifting opens later (e.g., next Monday–Tuesday).

**Why:** The current model only expresses duration ("starts now, runs for X"), which breaks the moment something starts later. Reece's example: listing today to open the market tomorrow — "runs for this long" is meaningless without a start date. Two windows are different things ("visibility is how long am I taking orders; pickup/lifting is… what is the date and time range you have to lift it"). Frank: "what we're missing is when does that window start — we need a date start for this one and a date start for this one."

**Done looks like:** Three timing scenarios expressible — (a) live now + runs X (already done), (b) starts later + runs X, (c) offset where the lifting window is decoupled from the visibility window — each with its own start.

## 7. Iterate toward hi-fi; Slack Reece anything worth showing
Keep pushing the design in the prototype between syncs; Slack Reece if there's something worth a look before tomorrow. Timing-related customer testing is on hold until this is in hi-fi anyway (customers are still on the original version).

## 8. Hold the priority order
Sequence: finish special offers first → then price-notification polish → then play with Scout (using the link Reece sent, now that live data is flowing). Reece confirmed special offers, "let's finish that up, I think we're close," then price-notification polish, then Scout (lower-urgency exploration).
