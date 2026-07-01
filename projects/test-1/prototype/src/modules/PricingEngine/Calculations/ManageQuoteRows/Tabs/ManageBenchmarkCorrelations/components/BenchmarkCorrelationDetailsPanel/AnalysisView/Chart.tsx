import { LineChartOutlined } from '@ant-design/icons'
import { addCommasToNumber, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { chartColors } from '@modules/Analytics/PricePerformance/components/helpers'
import {
  Loading,
  NoData,
} from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/common/messageAskingUserToSelectAQuoteRow'
import { numberToShortString } from '@utils/index'
import React, { useMemo } from 'react'
import {
  CartesianGrid,
  ComposedChart,
  Label,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { BenchmarkCorrelationLatestMeasurementsData } from '../../../api/schema.types'

export interface BenchmarkCorrelationChartProps {
  measurementData: BenchmarkCorrelationLatestMeasurementsData
  isFetchingData: boolean
}

export function BenchmarkCorrelationChart({ measurementData, isFetchingData }: BenchmarkCorrelationChartProps) {
  const { gold, lightGreenArea } = chartColors
  // Convert new data structure to old format for Chart component compatibility
  const scatterData = useMemo(() => {
    if (!measurementData?.SegmentData?.[0]?.StructuredSegmentData) return []

    const { Slope, Intercept, StartX, EndX } = measurementData.SegmentData[0].StructuredSegmentData
    const linePoints = [
      {
        x: StartX,
        y: Slope * StartX + Intercept > 0 ? Slope * StartX + Intercept : 0,
        isLine: true,
        bestFitVolume: Slope * StartX + Intercept > 0 ? Slope * StartX + Intercept : 0,
      },
      {
        x: EndX,
        y: Slope * EndX + Intercept > 0 ? Slope * EndX + Intercept : 0,
        isLine: true,
        bestFitVolume: Slope * EndX + Intercept > 0 ? Slope * EndX + Intercept : 0,
      },
    ]

    return (
      measurementData?.ChartPoints?.map((point) => ({
        x: point.XValue,
        y: point.YValue,
        delta: point.XValue,
        volume: point.YValue,
        linePointsY: point.XValue == StartX ? linePoints[0].y : point.XValue == EndX ? linePoints[1].y : null,
      })) || []
    )
  }, [measurementData])
  const yAxisMax = useMemo(() => {
    return Math.max(...scatterData.map((d) => d.y), ...scatterData.map((d) => d.linePointsY || 0))
  }, [scatterData])
  const renderLegend = (props) => {
    const legendData = [
      {
        dataKey: 'scatter',
        color: lightGreenArea,
        label: 'Data Points',
        icon: (
          <div className='mr-2'>
            <svg width='10' height='10' xmlns='http://www.w3.org/2000/svg'>
              <circle cx='5' cy='5' r='4' fill={lightGreenArea} fillOpacity={0.7} />
            </svg>
          </div>
        ),
      },
      {
        dataKey: 'bestfit',
        color: gold,
        label: 'Line of Best Fit',
        icon: <LineChartOutlined className='mr-2' style={{ color: gold }} />,
      },
    ]

    return (
      <Horizontal verticalCenter horizontalCenter className='mb-2 mt-0 pt-0'>
        {legendData.map((legend) => (
          <Horizontal className='mr-4' verticalCenter key={legend.dataKey}>
            {legend.icon}
            <Texto category='label' className='mr-2' textTransform='uppercase'>
              {legend.label}
            </Texto>
          </Horizontal>
        ))}
      </Horizontal>
    )
  }

  const tooltipContent = (props: any) => {
    const { active, payload } = props
    if (active && payload && payload.length) {
      const data = payload[0]?.payload
      return (
        <Vertical className='bg-1 bordered p-3' style={{ verticalAlign: 'center', width: 180 }}>
          <Horizontal className='justify-sb mb-1'>
            <Texto category='p2' weight={600}>
              Delta:
            </Texto>
            <Texto category='p2'>${addCommasToNumber(data.delta, 4)}</Texto>
          </Horizontal>
          <Horizontal className='justify-sb mb-1'>
            <Texto category='p2' weight={600}>
              Volume:
            </Texto>
            <Texto category='p2'>{numberToShortString(data.volume)}</Texto>
          </Horizontal>
          {data.linePointsY && (
            <Horizontal className='justify-sb mb-1'>
              <Texto category='p2' weight={600}>
                Best Fit Volume:
              </Texto>
              <Texto category='p2'>{numberToShortString(data.linePointsY)}</Texto>
            </Horizontal>
          )}
        </Vertical>
      )
    }
    return null
  }

  if (isFetchingData) return <Loading />
  if (!scatterData?.length) return <NoData />

  return (
    <Horizontal
      style={{ width: '100%', height: '100%' }}
      className='bg-1 bordered border-radius-5 py-2 pr-2'
      verticalCenter
      horizontalCenter
    >
      <ResponsiveContainer width='100%' height='100%' className=''>
        <ComposedChart data={scatterData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            type='number'
            dataKey='x'
            domain={['dataMin', 'dataMax']}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${addCommasToNumber(value, 4)}`}
            label={
              <Label
                value='BENCHMARK PRICE DELTA'
                position='insideBottom'
                offset={-5}
                fill='var(--gray-400)'
                style={{ letterSpacing: '2px', textAnchor: 'middle' }}
              />
            }
          />
          <YAxis
            type='number'
            dataKey='y'
            domain={[0, yAxisMax]}
            tickFormatter={(value) => numberToShortString(value, 0)}
            label={
              <Label
                value='VOLUME'
                angle={-90}
                fill='var(--gray-400)'
                style={{ letterSpacing: '3px' }}
                position='insideLeft'
                offset={10}
              />
            }
          />

          <Tooltip content={tooltipContent} filterNull cursor={{ strokeDasharray: '3 3' }} />
          <Legend content={renderLegend} verticalAlign='top' align='center' />

          {/* Scatter plot points */}
          <Scatter dataKey='y' fill={lightGreenArea} fillOpacity={0.7} stroke={lightGreenArea} strokeWidth={1} r={4} />

          {/* Line of best fit */}
          <Line dataKey='linePointsY' stroke={gold} strokeWidth={2} connectNulls activeDot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </Horizontal>
  )
}
