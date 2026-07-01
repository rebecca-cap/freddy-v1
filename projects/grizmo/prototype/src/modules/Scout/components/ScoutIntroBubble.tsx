// ScoutIntroBubble — first-time tour popover that points at the toolbar G
// button. Mirrors the wireframe (gizmo-demo.html) `.tour-popover` element.
//
// The outer container + tail are custom because the bubble's exact pointer
// position has to align with the toolbar trigger pixel-by-pixel — antd
// Popover binds to its child and positions relative to that child, which
// doesn't fit our portaled bubble + remote trigger model. But the typography
// and the dismiss button come from the design system: title and body are
// `Texto` (Excalibrr typography), close is `GraviButton` (Excalibrr button).
//
// Visibility rules (per the round-4 plan):
//   - Render `null` when state.bubbleDismissed === true (user clicked the X).
//   - Render `null` when state.open === true (panel is open, intro is moot).
//   - Render `null` when the trigger element is not yet mounted — we retry
//     on the next window resize / re-render.
//
// Positioning: the bubble is portaled to <body> so the toolbar's overflow
// rules can't clip it. We compute its viewport-relative top/right from
// `getElementById('scout-trigger').getBoundingClientRect()` on mount and on
// every `resize`. The tail offset (CSS `::before { right: 22px }`) lines up
// with the trigger when we right-align the bubble's right edge with the
// trigger's right edge, so we set `right = window.innerWidth - rect.right`.
//
// Reserved-name guard: `components/ScoutBubble.tsx` is reserved for chat
// message bubbles (Phase 3.2 / 3.3). This file is a separate component.

import { CloseOutlined } from '@ant-design/icons'
import { GraviButton, Texto } from '@gravitate-js/excalibrr'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { useScout } from '../state/ScoutContext'

import scoutHead from '../assets/Scout-head 2.png'

import './ScoutIntroBubble.css'

// Vertical gap (px) between the trigger's bottom edge and the bubble's top
// edge. The CSS `::before` tail extends 7px above the bubble, so the visual
// gap reads slightly tighter than this number suggests. 12px matches the
// wireframe's `top: 54px` (40px trigger row + 14px gap ≈ 12px below trigger).
const TAIL_GAP_PX = 12

interface BubbleAnchor {
  top: number
  right: number
}

const measureAnchor = (): BubbleAnchor | null => {
  const trigger = document.getElementById('scout-trigger')
  if (!trigger) return null
  const rect = trigger.getBoundingClientRect()
  // Right-align bubble with trigger so the tail at CSS `right: 22px` lands
  // near the trigger center. If the trigger sits very close to the right
  // edge of the viewport, this keeps the bubble on-screen because we never
  // push it off the right side.
  return {
    top: rect.bottom + TAIL_GAP_PX,
    // Offset the bubble's right edge left of the trigger's right edge so the
    // tail (CSS `::before { right: 22px }`) lands centered under the wider
    // "Ask Scout" trigger button.
    right: Math.max(8, window.innerWidth - rect.right + 23),
  }
}

export const ScoutIntroBubble = () => {
  const { state, actions } = useScout()
  const [anchor, setAnchor] = useState<BubbleAnchor | null>(() => {
    // SSR / pre-mount safety — `document` may not exist at module init time
    // in some test harnesses, so we lazily measure inside an effect below.
    if (typeof document === 'undefined') return null
    return measureAnchor()
  })

  // Recompute on mount AND whenever the page reflows. The QuoteBook toolbar
  // lives inside GraviGrid's controlBarProps; the grid renders empty first
  // then reflows when row data arrives, so a one-shot measurement at mount
  // anchors the bubble to the wrong y. A `ResizeObserver` on the trigger
  // element fires when its box-rect changes for any reason (parent reflow,
  // viewport resize, font load) — that's the signal we actually want.
  useEffect(() => {
    const update = () => setAnchor(measureAnchor())
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, { passive: true, capture: true })

    let observer: ResizeObserver | null = null
    let pollFrame: number | null = null

    // The trigger lives inside GraviGrid's controlBarProps; the grid renders
    // empty first, then reflows when row data arrives. ResizeObserver fires
    // on the OBSERVED element's box change — the trigger itself stays 28×28
    // through the reflow, so a one-shot observer never wakes up. Workaround:
    // re-measure on every frame for ~1 second after mount to catch the grid
    // settling, then attach a ResizeObserver for steady-state changes
    // (window resize, font load, sidebar toggle).
    const POLL_FRAMES = 60 // ≈ 1s at 60fps; matches typical grid-data hydration
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
      window.removeEventListener('scroll', update, { capture: true } as EventListenerOptions)
      if (pollFrame !== null) cancelAnimationFrame(pollFrame)
      observer?.disconnect()
    }
  }, [])

  if (state.bubbleDismissed || state.open) return null
  if (!anchor) return null

  return createPortal(
    <div
      className='scout-scope scout-intro-bubble'
      role='dialog'
      aria-label='Meet Scout'
      style={{ top: anchor.top, right: anchor.right }}
    >
      <img
        className='scout-intro-bubble__head'
        src={scoutHead}
        alt=''
        aria-hidden='true'
        draggable={false}
      />
      <div className='scout-intro-bubble__body'>
        <Texto category='h5' className='scout-intro-bubble__title'>
          Hi, I&apos;m Scout 👋
        </Texto>
        <Texto category='p2' className='scout-intro-bubble__text'>
          I answer questions about your pricing rows — costs, margins, deltas.
          <br />
          Click <b>Ask Scout</b> to start, or press <b>⌘G</b>.
        </Texto>
      </div>
      <GraviButton
        size='small'
        className='scout-intro-bubble__close'
        icon={<CloseOutlined />}
        aria-label='Dismiss intro'
        onClick={actions.dismissBubble}
      />
    </div>,
    document.body,
  )
}
