# DESIGN.md — Gravitate Wireframe Design System

> **Audience:** AI design agents (Claude, Cursor, Stitch, etc.) and the humans reviewing their output.
> **Purpose:** Encode the *reasoning* the component library can't — when to use which component, how to make density and color choices, and what never to do. Read this first, then pull canonical markup from `components/` and tokens from `tokens/`.
> **Scope:** Wireframes are the primary target. Where a rule transfers downstream to Excalibrr, it's flagged `[Excalibrr]`.
> **Owner:** Frank Overland · **Last updated:** 2026-04-24 · **Companion to:** `README.md`, `PROJECT_CONTEXT.md`, `docs/component-guide.md`

---

## How to use this file

When generating, reviewing, or editing a wireframe in this system:

1. **Read this file first.** It's the "why" layer. Without it you will drift.
2. **Then pull markup from `components/[category]/[Component].html`.** That's the canonical answer set — copy it verbatim. Don't invent class names.
3. **Reference tokens by name from `tokens/`**, never by hex value or pixel literal. If the token doesn't exist, that's a signal to ask, not to invent.
4. **Check the anti-patterns section before shipping.** If the wireframe violates one, fix it.
5. **If a decision isn't covered here, ask Frank.** Adding the answer to this file is part of the job.

This document is natural-language guidance, not enforcement. The HTML library is the enforcement layer. This file reduces drift; it doesn't eliminate it.

---

## 1. Product Context

**Gravitate** is an enterprise data platform for the energy sector. The users are analysts, traders, and operators working with contracts, volumes, schedules, and reconciliations under time pressure. They are domain experts moving between dense screens many times a day.

This shapes every design decision:

- The product is **enterprise data-density**, not consumer-friendly whitespace. Users would rather see one more row than one more breath of margin.
- **Scannability beats delight.** Hierarchy, alignment, and predictability matter more than novelty.
- **Keyboard-first.** Mouse interaction is a fallback. Tab order, focus visibility, and shortcut discoverability are not "accessibility extras" — they are the primary input model.
- Users return to the same screens dozens of times per week. **Consistency across sessions is a feature.** Surprise is a bug.

When in doubt about a posture call, default to: *what would a senior analyst doing rapid decision-making want to see?* That answer is almost always denser, more muted, and more keyboard-friendly than a default UI library would produce.

---

## 2. Design Principles

Seven declarative principles. Apply in order — earlier ones win when they conflict with later ones.

### 2.1 Patterns over novelty

Reuse before inventing. If `patterns/DashboardLayout.html` solves the layout problem, start there. If `MetricCard` shows the data, use it. Inventing a new component is the last resort, not the first move. Every novel component is a future inconsistency.

### 2.2 Grid-first for data, narrative-first for forms

Two layout postures. **Data views** (tables, dashboards, comparisons) are grid-first: align columns, share row rhythm, let the eye scan vertically. **Forms and settings** are narrative-first: a single column, top-down reading order, generous label-to-input proximity. Don't mix postures inside one page section.

### 2.3 Muted palette; reserve color for status and interactive intent

The page should read as neutral gray with one accent. Color is a signal, not decoration. Status colors (success, warning, error) appear only when there is actual status to report. Primary blue appears only on interactive surfaces (buttons, links, focus rings) or to mark the user's current location (selected tab, active row). See [§3 Semantic Color Intent](#3-semantic-color-intent) for the hard rules.

### 2.4 Keyboard-first interaction model

Every interactive element must be reachable, operable, and visibly focused via keyboard alone. If a wireframe shows a flow that requires a mouse, the wireframe is wrong, not the keyboard. See [§6 Interaction & Accessibility Non-Negotiables](#6-interaction--accessibility-non-negotiables).

### 2.5 Density is a feature, not a bug

Default to compact. 14px body text (`--wf-text-base`). Tight stacking (`--wf-space-stack-sm` between related rows). Page padding via `--wf-space-page-x` / `--wf-space-page-y`, not arbitrary values. "Comfortable" mode (16px body, looser spacing) is an explicit opt-in, not the default. See [§5 Layout & Density Rules](#5-layout--density-rules).

### 2.6 Consistency trumps cleverness

If two solutions are roughly equivalent and one matches an established pattern in this system, pick the established one. The marginal benefit of a clever variation is almost always outweighed by the cost of users having to recognize a new pattern.

### 2.7 The token is the source of truth

Never write a hex value, a pixel literal, or a font weight as a number in component code. If the token doesn't exist, the design isn't ready. Tokens encode intent; literals don't. `[Excalibrr]` This rule transfers — production components must reach for the production token, not a number.

---

## 3. Semantic Color Intent

This section is about *when* to use each color, not *what* the color is. Hex values live in `tokens/colors.css`. Refer to colors here only by their semantic name.

### 3.1 The hard rule

**Status colors are reserved for status.** No exceptions.

| Token group | Reserved for | Never used for |
|---|---|---|
| `--wf-color-success` / `-dim` | Confirmation of a completed positive action; "healthy" or "passing" status | Decorative accents, "go" buttons, growth charts that aren't status |
| `--wf-color-warning` / `-dim` | Pending state, attention required, soft-fail | Highlighting, "tip" callouts, brand color |
| `--wf-color-error` / `-dim` | Validation failure, destructive action affordance, hard-fail status | Required-field markers (those are neutral), brand color, decorative red |
| `--wf-color-primary` / `-dim` | Interactive intent: primary CTA, links, focus ring, selected state, current location | Decorative bands, headline emphasis, dividers |

If color is used for any other purpose, that is a violation of this section. There are no "but it looked nice" exceptions.

### 3.2 The neutral scale carries everything else

Anything that isn't status or interactive intent is neutral. Use the semantic aliases — never reach for `--wf-color-neutral-300` directly when `--wf-color-border` says the same thing more clearly.

| Use case | Token |
|---|---|
| Primary text, headings | `--wf-color-text-primary` |
| Secondary text, labels | `--wf-color-text-secondary` |
| Hints, placeholders, timestamps | `--wf-color-text-tertiary` |
| Text on dark / colored backgrounds | `--wf-color-text-inverse` |
| Default surface (cards, modals, inputs) | `--wf-color-surface` |
| Raised surface (elevated panels) | `--wf-color-surface-raised` |
| Sunken / inset surface (disabled, code blocks) | `--wf-color-surface-sunken` |
| Page background | `--wf-color-background` |
| Modal scrim | `--wf-color-background-overlay` |
| Default border / divider | `--wf-color-border` |
| Subtle border (related rows) | `--wf-color-border-light` |
| Focus ring | `--wf-color-border-focus` |

### 3.3 Color is never the only signal

Pair color with an icon, a label, or a shape. A red border alone is not enough to communicate an error — pair it with `--wf-border-input-error` *and* an inline error message *and* an icon. This is non-negotiable for accessibility (see [§6](#6-interaction--accessibility-non-negotiables)).

### 3.4 Contrast floor

WCAG 2.1 AA minimum on every text/background pair. The token system is designed so that aliases pair correctly out of the box — `text-primary on surface` passes, `text-tertiary on surface-sunken` passes. If a pairing is ambiguous, run a contrast check before shipping.

`[Excalibrr]` The reservation rule transfers verbatim. Production never uses status colors decoratively either.

---

## 4. Component Decision Tree

This is the highest-leverage section of this file. The library says *what* a Card is. This section says *when to reach for it instead of something else.*

### 4.1 Container choice — Card vs. MetricCard vs. FormSection vs. plain Container

**`wf-card`** is the default content container. Reach for it when you have a discrete chunk of related content (a record, a panel, a grouped list) that needs visual separation from siblings on the page. It has padding, a border, and a corner radius. Use it for narrative content, summary panels, settings groups that aren't form-shaped, and lists.

**`wf-metric-card`** is *only* for dashboard metrics — a single big number with a label, optional trend indicator, optional delta. Don't use it as a generic "highlighted card." If your card has more than one metric or any prose, it's a `wf-card`, not a `wf-metric-card`.

**`wf-form-section`** is the form-shaped grouping primitive. Use it whenever you have form fields that belong together (e.g., "Contact Info," "Shipment Details"). It owns its own heading, optional helper text, and consistent vertical rhythm between fields. Forms compose `wf-form-section` blocks vertically; they should rarely sit inside a `wf-card`.

**`wf-container`** is structural, not decorative — a max-width wrapper for centering content on wide screens. It has no border, no background, no padding of its own. Reach for it when you need width constraint without visual weight.

> **Quick lookup:** highlighted metric → `MetricCard`. Form fields → `FormSection`. Discrete content chunk → `Card`. Width control only → `Container`.

### 4.2 Overlay choice — Modal vs. Drawer vs. ConfirmDialog vs. Toast vs. Tooltip vs. Alert

This is where the most drift happens. Match the overlay to the *cognitive load* of the interaction, not its visual prominence.

**`wf-confirm-dialog`** for destructive or irreversible confirmation. "Delete this contract?" "Submit final reconciliation?" Two buttons (cancel + destructive), short prose, no form fields. Always use this — never use a generic Modal — for destructive confirmation. The shape is part of the safety guarantee.

**`wf-modal`** for focused tasks that require the user's full attention and have a non-trivial UI footprint: "Edit volume schedule," "Configure new alert." Centered, scrim behind, traps focus. Use sparingly — every modal is a context switch.

**`wf-drawer`** for adjacent context that doesn't need to block the rest of the page. "Show details for this row," "Filter panel," "Activity log." Slides in from the side, often does not trap focus, often allows the underlying page to remain partially visible and interactive. Default for "look at this without losing the page."

**`wf-toast`** for transient feedback: "Saved." "Export queued." Auto-dismisses. Never blocks. Stack at most two at a time. Don't use Toast for anything the user must act on — that's an Alert or Modal.

**`wf-alert`** (inline, persistent) for state that lives on the page: "This contract is past its expiry date," "3 rows have validation errors." Stays until the underlying state changes or the user dismisses it. Use Alert *inline* near the affected content, not floated globally.

**`wf-tooltip`** for one-line, non-essential clarification on hover/focus. Never put critical info in a tooltip — it's invisible to many users and inaccessible on touch.

> **Decision shortcut:**
> - Destructive confirm? → `ConfirmDialog`
> - Focused task, blocks the page? → `Modal`
> - Adjacent context, doesn't block? → `Drawer`
> - Transient confirmation? → `Toast`
> - Persistent inline state? → `Alert`
> - One-line hover hint? → `Tooltip`

`[Excalibrr]` The same six-way split applies in production. The component names map per `docs/migration-guide.md`.

### 4.3 Toolbar choice — ActionBar vs. FilterBar vs. inline buttons

**`wf-action-bar`** is for actions that operate on a collection or selection: "Export," "Bulk edit," "Delete selected." It sits above a grid or list and contains buttons + maybe a count of selected rows. Its job is to verbs.

**`wf-filter-bar`** is for narrowing what's shown in the grid or list below it: text search, dropdown filters, date ranges, saved views. Its job is to nouns and predicates. It does not contain action buttons.

**Inline buttons** (single buttons placed near specific content, e.g., "Edit" in a row, "Add member" next to a heading) are for scoped, non-bulk actions tied to a specific record.

> **Quick lookup:** filtering = `FilterBar`. Bulk action = `ActionBar`. Single-record action = inline button.

If your toolbar is doing both filtering and acting, split it: `FilterBar` on top, `ActionBar` below it (or vice versa, depending on flow). Don't crowd both into one bar — the user can no longer tell what each control does.

### 4.4 Navigation choice — Tabs vs. Stepper vs. Sidebar vs. Breadcrumb

**`wf-tabs`** for switching between *peer views of the same thing*: "Overview / History / Settings" on a contract record. The user can move freely between tabs in any order. All tabs are equally valid.

**`wf-stepper`** for *ordered, gated progression*: "Configure → Review → Submit." The user can't usually skip ahead. Each step has a completion state. Use Stepper when there is a single correct path.

**`wf-sidebar`** for top-level app navigation — the primary mental model for "where am I in the app." Persists across screens. Always shows the user's current location.

**`wf-breadcrumb`** for showing hierarchical position within a deep tree: "Contracts / 2026 / ACME Corp / Schedule." Use when the user benefits from knowing both their current location *and* the parents.

> **Decision shortcut:** Peer views? Tabs. Ordered path? Stepper. Top-level location? Sidebar. Hierarchy crumbs? Breadcrumb.

If you're tempted to use Tabs for an ordered flow, you want a Stepper. If you're tempted to use a Stepper for free navigation, you want Tabs.

### 4.5 Feedback choice — Alert (inline) vs. Toast (transient) vs. Modal (blocking)

This is partly covered above; restated as a single decision because it's frequently confused.

- The user **needs to act** before continuing? → `Modal` or `ConfirmDialog`.
- The user **should be aware** of state that persists? → `Alert`, inline near the affected content.
- The user **should be informed** of something that already happened, doesn't need action? → `Toast`.

If you can't decide between Toast and Alert, ask: "Will the user ever come back to this page and need to see this message?" If yes, it's an Alert. If no, it's a Toast.

### 4.6 Empty / loading / progress — Skeleton vs. Loader vs. EmptyState vs. Progress

**`wf-skeleton`** for content that's loading and you can predict its shape. Renders as gray bars matching the eventual layout. Use whenever you have a known structure (table rows, card grids).

**`wf-loader`** (spinner) for indeterminate, short-duration waits where you don't know the shape of what's coming. Don't spin for more than a few seconds — beyond that, switch to Progress.

**`wf-progress`** (bar) for determinate operations where you can show percent complete: file upload, batch reconciliation, multi-step import.

**`wf-empty-state`** for "there's no data here yet." Always pair with a primary action ("Add your first contract") so the empty state isn't a dead end.

> **Decision shortcut:** Known shape, loading? Skeleton. Unknown shape, short wait? Loader. Determinate progress? Progress. No data? EmptyState (with a CTA).

---

## 5. Layout & Density Rules

### 5.1 Density default is compact

| Property | Default | "Comfortable" opt-in |
|---|---|---|
| Body text | `--wf-text-base` (14px) | `--wf-text-md` (16px) |
| Form field gap | `--wf-space-stack` (16px) | `--wf-space-stack-lg` (24px) |
| Row stacking (related) | `--wf-space-stack-sm` (8px) | `--wf-space-stack` (16px) |
| Page horizontal padding | `--wf-space-page-x` (24px) | `--wf-space-8` (32px) |
| Page vertical padding | `--wf-space-page-y` (32px) | `--wf-space-12` (48px) |
| Card padding | `--wf-space-card` (16px) | `--wf-space-card-lg` (24px) |

"Comfortable" is only used when explicitly requested or when the screen is intentionally onboarding-shaped. Do not default to it because it looks "cleaner."

### 5.2 The 8px grid is non-negotiable

All spacing between elements must come from the spacing scale (`--wf-space-0` through `--wf-space-16`). There are no 7px gaps, no 10px paddings, no 18px margins. If the scale doesn't have a token at the size you want, the right answer is almost always one step up or one step down — not a custom value.

### 5.3 Tap targets stay at 44×44 even at high density

Compactness applies to spacing and text, not to interactive targets. A button can have visual padding of `--wf-space-2` and still hit a 44×44 hit box via `min-height` / `min-width`. Never sacrifice the minimum tap target for visual density.

### 5.4 Vertical rhythm

Within a section, related rows stack at `--wf-space-stack-sm`. Between sections, use `--wf-space-stack-lg`. Between major page regions, use `--wf-space-8` or larger. A page that uses 3+ different vertical rhythms inside one region is broken.

### 5.5 Page-level scaffolding

Every wireframe page starts from one of:
- `patterns/DashboardLayout.html` — metrics + grid + sidebar
- `patterns/MasterDetailLayout.html` — list on left, detail panel on right
- `patterns/FormWizard.html` — stepper + form sections + wizard footer
- `patterns/SettingsPage.html` — sidebar nav + form sections
- `patterns/DataTablePage.html` — filter bar + action bar + grid
- `patterns/ComparisonMatrix.html` — multi-column comparison

If the page you're building doesn't fit one of these, that's a signal to pause and check whether the requirement is a real new pattern or a variant of an existing one. Most of the time it's the latter.

`[Excalibrr]` Density rules transfer. Production should default to compact too — but check with Frank before changing the production default for a given screen.

---

## 6. Interaction & Accessibility Non-Negotiables

These are not best practices. They are floor requirements. A wireframe that fails any of these is rejected, even if it ships visually polished.

### 6.1 Keyboard reachability

Every interactive element — button, link, input, menu trigger, tab, row action — must be reachable via Tab in a sensible order. The order should match the visual reading order (top-to-bottom, left-to-right in LTR languages). If a wireframe shows an interaction that has no keyboard path, it's wrong.

### 6.2 Visible focus states

Every focusable element shows a clearly visible focus ring (`--wf-color-border-focus` / `--wf-focus-ring`). Never `outline: none` without a replacement. Focus must be visible against any background — that's why the focus ring uses both `--wf-color-surface` and `--wf-color-primary` in a layered ring.

### 6.3 Color is never the only signal

Restated from §3.3 because it sits at the keyboard/AT/visual intersection. Pair color with text, icon, or shape. A red border alone is not an error — pair it with `--wf-border-input-error` *and* an inline error message *and* an icon.

### 6.4 Error states pair color + icon + message

Validation errors have three parts: the input gets `--wf-border-input-error`, an icon appears next to the field, and a text message in `--wf-color-error` describes the problem and how to fix it. Two-of-three is not enough.

### 6.5 Modal focus trapping; drawers don't have to

A `wf-modal` traps focus — Tab cycles within the modal, Esc closes it, focus returns to the invoking element on close. A `wf-drawer` does not have to trap focus, because the page behind it is often still meant to be scannable.

### 6.6 Hit targets

44×44 minimum, always. See §5.3.

### 6.7 Touch and pointer parity

Every action accomplishable by hover must also be accomplishable by tap or focus. Tooltips that hide critical info are forbidden — see §4.2.

`[Excalibrr]` Every rule in this section transfers verbatim to production.

---

## 7. Anti-Patterns

This is the list of things to never do. It starts seeded; **add to it whenever a wireframe round surfaces a recurring mistake.** This section compounds in value over time.

### 7.1 Layout & containers

- **Don't nest Cards inside Cards.** A `wf-card` inside another `wf-card` is almost always two card layers fighting for the same job. Pick one container — usually the outer.
- **Don't use a Container as a styled box.** `wf-container` is structural (max-width); it has no border, padding, or background by design.
- **Don't put a `wf-form-section` inside a `wf-card`.** Pick one. Forms compose `FormSection` blocks vertically without an outer card wrapper.

### 7.2 Color & emphasis

- **Don't use primary color for non-interactive emphasis.** Primary is for interactive intent only. If you want emphasis, use weight (`--wf-font-semibold`), size, or hierarchy — not color.
- **Don't use status colors decoratively.** Success green is not an "approval" accent for static labels. Warning orange is not a "notable" highlight color. See §3.1.
- **Don't reach for `--wf-color-neutral-*` directly when an alias exists.** `--wf-color-text-secondary` is more meaningful than `--wf-color-neutral-700` even though they're the same value.

### 7.3 Overlays & feedback

- **Don't use Modal for destructive confirmation.** Use `wf-confirm-dialog`. The shape is the safety guarantee.
- **Don't stack more than two Toasts.** If three things finish at once, batch them into one Toast or use an Alert.
- **Don't put critical info in a Tooltip.** Tooltips are non-essential clarification only.
- **Don't use a Drawer when the user has to commit to an action and cannot interact with the page behind.** That's a Modal.

### 7.4 Data display

- **Don't use a `wf-datagrid` for fewer than 3 rows.** Three rows is usually a `wf-card` with a list inside, not a grid.
- **Don't put more than one `wf-metric-card`-worth of content into a `wf-metric-card`.** It's for one number, one label, one optional trend. Use `wf-card` if you need more.
- **Don't render zero-data as a blank grid.** Use `wf-empty-state` with a CTA so the user knows what to do next.

### 7.5 Navigation & toolbars

- **Don't mix ActionBar and FilterBar in one bar.** Verbs and predicates do different jobs. Stack them; don't combine them.
- **Don't use Tabs for an ordered flow.** That's a Stepper.
- **Don't show breadcrumbs that only have one level.** A single-level breadcrumb is just a heading.

### 7.6 Density & spacing

- **Don't use 16px body text by default.** Default is 14px (`--wf-text-base`). 16px is the explicit comfortable opt-in.
- **Don't write pixel literals in component code.** Always reach for a token. If the right token doesn't exist, ask — don't invent.

### 7.7 Accessibility & interaction

- **Don't `outline: none` without a replacement focus ring.** The focus ring is non-negotiable.
- **Don't use color as the only error signal.** Color + icon + message, every time.
- **Don't ship a flow that needs a mouse.** Keyboard parity is required.

### 7.8 Add yours here

> **Frank:** add anti-patterns to this section as Claude (or another tool) keeps making the same mistake. The format is:
>
> - **Don't [thing].** [One sentence on why, and what to do instead.]
>
> Top three to seed when ready (open question from the proposal):
>
> - *(awaiting your top-three brain-dump)*
> - *(awaiting your top-three brain-dump)*
> - *(awaiting your top-three brain-dump)*

---

## 8. Migration Posture

The wireframe system is a *prototype* of the production Excalibrr design system, not a parallel universe. Every wireframe class is intended to map cleanly to a production component or pattern. Don't invent classes that won't translate.

The full mapping table lives in `docs/migration-guide.md`. Highlights:

| Wireframe | Excalibrr |
|---|---|
| `wf-row` | `<Horizontal>` |
| `wf-column` | `<Vertical>` |
| `wf-text` | `<Texto>` (with `variant`) |
| `wf-button` | `<GraviButton>` (with `variant`) |
| `wf-datagrid` | `<GraviGrid>` |
| `wf-modal` | `<Modal>` |
| `wf-tabs` | `<Tabs>` |

When in doubt about a wireframe class name, check the migration guide first. If the wireframe name doesn't have a clean mapping, that's a signal the wireframe is using the wrong primitive.

`[Excalibrr]` callouts throughout this file mark rules that travel with the migration. Roughly: principles transfer entirely, density transfers as the default but can be tuned per screen, color rules transfer verbatim, and component decision trees transfer with renamed components.

---

## 9. Open questions and follow-ups

Items that this file deliberately leaves blank, to be filled in as the system matures:

1. **Top three anti-patterns from Frank's experience.** The §7.8 brain-dump. Highest-leverage open item — fill these in next.
2. **Comfortable mode triggers.** When *should* a wireframe explicitly opt into comfortable density? Onboarding? External-facing pages? Document the trigger so it's not a judgment call every time.
3. **Marketing-vs-product crossover.** This file assumes enterprise product context. If the wireframe system is ever used for marketing or external pages, the color and density rules likely loosen — capture that in a future amendment.
4. **Excalibrr mode flag.** Long-term, consider a small "for production builds" appendix that re-states which rules tighten or loosen when generating Excalibrr code rather than wireframes.

---

## 10. References

- `README.md` — system overview and quick start
- `PROJECT_CONTEXT.md` — session continuity and changelog (different role from this file; do not merge)
- `docs/component-guide.md` — full component API reference
- `docs/token-reference.md` — token names and values
- `docs/migration-guide.md` — wireframe → Excalibrr mapping
- `docs/pattern-guide.md` — full-page pattern templates
- `tokens/colors.css`, `tokens/spacing.css`, `tokens/typography.css`, `tokens/borders.css`, `tokens/utilities.css` — token source of truth

External:

- [Google Stitch DESIGN.md format](https://stitch.withgoogle.com/docs/design-md/format/)
- [VoltAgent awesome-design-md](https://github.com/VoltAgent/awesome-design-md)

---

*End of DESIGN.md. Edits welcome — keep the file under ~600 lines so it remains usable as persistent AI context.*
