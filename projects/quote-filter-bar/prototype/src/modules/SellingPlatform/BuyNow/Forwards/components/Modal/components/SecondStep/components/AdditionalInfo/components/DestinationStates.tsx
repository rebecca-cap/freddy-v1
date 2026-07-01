import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

const { Option } = Select

export function DestinationStates({ orderEntryInfo }) {
  return (
    <Horizontal verticalCenter className='mb-4'>
      <Texto style={{ width: 200 }}>DESTINATION STATES</Texto>
      <Form.Item
        name='DestinationStatesIds'
        rules={[{ required: true, message: 'Destination State(s) must be chosen' }]}
        style={{ flex: 1 }}
      >
        <Select placeholder='Select Destination State(s)' mode='multiple' allowClear size='middle'>
          {orderEntryInfo?.Data?.SelectedItems[0]?.DestinationLocations.map((item, i) => (
            <Option key={item.LocationId} value={item.LocationId}>
              {item.LocationName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Horizontal>
  )
}
