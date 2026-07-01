// ScoutConfidence — the confidence badge at the TOP of an answer card.
//
// Spec (response-cards-spec.html §confidence): a small chip declaring how
// confident Scout is, shown on every answer, directly below the row tag and
// never inline with the body. Three levels (High / Medium / Low), each
// color-coded. An optional one-line note rides alongside the level
// (e.g. "Medium · single sample").

import type { ConfidenceLabel } from '../types'

import './ScoutConfidence.css'

interface ConfidenceProps {
  confidence: ConfidenceLabel
  note?: string
}

const LEVEL_CLASS: Record<ConfidenceLabel, string> = {
  High: 'is-high',
  Medium: 'is-medium',
  Low: 'is-low',
}

export const ScoutConfidence = ({ confidence, note }: ConfidenceProps) => (
  <div
    className={`scout-conf ${LEVEL_CLASS[confidence]}`}
    title='How sure Scout is in this answer'
  >
    <span className='scout-conf__dot' aria-hidden='true' />
    <span className='scout-conf__label'>
      {note ? `${confidence} confidence · ${note}` : `${confidence} confidence`}
    </span>
  </div>
)
