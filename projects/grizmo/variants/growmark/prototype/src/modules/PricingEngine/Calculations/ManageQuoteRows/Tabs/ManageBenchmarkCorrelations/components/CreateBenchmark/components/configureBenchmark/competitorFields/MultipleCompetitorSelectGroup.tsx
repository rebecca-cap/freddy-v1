import { DeleteOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { BenchmarkMetadataResponse } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/api/schema.types'
import { CounterpartySelectField } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/competitorFields/CounterpartySelectField'
import { PercentageInputField } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/competitorFields/WeightInputField'
import { PublisherSelectField } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/PublisherSelectField'
import React from 'react'

export interface MultipleCompetitorSelectGroupProps {
  metadata?: BenchmarkMetadataResponse
  remove: (index: number) => void
  index: number
  length: number
  selectedPricePublisherIds: string[]
}
export function MultipleCompetitorSelectGroup({
  metadata,
  remove,
  index,
  length,
  selectedPricePublisherIds,
}: MultipleCompetitorSelectGroupProps) {
  return (
    <Horizontal
      className={`w-full multiple-competitor-rows ${index < length - 1 ? 'border-bottom' : ''}`}
      justifyContent='space-between'
    >
      <PublisherSelectField metadata={metadata} noLabel index={index} />
      <CounterpartySelectField
        metadata={metadata}
        noLabel
        index={index}
        selectedPricePublisherIds={selectedPricePublisherIds}
      />
      <PercentageInputField index={index} />

      <GraviButton
        className={`primary-color ghost-gravi-button my-2 ${index === 0 ? 'hidden' : ''}`}
        onClick={() => remove(index)}
        icon={<DeleteOutlined />}
      />
    </Horizontal>
  )
}
