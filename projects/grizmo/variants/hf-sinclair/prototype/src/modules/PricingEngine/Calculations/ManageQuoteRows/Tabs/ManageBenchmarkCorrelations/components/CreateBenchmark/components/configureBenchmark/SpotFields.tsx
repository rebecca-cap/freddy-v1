import { BenchmarkMetadataResponse } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/api/schema.types'
import { PublisherSelectField } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/PublisherSelectField'
import React from 'react'

export interface SpotFieldsProps {
  metadata?: BenchmarkMetadataResponse
}
export function SpotFields({ metadata }: SpotFieldsProps) {
  return <PublisherSelectField metadata={metadata} />
}
