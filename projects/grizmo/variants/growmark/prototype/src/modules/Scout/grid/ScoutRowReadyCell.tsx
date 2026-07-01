// Scout — per-row "ready" indicator cell renderer (ROW-1..3).
//
// Renders a tiny three-dot indicator in a pinned leading grid column. The dots
// LIGHT UP when this row's thread is Ready/unseen (ROW-1), show a subtle
// in-progress shimmer while the thread is still thinking (ROW-3, truthful to
// status), and are ABSENT when the thread is 'viewed' or there is no thread.
//
// Clicking the indicator (ROW-2) focuses that row's thread and opens the panel,
// dropping the user back into the conversation where they left off.
//
// AG Grid does NOT re-render this renderer on external React state changes, so
// it reads thread status + the click handler from LIVE REFS set by
// useScoutGridWiring, which pairs every threads/simNow change with
// gridApi.refreshCells({ force: true }) to force the cells to repaint.

import React from 'react'

import type { ThreadStatus } from '../types'

import './ScoutRowReadyCell.css'

// Live wiring set once per useScoutGridWiring render (module-level, mirrors the
// withScoutCellWiring ref pattern). The renderer reads these at paint time.
export interface ScoutRowReadyDeps {
  // Map of String(QuoteConfigurationMappingId) -> thread id, for rows that have
  // a thread.
  rowThreadIdRef: { current: ReadonlyMap<string, string> }
  // Map of String(QuoteConfigurationMappingId) -> thread status.
  rowStatusRef: { current: ReadonlyMap<string, ThreadStatus> }
  // Open the given row's thread (ROW-2): setActiveThread + setOpen(true).
  onOpenThread?: (threadId: string) => void
}

let liveRowThreadIdRef: ScoutRowReadyDeps['rowThreadIdRef'] = { current: new Map() }
let liveRowStatusRef: ScoutRowReadyDeps['rowStatusRef'] = { current: new Map() }
let liveOnOpenThread: ScoutRowReadyDeps['onOpenThread'] = undefined

export function setScoutRowReadyDeps(deps: ScoutRowReadyDeps): void {
  liveRowThreadIdRef = deps.rowThreadIdRef
  liveRowStatusRef = deps.rowStatusRef
  liveOnOpenThread = deps.onOpenThread
}

interface RowReadyCellParams {
  data?: { QuoteConfigurationMappingId?: string | number }
  node?: { group?: boolean }
}

const STATUS_LABEL: Record<ThreadStatus, string> = {
  'in-progress': 'Scout is still thinking about this row',
  ready: 'Scout has an answer ready for this row — open it',
  viewed: '',
}

// AG Grid functional cell renderer. Returns the indicator only for leaf rows
// whose thread is 'ready' or 'in-progress'. Group rows and threadless / 'viewed'
// rows render nothing (keeps the column visually empty so it reads as a quiet
// gutter, ROW-3).
export function ScoutRowReadyCell(params: RowReadyCellParams): React.ReactElement | null {
  if (params?.node?.group) return null
  const rawId = params?.data?.QuoteConfigurationMappingId
  if (rawId == null) return null
  const rowKey = String(rawId)

  const status = liveRowStatusRef.current.get(rowKey)
  // ROW-3: absent when 'viewed' or no thread.
  if (status !== 'ready' && status !== 'in-progress') return null

  const threadId = liveRowThreadIdRef.current.get(rowKey)
  const isReady = status === 'ready'

  const handleClick = (e: React.MouseEvent) => {
    // Stop the click from also reaching AG Grid's onCellClicked / row select.
    e.stopPropagation()
    if (threadId && liveOnOpenThread) liveOnOpenThread(threadId)
  }

  return (
    <span
      className={
        'scout-scope scout-row-ready' +
        (isReady ? ' scout-row-ready--ready' : ' scout-row-ready--progress')
      }
      role="button"
      tabIndex={0}
      title={STATUS_LABEL[status]}
      aria-label={STATUS_LABEL[status]}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (threadId && liveOnOpenThread) liveOnOpenThread(threadId)
        }
      }}
    >
      <span className="scout-row-ready__dot" />
      <span className="scout-row-ready__dot" />
      <span className="scout-row-ready__dot" />
    </span>
  )
}
