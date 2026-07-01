// ScoutCloseConfirm — Phase 7.2 close confirmation modal.
//
// Always shown when the panel header's Close (×) is clicked. Three actions:
//   - Minimize (primary): keep state, close panel — `actions.setOpen(false)`.
//   - Close & discard (destructive): stash backups, wipe live state, set
//     open=false. Handled in a single reducer action so the user only sees one
//     re-render (`discardSession`).
//   - Keep going (cancel link): just close the modal.
//
// Visual mirrors `.close-confirm-*` at gizmo-demo.html ~line 250. The backdrop
// portals to <body> so it can overlay the panel without inheriting its overflow
// clipping.
//
// Round-4 fix: do NOT auto-skip the modal when state appears empty. The user
// has consistently asked for the confirmation step.

import { ExclamationCircleFilled } from '@ant-design/icons'
import { GraviButton } from '@gravitate-js/excalibrr'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { useScout } from '../state/ScoutContext'

import './ScoutCloseConfirm.css'

export const ScoutCloseConfirm = () => {
  const { state, actions } = useScout()
  const cancelRef = useRef<HTMLButtonElement | null>(null)

  // Focus the safer option on open. The wireframe focuses Minimize; we focus
  // the primary GraviButton too via a DOM query inside the modal.
  useEffect(() => {
    if (!state.closeConfirmOpen) return undefined
    const id = requestAnimationFrame(() => {
      const btn = document.querySelector<HTMLButtonElement>(
        '.scout-close-confirm .scout-close-confirm__minimize',
      )
      btn?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [state.closeConfirmOpen])

  // Esc closes (acts as Cancel).
  useEffect(() => {
    if (!state.closeConfirmOpen) return undefined
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        actions.closeCloseConfirm()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [state.closeConfirmOpen, actions])

  if (!state.closeConfirmOpen) return null

  const gizmoCount = state.messages.filter((m) => m.role === 'scout').length
  const ctxCount = state.contexts.length

  const hasDiscardable = gizmoCount > 0 || ctxCount > 0

  let description: string
  if (gizmoCount > 0) {
    const noun = gizmoCount === 1 ? 'answer' : 'answers'
    const ctxBit = ctxCount > 0 ? ' and the cells in focus' : ''
    description = `Discarding clears ${gizmoCount} ${noun}${ctxBit} and ends this conversation. Minimize instead to keep it for later.`
  } else if (ctxCount > 0) {
    description = 'Discarding clears the cells in focus and ends this conversation. Minimize instead to keep it for later.'
  } else {
    description = 'Closing discards this conversation. Minimize keeps Scout nearby for later.'
  }

  const handleMinimize = () => {
    actions.closeCloseConfirm()
    actions.minimize()
  }

  const handleDiscard = () => {
    actions.discardSession()
  }

  const handleCancel = () => {
    actions.closeCloseConfirm()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleCancel()
  }

  return createPortal(
    <div
      className='scout-scope scout-close-confirm-backdrop'
      onClick={handleBackdropClick}
    >
      <div
        className='scout-close-confirm'
        role='dialog'
        aria-modal='true'
        aria-labelledby='scoutCloseConfirmTitle'
      >
        <div className='scout-close-confirm__icon' aria-hidden='true'>
          <ExclamationCircleFilled />
        </div>
        <div
          className='scout-close-confirm__title'
          id='scoutCloseConfirmTitle'
        >
          Discard this conversation?
        </div>
        <div className='scout-close-confirm__body'>{description}</div>
        <div className='scout-close-confirm__actions'>
          <GraviButton
            className='scout-close-confirm__minimize'
            buttonText='Minimize instead'
            onClick={handleMinimize}
          />
          <GraviButton
            className='scout-close-confirm__discard'
            buttonText={hasDiscardable ? 'Discard' : 'Close'}
            onClick={handleDiscard}
          />
        </div>
        <button
          ref={cancelRef}
          type='button'
          className='scout-close-confirm__cancel'
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  )
}
