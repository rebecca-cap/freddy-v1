import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

export function CounterPartyInfo({ orderDetails }) {
  return (
    <div className='flex-half'>
      <Vertical className='mx-4'>
        <Horizontal className='border-bottom'>
          <Texto category='h5' appearance='medium'>
            COUNTERPARTY INFO
          </Texto>
        </Horizontal>
        <Horizontal
          className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
          style={{ borderRadius: 5, fontSize: 12 }}
        >
          <Vertical>
            <Horizontal className='justify-sb bg-1' style={{ borderRadius: 5 }}>
              <Texto appearance='medium' weight={600}>
                Contact
              </Texto>
              <Texto appearance='medium'>
                {orderDetails?.ExternalColleagueFirstName} {orderDetails?.ExternalColleagueLastName}
              </Texto>
            </Horizontal>
            <Horizontal className='mt-2 justify-sb bg-1' style={{ borderRadius: 5 }}>
              <Texto appearance='medium' weight={600}>
                Counterparty
              </Texto>
              <Texto appearance='medium'>{orderDetails?.ExternalCounterPartyName}</Texto>
            </Horizontal>
          </Vertical>
        </Horizontal>
      </Vertical>
    </div>
  )
}
