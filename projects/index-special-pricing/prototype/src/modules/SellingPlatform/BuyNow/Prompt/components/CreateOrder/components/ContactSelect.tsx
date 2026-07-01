import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

export function ContactSelect({ selectedItemMeta }) {
  return (
    <Horizontal alignItems='center' justifyContent='space-between' className='mt-2 '>
      <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
        Contact
      </Texto>

      <Form.Item
        name='ExternalColleagueId'
        rules={[{ required: true, message: 'Please select a contact' }]}
        style={{ width: '60%' }}
      >
        <Select
          showSearch
          placeholder='Select contact'
          style={{ minWidth: '100%' }}
          className='test-Contact'
          filterOption={(value, option) => {
            return (option?.label as string)?.toLowerCase().includes(value.toLowerCase())
          }}
          options={selectedItemMeta?.ExternalColleagueOverride.map((item) => ({
            key: item.key,
            value: item.key,
            label: item.value,
          }))}
        />
      </Form.Item>
    </Horizontal>
  )
}
