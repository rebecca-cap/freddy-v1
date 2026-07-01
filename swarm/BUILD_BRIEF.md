# Wave 1 Build Brief — Freddy Fixture Population

You are one of 10 BUILD TEAMS. Your job: populate fictional but believable mock data for the routes assigned to your team, so every page renders with real-looking rows, no empty grids, no crashes.

## Project layout

- `~/freddy/proto-base/` — Vite+React clone of the Gravitate frontend
- `~/freddy/proto-base/src/freddy/fixtures/` — your work area
- `~/freddy/proto-base/src/freddy/fixtures/index.ts` — endpoint→fixture registry; you APPEND new keys here
- `~/freddy/proto-base/src/modules/**` — consumer code; READ to learn row shapes, do NOT modify

## Your inputs

1. `~/freddy/swarm/manifest.json` — find your team's routes and look up `fixtureFile`, `endpoints`, `missingEndpoints`, `consumerCrashes`, `currentState` for each.
2. `~/freddy/proto-base/src/freddy/fixtures/quoteBook.ts` — exemplar template (factory function, 6 rows, fictional names, ISO dates).
3. `~/freddy/proto-base/src/freddy/fixtures/commandCenter.ts` — exemplar of two envelope patterns side by side.

## Hard rules

1. **One file per agent**: only modify fixture files in your team's manifest entry. NEVER touch a fixture file owned by another team.
2. **index.ts**: APPEND new entries at the end before the closing `}`. Do not reorder existing entries. The orchestrator will re-merge if needed.
3. **No source/module edits**: do not change anything in `src/modules/**`. If a consumer crashes because of a `.reduce` on undefined, your job is to make sure your fixture provides the field that's expected — read the consumer code to learn the shape.
4. **No backend wiring**: this is frontend-only. No real HTTP allowed.

## Conventions

- **Voice**: fictional but professional. Companies: "Demo Refining Inc.", "Frontier Fuel Services", "Cascade Logistics", "Prairie Trading Co.". Terminals: "Houston Terminal", "Dallas Hub", "Salt Lake Rack". Products: "ULSD", "Gasoline 87", "Gasoline 91", "Jet A", "Biodiesel B5".
- **Dates**: ISO 8601 anchored at `2026-05-02`. Recent activity ±7 days; longer history ±90 days. Never use `new Date()` — fixtures must be deterministic.
- **Prices**: realistic refined-product decimals 2.40–3.30. Margins 0.05–0.45. Volumes in thousands of gallons (e.g., 5000–50000).
- **Row count**: 5–10 per grid by default. Charts/time-series: 30+ points. Lists with sparkline-style data: 20+.
- **IDs**: separate ranges by entity — Counterparties 9000s, Locations 5000s, Products 7000s, Users 2000s, Quotes 8000s, MPIs 6000s. Keep cross-references consistent (a Quote referencing CounterPartyId 9001 should match the Counterparty fixture).

## Envelope shapes — VERIFY before writing

Before populating a fixture, **open the consumer file** (from manifest's `consumerCrashes` or `grep -r "endpointKey" src/modules/`) and find where the response is `.map`'d. Two patterns exist:

- **Type A**: `{ Data: T[], TotalRecords, Query: null, Validations: [] }` — consumer does `response.Data.map(...)`. Used by QuoteBook, Counterparties, Locations.
- **Type B**: `{ Data: { Rows: T[], Columns: [...] }, TotalRecords, Query: null, Validations: [] }` — consumer does `response.Data.Rows.map(...)`. Used by CommandCenter widgets, Calculated Value Report.

Pick wrong → infinite loader or crash. Read the consumer.

## Deliverable per team

1. Modified/new fixture files in `~/freddy/proto-base/src/freddy/fixtures/`.
2. Append your endpoint registrations to `index.ts`. Group them with a `// === T{N} {team-name} ===` banner comment so the merge step is obvious.
3. Write report to `~/freddy/swarm/reports/T{N}.md` with:
   - Files touched
   - Endpoints added (key → fixture export name)
   - Row counts per fixture
   - Any consumer crashes you fixed (cite file:line)
   - Anything you couldn't figure out (defer to verify swarm)

## Output style

Header on each new fixture file: one line `// Freddy mock fixture — fictional`. No other comments unless the WHY is non-obvious. Use TypeScript `as const` only where it helps the consumer's type inference.

Remember: 10 teams running in parallel. Stay in your lane.
