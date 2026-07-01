import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

export function PreferredTerminals({ orderEntryInfo }) {
  return (
    <Horizontal verticalCenter className='my-4'>
      <Texto style={{ width: 200 }}>PREFERRED TERMINALS</Texto>
      <Form.Item
        name='LiftingLocationIds'
        rules={[{ required: true, message: 'Preferred Terminals(s) must be chosen' }]}
        style={{ flex: 1 }}
      >
        <Select
          placeholder='Select preferred terminals'
          allowClear
          size='middle'
          mode='multiple'
          options={orderEntryInfo?.Data?.SelectedItems[0].LiftingLocations.map((item) => ({
            key: item.key,
            value: item.key,
            label: item.LocationName,
          }))}
        />
      </Form.Item>
    </Horizontal>
  )
}
