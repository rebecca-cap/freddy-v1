import { Vertical } from '@gravitate-js/excalibrr'
import { Form, Radio, Skeleton } from 'antd'
import React from 'react'

export function ContractTypeCheckboxGroup({ metadata, disableFields }) {
  if (!metadata) {
    return <Skeleton active />
  }

  return (
    <Vertical style={{ gap: 16 }}>
      <Form.Item
        rules={[{ required: true, message: 'Contract Type is required' }]}
        style={{ width: '100%' }}
        name='TradeInstrumentId'
      >
        <Radio.Group disabled={disableFields} name='TradeInstrumentId'>
          {metadata?.TradeInstrumentList.map((option) => {
            return (
              <Radio key={option.Value} className='trade-instrument-radio' value={parseInt(option.Value)}>
                {option.Text}
              </Radio>
            )
          })}
        </Radio.Group>
      </Form.Item>
    </Vertical>
  )
}
