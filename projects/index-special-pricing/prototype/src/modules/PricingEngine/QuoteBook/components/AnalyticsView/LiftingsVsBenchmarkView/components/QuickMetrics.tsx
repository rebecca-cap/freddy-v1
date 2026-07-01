import { DollarOutlined, LineChartOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons'
import { Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

import { QuickMetric } from './QuickMetric'

interface QuickMetricsProps {
  quickMetrics?: {
    AverageDelta: number
    AverageLifting: number
    AverageMargin: number
  }
}

function QuickMetrics({ quickMetrics }: QuickMetricsProps) {
  return (
    <Vertical gap='0.5rem' justifyContent='space-evenly'>
      <QuickMetric
        icon={DollarOutlined}
        label='Average Benchmark Diff'
        value={quickMetrics?.AverageDelta}
        format='price'
      />
      <QuickMetric
        icon={VerticalAlignBottomOutlined}
        label='Average Lifting'
        value={quickMetrics?.AverageLifting}
        format='volume'
      />
      <QuickMetric icon={LineChartOutlined} label='Average Margin' value={quickMetrics?.AverageMargin} format='price' />
    </Vertical>
  )
}

export { QuickMetrics }
