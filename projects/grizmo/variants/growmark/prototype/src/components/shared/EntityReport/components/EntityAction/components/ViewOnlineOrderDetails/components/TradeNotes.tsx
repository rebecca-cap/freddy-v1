import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

export function TradeNotes({ orderDetails }) {
  return (
    orderDetails?.Comments && (
      <div className='flex-half'>
        <Vertical>
          <Horizontal className='mx-4 border-bottom'>
            <Texto category='h5' appearance='medium'>
              TRADE NOTE
            </Texto>
          </Horizontal>
          <Horizontal className='mt-2 mx-4'>
            <Texto appearance='medium' style={{ fontSize: 12 }}>
              {orderDetails?.Comments || 'N/A'}
            </Texto>
          </Horizontal>
        </Vertical>
      </div>
    )
  )
}
