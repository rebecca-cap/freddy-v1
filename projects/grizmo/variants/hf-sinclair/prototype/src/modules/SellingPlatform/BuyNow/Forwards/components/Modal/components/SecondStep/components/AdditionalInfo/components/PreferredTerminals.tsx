import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

const { Option } = Select

export function PreferredTerminals({ orderEntryInfo }) {
  return (
    <Horizontal verticalCenter className='my-4'>
      <Texto style={{ width: 200 }}>PREFERRED TERMINALS</Texto>
      <Form.Item
        name='LiftingLocationIds'
        rules={[{ required: true, message: 'Preferred Terminals(s) must be chosen' }]}
        style={{ flex: 1 }}
      >
        <Select placeholder='Select preferred terminals' allowClear size='middle' mode='multiple'>
          {orderEntryInfo?.Data?.SelectedItems[0].LiftingLocations.map((item, i) => (
            <Option key={item.key} value={item.key}>
              {item.LocationName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Horizontal>
  )
}
