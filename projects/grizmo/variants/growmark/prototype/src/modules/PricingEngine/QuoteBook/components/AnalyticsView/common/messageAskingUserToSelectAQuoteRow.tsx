import { Horizontal, NothingMessage } from '@gravitate-js/excalibrr'
import { Spin } from 'antd'
import React from 'react'

export function MessageAskingUserToSelectAQuoteRow({ tooManySelected = false }) {
  return (
    <Horizontal className='bg-2 p-4 full-height-width' verticalCenter horizontalCenter>
      <NothingMessage
        title={tooManySelected ? 'Too Many Rows Selected' : 'No Quote Book row selected'}
        message='Please select a single quote book row below to view quote analytics.'
      />
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
      <NothingMessage title='No Data' message='No data available for the selected quote row.' />
    </Horizontal>
  )
}
