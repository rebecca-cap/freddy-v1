import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import React from 'react'

export function DetailHeader({ selectedProductGroup }) {
  return (
    <Horizontal className='side-detail-header-background p-4' style={{ minHeight: 70, gap: 20 }} verticalCenter>
      <Texto appearance='white'>LOCATION GROUP</Texto>
      <Texto appearance='white' category='h4'>
        {selectedProductGroup.locationName}
      </Texto>
      <Texto appearance='white'>PRODUCT GROUP</Texto>
      <Texto appearance='white' category='h4'>
        {selectedProductGroup.productName}
      </Texto>
    </Horizontal>
  )
}
