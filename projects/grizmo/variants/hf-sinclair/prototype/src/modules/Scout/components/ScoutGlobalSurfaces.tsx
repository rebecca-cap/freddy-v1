// ScoutGlobalSurfaces — shell-level Scout surfaces that render on EVERY page
// (mounted once by Phase A, inside the hoisted <ScoutProvider> at
// AuthenticatedRoute, next to <Outlet/>). Keep this a descendant of the
// provider.
//
// Phase B4 — the bottom PROTOTYPE TIMER bar (TMR-2). This is the visible
// face of the single global timer engine Phase A built (TMR-1/3/4). It is a
// pure consumer: it reads `simNow` + `threads` from useScout() and renders a
// live countdown of the soonest-resolving in-progress thread. It does NOT own
// a timer — `simNow` is advanced by the one shell engine (useScoutTimer), so
// the countdown is continuous and correct across page navigation for free.
//
// It must read as OBVIOUS SCAFFOLDING — clearly NOT part of the Scout product
// UI: utilitarian dashed border, monospace, muted neutral system colors (no
// brand purple), and a literal "PROTOTYPE TIMER" label.

import { createPortal } from 'react-dom'

import { useScout } from '../state/ScoutContext'

import './ScoutGlobalSurfaces.css'

// Render the bar via a body portal (mirrors ScoutToastHost) so it sits above
// page layout and is unaffected by any page's stacking/overflow context.
export const ScoutGlobalSurfaces = () => {
  const { threads, simNow, unseenCount } = useScout()

  const inProgress = threads.filter(
    (t) => t.status === 'in-progress' && t.readyAt != null,
  )
  const thinkingCount = inProgress.length

  // Soonest-resolving in-progress thread drives the headline countdown.
  const soonest = inProgress.reduce<number | null>((min, t) => {
    const r = t.readyAt as number
    return min == null || r < min ? r : min
  }, null)

  const remainingMs = soonest != null ? soonest - simNow : null
  // Guard against a negative flicker between the tick that passes readyAt and
  // the tick that flips the thread to 'ready'.
  const remainingS =
    remainingMs != null ? Math.max(0, Math.ceil(remainingMs / 1000)) : null

  const isThinking = thinkingCount > 0

  const summary = isThinking
    ? `${thinkingCount} thread${thinkingCount === 1 ? '' : 's'} thinking · ${unseenCount} ready`
    : unseenCount > 0
      ? `idle — ${unseenCount} ready · 0 thinking`
      : 'idle — no threads thinking'

  return createPortal(
    <div
      className='scout-proto-timer'
      role='status'
      aria-live='off'
      data-state={isThinking ? 'thinking' : 'idle'}
    >
      <span className='scout-proto-timer__label'>
        SCOUT
        <span className='scout-proto-timer__sub'>
          {' '}
          · simulated thinking timer (prototype)
        </span>
      </span>

      <span className='scout-proto-timer__divider' aria-hidden='true'>
        |
      </span>

      {isThinking && remainingS != null ? (
        <span className='scout-proto-timer__count'>
          next ready in{' '}
          <span className='scout-proto-timer__num'>{remainingS}s</span>
        </span>
      ) : (
        <span className='scout-proto-timer__count scout-proto-timer__count--idle'>
          idle — no threads thinking
        </span>
      )}

      <span className='scout-proto-timer__divider' aria-hidden='true'>
        |
      </span>

      <span className='scout-proto-timer__summary'>{summary}</span>
    </div>,
    document.body,
  )
}
