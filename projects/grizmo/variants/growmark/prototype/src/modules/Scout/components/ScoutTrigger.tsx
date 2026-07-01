// ScoutTrigger — toolbar button that opens / closes the Scout panel.
//
// Renders an Excalibrr `GraviButton` (not a raw <button>) so we inherit antd's
// focus ring, disabled handling, ripple, and screen-reader semantics. The
// brand purple + 28×28 sizing comes from `.scout-trigger-btn` in the scoped
// `--scout-*` token sheet — antd defaults are overridden, not bypassed.
//
// Drops into QuoteBookActionButtons.tsx (see SCOUT_NOTES.md). The outer span
// carries `.scout-scope` so the tokens activate. The button itself carries
// `id="scout-trigger"` so the bubble popover (step 1.2) can anchor to it via
// getBoundingClientRect and the ⌘G shortcut (step 1.4) can `.click()` it.
// Do not change the id without updating those consumers.

import { GraviButton } from '@gravitate-js/excalibrr'

import { useScout } from '../state/ScoutContext'

import './ScoutTrigger.css'

// AI "sparkles" mark — antd has no sparkle icon, so (per the ScoutBookmarkIcon
// precedent) we inline an SVG that inherits `currentColor` and stays crisp at
// small sizes. A large 4-point star plus a small companion sparkle.
const SparkleIcon = () => (
  <svg
    className='scout-trigger-btn__sparkle'
    viewBox='0 0 24 24'
    width='14'
    height='14'
    aria-hidden='true'
  >
    <path
      fill='currentColor'
      d='M11 2c.6 4 1.8 6.2 6 7-4.2.8-5.4 3-6 7-.6-4-1.8-6.2-6-7 4.2-.8 5.4-3 6-7Z'
    />
    <path
      fill='currentColor'
      d='M18.5 13c.25 1.7.75 2.5 2.5 3-1.75.5-2.25 1.3-2.5 3-.25-1.7-.75-2.5-2.5-3 1.75-.5 2.25-1.3 2.5-3Z'
    />
  </svg>
)

export const ScoutTrigger = () => {
  const { state, actions } = useScout()
  const { open } = state

  // Pulse only during the welcome state — i.e. while the intro bubble is
  // showing (panel closed AND intro not yet dismissed). The moment the user
  // engages (opens the panel) or dismisses the bubble, the pulse stops.
  const welcoming = !open && !state.bubbleDismissed

  return (
    <span className='scout-scope scout-trigger-wrap'>
      <GraviButton
        id='scout-trigger'
        className={`scout-trigger-btn${open ? ' is-open' : ''}${
          welcoming ? ' is-welcoming' : ''
        }`}
        aria-label={open ? 'Close Scout' : 'Open Scout'}
        aria-pressed={open}
        icon={<SparkleIcon />}
        buttonText='Ask Scout'
        onClick={actions.toggleOpen}
      />
    </span>
  )
}
