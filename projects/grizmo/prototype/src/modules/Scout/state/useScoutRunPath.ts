// useScoutRunPath — Phase 6.4 runner.
//
// Switches view to chat, sets isPathRunning, then runs each step of a saved
// path sequentially via the same `ask()` flow the composer uses. Each step
// produces its own user + scout bubble pair (so the conversation shows the
// work).
//
// Row-scoped paths require a row chip in state.contexts; if missing we show a
// toast (Phase 7.4 polish — for now we surface via `addToast`) and bail out
// early. Aggregate paths run unconditionally.

import { useCallback } from 'react'

import type { SavedItem, Toast } from '../types'

import { useScout } from './ScoutContext'
import { useScoutAsk } from './useScoutAsk'

const makeToastId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `toast-${crypto.randomUUID()}`
  }
  return `toast-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
}

export const useScoutRunPath = () => {
  const { state, actions } = useScout()
  const ask = useScoutAsk()

  const runPath = useCallback(
    async (path: SavedItem) => {
      if (state.isPathRunning) return

      // Row-scoped items need a row chip. Aggregate items run regardless.
      if (path.scope === 'row') {
        const hasRow = state.contexts.some(
          (c) => c.kind === 'row' || c.kind === 'cell',
        )
        if (!hasRow) {
          const toast: Toast = {
            id: makeToastId(),
            kind: 'warn',
            text: 'Pick a row first to run this path.',
          }
          actions.addToast(toast)
          return
        }
      }

      // Switch into chat so the running conversation is visible.
      actions.setView('chat')
      actions.setPathRunning(true)
      try {
        for (const step of path.steps) {
          const promptId = step.promptId ?? step.label
          await ask({
            promptId,
            label: step.label,
          })
        }
      } finally {
        actions.setPathRunning(false)
      }
    },
    [state.isPathRunning, state.contexts, actions, ask],
  )

  return runPath
}
