// ScoutMini — Phase 7.1b minimized-state floating pill.
//
// When the user clicks the Minimize header button, the panel disappears and
// this small brand-purple pill appears in its place. Click to restore the
// panel with all state intact. Mirrors `.gizmo-mini` at gizmo-demo.html line
// 1214 (positioned `top: 6px; right: 280px` inside the demo's QB frame).
//
// Renders only when `state.isMinimized === true`. The `setOpen(true)` dispatch
// also flips `isMinimized` back to false (reducer guarantee), so the click
// handler doesn't need to manage both flags.
//
// Positioning: anchored centered above the #scout-trigger G button with a
// small gap. Same measurement strategy as ScoutIntroBubble — measure the
// trigger's viewport rect on mount, on resize, and on a short rAF poll to
// catch the grid's first reflow. The pill is `position: fixed`, so its
// place in the React tree doesn't affect layout.

import { useEffect, useState } from 'react'

import { useScout } from '../state/ScoutContext'

import './ScoutMini.css'

// Vertical gap (px) between the trigger's top edge and the pill's bottom
// edge. Matches the user-requested ~10px hover above the G.
const PILL_GAP_PX = 10
const VIEWPORT_INSET = 8

interface PillAnchor {
  left: number
  bottom: number
}

const measureAnchor = (): PillAnchor | null => {
  const trigger = document.getElementById('scout-trigger')
  if (!trigger) return null
  const rect = trigger.getBoundingClientRect()
  // Pill centers on the trigger's horizontal midpoint via
  // `transform: translateX(-50%)`. The pill is much narrower than the
  // welcome bubble so clamp tolerance is loose — keep it on-screen by at
  // least VIEWPORT_INSET px on either side.
  const centerX = rect.left + rect.width / 2
  const left = Math.min(
    Math.max(centerX, VIEWPORT_INSET),
    window.innerWidth - VIEWPORT_INSET,
  )
  return {
    left,
    bottom: window.innerHeight - rect.top + PILL_GAP_PX,
  }
}

export const ScoutMini = () => {
  const { state, actions } = useScout()
  const [anchor, setAnchor] = useState<PillAnchor | null>(() => {
    if (typeof document === 'undefined') return null
    return measureAnchor()
  })

  useEffect(() => {
    if (!state.isMinimized) return undefined
    const update = () => setAnchor(measureAnchor())
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, { passive: true, capture: true })

    let observer: ResizeObserver | null = null
    let pollFrame: number | null = null

    // Same rAF-poll-then-ResizeObserver pattern as ScoutIntroBubble. The
    // trigger lives inside GraviGrid's controlBarProps which reflows when
    // row data arrives, so we re-measure for ~1s after mount, then attach
    // a ResizeObserver for steady-state changes.
    const POLL_FRAMES = 60
    let frame = 0
    const poll = () => {
      update()
      frame += 1
      if (frame < POLL_FRAMES) {
        pollFrame = requestAnimationFrame(poll)
      } else {
        const trigger = document.getElementById('scout-trigger')
        if (trigger && typeof ResizeObserver !== 'undefined') {
          observer = new ResizeObserver(update)
          observer.observe(trigger)
          observer.observe(document.body)
        }
      }
    }
    pollFrame = requestAnimationFrame(poll)

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener(
        'scroll',
        update,
        { capture: true } as EventListenerOptions,
      )
      if (pollFrame !== null) cancelAnimationFrame(pollFrame)
      observer?.disconnect()
    }
  }, [state.isMinimized])

  if (!state.isMinimized) return null

  const handleClick = () => {
    actions.setOpen(true)
  }

  return (
    <button
      type='button'
      className='scout-scope scout-mini'
      onClick={handleClick}
      aria-label='Reopen Scout conversation'
      style={
        anchor === null
          ? { visibility: 'hidden' }
          : { left: anchor.left, bottom: anchor.bottom }
      }
    >
      <span className='scout-mini__g' aria-hidden='true'>
        G
      </span>
      <span className='scout-mini__label'>Resume conversation</span>
    </button>
  )
}
