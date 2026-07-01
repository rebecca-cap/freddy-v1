import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  benchmarkKeyMap,
  BenchmarkTypes,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/api/schema.types'
import { Segmented } from 'antd'
import React, { SetStateAction } from 'react'

type SelectBenchmarkTypeProps = {
  selectedType: BenchmarkTypes
  setSelectedType: React.Dispatch<SetStateAction<BenchmarkTypes>>
}

export function SelectBenchmarkType({ selectedType, setSelectedType }: SelectBenchmarkTypeProps) {
  const typeOptions = Object.keys(benchmarkKeyMap)

  return (
    <Horizontal className='p-2'>
      <Vertical className='px-4'>
        <Horizontal>
          <Texto>Benchmark Type</Texto>
        </Horizontal>
        <Horizontal className='mt-2'>
          <Segmented
            className='segment'
            block
            options={typeOptions}
            size='large'
            defaultValue={benchmarkKeyMap[selectedType]}
            value={selectedType}
            onChange={(val) => setSelectedType(val as BenchmarkTypes)}
          />
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
