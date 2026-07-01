import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { BenchmarkCorrelation } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/api/schema.types'
import React from 'react'

export interface SingleRowDisplayProps {
  selectedRow: BenchmarkCorrelation
}

export function SingleRowDisplay({ selectedRow }: SingleRowDisplayProps) {
  return (
    <Horizontal verticalCenter className='p-2 border-bottom px-4'>
      <Vertical className='m-2' verticalCenter>
        <Texto category='h6'>{selectedRow?.ProductName}</Texto>
        <Horizontal>
          <Texto category='p1'>{selectedRow?.LocationName}</Texto>
          <Texto className='mx-1'>|</Texto>
          <Texto category='p1'>{selectedRow?.GroupName}</Texto>
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
