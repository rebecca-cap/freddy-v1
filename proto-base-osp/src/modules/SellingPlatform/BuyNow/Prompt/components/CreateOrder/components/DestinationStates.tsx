import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

export function DestinationStates({ selectedItemMeta }) {
  return (
    <Horizontal className='justify-sb mt-1' style={{ marginTop: -10 }} verticalCenter>
      <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
        Destination State
      </Texto>
      <Form.Item
        name='DestinationStatesIds'
        style={{ minWidth: '70%' }}
        rules={[{ required: true, message: 'Destination State(s) must be chosen' }]}
      >
        <Select
          placeholder='Select Destination State(s)'
          allowClear
          mode='multiple'
          options={selectedItemMeta?.DestinationStates.map((item) => ({
            key: item.LocationId,
            value: item.LocationId,
            label: item.LocationName,
          }))}
        />
      </Form.Item>
    </Horizontal>
  )
}
