# Lo-fi → Hi-fi handoff — Quote Filter Bar

Generated at the lo-fi → hi-fi boundary. The chosen direction is **Round 2** (see `round-2/`).

## What was promoted

Round 2's filter-bar model, implemented as a real React component in the prototype:

- **New file:** `prototype/src/modules/PricingEngine/QuoteBook/components/QuoteFilterBar.tsx`
- **Wired in:** `prototype/src/modules/PricingEngine/QuoteBook/components/Grid/index.tsx` — the bar renders above the grid; `rowData` is filtered + sorted in React before reaching ag-grid (lowest-risk integration — no ag-grid filter-model surgery).

## Interaction model carried over from lo-fi (intact)

- High-frequency control = one-click **chips**; lower-frequency = **dropdowns**.
- **Additive (AND)** filtering.
- **Removable filter tokens** under the bar (R2 change #2).
- **Sticky** bar on scroll (R2 change #3) — `position: sticky`.
- Always-visible **result count + Clear all** (the "never look empty" requirement).
- Single **sort** control grouped with the filters (R2 change #4).

## Honest lo-fi → hi-fi adaptation (the one real divergence)

The lo-fi modeled the high-frequency chips as lifecycle **Status** (Pending / Quoted / Accepted / Expired). The live QuoteBook quote rows have **no lifecycle-status field**, so binding chips to Status would filter nothing. The hi-fi keeps the *exact interaction model* but binds it to the real high-frequency field on the rows:

| Lo-fi control | Hi-fi binding (real data) |
|---|---|
| Status chips | **Product** chips (ULSD, Gasoline 87/91, Biodiesel…) — derived from row data |
| Product dropdown | **Location** dropdown (Houston Terminal, Dallas Hub) |
| Date dropdown | **Counterparty** search (fixture dates are uniform, so date wouldn't differentiate) |

If/when a lifecycle-status field is added to the quote schema, the chips can move back to Status with no structural change to the bar.

## Verified in the running prototype

- The filter bar renders above the QuoteBook grid in the live dev server (`/PricingEngine/QuoteBookEOD`).
- Interaction confirmed: typing a counterparty search produced a removable token, flipped the count to "0 of 0", and enabled "Clear all"; clearing reset the bar. Chips / Location / Sort render and are wired to the same filter state.

## Two infra fixes required to boot this fresh worktree (not feature work)

1. **`prototype/vite.config.js`** — added a worktree-local `cacheDir` (`.vite-cache`). The Hub symlinks `node_modules` to the shared proto-base, so Vite's default `node_modules/.vite` cache is shared across worktrees and races on the `deps_temp → deps` rename (ENOENT), which left the app blank. Worth folding back into the Hub's project scaffolding.
2. **`prototype/src/hooks/useNavigationBlock.ts`** — `react-router-dom` is 6.28.1, which removed the `unstable_` aliases; switched the imports to the stable `useBlocker` / `BlockerFunction`. The old import crashed the whole app on boot.

## Known pre-existing caveat

The QuoteBook grid shows no rows in this worktree: the prototype's `api.post('QuoteBook/GetRows')` resolves empty even though the freddy fixture handler returns 6 rows when called directly. This is in the excalibrr-freddy mock seam, unrelated to the filter bar, and would also affect an unmodified worktree.
