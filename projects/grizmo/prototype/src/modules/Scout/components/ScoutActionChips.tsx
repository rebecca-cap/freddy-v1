// ScoutActionChips — inline scenario action chips at the END of an answer body.
//
// Spec (response-cards-spec.html §action chips): small primary-colored chips
// that fire a specific action. The universal Copy / Export / Save controls now
// live in the answer footer's overflow (meatballs) menu — this component only
// renders the *scenario-specific* chips ('open' / 'apply'), which are toast
// stubs in the prototype (no real grid mutation). When a scenario emits none,
// it renders nothing.

import { GraviButton } from '@gravitate-js/excalibrr'

import { useScout } from '../state/ScoutContext'
import type { ActionChip, Toast } from '../types'

// Reuse the follow-up chip styling verbatim so action chips are the exact same
// size + style as the "Try a follow-up" chips (white pill, gray border, hover
// glimmer). `.scout-action-chips` only owns the wrapping row layout.
import './ScoutChips.css'
import './ScoutActionChips.css'

interface ActionChipsProps {
  actions: ActionChip[]
}

// Deterministic toast ids — an incrementing module counter, never clock/random.
let toastCounter = 0
const makeToastId = (): string => {
  toastCounter += 1
  return `toast-action-${toastCounter}`
}

export const ScoutActionChips = ({ actions }: ActionChipsProps) => {
  const { actions: storeActions } = useScout()

  // Copy/export are handled by the footer menu — keep only the contextual CTAs.
  const chips = actions.filter(
    (a) => a.kind !== 'copy' && a.kind !== 'export',
  )

  if (chips.length === 0) return null

  const toast = (kind: Toast['kind'], text: string) =>
    storeActions.addToast({ id: makeToastId(), kind, text })

  const handleClick = (chip: ActionChip) => {
    if (chip.kind === 'apply') {
      toast('success', `Applied · ${chip.label}`)
      return
    }
    toast('info', chip.label)
  }

  return (
    <div className='scout-action-chips'>
      {chips.map((chip) => (
        <GraviButton
          key={chip.id}
          size='small'
          shape='round'
          className='scout-chip'
          buttonText={chip.label}
          onClick={() => handleClick(chip)}
        />
      ))}
    </div>
  )
}
