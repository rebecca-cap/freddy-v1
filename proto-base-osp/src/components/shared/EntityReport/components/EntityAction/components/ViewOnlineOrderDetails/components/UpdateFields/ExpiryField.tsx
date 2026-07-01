import { dateFormat } from '@components/TheArmory/helpers'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import type { Model } from '@hooks/useOnlineOrderViewTypes'
import { DatePicker, Form } from 'antd'
import dayjs from '@utils/dayjs'
import React from 'react'

export function ExpiryField({ canWrite, orderDetails }: { canWrite: boolean; orderDetails: Model }) {
  return (
    <Horizontal  justifyContent='flex-end'>
      <Form.Item
          label={<Texto category={'p2'} weight={'bold'}>Expiry ({serverTimeZoneAlias})</Texto>} name='TradeEntryExpiry' rules={[{ required: true, message: 'Date selection is required' }]}>
        <DatePicker
          format={dateFormat.SHORT_DATE_YEAR_TIME_V2}
          showTime
          use12Hours
          placeholder='Select Date and Time'
          disabled={!canWrite}
          disabledDate={(date) => date.isAfter(dayjs(orderDetails?.MaximumBidExpiration))}
          size='small'
          className='border-radius-5'
          style={{ width: '160px' }}
        />
      </Form.Item>
    </Horizontal>
  )
}
