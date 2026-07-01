import { TrendDataDTO } from '@api/useQuoteBookAnalytics/response'
import { CHART_COLORS } from '@constants/colors'
import { addCommasToNumber, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { chartColors } from '@modules/Analytics/PricePerformance/components/helpers'
import dayjs from '@utils/dayjs'
import { numberToShortString } from '@utils/index'
import React, { useMemo } from 'react'
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface TrendDataGraphProps {
  trendData: TrendDataDTO[]
}
function TrendDataGraph({ trendData }: TrendDataGraphProps) {
  const { lightGreenArea, greenTheme } = chartColors
  const processedData = useMemo(
    () =>
      trendData.map((item) => ({
        ...item,
        DateValue: dayjs(item.DateValue).valueOf(),
      })),
    [trendData]
  )

  const renderTooltip = (props) => {
    const { payload, label } = props
    const volume = {
      value: payload?.find((entry) => entry.dataKey === 'VolumeLifted')?.value,
      label: 'Volume Lifted',
      color: greenTheme,
      displayValue: addCommasToNumber(payload?.find((entry) => entry.dataKey === 'VolumeLifted')?.value, 0),
    }
    const price = {
      value: payload?.find((entry) => entry.dataKey === 'PriceDelta')?.value,
      label: 'Price Delta',
      color: lightGreenArea,
      displayValue: fmt.marginDecimal(payload?.find((entry) => entry.dataKey === 'PriceDelta')?.value),
    }
    const dataItem = processedData.find((item) => item.DateValue === label)
    let displayDate = ''
    if (!dataItem?.Date?.includes('Week')) {
      const hours = dayjs(label).hour()
      if (hours === 0) {
        displayDate = dayjs(label).format('M/D 12A')
      } else {
        displayDate = dayjs(label).format('M/D hA')
      }
    } else {
      displayDate = dataItem?.Date
    }
    return (
      <Vertical className='bordered bg-1 p-2 trend-tooltip'>
        <Horizontal className='mb-2'>
          <Texto>{displayDate}</Texto>
        </Horizontal>
        {[volume, price].map((data) => (
          <Horizontal verticalCenter key={data.label} className='mb-2'>
            <Vertical flex={1.5}>
              <Texto style={{ color: data.color }}>{data.label}:</Texto>
            </Vertical>
            <Vertical flex={1} alignItems='end' className='mr-2'>
              <Texto style={{ color: data.color }}>{data.displayValue}</Texto>
            </Vertical>
          </Horizontal>
        ))}
      </Vertical>
    )
  }

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <ComposedChart data={processedData}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <Tooltip content={renderTooltip} />
        <ReferenceLine y={0} stroke='var(--gray-600)' yAxisId='right' type='monotone' strokeWidth={1} />

        <XAxis
          dataKey='DateValue'
          ticks={processedData.map((item) => dayjs(item.DateValue).hour(0).minute(0).valueOf())}
          tickFormatter={(tick) => dayjs(tick).format('M/D')}
          domain={[processedData?.[0].DateValue, processedData?.[processedData.length - 1].DateValue]}
          scale='time'
          type='number'
        />
        <YAxis
          yAxisId='right'
          orientation='right'
          dataKey='PriceDelta'
          name='Price Delta'
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => fmt.marginDecimal(value)}
          width={70}
        >
          <Label
            value='PRICE DIFF'
            angle={-90}
            fill='var(--gray-400)'
            style={{ letterSpacing: '3px' }}
            dx={30}
            dy={0}
          />
        </YAxis>
        <YAxis
          yAxisId='left'
          orientation='left'
          dataKey='VolumeLifted'
          name='Volume Lifted'
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => numberToShortString(value)}
          width={50}
        >
          <Label value='VOLUME' angle={-90} fill='var(--gray-400)' style={{ letterSpacing: '3px' }} dy={0} dx={-25} />
        </YAxis>
        <Area
          yAxisId='right'
          type='monotone'
          dataKey='PriceDelta'
          stroke={CHART_COLORS.trendLine}
          fill={CHART_COLORS.trendLine}
          fillOpacity={0.2}
          isAnimationActive={false}
          activeDot={false}
          dot={false}
          strokeWidth={2}
        />
        <Bar yAxisId='left' dataKey='VolumeLifted' barSize={5} fill={greenTheme} opacity={0.75} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export { TrendDataGraph }
