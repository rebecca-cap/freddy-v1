import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  BenchmarkCorrelation,
  benchmarkKeys,
  BenchmarkMetadataBenchmarkItem,
  BenchmarkTypes,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/api/schema.types'
import {
  getBenchmarkSelectOptions,
  getSelectBenchmarkPlaceholder,
  isDisplayed,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/util'
import { Form, Select } from 'antd'
import React, { useEffect, useMemo } from 'react'

type SelectBenchmarkProps = {
  selectedRows: BenchmarkCorrelation[]
  selectedType: BenchmarkTypes
  benchmarkList: BenchmarkMetadataBenchmarkItem[]
  setForm: () => void
}

export function SelectBenchmark({ selectedRows, selectedType, benchmarkList, setForm }: SelectBenchmarkProps) {
  const singleRowSelected = selectedRows?.length === 1

  const selectOptions = useMemo(() => {
    return getBenchmarkSelectOptions(benchmarkList)
  }, [benchmarkList, selectedType])

  useEffect(() => {
    setForm()
    // set form to all the default values
  }, [selectedRows])

  return (
    <Horizontal verticalCenter className='px-4 p-2 mx-2'>
      <Vertical>
        <Texto className='mb-2 ' weight={singleRowSelected ? 500 : 900}>
          {singleRowSelected ? 'Current Benchmark' : 'Select New Benchmark'}
        </Texto>
        {benchmarkKeys?.map((key) => {
          return (
            <Form.Item name={key} key={key} style={{ display: isDisplayed(key, selectedType) }}>
              <Select
                showSearch
                allowClear
                options={selectOptions}
                placeholder={getSelectBenchmarkPlaceholder(selectedType)}
                filterOption={(input, option) => {
                  const label = typeof option?.label === 'string' ? option.label : ''
                  return label.toLowerCase().includes(input.toLowerCase())
                }}
              />
            </Form.Item>
          )
        })}
      </Vertical>
    </Horizontal>
  )
}
