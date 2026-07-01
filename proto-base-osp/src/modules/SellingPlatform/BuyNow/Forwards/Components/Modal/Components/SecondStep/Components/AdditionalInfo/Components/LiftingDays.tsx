import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { getNumSign } from '@utils/index'
import { Form, Select } from 'antd'
import React from 'react'

export function LiftingDays({ allowedPriceAdjustments }) {
  return (
    <Horizontal verticalCenter className='my-4'>
      <Texto style={{ width: 200 }}>LIFTING DAYS</Texto>

      <Form.Item name='PriceAdjustmentId' style={{ flex: 1 }}>
        <Select
          placeholder='Select lifting days'
          size='middle'
          options={allowedPriceAdjustments.map((item) => ({
            key: item.key,
            value: item.key,
            label: `${item?.Duration} Days: ${getNumSign(item?.AdjustmentPrice)}${fmt.currency(item?.AdjustmentPrice)}`,
          }))}
        />
      </Form.Item>
    </Horizontal>
  )
}
