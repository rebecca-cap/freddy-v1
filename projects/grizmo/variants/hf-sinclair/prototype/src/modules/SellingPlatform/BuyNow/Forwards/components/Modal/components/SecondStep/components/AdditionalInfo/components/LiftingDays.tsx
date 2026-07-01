import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { getNumSign } from '@utils/index'
import { Form, Select } from 'antd'
import React from 'react'

const { Option } = Select

export function LiftingDays({ allowedPriceAdjustments }) {
  return (
    <Horizontal verticalCenter className='my-4'>
      <Texto style={{ width: 200 }}>LIFTING DAYS</Texto>

      <Form.Item name='PriceAdjustmentId' style={{ flex: 1 }}>
        <Select placeholder='Select lifting days' size='middle'>
          {allowedPriceAdjustments.map((item, i) => (
            <Option key={item.key} value={item.key}>
              {item?.Duration} Days: {`${getNumSign(item?.AdjustmentPrice)}${fmt.currency(item?.AdjustmentPrice)}`}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Horizontal>
  )
}
