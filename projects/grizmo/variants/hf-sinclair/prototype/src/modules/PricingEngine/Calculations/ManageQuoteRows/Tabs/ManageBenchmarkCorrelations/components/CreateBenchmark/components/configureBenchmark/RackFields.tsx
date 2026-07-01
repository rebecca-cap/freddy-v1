import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { BenchmarkMetadataResponse } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/api/schema.types'
import { PublisherSelectField } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/PublisherSelectField'
import { Form, Radio } from 'antd'
import React from 'react'

export interface RackFieldsProps {
  metadata?: BenchmarkMetadataResponse
}
export function RackFields({ metadata }: RackFieldsProps) {
  return (
    <>
      <Texto className='mb-1'>Benchmark type</Texto>
      <Form.Item name='RackType' className='mb-4 w-50' rules={[{ required: true, message: 'Please choose a type' }]}>
        <Radio.Group className='w-ful' name='RackType'>
          <Vertical>
            <Radio value='RackLow' className='p-1'>
              Rack low (lowest competitor)
            </Radio>
            <Radio value='RackAverage' className='p-1'>
              Rack average (all competitors)
            </Radio>
          </Vertical>
        </Radio.Group>
      </Form.Item>
      <PublisherSelectField metadata={metadata} />
    </>
  )
}
