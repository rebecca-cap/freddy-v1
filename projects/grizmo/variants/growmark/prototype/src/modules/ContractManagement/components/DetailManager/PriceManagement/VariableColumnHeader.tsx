import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

export function VariableColumnHeader({ showDisplay }) {
  return (
    <Horizontal className='bg-2 px-3 py-2 border-bottom border-top'>
      <Vertical flex={1} className='mr-3 border-right'>
        <Texto category='label' textTransform='uppercase' appearance='medium'>
          %
        </Texto>
      </Vertical>
      <Vertical flex={2} className='mr-3 border-right'>
        <Texto category='label' textTransform='uppercase' appearance='medium'>
          Publisher
        </Texto>
      </Vertical>
      <Vertical flex={3} className='mr-3 border-right'>
        <Texto category='label' textTransform='uppercase' appearance='medium'>
          Instrument
        </Texto>
      </Vertical>
      <Vertical flex={2} className='mr-3 border-right'>
        <Texto category='label' textTransform='uppercase' appearance='medium'>
          Type
        </Texto>
      </Vertical>
      <Vertical flex={1} className='mr-5 border-right'>
        <Texto category='label' textTransform='uppercase' appearance='medium'>
          Diff
        </Texto>
      </Vertical>
      {showDisplay && (
        <Vertical flex={1} className='mr-5 border-right'>
          <Texto category='label' textTransform='uppercase' appearance='medium'>
            Display
          </Texto>
        </Vertical>
      )}
      <Vertical flex={1} className='mr-3 border-right'>
        <Texto category='label' textTransform='uppercase' appearance='medium'>
          UOM / Currency
        </Texto>
      </Vertical>
      <Vertical flex={1} className='mr-3 border-right'>
        <Texto category='label' textTransform='uppercase' appearance='medium'>
          Date Rule
        </Texto>
      </Vertical>
      <Vertical flex={1} className='mr-3 border-right'>
        <Texto category='label' textTransform='uppercase'>
          Value
        </Texto>
      </Vertical>
    </Horizontal>
  )
}
