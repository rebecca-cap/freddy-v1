// Walk an AG Grid column-defs tree and decorate each leaf column with:
//   • `cellClass`   — adds `scout-cell--scope|identity` + `scout-col--<group>`
//   • `headerClass` — adds `scout-col--<group>` so header cells tint too.
//   • `onCellClicked` — calls the supplied handler (Phase 4.5 / 4.6 will use
//                       it to add/replace context chips).
//
// Existing column behavior is preserved by composing with whatever was
// already on the def. Wrapper is pure: it returns a new tree of plain
// objects without mutating the input.

import type { CellClassParams, ColDef, ColGroupDef } from 'ag-grid-community'

import {
  SCOUT_CELL_CLASS,
  getCellState,
  getScopeGroupForField,
  isCellEligible,
  isIdentityField,
} from './scoutScope'
import type { ContextChip } from '../types'

export interface ScoutCellWiringDeps {
  contextsRef: { current: ReadonlyArray<ContextChip> }
  // Read at click time. When true, Scout intercepts the click and the
  // host app's onCellClicked is skipped (so drawer-opening cells don't
  // pop drawers while the user is scoping Scout).
  openRef: { current: boolean }
  // Read at paint time. When true, ineligible data cells get the disabled
  // overlay (Wireframe 5 cell-selection constraint).
  addModeRef: { current: boolean }
  onCellClicked?: (params: {
    rowId: string | number | undefined
    field: string | undefined
    columnHeaderName: string | undefined
    rowData: unknown
  }) => void
}

type AnyColDef = ColDef | ColGroupDef

function asArray<T>(x: T | T[] | undefined | null): T[] {
  if (x == null) return []
  return Array.isArray(x) ? x : [x]
}

/**
 * Compose AG Grid's `cellClass` callback with the existing one.
 *
 * AG Grid `cellClass` can be a string, an array, or a callback that returns
 * either; we normalize to string[] and add our own.
 */
function composeCellClass(existing: ColDef['cellClass']) {
  return (params: CellClassParams): string[] => {
    const classes = new Set<string>()
    if (typeof existing === 'function') {
      const result = existing(params)
      for (const c of asArray(result)) if (c) classes.add(c)
    } else if (existing != null) {
      for (const c of asArray(existing)) if (c) classes.add(c)
    }
    // Field can live on colDef or in the nested column def (rowGroup, etc.).
    const field =
      (params.colDef as ColDef).field ??
      (params.column?.getColId() as string | undefined)
    const rowId = params?.node?.id ?? params?.data?.QuoteConfigurationMappingId
    const scopeGroup = getScopeGroupForField(field)
    if (scopeGroup) classes.add(`scout-col--${scopeGroup}`)
    const contexts = getContexts(params)
    // Wireframe 5 / R3: Scout only paints the grid while +Add is active — it's
    // a focused selection mode. Outside add mode the grid stays completely
    // normal. In add mode a cell is painted only when it's:
    //   • scope    — an already-picked cell (green outline, click removes it)
    //   • disabled — identity columns OR off-axis data cells (grayed, inert)
    // Eligible data cells (the valid row/scope-group column) are left NORMAL —
    // the highlight comes purely from the off-axis cells being grayed out.
    if (liveAddModeRef.current) {
      const state = getCellState({ rowId, field }, contexts)
      if (state === 'scope') {
        classes.add(SCOUT_CELL_CLASS.scope)
      } else if (isIdentityField(field) || !isCellEligible(rowId, field, contexts)) {
        classes.add(SCOUT_CELL_CLASS.disabled)
      }
    }
    return Array.from(classes)
  }
}

// Pulls the live contexts off the params via the wiring deps. AG Grid lets us
// stash arbitrary data on the colDef via `context`, but reading from a ref
// avoids re-creating defs on every chip change (which would force a grid
// re-render and lose scroll). The ref is set once when the wrapper runs.
let liveContextsRef: { current: ReadonlyArray<ContextChip> } = { current: [] }
let liveOpenRef: { current: boolean } = { current: false }
let liveAddModeRef: { current: boolean } = { current: false }
let liveOnCellClicked: ScoutCellWiringDeps['onCellClicked'] = undefined
function getContexts(_params: CellClassParams): ReadonlyArray<ContextChip> {
  return liveContextsRef.current
}

function composeHeaderClass(
  existing: ColDef['headerClass'],
  scopeGroup: ReturnType<typeof getScopeGroupForField>,
) {
  if (!scopeGroup) return existing
  return (params: unknown): string[] => {
    const classes = new Set<string>()
    if (typeof existing === 'function') {
      const result = (existing as (p: unknown) => string | string[] | undefined)(params)
      for (const c of asArray(result)) if (c) classes.add(c)
    } else if (existing != null) {
      for (const c of asArray(existing)) if (c) classes.add(c)
    }
    classes.add(`scout-col--${scopeGroup}`)
    return Array.from(classes)
  }
}

function composeOnCellClicked(existing: ColDef['onCellClicked']) {
  return (event: Parameters<NonNullable<ColDef['onCellClicked']>>[0]) => {
    // While Scout is open, cell clicks scope the panel — don't fire the host
    // app's onCellClicked (which would open drawers, navigate, etc.).
    if (!liveOpenRef.current && typeof existing === 'function') {
      try {
        existing(event)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[scout] existing onCellClicked threw', err)
      }
    }
    if (!liveOnCellClicked) return
    if (!liveOpenRef.current) {
      // Panel closed → still fire Scout handler so the first cell click can
      // open the panel and seed a chip (matches the wireframe behavior).
    }
    const field =
      (event.colDef as ColDef).field ?? event.column?.getColId() ?? undefined
    const rowId = event.node?.id ?? event.data?.QuoteConfigurationMappingId
    const columnHeaderName =
      typeof event.colDef.headerName === 'string'
        ? event.colDef.headerName
        : (event.column?.getColId() ?? undefined)
    liveOnCellClicked({
      rowId,
      field,
      columnHeaderName,
      rowData: event.data,
    })
  }
}

function wrapColDef(def: AnyColDef): AnyColDef {
  if ('children' in def && Array.isArray((def as ColGroupDef).children)) {
    const group = def as ColGroupDef
    return {
      ...group,
      children: group.children.map((child) => wrapColDef(child as AnyColDef)),
    }
  }
  const leaf = def as ColDef
  const scopeGroup = getScopeGroupForField(leaf.field)
  return {
    ...leaf,
    cellClass: composeCellClass(leaf.cellClass),
    headerClass: composeHeaderClass(leaf.headerClass, scopeGroup),
    onCellClicked: composeOnCellClicked(leaf.onCellClicked),
  } as ColDef
}

export function withScoutCellWiring(
  colDefs: AnyColDef[],
  deps: ScoutCellWiringDeps,
): AnyColDef[] {
  liveContextsRef = deps.contextsRef
  liveOpenRef = deps.openRef
  liveAddModeRef = deps.addModeRef
  liveOnCellClicked = deps.onCellClicked
  return colDefs.map((def) => wrapColDef(def))
}
