// ScoutThinkingDivider — the in-turn "thinking" separator shown between the
// ask bubble and the streaming answer card.
//
// Visually it's the same rule-on-each-side treatment as ScoutRowDivider (so it
// reads as a sibling of the row separators), but the centered label cycles
// through a pool of playful synonyms for "thinking" (à la Claude Code) and wears
// a gradient glimmer that sweeps across the text while the answer is in flight.

import { useEffect, useState } from 'react'

import './ScoutRowDivider.css'
import './ScoutThinkingDivider.css'

// Entertaining stand-ins for "thinking" — short enough to fit the centered
// divider slot. Order doesn't matter; the starting word is randomized so a
// fresh run rarely opens on the same one.
const THINKING_WORDS = [
  'Thinking',
  'Pondering',
  'Noodling',
  'Cogitating',
  'Ruminating',
  'Mulling it over',
  'Percolating',
  'Untangling',
  'Connecting the dots',
  'Crunching the numbers',
  'Pulling threads',
  'Synthesizing',
  'Deliberating',
  'Chewing on it',
]

// How long each word lingers before the next one swaps in.
const CYCLE_MS = 2400

export const ScoutThinkingDivider = () => {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * THINKING_WORDS.length),
  )

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((n) => (n + 1) % THINKING_WORDS.length)
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [])

  const word = THINKING_WORDS[index]

  return (
    <div
      className='scout-row-divider scout-row-divider--tight'
      role='status'
      aria-live='polite'
      aria-label='Thinking'
    >
      <span className='scout-row-divider__rule' aria-hidden='true' />
      <span className='scout-row-divider__center'>
        <span className='scout-thinking-shimmer'>{word}…</span>
      </span>
      <span className='scout-row-divider__rule' aria-hidden='true' />
    </div>
  )
}
