import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

interface AggCellRendererProps {
  value: number
  diff: number
  valueFormatter: (value: number) => string
}

export function AggCellRenderer({ value, diff, valueFormatter }: AggCellRendererProps) {
  const isPositive = useMemo(() => diff > 0, [diff])

  return (
    <Horizontal verticalCenter justifyContent='flex-end'>
      <Texto align='right'>{valueFormatter(value)}</Texto>
      {isPositive ? (
        <CaretUpFilled style={{ color: 'var(--theme-success)' }} className='ml-2 mr-1' />
      ) : (
        <CaretDownFilled style={{ color: 'var(--theme-error)' }} className='ml-2 mr-1' />
      )}
      <Texto align='right' appearance={isPositive ? 'success' : 'error'}>
        {valueFormatter(diff)}
      </Texto>
    </Horizontal>
  )
}
