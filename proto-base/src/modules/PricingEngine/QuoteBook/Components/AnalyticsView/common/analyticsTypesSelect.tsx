import {
  ArrowsAltOutlined,
  ExperimentOutlined,
  LineChartOutlined,
  UserSwitchOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons'
import { AnalyticsType } from '@api/useQuoteBookAnalytics/response'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import React from 'react'

export const analyticTypes = [
  {
    label: (
      <Horizontal verticalCenter className='mr-2'>
        <VerticalAlignBottomOutlined className='mx-2' />
        <Texto>Liftings vs. Benchmark</Texto>
      </Horizontal>
    ),
    value: 'LiftingVsBenchmark' as AnalyticsType,
  },
  {
    label: (
      <Horizontal verticalCenter className='mr-2'>
        <ArrowsAltOutlined className='mx-2' />
        <Texto>Liftings vs. Margin</Texto>
      </Horizontal>
    ),
    value: 'LiftingVsMargin' as AnalyticsType,
  },
  {
    label: (
      <Horizontal verticalCenter className='mr-2'>
        <UserSwitchOutlined className='mx-2' /> <Texto>Top Customer Liftings</Texto>
      </Horizontal>
    ),
    value: 'Customer' as AnalyticsType,
  },
  {
    label: (
      <Horizontal verticalCenter className='mr-2'>
        <LineChartOutlined className='mx-2' /> <Texto>Competitor Prices</Texto>
      </Horizontal>
    ),
    value: 'Competitor' as AnalyticsType,
  },
  {
    label: (
      <Horizontal verticalCenter className='mr-2'>
        <ExperimentOutlined className='mx-2' /> <Texto>Allocation Analysis</Texto>
      </Horizontal>
    ),
    value: 'Allocation' as AnalyticsType,
  },
]
