import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import React from 'react'

export function ExternalCounterpartyDisplay({ currentCounterParty }) {
  return (
    <Horizontal className='mt-3 mb-2 justify-sb'>
      <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
        Counterparty
      </Texto>
      <Texto category='p1' appearance='default'>
        {currentCounterParty}
      </Texto>
    </Horizontal>
  )
}
