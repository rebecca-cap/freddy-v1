import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

const { Option } = Select

export function LoadingNumbers({ selectedItemMeta }) {
  return (
    <Horizontal className='justify-sb mt-1' style={{ marginTop: -10 }} verticalCenter>
      <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
        Loading Numbers
      </Texto>
      <Form.Item
        name='LoadingNumbersIds'
        style={{ minWidth: '70%' }}
        rules={[{ required: true, message: 'Loading number(s) must be chosen' }]}
      >
        <Select
          placeholder='Select Loading Number(s) '
          mode={selectedItemMeta?.Constraints.AllowMultipleLoadingNumbers ? 'multiple' : undefined}
          allowClear
          showSearch
          filterOption={(input, option) =>
            option?.children?.toString().toLowerCase().includes(input.toLowerCase())
          }
        >
          {selectedItemMeta?.LoadingNumbersList.map((item, i) => (
            <Option key={item.key} value={item.key}>
              {item.Display}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Horizontal>
  )
}
