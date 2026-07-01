import { GraphDataDTO } from '@api/useQuoteBookAnalytics/response'
import { addCommasToNumber, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { chartColors } from '@modules/Analytics/PricePerformance/components/helpers'
import { numberToShortString } from '@utils/index'
import moment from 'moment/moment'
import React, { useMemo } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  DotProps,
  Label,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface LiftingVsMarginGraphProps {
  graphData: GraphDataDTO[]
  selectedDate?: string | null
}

function LiftingVsMarginGraph({ graphData, selectedDate }: LiftingVsMarginGraphProps) {
  const formatVolume = (value: number) => (value > 999 ? `${numberToShortString(value)}` : addCommasToNumber(value, 0))
  const { greenTheme, lightGreenArea, gold } = chartColors
  const CustomDot = useMemo(
    () =>
      function (props: DotProps) {
        const { cx, cy, payload } = props
        const isSelected = payload.Date === selectedDate
        if (!isSelected) return null
        return (
          <circle
            cx={cx}
            cy={cy}
            r={isSelected ? 6 : 3}
            fill={isSelected ? gold : lightGreenArea}
            stroke={isSelected ? `var(--gray-600)` : lightGreenArea}
            strokeWidth={1}
          />
        )
      },
    [selectedDate]
  )
  const processedData = useMemo(
    () =>
      graphData.map((item) => ({
        ...item,
        DateValue: moment(item.DateValue).valueOf(),
      })),
    [graphData]
  )

  const minMargin = useMemo(() => Math.min(...graphData.map((data) => data.Margin)) * 0.95, [graphData])
  const renderTooltip = (props) => {
    const { payload, label } = props
    const volume = {
      value: payload?.find((entry) => entry.dataKey === 'Volume')?.value,
      label: 'Volume',
      color: lightGreenArea,
      displayValue: formatVolume(payload?.find((entry) => entry.dataKey === 'Volume')?.value),
    }
    const price = {
      value: payload?.find((entry) => entry.dataKey === 'Margin')?.value,
      label: 'Margin',
      color: greenTheme,
      displayValue: fmt.marginDecimal(payload?.find((entry) => entry.dataKey === 'Margin')?.value),
    }
    const dataItem = processedData.find((item) => item.DateValue === label)
    let displayDate = ''
    if (!dataItem?.Date?.includes('Week')) {
      const hours = moment(label).hours()
      if (hours === 0) {
        displayDate = moment(label).format('M/D 12A')
      } else {
        displayDate = moment(label).format('M/D hA')
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
    <ResponsiveContainer width='100%' height='100%' className='p-4'>
      <ComposedChart data={processedData}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <XAxis
          dataKey='DateValue'
          ticks={processedData.map((item) => moment(item.DateValue).hour(0).minute(0).valueOf())}
          tickFormatter={(tick) => moment(tick).format('M/D')}
          domain={[processedData?.[0].DateValue, processedData?.[processedData.length - 1].DateValue]}
          scale='time'
          type='number'
          angle={-25}
          dy={5}
        />
        <Legend />
        <YAxis
          yAxisId='left'
          orientation='left'
          dataKey='Volume'
          axisLine={false}
          tickLine={false}
          tickFormatter={formatVolume}
          domain={[0, 'auto']}
        >
          <Label value='VOLUME' angle={-90} fill='var(--gray-400)' style={{ letterSpacing: '3px' }} dx={-20} dy={0} />
        </YAxis>
        <YAxis
          yAxisId='right'
          orientation='right'
          dataKey='Margin'
          axisLine={false}
          tickLine={false}
          tickFormatter={fmt.marginDecimal}
          domain={[minMargin, 'auto']}
          width={70}
        >
          <Label value='MARGIN' angle={-90} fill='var(--gray-400)' style={{ letterSpacing: '3px' }} dx={30} dy={0} />
        </YAxis>
        <Tooltip content={renderTooltip} />
        <ReferenceLine y={0} stroke='var(--gray-600)' yAxisId='right' type='monotone' strokeWidth={1} />
        <Area
          yAxisId='left'
          type='monotone'
          dataKey='Volume'
          stroke={lightGreenArea}
          fill={lightGreenArea}
          fillOpacity={0.2}
          isAnimationActive={false}
          strokeWidth={2}
        />
        <Line
          yAxisId='right'
          type='monotone'
          dataKey='Margin'
          stroke={greenTheme}
          strokeWidth={2}
          dot={<CustomDot />}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

LiftingVsMarginGraph.defaultProps = {
  selectedDate: null,
}

export { LiftingVsMarginGraph }
