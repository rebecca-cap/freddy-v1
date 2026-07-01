import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

const { Option } = Select

export function PreferredTerminals({ selectedItemMeta }) {
  return (
    <Horizontal className='justify-sb mt-1' style={{ marginTop: -10 }} verticalCenter>
      <Texto category='p1' appearance='default'>
        Preferred Terminals
      </Texto>
      <Form.Item
        name='LiftingLocationIds'
        style={{ minWidth: '50%' }}
        rules={[{ required: true, message: 'Preferred Terminals(s) must be chosen' }]}
      >
        <Select placeholder='Select preferred terminals' allowClear size='small' mode='multiple'>
          {selectedItemMeta?.LiftingLocationsList.map((item, i) => (
            <Option key={item.key} value={item.key}>
              {item.LocationName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Horizontal>
  )
}
