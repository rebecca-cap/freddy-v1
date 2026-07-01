import { BenchmarkSelectionDTO } from '@api/useQuoteBookAnalytics/response'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { Select } from 'antd'
import React, { useMemo } from 'react'

interface BenchmarkComparisonSelectionProps {
  benchmarkSelection?: BenchmarkSelectionDTO
  onBenchmarkChange: (benchmarkId: number) => void
  selectedRow: Quote
}

function BenchmarkComparisonSelection({
  benchmarkSelection,
  onBenchmarkChange,
  selectedRow,
}: BenchmarkComparisonSelectionProps) {
  const displayText = useMemo(() => {
    return `${selectedRow.ProductName} @ ${selectedRow.LocationName} ID:
    ${benchmarkSelection?.ComparisonTarget?.split(': ')?.[1]}`
  }, [selectedRow, benchmarkSelection])
  const selectOptions = useMemo(() => {
    if (!benchmarkSelection?.AvailableBenchmarks) return []
    return benchmarkSelection.AvailableBenchmarks.sort((a, b) => a.BenchmarkName.localeCompare(b.BenchmarkName)).map(
      (benchmark) => ({
        label: (
          <Texto weight='normal' className='mr-4'>
            {benchmark.BenchmarkName}
          </Texto>
        ),
        value: benchmark.BenchmarkId,
      })
    )
  }, [benchmarkSelection?.AvailableBenchmarks])
  return (
    <Horizontal verticalCenter>
      <Texto>{displayText}</Texto>
      <Texto className='mx-4'>vs.</Texto>
      <Select
        value={benchmarkSelection?.RequestedBenchmarkId}
        onChange={onBenchmarkChange}
        bordered={false}
        dropdownStyle={{ minWidth: '200px' }}
        style={{ minWidth: '200px' }}
        options={selectOptions}
        optionLabelProp='label'
        className='benchmark-comparison-select'
        placeholder='Select Benchmark'
      />
    </Horizontal>
  )
}

export { BenchmarkComparisonSelection }
