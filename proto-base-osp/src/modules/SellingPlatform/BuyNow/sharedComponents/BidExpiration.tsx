import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { DatePicker, Form } from 'antd'
import dayjs from '@utils/dayjs'
import { stripTimezoneOffset } from '@utils/timezone'
import React from 'react'

interface BidExpirationProps {
  form: any
  selectedItemMeta: any
  layout?: 'horizontal' | 'vertical'
  width?: number
}

export function BidExpiration({ form, selectedItemMeta, layout = 'horizontal', width = 100 }: BidExpirationProps) {
  const pickerWidth = layout === 'horizontal' ? '50%' : `${width}%`
  const defaultBidExpiryRaw = selectedItemMeta?.Defaults?.DefaultBidExpiryDateTime
  const defaultBidExpiry = defaultBidExpiryRaw
    ? dayjs(stripTimezoneOffset(defaultBidExpiryRaw))
    : undefined
  const datePicker = (
    <Form.Item
      name='BidExpiration'
      style={{ width: pickerWidth }}
      rules={[{ required: true, message: 'Date selection is required' }]}
      initialValue={defaultBidExpiry}
    >
      <DatePicker
        format='MM/DD/YYYY hh:mm a'
        style={{ width: '100%' }}
        showTime={{ format: 'HH:mm' }}
        use12Hours
        disabledDate={(date) => date.isAfter(dayjs(selectedItemMeta?.Constraints?.MaximumBidExpiration))}
        onSelect={(value) => {
          form.setFieldsValue({ ExpirationDate: dayjs(value, 'MM/DD/YYYY hh:mm a') })
        }}
        placeholder='Select Date and Time'
      />
    </Form.Item>
  )

  if (layout === 'vertical') {
    return (
      <Vertical className='mt-4'>
        <Texto className='mb-2' category='h6'>
          Bid Expiration ({serverTimeZoneAlias})
        </Texto>
        {datePicker}
      </Vertical>
    )
  }

  return (
    <Horizontal
      className='test-BidExpiration mt-2 mx-4 mb-3 justify-sb my-3'
      verticalCenter
      style={{ textAlign: 'center' }}
    >
      <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
        Bid Expiration ({serverTimeZoneAlias})
      </Texto>
      {datePicker}
    </Horizontal>
  )
}
