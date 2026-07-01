import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

export function DestinationStates({ orderEntryInfo }) {
  return (
    <Horizontal verticalCenter className='mb-4'>
      <Texto style={{ width: 200 }}>DESTINATION STATES</Texto>
      <Form.Item
        name='DestinationStatesIds'
        rules={[{ required: true, message: 'Destination State(s) must be chosen' }]}
        style={{ flex: 1 }}
      >
        <Select
          placeholder='Select Destination State(s)'
          mode='multiple'
          allowClear
          size='middle'
          options={orderEntryInfo?.Data?.SelectedItems[0]?.DestinationLocations.map((item) => ({
            key: item.LocationId,
            value: item.LocationId,
            label: item.LocationName,
          }))}
        />
      </Form.Item>
    </Horizontal>
  )
}
