import { LineChartOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { addCommasToNumber, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { chartColors } from '@modules/Analytics/PricePerformance/components/helpers'
import {
  Loading,
  NoData,
} from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/common/messageAskingUserToSelectAQuoteRow'
import { numberToShortString } from '@utils/index'
import moment from 'moment/moment'
import React, { useMemo } from 'react'
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  Legend,
  Line,
  Rectangle,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AxisDomain } from 'recharts/types/util/types'

export function HistoryChart({
  graphData,
  selectedBenchmark,
  selectedAgainst,
  metadata,
  againstOptions,
  isFetchingHistory,
}) {
  const { gold, greenTheme, lightGreenArea } = chartColors

  const benchmark = metadata?.Benchmarks?.find((bm) => bm.Value?.toString() === selectedBenchmark?.toString())
  const againstOption = againstOptions?.find((a) => a.value === selectedAgainst)
  const renderLegend = (props) => {
    const { payload } = props

    const benchmarkLegend = {
      dataKey: 'Benchmark',
      color: gold,
      label: benchmark?.Text,
      icon: <LineChartOutlined className='mr-2' style={{ color: gold }} />,
    }

    const legendData = [
      {
        dataKey: 'Price',
        color: lightGreenArea,
        label: 'Quote Price',
        icon: <LineChartOutlined className='mr-2' style={{ color: lightGreenArea }} />,
      },
      {
        dataKey: selectedAgainst,
        color: greenTheme,
        name: 'Lifted Volume',
        label: againstOption?.text,
        icon: (
          <div className='mr-2'>
            <svg width='10' height='10' xmlns='http://www.w3.org/2000/svg'>
              <circle cx='5' cy='5' r='5' fill={greenTheme} />
            </svg>
          </div>
        ),
      },
    ]

    if (benchmark) {
      legendData.push(benchmarkLegend)
    }

    return (
      <Horizontal verticalCenter horizontalCenter className='mb-2 mt-0 pt-0'>
        {payload.map((entry, index) => {
          const legend = legendData.find((l) => l.dataKey === entry.value)
          return (
            <Horizontal className='mr-4' verticalCenter key={`${legend?.dataKey} - ${index}`}>
              {legend?.icon}
              <Texto category='label' className='mr-2' key={`item-${index}`} textTransform='uppercase'>
                {legend?.label}
              </Texto>
            </Horizontal>
          )
        })}
      </Horizontal>
    )
  }
  const tooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Vertical className='bg-1 bordered p-3' style={{ verticalAlign: 'center', width: 150 }}>
          <Horizontal>
            <Texto category='p2' weight={900}>
              {moment(label).format('MMM. D, YYYY')}
            </Texto>
          </Horizontal>
          {payload.map((item) => {
            let { name, value } = item
            if (name === 'Benchmark') name = benchmark?.Text
            if (name === selectedAgainst) name = againstOption?.text
            const formattedValue =
              name === 'Margin'
                ? `${fmt.marginDecimal(value)}`
                : name === 'Liftings'
                ? numberToShortString(value)
                : name === 'Profit'
                ? `$${numberToShortString(value)}`
                : `$${addCommasToNumber(value, 4)}`
            return (
              <Horizontal key={name} verticalCenter className='justify-sb'>
                <Texto style={{ color: item.color }}>{name}:</Texto>
                <Texto style={{ color: item.color }}>{formattedValue}</Texto>
              </Horizontal>
            )
          })}
        </Vertical>
      )
    }
    return null
  }

  const LeftYDataKey = useMemo(() => {
    if (!graphData?.length) return ''
    const benchmarks = graphData.map((d) => d.Benchmark).filter((d) => d)
    const prices = graphData.map((d) => d.Price).filter((d) => d)
    return Math.max(...prices) > Math.max(...benchmarks) ? 'Price' : 'Benchmark'
  }, [graphData])

  const leftYAxisDomain: AxisDomain = useMemo(() => {
    if (!graphData?.length) return [0, 'auto']

    const priceValues = graphData.map((d) => d.Price).filter((v) => typeof v === 'number' && !Number.isNaN(v))

    const benchmarkValues = graphData.map((d) => d.Benchmark).filter((v) => typeof v === 'number' && !Number.isNaN(v))

    const allValues = [...priceValues, ...benchmarkValues]

    if (!allValues.length) return [0, 'auto']

    const min = Math.min(...allValues)
    const max = Math.max(...allValues)

    return [min, max]
  }, [graphData])

  if (isFetchingHistory) return <Loading />
  if (!graphData?.length) return <NoData />
  return (
    <Horizontal fullHeight className='p-4'>
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart data={graphData}>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis
            dataKey='Date'
            tickFormatter={(tick) => moment(tick).format(dateFormat.MONTH_DATE)}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId='left'
            orientation='left'
            axisLine={false}
            dataKey={LeftYDataKey}
            width={80}
            label={
              <Label
                value='PRICE'
                angle={-90}
                fill='var(--gray-400)'
                style={{ letterSpacing: '3px' }}
                dy={0}
                dx={-40}
              />
            }
            tickLine={false}
            tickFormatter={(value) => `$${addCommasToNumber(value, 4)}`}
            interval='preserveStartEnd'
            domain={leftYAxisDomain}
          />
          <YAxis
            yAxisId='right'
            orientation='right'
            tickLine={false}
            dataKey={`${selectedAgainst}`}
            axisLine={false}
            width={75}
            label={
              <Label
                value={selectedAgainst.toUpperCase()}
                angle={-90}
                fill='var(--gray-400)'
                style={{ letterSpacing: '3px' }}
                dy={0}
                dx={35}
              />
            }
            tickFormatter={(value) =>
              selectedAgainst === 'Profit'
                ? numberToShortString(value)
                : selectedAgainst === 'Margin'
                ? fmt.marginDecimal(value)
                : selectedAgainst === 'Liftings'
                ? numberToShortString(value)
                : addCommasToNumber(value, 0)
            }
          />

          <Tooltip content={tooltipContent} />
          <Legend content={renderLegend} verticalAlign='top' align='center' />
          <ReferenceLine y={0} stroke='var(--gray-600)' yAxisId='right' type='monotone' strokeWidth={1} />

          <Area
            dataKey='Price'
            stroke={lightGreenArea}
            yAxisId='left'
            fillOpacity={0.2}
            strokeWidth={2}
            fill={lightGreenArea}
          />
          <Line dataKey='Benchmark' stroke={gold} strokeWidth={2} yAxisId='left' dot={false} />
          <Bar
            dataKey={`${selectedAgainst}`}
            fill={greenTheme}
            yAxisId='right'
            barSize={8}
            shape={(props) => {
              const { x, y, width, height } = props
              const radius = 5
              return (
                <Rectangle
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  radius={[radius, radius, 0, 0]}
                  fill={greenTheme}
                />
              )
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Horizontal>
  )
}
