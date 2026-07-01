import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

import { createSelectList } from '../../../utils'

export function InternalCounterparty({ orderEntryInfo }) {
  const internalCounterPartyOverride = createSelectList(orderEntryInfo?.Data?.InternalCounterPartyOverrideList)

  return (
    <Vertical gap={5} className='mb-4'>
      <Texto category='p2'>INTERNAL COUNTERPARTY</Texto>
      <Form.Item
        name='InternalCounterPartyId'
        style={{ width: '100%' }}
        rules={[{ required: true, message: 'Please select an internal counterparty' }]}
        className='test-InternalCounterpartySelect'
      >
        <Select
          showSearch
          placeholder='Select internal counterparty'
          style={{ minWidth: '100%' }}
          filterOption={(value, option) => {
            return (option?.label as string)?.toLowerCase().includes(value.toLowerCase())
          }}
          options={internalCounterPartyOverride.map((item, index) => ({
            key: item.key,
            value: item.key,
            label: item.value,
            className: `test-InternalCounterpartyOption-${index}`,
          }))}
        />
      </Form.Item>
    </Vertical>
  )
}
