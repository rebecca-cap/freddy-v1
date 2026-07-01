# CLAUDE.md — Working in the Gravitate WireframeDesignSystem

> **If you are an AI agent (Claude, Cursor, or otherwise) opening this folder to generate, edit, or review a wireframe — read this file first, then read `DESIGN.md`.**

---

## Required reading order

Before pulling any markup or writing any class names, read these in order:

1. **`DESIGN.md`** — the *why* layer. Product context, design principles, semantic color intent, component decision trees, density rules, accessibility floor, and anti-patterns. Without this, you will drift.
2. **`README.md`** — system overview and quick start.
3. **`PROJECT_CONTEXT.md`** — session continuity, current status, and changelog. Distinct from DESIGN.md; do not merge or rename.

Then, only after the above:

4. **`components/[category]/[Component].html`** — canonical markup. Copy verbatim. Do not invent class names.
5. **`tokens/*.css`** — token source of truth. Reference by name, never by hex or pixel literal.
6. **`docs/component-guide.md`** — full component API reference, when you need details beyond the HTML preview.
7. **`docs/migration-guide.md`** — when the work needs to map cleanly to Excalibrr production.

## Hard rules

- **No invented class names.** If `wf-foo` doesn't exist in `components/` or the CSS, don't use it.
- **No hex or pixel literals in component code.** Every color, space, radius, and weight comes from a token in `tokens/`. If the token doesn't exist, ask — don't invent.
- **Status colors are reserved for status.** `--wf-color-success` / `-warning` / `-error` are never decorative. See `DESIGN.md` §3.
- **Default density is compact.** 14px body (`--wf-text-base`), tight stacking. "Comfortable" is an explicit opt-in. See `DESIGN.md` §5.
- **Keyboard parity is non-negotiable.** Every interaction must work via keyboard with a visible focus state. See `DESIGN.md` §6.
- **Check anti-patterns before shipping.** `DESIGN.md` §7 lists things to never do. Run through it as a final check.

## When uncertain

If a design decision isn't covered by `DESIGN.md`, ask Frank rather than guessing. Adding the answer to `DESIGN.md` is part of the job — that file is meant to compound over time.

## Out of scope here

- This is a wireframe system. For high-fidelity production builds, the rules in `DESIGN.md` flagged `[Excalibrr]` transfer; the rest of production styling lives in the Excalibrr design system, not here.
- This is not a marketing or external-pages system. The density, color, and copy postures assume an enterprise-product context.

---

*This file exists so that every AI session starts from the same baseline. If it gets stale, fix it — don't ignore it.*
