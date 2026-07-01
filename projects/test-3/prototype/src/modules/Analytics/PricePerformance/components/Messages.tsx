import { Horizontal, NothingMessage } from '@gravitate-js/excalibrr'
import { message, Spin } from 'antd'
import React from 'react'

export function MessageAskingUserToSelectARow() {
  return (
    <Horizontal className='bg-2 p-4 full-height-width' verticalCenter horizontalCenter>
      <NothingMessage title='No row selected' message='Please select a row to view the chart.' />
    </Horizontal>
  )
}

export function Loading() {
  return (
    <Horizontal horizontalCenter verticalCenter className='full-height-width'>
      <Spin size='large' />
    </Horizontal>
  )
}

export function NoData() {
  return (
    <Horizontal className='bg-2 p-4 full-height-width' verticalCenter horizontalCenter>
      <NothingMessage title='No Data' message='No data available for the selected row' />
    </Horizontal>
  )
}

export const showRowSelectionError = () => {
  message.error('You can only select up to 5 rows.')
}
