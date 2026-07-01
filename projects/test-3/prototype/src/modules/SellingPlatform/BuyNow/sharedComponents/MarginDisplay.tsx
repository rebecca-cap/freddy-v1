import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { getNumSign } from '@utils/index'
import React from 'react'

export const MarginDisplay = ({ margin }) => {
  return (
    <Horizontal className='test-Price mt-3 mb-2 mx-4 justify-sb' verticalCenter>
      <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
        Margin
      </Texto>
      <Texto category='p2'>{`${getNumSign(margin)}${fmt.currency(margin)}`}</Texto>
    </Horizontal>
  )
}
