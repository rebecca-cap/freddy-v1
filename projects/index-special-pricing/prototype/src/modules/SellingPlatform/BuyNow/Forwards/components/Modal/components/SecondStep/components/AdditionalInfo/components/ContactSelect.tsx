import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

import { createSelectList } from '../../../utils.js'

export function ContactSelect({ orderEntryInfo }) {
  const externalColleagueOverrideList = createSelectList(orderEntryInfo?.Data?.ExternalColleagueOverrideList)
  return (
    <Vertical gap={5}>
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
            return (option?.label as string)?.toLowerCase().includes(value.toLowerCase())
          }}
          options={externalColleagueOverrideList.map((item) => ({
            key: item.key,
            value: item.key,
            label: item.value,
          }))}
        />
      </Form.Item>
    </Vertical>
  )
}
