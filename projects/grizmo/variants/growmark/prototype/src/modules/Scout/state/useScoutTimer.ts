// useScoutTimer — the single, continuous shell timer engine (TMR-1/3/4).
//
// ONE setInterval lives in the hoisted <ScoutProvider> (mounted at the app
// shell around <Outlet/>), so it survives route changes: the countdown never
// resets, pauses, or restarts on navigation. Each tick dispatches
// `tickTimer(now)` which advances simNow and flips any in-progress thread past
// its readyAt to 'ready'. That single flip is what simultaneously lights the
// per-row indicator (ROW-1), updates the name tag/indicator (ALR-3/4), and
// adds/updates the drawer card (ALR-2) — one source of truth, every surface
// reacts (TMR-4).
//
// NOTE: `Date.now()` (the browser wall clock) is the correct time source here —
// this is real app code, not a deterministic Workflow script. The clock keeps
// advancing regardless of which page is mounted, so two threads started at
// different moments each land Ready at their own real-world moment.

import { useEffect } from 'react'

import { useScout } from './ScoutContext'

// ~250ms cadence: smooth enough for a 10s countdown bar, cheap enough to leave
// running for the whole session.
const TICK_MS = 250

export const useScoutTimer = (): void => {
  const { actions } = useScout()

  useEffect(() => {
    // Prime immediately so simNow is fresh on mount, then tick on an interval.
    actions.tickTimer(Date.now())
    const handle = window.setInterval(() => {
      actions.tickTimer(Date.now())
    }, TICK_MS)
    return () => window.clearInterval(handle)
    // `actions` is stable across renders (bound once), so this effect mounts a
    // single interval for the provider's lifetime.
  }, [actions])
}
