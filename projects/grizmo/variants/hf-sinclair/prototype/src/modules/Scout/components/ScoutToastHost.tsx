// ScoutToastHost — Phase 7.4.
//
// Single-toast renderer. State already exposes `state.toasts: Toast[]`, but the
// Round-4 wireframe (`gizmo-demo.html` ~line 4142) uses a single-toast policy:
// every new toast replaces the previous one. We honor that here by rendering
// only the latest toast in `state.toasts` and dismissing it on a 2500ms timer.
//
// Each toast carries its own `id`, so the auto-dismiss timer keys on it — when
// the id changes (a newer toast arrived), the old timer is canceled and a fresh
// 2500ms window opens for the new toast.
//
// Position + visual mirror the wireframe `.toast` pill: bottom-center, dark
// background, white text, rounded.

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { useScout } from '../state/ScoutContext'

import './ScoutToastHost.css'

const AUTO_DISMISS_MS = 2500

export const ScoutToastHost = () => {
  const { state, actions } = useScout()
  const latest = state.toasts[state.toasts.length - 1] ?? null

  useEffect(() => {
    if (!latest) return undefined
    const t = window.setTimeout(() => {
      actions.dismissToast(latest.id)
    }, AUTO_DISMISS_MS)
    return () => window.clearTimeout(t)
  }, [latest?.id, actions])

  if (!latest) return null

  const kindClass = latest.kind ? `scout-toast--${latest.kind}` : ''

  return createPortal(
    <div className='scout-scope scout-toast-host' role='status' aria-live='polite'>
      <div className={`scout-toast ${kindClass}`.trim()} key={latest.id}>
        {latest.text}
      </div>
    </div>,
    document.body,
  )
}
