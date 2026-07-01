import { addCommasToNumber, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { chartColors } from '@modules/Analytics/PricePerformance/components/helpers'
import { type CompetitorPricingRecord } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/CompetitorPricesView/api/schema.types'
import React, { useMemo } from 'react'
import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, YAxis } from 'recharts'

interface PricingChartData extends CompetitorPricingRecord {
  shade?: string
}
interface PricingChartProps {
  pricingData: PricingChartData[]
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>
}

export function PricingChart({ pricingData, setSelectedItem }: PricingChartProps) {
  const avgPrice = useMemo(
    () => pricingData.reduce((sum: number, item: PricingChartData) => sum + item.Price, 0) / pricingData.length,
    [pricingData]
  )
  const { gold } = chartColors

  const renderTooltip = (props) => {
    if (!props?.active) {
      return <div />
    }
    const name = props?.payload[0]?.payload?.IsSelectedRow ? 'selectedRow' : props?.payload[0]?.payload?.CompetitorName
    const id = props?.payload[0]?.payload?.PriceInstrumentId?.toString() || ''
    const price = props?.payload[0]?.value
    setSelectedItem(id)
    return (
      <Vertical className='bg-1 p-2 br-5 bordered' style={{ minWidth: 'fit-content' }}>
        <Horizontal className='mb-1' verticalCenter>
          <Texto category='p2' weight={900}>
            {name === 'selectedRow' ? 'Selected Row' : name}
          </Texto>
        </Horizontal>
        <Horizontal justifyContent='space-between' verticalCenter>
          <Texto className='mr-4'>Price:</Texto>
          <Texto>${price && addCommasToNumber(price, 4)}</Texto>
        </Horizontal>
        <Horizontal justifyContent='space-between' verticalCenter>
          <Texto className='mr-4'>Average:</Texto>
          <Texto>${addCommasToNumber(avgPrice, 4)}</Texto>
        </Horizontal>
      </Vertical>
    )
  }
  const pricingDataSortedByHighestPrice = useMemo(() => {
    const dataCopy = [...pricingData]
    return dataCopy.sort((a, b) => b.Price - a.Price)
  }, [pricingData])

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart data={pricingDataSortedByHighestPrice}>
        <YAxis hide domain={['dataMin', 'auto']} />
        <Tooltip content={renderTooltip} />
        <Bar dataKey='Price'>
          {pricingDataSortedByHighestPrice.map((entry, index) => {
            return <Cell key={`cell-${entry.PriceInstrumentId}`} fill={entry.shade} />
          })}
        </Bar>
        <ReferenceLine y={avgPrice} stroke={gold} strokeWidth={3} />
      </BarChart>
    </ResponsiveContainer>
  )
}
