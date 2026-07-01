import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

export function DiffLine({ label, price }: { label: string; price: number }) {
  const icon = useMemo(() => {
    if (price > 0) {
      return <CaretUpFilled />
    }
    if (price < 0) {
      return <CaretDownFilled />
    }
    return null
  }, [price])
  return (
    <Horizontal verticalCenter justifyContent='flex-end' style={{ gap: '0.5em' }}>
      <Texto appearance='medium'>Diff To {label}</Texto>
      {icon}
      <Texto className='mr-1'>
        {price > 0 && '+'}
        {price}
      </Texto>
    </Horizontal>
  )
}
