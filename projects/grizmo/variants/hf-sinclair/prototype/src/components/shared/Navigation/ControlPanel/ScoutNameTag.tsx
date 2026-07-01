// ScoutNameTag — cross-page activity tag + unseen indicator (ALR-3, ALR-4).
//
// Renders in the top-right chrome (UserSummary), OUTSIDE .scout-scope. It is a
// plain consumer of the hoisted ScoutProvider via useScout(): it shows a
// compact tag communicating scoutActivityState ("Scout is thinking" /
// "Scout is ready") to the LEFT of the user's name (ALR-4), and a small dot
// indicator when there is unseen status worth surfacing (ALR-3). Both are
// driven entirely by the single global timer (TMR-4) and persist on every page
// because the provider is hoisted to the shell (ALR-5).

import React from 'react'

import { useScout } from '@modules/Scout'

import './alerts.css'

export function ScoutNameTag() {
  const { scoutActivityState, unseenCount } = useScout()

  if (scoutActivityState === 'idle') return null

  const isThinking = scoutActivityState === 'thinking'
  const label = isThinking ? 'Scout is thinking' : 'Scout is ready'

  return (
    <div
      className={`scout-name-tag scout-name-tag--${scoutActivityState}`}
      role='status'
      aria-live='polite'
      title={
        unseenCount > 0
          ? `${unseenCount} Scout ${unseenCount === 1 ? 'answer' : 'answers'} ready`
          : label
      }
    >
      <span
        className={`scout-name-tag__dot scout-name-tag__dot--${scoutActivityState}`}
        aria-hidden='true'
      />
      <span className='scout-name-tag__label'>{label}</span>
    </div>
  )
}

// ScoutNameIndicator — the bare dot/badge used directly beside the avatar so
// the unseen signal stays visible even when the tag is collapsed on narrow
// chrome. Only renders when there is an unseen-ready thread (ALR-3).
export function ScoutNameIndicator() {
  const { unseenCount } = useScout()

  if (unseenCount <= 0) return null

  return (
    <span
      className='scout-name-indicator'
      title={`${unseenCount} Scout ${unseenCount === 1 ? 'answer' : 'answers'} ready`}
      aria-label={`${unseenCount} Scout answers ready`}
    >
      {unseenCount > 9 ? '9+' : unseenCount}
    </span>
  )
}
