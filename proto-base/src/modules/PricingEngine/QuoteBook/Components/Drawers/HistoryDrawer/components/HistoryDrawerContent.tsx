import { BarChartOutlined, DollarCircleFilled, PercentageOutlined } from '@ant-design/icons'
import { AgainstType } from '@api/useQuoteBookAnalytics/response'
import { Horizontal, useLocalStorage, Vertical } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { QuoteHistoryResponse } from '@modules/PricingEngine/QuoteBook/Components/Drawers/HistoryDrawer/api/schema.types'
import { QuoteHistoryGrid } from '@modules/PricingEngine/QuoteBook/Components/Drawers/HistoryDrawer/components/Grid'
import React, { useMemo, useState } from 'react'

import { QuoteHistoryChart } from './Chart'
import { HistoryDrawerHeader } from './HistoryDrawerHeader'

interface QuoteBookHistoryDrawerProps {
  history?: QuoteHistoryResponse
  metadata?: any
  quoteHistoryHeaderInfo?: Quote
  isFetchingHistory: boolean
}

// TODO: type of metadata
export function HistoryDrawerContent({
  history,
  metadata,
  quoteHistoryHeaderInfo,
  isFetchingHistory,
}: QuoteBookHistoryDrawerProps) {
  const [selectedBenchmark, setSelectedBenchmark] = useState(metadata?.Benchmarks[0]?.Value)
  const { value: selectedAgainst, setValue: setSelectedAgainst } = useLocalStorage(
    'QuoteHistoryAgainst',
    'Liftings' as AgainstType
  )

  const againstOptions = [
    { text: 'Liftings', value: 'Liftings', icon: <BarChartOutlined className='mr-2' /> },
    { text: 'Margin', value: 'Margin', icon: <PercentageOutlined className='mr-2' /> },
    { text: 'Profit', value: 'Profit', icon: <DollarCircleFilled className='mr-2' /> },
  ]

  const getGraphData = () => {
    const historyData = history?.Data?.Rows

    if (historyData?.length) {
      const data = historyData.map((row) => {
        const benchmark = row.Benchmarks.find((bm) => bm.BenchmarkId?.toString() === selectedBenchmark?.toString())
        return {
          Date: row.StartDate,
          [selectedAgainst]: row[selectedAgainst],
          Price: row.LastPrice,
          Benchmark: benchmark?.Value,
        }
      })
      return data.reverse()
    }
    return []
  }

  const graphData = useMemo(() => {
    return getGraphData()
  }, [selectedBenchmark, selectedAgainst, history?.Data?.Rows])

  return (
    <Horizontal fullHeight className='full-height-width' flex={1}>
      <Vertical className='bg-1'>
        <HistoryDrawerHeader quoteHistoryHeaderInfo={quoteHistoryHeaderInfo} />
        <QuoteHistoryChart
          isFetchingHistory={isFetchingHistory}
          graphData={graphData} // This looks weird, but the original row is sorted by date, so we need to reverse for the chart
          metadata={metadata}
          selectedBenchmark={selectedBenchmark}
          setSelectedBenchmark={setSelectedBenchmark}
          selectedAgainst={selectedAgainst}
          setSelectedAgainst={setSelectedAgainst}
          againstOptions={againstOptions}
        />
        <Horizontal flex={5} height={600}>
          <div style={{ width: '100%' }}>
            <QuoteHistoryGrid
              isFetchingHistory={isFetchingHistory}
              history={history}
              quoteHistoryHeaderInfo={quoteHistoryHeaderInfo}
              metadata={metadata}
            />
          </div>
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
