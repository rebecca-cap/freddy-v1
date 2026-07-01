// Hook: turns raw AG Grid column defs into Scout-aware column defs.
//
// Responsibilities:
//   • Keep an up-to-date ref to `state.contexts` so the `cellClass` callback
//     evaluates against the latest chip list without re-creating colDefs
//     (re-creating defs forces AG Grid to reset state — sort, scroll, etc.).
//   • Handle cell clicks with the wireframe's replace/append rule.
//   • Open the panel automatically the first time a cell is clicked.
//
// Returns a stable array reference whenever the underlying `colDefs` array
// reference is stable.

import { useCallback, useEffect, useMemo, useRef } from 'react'

import { useScout } from '../state/ScoutContext'
import type { ContextChip, ThreadStatus } from '../types'

import { setScoutRowReadyDeps } from './ScoutRowReadyCell'
import { isCellEligible, isIdentityField } from './scoutScope'
import { withScoutCellWiring } from './withScoutCellWiring'

import type { ColDef, ColGroupDef, GridApi } from 'ag-grid-community'
import type { MutableRefObject } from 'react'

type AnyColDef = ColDef | ColGroupDef

interface CellClickPayload {
  rowId: string | number | undefined
  field: string | undefined
  columnHeaderName: string | undefined
  rowData: { QuoteConfigurationName?: string } | undefined | unknown
}

function chipId(parts: string[]): string {
  return parts.filter((p) => p != null && p !== '').join('::')
}

function rowLabel(rowData: CellClickPayload['rowData'], rowId: unknown): string {
  const name = (rowData as { QuoteConfigurationName?: string } | undefined)
    ?.QuoteConfigurationName
  if (name && typeof name === 'string') return name
  return `Row ${rowId ?? '?'}`
}

export function useScoutGridWiring<T extends AnyColDef>(
  colDefs: T[] | undefined,
  gridApiRef?: MutableRefObject<GridApi | undefined | null>,
): T[] | undefined {
  const { state, actions } = useScout()

  // Live refs the cellClass / onCellClicked callbacks read at paint/click time
  // (the callbacks are created once per colDefs identity, so they can't close
  // over fresh state directly).
  //   • contexts  — current chip list (cell highlighting)
  //   • open      — whether Scout intercepts cell clicks
  //   • addMode   — drives the disabled-cell overlay
  const contextsRef = useRef<ReadonlyArray<ContextChip>>(state.contexts)
  const openRef = useRef(state.open)
  const addModeRef = useRef(state.addContextMode)

  // ROW-1..3 — live maps the per-row ready indicator reads at paint time
  // (keyed by String(QuoteConfigurationMappingId), matching the grid's getRowId
  // and the chip rowId the cell-click handler stores).
  const rowThreadIdRef = useRef<ReadonlyMap<string, string>>(new Map())
  const rowStatusRef = useRef<ReadonlyMap<string, ThreadStatus>>(new Map())

  // Sync the refs AND repaint in one effect, in this order — the refs must be
  // fresh BEFORE refreshCells re-runs cellClass, or the grid paints with stale
  // state (e.g. +Add flips true but cells repaint while addMode is still false,
  // so the disabled overlay never appears until the next incidental refresh).
  useEffect(() => {
    contextsRef.current = state.contexts
    openRef.current = state.open
    addModeRef.current = state.addContextMode
    const api = gridApiRef?.current
    if (!api) return
    try {
      api.refreshCells({ force: true })
    } catch {
      // refreshCells throws if the grid was destroyed mid-update.
    }
  }, [
    state.contexts,
    state.open,
    state.addContextMode,
    gridApiRef,
  ])

  // Rebuild the row→thread maps whenever threads change, then force the grid to
  // repaint so the indicator cells re-render the instant the timer flips a
  // thread to 'ready' (ROW-1) or a thread is opened/viewed (ROW-3). AG Grid does
  // NOT re-run cell renderers on external React state, so the forced refresh is
  // mandatory (see codebase gotcha). simNow is a dep because the timer flips
  // status on tick; threads is the source of the maps.
  useEffect(() => {
    const idMap = new Map<string, string>()
    const statusMap = new Map<string, ThreadStatus>()
    for (const t of state.threads) {
      if (t.rowId == null) continue // stream thread has no row indicator
      idMap.set(t.rowId, t.id)
      statusMap.set(t.rowId, t.status)
    }
    rowThreadIdRef.current = idMap
    rowStatusRef.current = statusMap
    const api = gridApiRef?.current
    if (!api) return
    try {
      api.refreshCells({ force: true })
    } catch {
      // refreshCells throws if the grid was destroyed mid-update.
    }
  }, [state.threads, state.simNow, gridApiRef])

  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // ROW-2 — clicking a row's indicator drops the user back into that thread:
  // focus it and open the panel. setActiveThread also marks the thread 'viewed'.
  const handleOpenThread = useCallback(
    (threadId: string) => {
      actions.setActiveThread(threadId)
      if (!stateRef.current.open) actions.setOpen(true)
    },
    [actions],
  )

  // Publish the live refs + handler to the module-level renderer wiring. Runs
  // on every render so the renderer always sees the current handler/refs.
  setScoutRowReadyDeps({
    rowThreadIdRef,
    rowStatusRef,
    onOpenThread: handleOpenThread,
  })

  const handleCellClick = useCallback(
    ({ rowId, field, columnHeaderName, rowData }: CellClickPayload) => {
      if (rowId == null || !field) return
      const rowKey = String(rowId)
      const identity = isIdentityField(field)
      const baseLabel = rowLabel(rowData, rowId)
      const cur = stateRef.current
      const addMode = cur.addContextMode

      // +Add mode → focused selection. Only eligible DATA cells are pickable;
      // identity columns and off-axis cells are inert (R2 decision 2 & 4): no
      // toast, no drawer, no state change. The grayed look + not-allowed cursor
      // are the only signal.
      if (addMode) {
        if (identity || !isCellEligible(rowKey, field, cur.contexts)) {
          return
        }
        const chip: ContextChip = {
          id: chipId(['cell', rowKey, field]),
          kind: 'cell',
          rowId: rowKey,
          columnId: field,
          label: `${baseLabel} · ${columnHeaderName ?? field}`,
          explicit: true,
        }
        // Toggle off if the same explicit chip is clicked again.
        const existing = cur.contexts.find((c) => c.id === chip.id)
        if (existing) {
          actions.removeContext(chip.id)
        } else {
          actions.addContext(chip)
        }
        actions.setAddContextMode(false)
        if (!cur.open) actions.setOpen(true)
        return
      }

      // Default click (no add mode):
      //   - identity cell → whole-row chip
      //   - data cell     → specific-cell chip (NOT explicit; gets replaced)
      // Replace non-explicit chips when no explicit chip exists; otherwise append.
      const hasExplicit = cur.contexts.some((c) => c.explicit)
      const newChip: ContextChip = identity
        ? {
            id: chipId(['row', rowKey]),
            kind: 'row',
            rowId: rowKey,
            label: baseLabel,
          }
        : {
            id: chipId(['cell', rowKey, field]),
            kind: 'cell',
            rowId: rowKey,
            columnId: field,
            label: `${baseLabel} · ${columnHeaderName ?? field}`,
          }

      // Click on the already-active chip → remove (matches wireframe).
      const existing = cur.contexts.find((c) => c.id === newChip.id)
      if (existing) {
        actions.removeContext(newChip.id)
        if (!cur.open) actions.setOpen(true)
        return
      }

      if (hasExplicit) {
        actions.addContext(newChip)
      } else {
        actions.replaceContexts([newChip])
      }
      if (!cur.open) actions.setOpen(true)
    },
    [actions],
  )

  return useMemo<T[] | undefined>(() => {
    if (!colDefs) return colDefs
    return withScoutCellWiring(colDefs as AnyColDef[], {
      contextsRef,
      openRef,
      addModeRef,
      onCellClicked: handleCellClick,
    }) as T[]
  }, [colDefs, handleCellClick])
}
