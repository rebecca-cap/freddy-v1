import { usePromptContext } from '@contexts/PromptContext'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { DatePicker, Form } from 'antd'
import moment from 'moment'
import React from 'react'

export function BidExpiration({ form }) {
  const { selectedItemMeta } = usePromptContext()
  return (
    <Horizontal
      className='test-BidExpiration mt-2 mx-4 mb-3 justify-sb my-3'
      verticalCenter
      style={{ textAlign: 'center' }}
    >
      <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
        Bid Expiration
      </Texto>
      <Form.Item
        name='BidExpiration'
        style={{ width: '50%' }}
        rules={[{ required: true, message: 'Date selection is required' }]}
        initialValue={moment(selectedItemMeta?.Defaults.DefaultBidExpiryDateTime)}
      >
        <DatePicker
          format='MM/DD/YYYY: hh:mm a'
          style={{ width: '100%' }}
          showTime={{ format: 'HH:mm' }}
          use12Hours
          disabledDate={(date) => date.isAfter(moment(selectedItemMeta?.Constraints.MaximumBidExpiration))}
          onSelect={(value) => {
            form.setFieldsValue({ ExpirationDate: moment(value, 'MM/DD/YYYY: hh:mm a') })
          }}
          placeholder='Select Date and Time'
        />
      </Form.Item>
    </Horizontal>
  )
}
