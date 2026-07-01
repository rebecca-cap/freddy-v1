// ScoutFollowUps — suggested next-question chips pinned at the conversation
// tail after an answer. Mirrors the wireframe's `.suggest-block` that refreshes
// each turn (gizmo-demo.html scopedChips / bindChips): a label plus a row of
// chips, where clicking one re-submits it as the next question.
//
// Driven by the latest completed answer's `followUps` (see ScoutMessageList).
// Reuses the chip + label styling from ScoutChips.css; `.scout-followups`
// only adds the tail separator + spacing.

import { GraviButton } from '@gravitate-js/excalibrr'

import { useScoutAsk } from '../state/useScoutAsk'
import type { FollowUp } from '../types'

import './ScoutChips.css'
import './ScoutFollowUps.css'

interface ScoutFollowUpsProps {
  chips: FollowUp[]
}

export const ScoutFollowUps = ({ chips }: ScoutFollowUpsProps) => {
  const ask = useScoutAsk()

  if (chips.length === 0) return null

  return (
    <div className='scout-followups'>
      <div className='scout-chips__label'>Try a follow-up</div>
      <div className='scout-chips__row'>
        {chips.map((chip) => (
          <GraviButton
            key={chip.promptId}
            size='small'
            shape='round'
            className='scout-chip'
            data-prompt-id={chip.promptId}
            buttonText={chip.label}
            onClick={() => {
              void ask({ promptId: chip.promptId, label: chip.label })
            }}
          />
        ))}
      </div>
    </div>
  )
}
