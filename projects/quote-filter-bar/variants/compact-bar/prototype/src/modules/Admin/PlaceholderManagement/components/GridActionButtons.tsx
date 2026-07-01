import { Horizontal, RangePicker } from '@gravitate-js/excalibrr'
import { Select } from 'antd'
import React from 'react'

export function PlaceholderManagementActionButtons({
  effectiveDates,
  setEffectiveDates,
  placeHolderMode,
  setPlaceholderMode,
}) {
  const modeOptions = [
    { value: 'OnlyPending', label: 'Only pending' },
    { value: 'OrdersWithAnyPending', label: 'Orders with any pending' },
    { value: 'All', label: 'All' },
  ]
  return (
    <Horizontal className='mx-3' style={{ gap: 10 }} verticalCenter>
      <Select style={{ minWidth: 180 }} value={placeHolderMode} onChange={setPlaceholderMode} options={modeOptions} />
      <RangePicker inputKey='Dates' dates={effectiveDates} onChange={setEffectiveDates} placement='bottomRight' />
    </Horizontal>
  )
}
