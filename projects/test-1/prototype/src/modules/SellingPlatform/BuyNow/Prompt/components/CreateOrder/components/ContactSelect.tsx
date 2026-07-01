import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

const { Option } = Select

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
            return option?.children?.toLowerCase().includes(value.toLowerCase())
          }}
        >
          {selectedItemMeta?.ExternalColleagueOverride.map((item) => (
            <Option key={item.key} value={item.key}>
              {item.value}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Horizontal>
  )
}
