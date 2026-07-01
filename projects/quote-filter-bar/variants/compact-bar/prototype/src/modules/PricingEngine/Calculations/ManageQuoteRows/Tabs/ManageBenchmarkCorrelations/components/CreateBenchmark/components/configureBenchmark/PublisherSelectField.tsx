import { Texto } from '@gravitate-js/excalibrr'
import { BenchmarkMetadataResponse } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/api/schema.types'
import { toAntOption } from '@utils/index'
import { Form, Select } from 'antd'
import React, { useMemo } from 'react'

export interface PublisherSelectFieldProps {
  metadata?: BenchmarkMetadataResponse
  isDisabled?: boolean
  placeholder?: string
  mode?: 'multiple' | undefined
  noLabel?: boolean
  index?: number
  selectedPricePublisherIds?: string[]
}
export function PublisherSelectField({
  metadata,
  isDisabled,
  placeholder,
  mode,
  noLabel,
  index,
  selectedPricePublisherIds,
}: PublisherSelectFieldProps) {
  const pricePublisherOptions = useMemo(() => {
    return metadata?.Data.PricePublishers.map(toAntOption) || []
  }, [metadata])
  const name = index !== undefined ? [index, 'PricePublisherId'] : 'PricePublisherId'
  return (
    <>
      {!noLabel && <Texto className='mt-1'>Price Publisher</Texto>}
      <Form.Item name={name} className='w-full my-2' rules={[{ required: true, message: 'Please choose a publisher' }]}>
        <Select
          options={pricePublisherOptions}
          allowClear
          placeholder={placeholder || 'Choose a price publisher'}
          disabled={isDisabled}
          mode={mode}
          showSearch
          filterOption={(input, option) =>
            option?.label.toLowerCase().includes(input.toLowerCase()) ||
            option?.value.toString().toLowerCase().includes(input.toLowerCase())
          }
        />
      </Form.Item>
    </>
  )
}
