import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Select } from 'antd'
import React from 'react'

export function LoadingNumbers({ orderEntryInfo }) {
  return (
    <Horizontal verticalCenter className='mb-4'>
      <Texto style={{ width: 200 }}>LOAD NUMBERS</Texto>
      <Form.Item
        name='LoadingNumbersIds'
        rules={[{ required: true, message: 'Loading number(s) must be chosen' }]}
        style={{ flex: 1 }}
      >
        <Select
          placeholder='Select Loading Number(s) '
          mode={orderEntryInfo?.Data?.SelectedItems[0].Constraints.AllowMultipleLoadingNumbers ? 'multiple' : undefined}
          allowClear
          size='middle'
          showSearch
          filterOption={(input, option) =>
            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
          }
          options={orderEntryInfo?.Data?.SelectedItems[0]?.LoadingNumbersList.map((item) => ({
            key: item.LoadingNumberId,
            value: item.LoadingNumberId,
            label: item.Display,
          }))}
        />
      </Form.Item>
    </Horizontal>
  )
}
