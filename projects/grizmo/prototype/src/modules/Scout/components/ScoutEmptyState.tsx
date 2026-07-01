// ScoutEmptyState — the panel's first frame before any conversation.
//
// Composes Phase 2's three pieces: portrait (2.1), greeting (2.2), and the
// closed-prompt chips (2.3). Renders only when the user has neither sent a
// message nor pinned any context — once either arrives, ScoutPanel will
// switch to the message list (Phase 3.1).
//
// Per the design-system policy: image stays a raw <img> (no Excalibrr image
// primitive); typography goes through `Texto`; chip primitives live in
// `ScoutChips`. Layout / spacing comes from CSS tokens.

import { Texto } from '@gravitate-js/excalibrr'

import portraitSrc from '../assets/scout-hi 1.png'

import { ScoutChips } from './ScoutChips'

import './ScoutEmptyState.css'

export const ScoutEmptyState = () => {
  return (
    <div className='scout-empty-state'>
      <img
        className='scout-empty-state__portrait'
        src={portraitSrc}
        alt=''
        aria-hidden='true'
      />
      <Texto category='label' className='scout-empty-state__title'>
        Hey, I'm Scout!
      </Texto>
      <Texto category='p2' className='scout-empty-state__body'>
        Your pricing co-pilot. I'll <b>explain prices</b>, model{' '}
        <b>what-if scenarios</b>, compare <b>peers</b>, and decode <b>flags</b>.
      </Texto>
      <ScoutChips />
    </div>
  )
}
