import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

import { chartColors } from '../helpers'

export function ComparisonGrid({ row, valueFormatter, items }) {
  const { gold } = chartColors
  return (
    <Horizontal className='border-bottom bg-2' verticalCenter>
      <Horizontal flex={0.5} className='p-2' verticalCenter horizontalCenter>
        <Texto align='center'>{row?.Date}</Texto>
      </Horizontal>
      <Vertical verticalCenter flex={3.5} className='border-left bg-1'>
        {items.map((item, index) => {
          const className = items.length > 1 && index < items.length - 1 ? 'border-bottom' : ''
          const diff = item.value - row?.comparisonValue

          return (
            <Horizontal
              className={className}
              key={`${index} - ${item.value} - ${item.key} - ${item.Date}`}
              verticalCenter
            >
              <Vertical verticalCenter flex={2} className='p-2'>
                <Texto>{item?.key}</Texto>
              </Vertical>
              <Vertical verticalCenter flex={1} className='p-2' alignItems='center'>
                <Texto weight='bold' style={{ color: gold }}>
                  {valueFormatter(row?.comparisonValue)}
                </Texto>
              </Vertical>
              <Horizontal verticalCenter flex={1} className='p-2 mr-2' justifyContent='flex-end'>
                <Texto>{valueFormatter(item.value)}</Texto>
                {diff > 0 ? (
                  <CaretUpFilled style={{ color: 'var(--theme-success)' }} className='ml-1' />
                ) : (
                  <CaretDownFilled style={{ color: 'var(--theme-error)' }} className='ml-1' />
                )}
                <Texto align='right' appearance={diff > 0 ? 'success' : 'error'}>
                  {valueFormatter(diff)}
                </Texto>
              </Horizontal>
            </Horizontal>
          )
        })}
      </Vertical>
    </Horizontal>
  )
}
