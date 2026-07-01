import { useApi } from '@gravitate-js/excalibrr'
import { CompetitorPricingRecord } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/api/schema.types'
import { useQuery } from '@tanstack/react-query'

const endpoints = {
  quoteAnalyticsCompetitorPrices: 'QuoteBook/Analytics/CompetitorPrices/Get',
}
export const useQuoteAnalyticsCompetitorPrices = () => {
  const api = useApi()

  const getCompetitorPricesQuery = (QuoteConfigurationMappingId: number, UseOpisPrices = false) =>
    useQuery<CompetitorPricingRecord[]>(
      [endpoints.quoteAnalyticsCompetitorPrices, { QuoteConfigurationMappingId, UseOpisPrices }],
      async () =>
        api.post(endpoints.quoteAnalyticsCompetitorPrices, {
          QuoteConfigurationMappingId,
          UseOpisPrices,
        }),
      {
        refetchOnWindowFocus: false,
        enabled: !!QuoteConfigurationMappingId,
      }
    )

  return {
    getCompetitorPricesQuery,
  }
}
