// ScoutFeedbackReceipt — quiet confirmation that replaces the feedback form.
//
// Spec (response-cards-spec.html §feedback-done): a single-line block that
// confirms the reason was logged. No further controls. Lives in the same slot
// the form occupied, inside the answer card.

import type { MessageFeedback } from '../types'

import { REASON_LABELS } from './ScoutFeedbackForm'

import './ScoutFeedbackReceipt.css'

interface ReceiptProps {
  feedback: MessageFeedback
}

export const ScoutFeedbackReceipt = ({ feedback }: ReceiptProps) => (
  <div className='scout-feedback-receipt'>
    Thanks — recorded as '{REASON_LABELS[feedback.reason]}'. We use this to
    improve Scout.
  </div>
)
