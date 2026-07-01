import type { CompetitorPricingRecord } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/api/schema.types'

export const selectedQuoteRowDistinctColor = '#212529'

interface PricingTableData extends CompetitorPricingRecord {
  shade?: string
}

export const getSummaryData = (pricingData: PricingTableData[]) => {
  const prices = pricingData.map((item) => item.Price).sort((a, b) => a - b)

  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)

  const maxPriceItems = [...pricingData].reverse().filter((item) => item.Price === maxPrice)
  const minPriceItems = pricingData.filter((item) => item.Price === minPrice)

  const minPriceItem: PricingTableData | 'Multiple' = minPriceItems?.length > 1 ? 'Multiple' : minPriceItems[0]
  const maxPriceItem: PricingTableData | 'Multiple' = maxPriceItems?.length > 1 ? 'Multiple' : maxPriceItems[0]
  const maxPriceItemName =
    maxPriceItem !== 'Multiple'
      ? `${maxPriceItem.CompetitorName || 'Selected Row'}${maxPriceItem.Category ? ` (${maxPriceItem.Category})` : ''}`
      : 'Multiple'

  const minPriceItemName =
    minPriceItem !== 'Multiple'
      ? `${minPriceItem.CompetitorName || 'Selected Row'}${minPriceItem.Category ? ` (${minPriceItem.Category})` : ''}`
      : 'Multiple'

  const yourPriceItem = pricingData.find((item) => item.IsSelectedRow)
  const yourPrice = yourPriceItem ? yourPriceItem.Price : 0

  const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length

  const diffToMax = yourPrice - maxPrice
  const diffToAvg = yourPrice - avg

  return {
    Max: {
      value: maxPrice,
      name: maxPriceItemName,
    },
    Min: {
      value: minPrice,
      name: minPriceItemName,
    },
    Avg: parseFloat(avg.toFixed(4)),
    YourPrice: {
      value: yourPrice,
    },
    DiffToMax: parseFloat(diffToMax.toFixed(4)),
    DiffToAvg: parseFloat(diffToAvg.toFixed(4)),
  }
}
