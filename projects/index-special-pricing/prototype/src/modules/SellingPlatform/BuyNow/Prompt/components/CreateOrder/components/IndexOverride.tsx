import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, InputNumber } from 'antd'
import React from 'react'

export function IndexOverride() {
  return (
    <Horizontal
      className='test-IndexOverride mx-4 my-3 justify-sb'
      verticalCenter
      style={{ textAlign: 'right', alignItems: 'right', alignContent: 'right' }}
    >
      <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
        Index Override
      </Texto>
      <Form.Item
        name='IndexPrice'
        style={{ minWidth: '50%', textAlign: 'right', alignItems: 'right', alignContent: 'right' }}
      >
        <InputNumber
          controls={false}
          style={{
            minWidth: '100%',
            textAlign: 'right',
          }}
          precision={fmt.currentPrecision}
          prefix='$'
          step={`.${'0'.repeat((fmt.currentPrecision || 4) - 1) + '1'}`}
        />
      </Form.Item>
    </Horizontal>
  )
}
