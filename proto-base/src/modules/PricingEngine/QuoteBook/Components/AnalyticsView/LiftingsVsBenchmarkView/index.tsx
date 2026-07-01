import { useQuoteBookAnalyticsTyped } from '@api/useQuoteBookAnalytics/useQuoteBookAnalyticsTyped'
import { Horizontal, Texto, useLocalStorage, Vertical } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import React, { useState } from 'react'

import { Loading, NoData } from '../common/messageAskingUserToSelectAQuoteRow'
import { BenchmarkComparisonSelection } from './components/BenchmarkComparisonSelection'
import { HistogramGraph } from './components/HistogramGraph'
import { QuickMetrics } from './components/QuickMetrics'
import { SelectGraphView } from './components/SelectGraphView'
import { TrendDataGraph } from './components/TrendDataGraph'

interface LiftingVsBenchmarkViewProps {
  quoteRowId: number
  fromDate: Date
  toDate: Date
  selectedRow: Quote
}
export type GraphView = 'histogram' | 'trend'

function LiftingVsBenchmarkView({ quoteRowId, fromDate, toDate, selectedRow }: LiftingVsBenchmarkViewProps) {
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<number | null>(null)
  const { useQuoteAnalyticsLiftingVsBenchmark } = useQuoteBookAnalyticsTyped()
  const { data, isLoading } = useQuoteAnalyticsLiftingVsBenchmark(quoteRowId, fromDate, toDate, selectedBenchmarkId)
  const { value: graphView, setValue: setGraphView } = useLocalStorage<GraphView>('LiftingVsBenchmarkView', 'histogram')

  if (isLoading) {
    return <Loading />
  }

  function renderGraph() {
    if (!data?.HasData) return <NoData />
    if (graphView === 'histogram')
      return <HistogramGraph histogramData={data.HistogramData} averageVolumeLifted={data.AverageLiftings} />
    return <TrendDataGraph trendData={data.TrendData} />
  }

  return (
    <Horizontal fullHeight gap='1rem' className='p-4'>
      <Vertical flex={2} className='pr-4 border-right'>
        <Texto className='pb-2'>Quick Metrics</Texto>
        <QuickMetrics quickMetrics={data?.QuickMetrics} />
      </Vertical>
      <Vertical flex={12}>
        <Horizontal justifyContent='space-between' className='mb-2' style={{ minHeight: '30px' }}>
          <BenchmarkComparisonSelection
            benchmarkSelection={data?.BenchmarkSelection}
            onBenchmarkChange={setSelectedBenchmarkId}
            selectedRow={selectedRow}
          />
          <SelectGraphView selectedView={graphView} onChange={setGraphView} />
        </Horizontal>
        <Horizontal verticalCenter horizontalCenter className='p-2'>
          <div className='lifting-table-legend-dot' />
          <Texto className='ml-2'>LIFTED VOLUME</Texto>
        </Horizontal>
        {renderGraph()}
      </Vertical>
    </Horizontal>
  )
}
export { LiftingVsBenchmarkView }
