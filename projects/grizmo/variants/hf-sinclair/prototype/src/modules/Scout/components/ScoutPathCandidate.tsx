// ScoutPathCandidate — Phase 6.1 inline save-as-path prompt.
//
// Renders below the latest Scout answer when `message.candidate === true`.
// Two actions: "Save as path" opens the Phase 6.2 modal seeded from the
// detected candidate, and "Dismiss" clears the candidate flag.
//
// Detection lives in `state/detectPathCandidate.ts` — this component only
// renders surface. It looks up the candidate from current state so the modal
// always opens with the freshest set of steps.

import { CloseOutlined, PlayCircleFilled } from '@ant-design/icons'
import { GraviButton } from '@gravitate-js/excalibrr'

import { useScout } from '../state/ScoutContext'
import {
  buildSaveModalState,
  detectPathCandidate,
} from '../state/detectPathCandidate'
import type { ScoutMessage } from '../types'

import './ScoutPathCandidate.css'

interface PathCandidateProps {
  message: ScoutMessage
}

export const ScoutPathCandidate = ({ message }: PathCandidateProps) => {
  const { state, actions } = useScout()
  if (!message.candidate) return null

  const candidate = detectPathCandidate(state.messages)
  // If the detector now disagrees (e.g. the latest answer changed), hide
  // gracefully — the user shouldn't see a stale prompt.
  if (!candidate || candidate.latestId !== message.id) return null

  const scope = candidate.scope
  const stepCount = candidate.steps.length
  const previewLabels = candidate.steps
    .slice(0, 3)
    .map((s) => `"${s.label}"`)
    .join(' → ')
  const more =
    candidate.steps.length > 3
      ? ` +${candidate.steps.length - 3} more`
      : ''

  const handleSave = () => {
    actions.openSaveModal(buildSaveModalState(candidate, message.id))
  }

  const handleDismiss = () => {
    actions.dismissCandidate(message.id)
  }

  return (
    <div className='scout-path-candidate' role='note'>
      <div
        className='scout-path-candidate__icon'
        aria-hidden='true'
      >
        <PlayCircleFilled />
      </div>
      <div className='scout-path-candidate__text'>
        <div className='scout-path-candidate__lede'>
          You just ran <b>{stepCount}</b> questions in a row on{' '}
          <b>{scope === 'agg' ? 'the quote book' : 'this row'}</b>. Save them as
          a path so you can re-run the whole thing with one click.
        </div>
        <div className='scout-path-candidate__preview'>
          {previewLabels}
          {more}
        </div>
      </div>
      <div className='scout-path-candidate__actions'>
        <GraviButton
          size='small'
          className='scout-path-candidate__save'
          buttonText='Save as path'
          onClick={handleSave}
        />
        <GraviButton
          size='small'
          className='scout-path-candidate__dismiss'
          icon={<CloseOutlined />}
          aria-label='Dismiss save-path prompt'
          onClick={handleDismiss}
        />
      </div>
    </div>
  )
}
