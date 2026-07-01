import { useApi } from '@gravitate-js/excalibrr'
import { AllocationDataResponse } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/AllocationGrid/api/schema.types'
import { useQuery } from '@tanstack/react-query'

const endpoints = {
  quoteAnalyticsAllocation: 'QuoteBook/Analytics/Allocation/GetDataForAnalytic',
}
export const useQuoteAnalyticsAllocation = () => {
  const api = useApi()

  const getAllocationDataQuery = (QuoteConfigurationMappingId: number) =>
    useQuery<AllocationDataResponse>(
      [endpoints.quoteAnalyticsAllocation, { QuoteConfigurationMappingId }],
      async () =>
        api.post(endpoints.quoteAnalyticsAllocation, {
          QuoteConfigurationMappingId,
        }),
      {
        refetchOnWindowFocus: false,
        enabled: !!QuoteConfigurationMappingId,
      }
    )

  return {
    getAllocationDataQuery,
  }
}
