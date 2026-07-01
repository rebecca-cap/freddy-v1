import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

import { createSelectList } from '../../../utils.js'

const { Option } = Select

export function ContactSelect({ orderEntryInfo }) {
  const externalColleagueOverrideList = createSelectList(orderEntryInfo?.Data?.ExternalColleagueOverrideList)
  return (
    <Vertical style={{ gap: 5 }}>
      <Texto category='p2'>CONTACT</Texto>
      <Form.Item
        name='ExternalColleagueId'
        rules={[{ required: true, message: 'Please select a contact' }]}
        style={{ width: '100%' }}
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
          {externalColleagueOverrideList.map((item) => (
            <Option key={item.key} value={item.key}>
              {item.value}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Vertical>
  )
}
