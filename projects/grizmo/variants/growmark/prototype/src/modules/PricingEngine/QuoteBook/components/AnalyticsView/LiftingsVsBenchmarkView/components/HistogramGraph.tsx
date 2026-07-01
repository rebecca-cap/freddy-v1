import { HistogramDataDTO } from '@api/useQuoteBookAnalytics/response'
import { addCommasToNumber, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { chartColors } from '@modules/Analytics/PricePerformance/components/helpers'
import { numberToShortString } from '@utils/index'
import React from 'react'
import {
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

interface HistogramGraphProps {
  histogramData: HistogramDataDTO[]
  averageVolumeLifted: number
}

function HistogramGraph({ histogramData, averageVolumeLifted }: HistogramGraphProps) {
  const { greenTheme, lightGreenArea, gold } = chartColors
  const renderTooltip = ({ payload }) => {
    const item = payload?.[0]?.payload
    const data = [
      {
        value: item?.VolumeLifted,
        label: 'Volume Lifted',
        color: greenTheme,
        displayValue: addCommasToNumber(item?.VolumeLifted, 0),
      },
      {
        value: item?.PriceDelta,
        label: 'Price Delta',
        color: lightGreenArea,
        displayValue: fmt.marginDecimal(item?.PriceDelta),
      },
      {
        value: averageVolumeLifted,
        label: 'Average',
        color: gold,
        displayValue: addCommasToNumber(averageVolumeLifted, 0),
      },
    ]
    return (
      <Vertical className='bordered bg-1 p-2 trend-tooltip'>
        {data.map((data) => (
          <Horizontal verticalCenter key={data.label} className='mb-2'>
            <Vertical flex={2}>
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
      <ComposedChart data={histogramData}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} />
        <Tooltip content={renderTooltip} />
        <XAxis
          dataKey='PriceDelta'
          axisLine={false}
          tickLine={false}
          domain={['dataMin', 'dataMax']}
          tickFormatter={(value) => fmt.marginDecimal(value)}
        />
        <YAxis
          dataKey='VolumeLifted'
          axisLine={false}
          tickLine={false}
          tickFormatter={(value): string =>
            (value > 999 ? numberToShortString(value) : addCommasToNumber(value, 0)) || ''
          }
          domain={[0, 'auto']}
        >
          <Label value='VOLUME' angle={-90} fill='var(--gray-400)' style={{ letterSpacing: '3px' }} dx={-20} />
        </YAxis>
        <Bar dataKey='VolumeLifted' barSize={20} fill={greenTheme} />
        <ReferenceLine y={averageVolumeLifted} stroke={gold} strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export { HistogramGraph }
