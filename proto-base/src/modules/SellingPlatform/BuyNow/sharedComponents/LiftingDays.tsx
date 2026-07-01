import { PriceAdjustment } from '@contexts/PromptContext/types.schema'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { getNumSign } from '@utils/index'
import { Form, Select } from 'antd'
import React from 'react'

const { Option } = Select
interface LiftingDaysProps {
  allowedPriceAdjustments: PriceAdjustment[]
  isPriceExpired: boolean
  isDateOverrideActive: boolean
}
export function LiftingDays({ allowedPriceAdjustments, isPriceExpired, isDateOverrideActive }: LiftingDaysProps) {
  return (
    <Horizontal className='mt-1 mx-4 justify-sb'>
      <Texto style={{ color: 'var(--theme-option)' }} category='p2'>
        Lifting Days
      </Texto>
      <Form.Item
        name='PriceAdjustmentId'
        style={{ minWidth: '50%' }}
        rules={[{ required: !isDateOverrideActive, message: 'Dates are required.' }]}
      >
        <Select placeholder='Select lifting days' disabled={isPriceExpired || isDateOverrideActive}>
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
