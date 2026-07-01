import type { CompetitorPricingRecord } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/api/schema.types'
import { DiffLine } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/components/Summary/components/DiffLine'
import { PriceBox } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/components/Summary/components/PriceBox'
import { getSummaryData } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/components/util'
import React from 'react'

interface PricingTableData extends CompetitorPricingRecord {
  shade?: string
}
interface SummaryProps {
  pricingData: PricingTableData[] | []
}

export function Summary({ pricingData }: SummaryProps) {
  if (!pricingData) {
    return null
  }
  const data = getSummaryData(pricingData)

  return (
    <>
      <PriceBox label='MAX' price={data.Max.value} name={data.Max.name} />
      <div className='mb-4'>
        <DiffLine label='Max' price={data.DiffToMax} />
        <PriceBox label='Selected Row' price={data.YourPrice.value} />
        <DiffLine label='Avg' price={data.DiffToAvg} />
      </div>
      <PriceBox label='AVG' price={data.Avg} />
      <PriceBox label='MIN' price={data.Min.value} name={data.Min.name} />
    </>
  )
}
