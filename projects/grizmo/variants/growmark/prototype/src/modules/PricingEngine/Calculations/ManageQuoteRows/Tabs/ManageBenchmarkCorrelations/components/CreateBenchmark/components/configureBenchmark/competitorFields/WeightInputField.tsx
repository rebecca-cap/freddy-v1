import { Form, InputNumber } from 'antd'
import React from 'react'

export function PercentageInputField({ index }: { index: number }) {
  return (
    <Form.Item
      className='my-2'
      name={[index, 'Percentage']}
      rules={[{ required: true, message: 'Please enter a percentage' }]}
      initialValue={0}
    >
      <InputNumber prefix='%' precision={2} min={0} placeholder='0.00' max={100} />
    </Form.Item>
  )
}
