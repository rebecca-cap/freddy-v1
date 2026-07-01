import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

export function ComparisonGridHeader({ selectedMetricType }: { selectedMetricType: string }) {
  return (
    <Horizontal verticalCenter style={{ height: '25px' }} className='bg-2 border-bottom'>
      <Horizontal flex={0.5} verticalCenter className='p-2'>
        <Texto align='center' category='label' style={{ textTransform: 'uppercase' }} appearance='medium' weight='bold'>
          Date
        </Texto>
      </Horizontal>
      <Vertical flex={3.5} verticalCenter className='border-left'>
        <Horizontal verticalCenter>
          <Vertical verticalCenter flex={2} className='p-2'>
            <Texto category='label' appearance='medium' weight='bold'>
              NAME
            </Texto>
          </Vertical>
          <Vertical verticalCenter flex={1} className='p-2'>
            <Texto category='label' appearance='medium' weight='bold' align='right'>
              SYSTEM AVG
            </Texto>
          </Vertical>
          <Vertical verticalCenter flex={1} className='p-2 mr-4' alignItems='end'>
            <Texto category='label' appearance='medium' weight='bold' textTransform='uppercase'>
              {selectedMetricType === 'AverageMargin' ? 'Margin' : selectedMetricType}
            </Texto>
          </Vertical>
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
