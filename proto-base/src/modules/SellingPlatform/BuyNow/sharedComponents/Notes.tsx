import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, Input } from 'antd'
import React from 'react'

const { TextArea } = Input

export function Notes({ isPriceExpired, form }) {
  return (
    <Horizontal className='test-Notes justify-sb mt-1 '>
      <Vertical flex={0.25}>
        <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
          Notes
        </Texto>
      </Vertical>
      <Vertical flex={0.75}>
        <Form.Item name='Notes' style={{ minWidth: '70%', minHeight: 80 }}>
          <TextArea
            disabled={isPriceExpired && form.getFieldValue('Type') !== 'bid'}
            className='form-text-area'
            placeholder='Enter notes'
            maxLength={255}
            autoSize={{ minRows: 2, maxRows: 2 }}
            allowClear
            showCount
            style={{ display: isPriceExpired && form.getFieldValue('Type') !== 'bid' ? 'none' : undefined }}
          />
        </Form.Item>
      </Vertical>
    </Horizontal>
  )
}
