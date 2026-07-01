import { useApi } from '@gravitate-js/excalibrr'
import { CustomerLiftingsResponse } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CustomerLiftingsView/api/schema.types'
import { useQuery } from '@tanstack/react-query'

const endpoints = {
  quoteAnalyticsLiftings: 'QuoteBook/Analytics/GetLiftings',
}
export const useQuoteAnalyticsCustomerLiftings = () => {
  const api = useApi()

  const useQuoteAnalyticsLiftings = (QuoteConfigurationMappingId: number | null, StartDate: Date, EndDate: Date) =>
    useQuery<CustomerLiftingsResponse>(
      [endpoints.quoteAnalyticsLiftings, QuoteConfigurationMappingId, StartDate, EndDate],
      async () =>
        api.post(endpoints.quoteAnalyticsLiftings, {
          QuoteConfigurationMappingId,
          StartDate,
          EndDate,
        } as any),
      {
        refetchOnWindowFocus: false,
        enabled: !!QuoteConfigurationMappingId && (!!StartDate || !!EndDate),
      }
    )

  return {
    useQuoteAnalyticsLiftings,
  }
}
