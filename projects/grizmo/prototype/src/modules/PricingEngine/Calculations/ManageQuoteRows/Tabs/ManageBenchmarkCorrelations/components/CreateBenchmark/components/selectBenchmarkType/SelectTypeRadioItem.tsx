import { Texto } from '@gravitate-js/excalibrr'
import { benchMarkTypeDescriptions } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/util'
import { BenchmarkTypes } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/types/page.types'
import { Radio } from 'antd'
import React from 'react'

export interface SelectTypeRadioItemProps {
  selectedType: BenchmarkTypes
  typeName: BenchmarkTypes
}

export function SelectTypeRadioItem({ selectedType, typeName }: SelectTypeRadioItemProps) {
  return (
    <Radio
      value={typeName}
      className={`p-4 bordered max-content-width mb-2 ${selectedType === typeName ? 'primary-bg' : ''}`}
    >
      <Texto category='h5'>{typeName} Benchmark</Texto>
      <Texto>Base pricing on {benchMarkTypeDescriptions[typeName]}</Texto>
    </Radio>
  )
}
