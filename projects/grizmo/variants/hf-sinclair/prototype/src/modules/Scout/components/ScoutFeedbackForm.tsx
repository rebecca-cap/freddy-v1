// ScoutFeedbackForm — inline negative-feedback capture inside the answer card.
//
// Spec (response-cards-spec.html §feedback): appears below the footer the moment
// thumbs-down is tapped. Asks "What went wrong?", offers three fixed reasons and
// an optional note, then Cancel / Submit. On submit it persists the reason+note
// on the message (which swaps this form for the receipt) and toasts "Feedback
// received". Cancel clears the thumbs-down (which removes the form).
//
// The form's visibility is derived by ScoutBubble (rating === 'down' &&
// !feedback) — this component owns only the in-progress radio/note selection.

import { useState } from 'react'

import { useScout } from '../state/ScoutContext'
import type { FeedbackReason, ScoutMessage, Toast } from '../types'

import './ScoutFeedbackForm.css'

interface FeedbackFormProps {
  message: ScoutMessage
}

export const REASON_LABELS: Record<FeedbackReason, string> = {
  'wrong-data': 'Wrong data',
  misread: 'Misread my question',
  'made-up': 'Invented data',
}

const REASON_ORDER: FeedbackReason[] = ['wrong-data', 'misread', 'made-up']

const makeToastId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `toast-${crypto.randomUUID()}`
  }
  return `toast-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
}

export const ScoutFeedbackForm = ({ message }: FeedbackFormProps) => {
  const { actions } = useScout()
  const [reason, setReason] = useState<FeedbackReason>('wrong-data')
  const [note, setNote] = useState('')

  const handleSubmit = () => {
    const trimmed = note.trim()
    actions.updateMessage(message.id, {
      rating: 'down',
      feedback: { reason, ...(trimmed ? { note: trimmed } : {}) },
    })
    const toast: Toast = {
      id: makeToastId(),
      kind: 'success',
      text: 'Feedback received',
    }
    actions.addToast(toast)
  }

  const handleCancel = () => {
    // Clearing the thumbs-down removes the form (derived visibility).
    actions.updateMessage(message.id, { rating: undefined })
  }

  return (
    <div className='scout-feedback'>
      <div className='scout-feedback__label'>What went wrong?</div>
      {REASON_ORDER.map((r) => (
        <label key={r} className='scout-feedback__option'>
          <input
            type='radio'
            name={`scout-feedback-${message.id}`}
            checked={reason === r}
            onChange={() => setReason(r)}
          />
          <span>{REASON_LABELS[r]}</span>
        </label>
      ))}
      <textarea
        className='scout-feedback__note'
        placeholder='Add a note (optional)'
        aria-label='Add a note (optional)'
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className='scout-feedback__buttons'>
        <button
          type='button'
          className='scout-feedback__btn scout-feedback__btn--secondary'
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type='button'
          className='scout-feedback__btn scout-feedback__btn--primary'
          onClick={handleSubmit}
        >
          Send feedback
        </button>
      </div>
    </div>
  )
}
