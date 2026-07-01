import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { DatePicker, Form } from 'antd'
import React from 'react'

export function FuturesMonth() {
  return (
    <Horizontal className='mx-4 mb-3 justify-sb' verticalCenter>
      <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
        Futures Month
      </Texto>
      <Form.Item name='FuturesMonth' style={{ width: '50%' }}>
        <DatePicker disabled format='MMM YYYY' style={{ width: '100%' }} placeholder='Select Date and Time' />
      </Form.Item>
    </Horizontal>
  )
}
