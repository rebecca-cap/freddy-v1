import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { BenchmarkMetadataResponse } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/api/schema.types'
import { CompetitorFields } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/competitorFields/CompetitorFields'
import { HierarchyFields } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/HierarchyFields'
import { RackFields } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/RackFields'
import { SpotFields } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/SpotFields'
import { benchmarkTypes } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/util'
import {
  BenchmarkTypes,
  CompetitorTypes,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/types/page.types'
import { Form, Input, InputNumber, Select } from 'antd'
import React from 'react'

export interface ConfigureBenchmarkProps {
  selectedType: BenchmarkTypes
  selectedCompetitorType: CompetitorTypes
  maxAvailable: number
  normalizeCompetitorWeights: () => void
  selectedPricePublisherIds: string[]
  metadata?: BenchmarkMetadataResponse
}
export function ConfigureBenchmark({
  selectedType,
  selectedCompetitorType,
  metadata,
  maxAvailable,
  normalizeCompetitorWeights,
  selectedPricePublisherIds,
}: ConfigureBenchmarkProps) {
  const differentialOptions = [
    { label: 'Add (+)', value: '+' },
    { label: 'Subtract (-)', value: '-' },
  ]
  return (
    <Horizontal justifyContent='center' alignItems='center'>
      <Vertical flex={1} alignItems='flex-start' className='max-content-width'>
        <Horizontal verticalCenter justifyContent='space-between'>
          <Texto>Benchmark Name </Texto>
        </Horizontal>
        <Form.Item
          className='w-full mb-4'
          name='Name'
          rules={[{ required: true, message: 'Please enter a benchmark name' }]}
        >
          <Input placeholder='Enter a name' className='w-full' maxLength={200} showCount />
        </Form.Item>

        {/* Hierarchy Selection Section */}
        <HierarchyFields metadata={metadata} />
        {selectedType === benchmarkTypes.Spot && <SpotFields metadata={metadata} />}
        {selectedType === benchmarkTypes.Rack && <RackFields metadata={metadata} />}
        {selectedType === benchmarkTypes.Competitor && (
          <CompetitorFields
            selectedCompetitorType={selectedCompetitorType}
            metadata={metadata}
            maxAvailable={maxAvailable}
            normalizeCompetitorWeights={normalizeCompetitorWeights}
            selectedPricePublisherIds={selectedPricePublisherIds}
          />
        )}
        <Vertical className='my-4 w-full'>
          <Horizontal className='mb-2 w-50' justifyContent='flex-start'>
            <Vertical flex={1} className='mr-4 w-full'>
              <Texto className='mb-1'>Differential</Texto>
              <Form.Item name='DifferentialSign' rules={[{ required: false }]}>
                <Select options={differentialOptions} allowClear />
              </Form.Item>
            </Vertical>
            <Vertical flex={1} className='w-full'>
              <Texto className='mb-1'>Amount ($)</Texto>
              <Form.Item name='DifferentialAmount' rules={[{ required: false }]} initialValue={0}>
                <InputNumber className='max-content-width' prefix='$' min={0} precision={fmt.currentPrecision} />
              </Form.Item>
            </Vertical>
          </Horizontal>
          <Texto className='mb-1'>
            Enter the amount to add or subtract from the {selectedType.toLowerCase()} price.
          </Texto>
        </Vertical>
      </Vertical>
    </Horizontal>
  )
}
