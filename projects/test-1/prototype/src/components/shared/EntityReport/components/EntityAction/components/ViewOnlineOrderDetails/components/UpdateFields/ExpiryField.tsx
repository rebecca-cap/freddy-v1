import { dateFormat } from '@components/TheArmory/helpers'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Model } from '@hooks/useOnlineOrderViewTypes'
import { DatePicker, Form } from 'antd'
import moment from 'moment'
import React from 'react'

export function ExpiryField({ canWrite, orderDetails }: { canWrite: boolean; orderDetails: Model }) {
  return (
    <Horizontal verticalCenter className='m-1' justifyContent='flex-end' style={{ minWidth: '200px' }}>
      <Texto category='p2' weight='bold' className='mr-3'>
        Expiry:
      </Texto>
      <Form.Item name='TradeEntryExpiry' rules={[{ required: true, message: 'Date selection is required' }]}>
        <DatePicker
          format={dateFormat.SHORT_DATE_YEAR_TIME_V2}
          showTime
          use12Hours
          placeholder='Select Date and Time'
          disabled={!canWrite}
          disabledDate={(date) => date.isAfter(moment(orderDetails?.MaximumBidExpiration))}
          size='small'
          className='border-radius-5'
          style={{ width: '160px' }}
        />
      </Form.Item>
    </Horizontal>
  )
}
