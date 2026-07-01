// Scout — grid scope mapping.
//
// Translates AG Grid `field`s (the column identifier the QuoteBook column
// defs already use) into Scout "scope groups" matching the wireframe's
// color legend (benchmark / proposed / margin / delta / flags).
//
// Identity columns describe the row rather than feed an answer; they stay
// gray when their row is in scope and are NEVER scope-green unless the user
// explicitly +Add'd that exact cell.
//
// Keep these maps small and explicit — when the column lineup changes,
// editing here is enough; no need to touch CSS or the cell-state selector.

import type { ContextChip } from '../types'

export type ScoutScopeGroup =
  | 'benchmark'
  | 'proposed'
  | 'margin'
  | 'delta'
  | 'flags'

export type ScoutCellState = 'default' | 'scope' | 'identity'

// AG Grid `field`s grouped by Scout scope. Fields that appear in the
// QuoteBook column defs but not here are treated as "default" data cells
// that participate in row scope (chip targets the whole row).
export const SCOPE_FIELDS: Record<ScoutScopeGroup, ReadonlyArray<string>> = {
  benchmark: ['Cost', 'StrategyBase.Value'],
  proposed: [
    'ProposedPrice',
    'ProposedPriceDelta',
    'Adjustment',
    'MarketMoveValue',
    'MarketMoveOverride',
  ],
  margin: ['Margin', 'TCIValue'],
  delta: ['PriorPrice', 'PriorPriceDelta'],
  flags: ['Flags', 'flag', 'flags'],
}

// Identity columns describe the row. Default behavior: when any chip targets
// a row, identity columns of that row paint as "identity" (subtle gray).
export const IDENTITY_FIELDS: ReadonlySet<string> = new Set([
  'QuoteConfigurationName',
  'CustomerName',
  'CustomerDisplayName',
  'CustomerId',
  'Customer',
  'LocationName',
  'Location',
  'ProductName',
  'Product',
  'QuoteId',
  'QuoteConfigurationMappingId',
])

const FIELD_TO_SCOPE: ReadonlyMap<string, ScoutScopeGroup> = (() => {
  const m = new Map<string, ScoutScopeGroup>()
  for (const group of Object.keys(SCOPE_FIELDS) as ScoutScopeGroup[]) {
    for (const field of SCOPE_FIELDS[group]) m.set(field, group)
  }
  return m
})()

export function getScopeGroupForField(field?: string): ScoutScopeGroup | undefined {
  if (!field) return undefined
  return FIELD_TO_SCOPE.get(field)
}

export function isIdentityField(field?: string): boolean {
  if (!field) return false
  return IDENTITY_FIELDS.has(field)
}

export interface CellLookup {
  rowId: string | number | undefined
  field: string | undefined
}

/**
 * Phase 4.6 selector.
 *
 * Chip kinds and what they paint:
 *   • kind:'row'       (rowId, no columnId)         → all non-identity cells
 *                                                     of that row → scope;
 *                                                     identity cells → identity.
 *   • kind:'selection' (rowId, columnId=scopeGroup) → all cells of that scope
 *                                                     group on that row → scope;
 *                                                     identity cells of that row → identity.
 *   • kind:'cell'      (rowId, columnId=field)      → that exact cell → scope;
 *                                                     identity cells of that row → identity.
 *
 * Identity columns NEVER paint as scope unless explicitly named by a cell chip
 * (the +Add gesture). A row in scope but a non-named non-identity cell → default
 * for cell/selection chips; scope for row chips.
 */
export function getCellState(
  { rowId, field }: CellLookup,
  contexts: ReadonlyArray<ContextChip>,
): ScoutCellState {
  if (rowId == null || !field) return 'default'
  const rowKey = String(rowId)
  const scopeGroup = getScopeGroupForField(field)
  const identity = isIdentityField(field)

  let rowChip = false
  let cellOrSelectionChip = false
  let scopeHit = false

  for (const ctx of contexts) {
    if (!ctx.rowId || String(ctx.rowId) !== rowKey) continue
    if (ctx.kind === 'cell') {
      cellOrSelectionChip = true
      if (ctx.columnId === field) scopeHit = true
    } else if (ctx.kind === 'selection') {
      cellOrSelectionChip = true
      if (scopeGroup && ctx.columnId === scopeGroup) scopeHit = true
    } else if (ctx.kind === 'row') {
      rowChip = true
    }
  }

  if (scopeHit) return 'scope'
  if (identity && (rowChip || cellOrSelectionChip)) return 'identity'
  if (rowChip && !identity) return 'scope'
  return 'default'
}

export const SCOUT_CELL_CLASS = {
  scope: 'scout-cell--scope',
  identity: 'scout-cell--identity',
  disabled: 'scout-cell--disabled',
  eligible: 'scout-cell--eligible',
} as const

export function getScoutCellClassName(
  state: ScoutCellState,
): string | undefined {
  if (state === 'scope') return SCOUT_CELL_CLASS.scope
  if (state === 'identity') return SCOUT_CELL_CLASS.identity
  return undefined
}

// --- Cell-selection constraint (Wireframe 5) -----------------------------
//
// Reece's rule (2026-05-21): when +Add mode stacks multiple data cells, they
// must share a single ROW or a single COLUMN — never a diagonal. We block
// ineligible cells at the source instead of accepting then refusing.
//
// "Column" means the visible scope GROUP (benchmark / proposed / margin /
// delta / flags), not the exact AG Grid field — so e.g. Cost and
// StrategyBase.Value (both `benchmark`) count as the same column.
//
// Identity cells add a whole-row context and never participate in the
// constraint. Only cell/selection chips lock the axis; row chips do not.

// Normalize a data field to its constraint "column key": the scope group if
// the field belongs to one, else the field name itself (ungrouped data cell).
export function columnKeyForField(field?: string): string | undefined {
  if (!field) return undefined
  return getScopeGroupForField(field) ?? field
}

// Chips that participate in the constraint — cell or selection, never row.
export function getCellChips(
  contexts: ReadonlyArray<ContextChip>,
): ReadonlyArray<ContextChip> {
  return contexts.filter((c) => c.kind === 'cell' || c.kind === 'selection')
}

// The column key a chip occupies. Selection chips already store a scope group
// in columnId; cell chips store a field that we normalize to its group.
function chipColumnKey(chip: ContextChip): string | undefined {
  if (chip.kind === 'selection') return chip.columnId
  return columnKeyForField(chip.columnId)
}

/**
 * Whether a data cell at (rowId, field) can be picked while +Add mode is on.
 * See the PRD §4 canonical rule. Pure — no DOM, no state mutation.
 */
export function isCellEligible(
  rowId: string | number | undefined,
  field: string | undefined,
  contexts: ReadonlyArray<ContextChip>,
): boolean {
  // Identity / whole-row clicks are always allowed.
  if (isIdentityField(field)) return true
  if (rowId == null || !field) return false
  const rowKey = String(rowId)
  const candidateKey = columnKeyForField(field)

  // Already-selected exact cell → eligible (clicking it removes the chip).
  if (
    contexts.some(
      (c) =>
        c.kind === 'cell' &&
        c.rowId != null &&
        String(c.rowId) === rowKey &&
        c.columnId === field,
    )
  ) {
    return true
  }

  const cellChips = getCellChips(contexts)
  if (cellChips.length === 0) return true // first cell chip — anywhere is OK
  if (cellChips.length === 1) {
    const c = cellChips[0]
    return String(c.rowId) === rowKey || chipColumnKey(c) === candidateKey
  }

  // 2+ chips — the axis is locked. All chips share one row, or one column.
  const rowIds = new Set(cellChips.map((c) => String(c.rowId)))
  if (rowIds.size === 1) return [...rowIds][0] === rowKey
  const cols = new Set(cellChips.map((c) => chipColumnKey(c)))
  if (cols.size === 1) return [...cols][0] === candidateKey
  return false // defensive — a locked selection is always single-axis
}

/**
 * Short hint describing the active constraint, for the +Add button label /
 * tooltip. Returns null when no cell chip exists (no constraint yet).
 */
export function getConstraintHint(
  contexts: ReadonlyArray<ContextChip>,
): string | null {
  const cellChips = getCellChips(contexts)
  if (cellChips.length === 0) return null
  if (cellChips.length === 1) return 'Same row or column as the picked cell'
  const rowIds = new Set(cellChips.map((c) => String(c.rowId)))
  if (rowIds.size === 1) return 'Locked to this row'
  const cols = new Set(cellChips.map((c) => chipColumnKey(c)))
  if (cols.size === 1) return 'Locked to this column'
  return null
}
