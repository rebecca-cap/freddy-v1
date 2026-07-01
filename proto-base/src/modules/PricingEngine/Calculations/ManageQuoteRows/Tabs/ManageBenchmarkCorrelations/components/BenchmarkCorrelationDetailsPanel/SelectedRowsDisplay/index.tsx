import { BenchmarkCorrelation } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/api/schema.types'
import { MultipleRowsDisplay } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/BenchmarkCorrelationDetailsPanel/SelectedRowsDisplay/MultipleRowsDisplay'
import { SingleRowDisplay } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/BenchmarkCorrelationDetailsPanel/SelectedRowsDisplay/SingleRowDisplay'
import React from 'react'

type SelectedRowsDisplayProps = {
  updateAssignedBenchmarks: boolean
  selectedRows: BenchmarkCorrelation[]
}

export function SelectRowsDisplay({ updateAssignedBenchmarks, selectedRows }: SelectedRowsDisplayProps) {
  const singleRowSelected = selectedRows?.length === 1

  if (singleRowSelected) {
    const selectedRow = selectedRows[0]

    return <SingleRowDisplay selectedRow={selectedRow} />
  }

  return <MultipleRowsDisplay selectedRows={selectedRows} updateAssignedBenchmarks={updateAssignedBenchmarks} />
}
