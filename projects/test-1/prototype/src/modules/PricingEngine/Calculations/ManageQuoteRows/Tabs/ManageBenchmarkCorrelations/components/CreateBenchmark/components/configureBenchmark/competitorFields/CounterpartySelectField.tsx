import { Texto } from '@gravitate-js/excalibrr'
import { PublisherSelectFieldProps } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/PublisherSelectField'
import { toAntOption } from '@utils/index'
import { Form, Select } from 'antd'
import React, { useMemo } from 'react'

export function CounterpartySelectField({
  metadata,
  isDisabled,
  placeholder,
  mode,
  noLabel,
  index,
  selectedPricePublisherIds,
}: PublisherSelectFieldProps) {
  const counterpartyOptions = useMemo(() => {
    if (selectedPricePublisherIds?.length) {
      const selectedId = index !== undefined ? selectedPricePublisherIds[index] : selectedPricePublisherIds[0]
      return metadata?.Data.CounterParties.filter((cp) => cp?.GroupingValue === selectedId).map(toAntOption) || []
    }
    return []
  }, [metadata, selectedPricePublisherIds])
  const name = index !== undefined ? [index, 'CounterPartyId'] : 'CounterPartyId'
  return (
    <>
      {!noLabel && <Texto className='mt-4'>Counterparty</Texto>}
      <Form.Item
        name={name}
        className='my-2 w-full'
        rules={[{ required: true, message: 'Please choose a counterparty' }]}
      >
        <Select
          options={counterpartyOptions}
          allowClear
          placeholder={placeholder || 'Choose a counterparty'}
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
