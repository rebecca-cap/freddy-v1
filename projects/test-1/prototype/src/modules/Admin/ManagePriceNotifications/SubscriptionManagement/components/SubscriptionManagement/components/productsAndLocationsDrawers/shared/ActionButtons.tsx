import { CloseOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import React from 'react'

export function ActionButtons({ clearStateAndClose }) {
  return (
    <Horizontal justifyContent='flex-end' className='w-full'>
      <GraviButton size='small' onClick={clearStateAndClose} className='ghost-gravi-button' icon={<CloseOutlined />} />
    </Horizontal>
  )
}
