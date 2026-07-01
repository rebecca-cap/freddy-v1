import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

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
            return (option?.label as string)?.toLowerCase().includes(value.toLowerCase())
          }}
          options={selectedItemMeta?.InternalCounterPartyOverride.map((item, index) => ({
            key: item.key,
            value: item.key,
            label: item.value,
            className: `test-InternalCounterpartyOption-${index}`,
          }))}
        />
      </Form.Item>
    </Horizontal>
  )
}
