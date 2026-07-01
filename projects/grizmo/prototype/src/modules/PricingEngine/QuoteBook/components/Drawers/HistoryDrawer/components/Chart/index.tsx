import { AgainstType } from '@api/useQuoteBookAnalytics/response'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { ChartController } from '@modules/PricingEngine/QuoteBook/components/Drawers/HistoryDrawer/components/Chart/ChartController'
import { HistoryChart } from '@modules/PricingEngine/QuoteBook/components/Drawers/HistoryDrawer/components/Chart/HistoryChart'
import React from 'react'

interface QuoteHistoryChartProps {
  graphData: any
  metadata: any
  selectedBenchmark: string
  setSelectedBenchmark: React.Dispatch<React.SetStateAction<string>>
  selectedAgainst: string
  setSelectedAgainst: React.Dispatch<React.SetStateAction<AgainstType>>
  againstOptions: any
  isFetchingHistory: boolean
}

export function QuoteHistoryChart({
  graphData,
  metadata,
  selectedBenchmark,
  setSelectedBenchmark,
  selectedAgainst,
  setSelectedAgainst,
  againstOptions,
  isFetchingHistory,
}: QuoteHistoryChartProps) {
  return (
    <Horizontal style={{ minHeight: '300px', maxHeight: '300px', minWidth: '1000px' }}>
      <Vertical style={{ minWidth: '300px', maxWidth: '300px' }}>
        <ChartController
          benchmarks={metadata?.Benchmarks}
          againstOptions={againstOptions}
          selectedBenchmark={selectedBenchmark}
          setSelectedBenchmark={setSelectedBenchmark}
          selectedAgainst={selectedAgainst}
          setSelectedAgainst={setSelectedAgainst}
        />
      </Vertical>
      <Vertical className='bg-1'>
        <HistoryChart
          graphData={graphData}
          isFetchingHistory={isFetchingHistory}
          selectedBenchmark={selectedBenchmark}
          selectedAgainst={selectedAgainst}
          metadata={metadata}
          againstOptions={againstOptions}
        />
      </Vertical>
    </Horizontal>
  )
}
