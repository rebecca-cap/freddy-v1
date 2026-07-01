import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

const { Option } = Select

export function InternalCounterparty({ selectedItemMeta }) {
  return (
    <Horizontal alignItems='center' justifyContent='space-between' className='mt-3 '>
      <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
        Internal Counterparty
      </Texto>

      <Form.Item
        name='InternalCounterPartyId'
        style={{ width: '60%' }}
        rules={[{ required: true, message: 'Please select an internal counterparty' }]}
        className='test-InternalCounterpartySelect'
      >
        <Select
          showSearch
          placeholder='Select internal counterparty'
          style={{ minWidth: '100%' }}
          filterOption={(value, option) => {
            return option?.children?.toLowerCase().includes(value.toLowerCase())
          }}
        >
          {selectedItemMeta?.InternalCounterPartyOverride.map((item, index) => (
            <Option className={`test-InternalCounterpartyOption-${index}`} key={item.key} value={item.key}>
              {item.value}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Horizontal>
  )
}
