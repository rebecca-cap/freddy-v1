/**
 * Type-safe Quote Analytics Customer Liftings API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('QuoteBook/Analytics/GetLiftings', payload as any)
 * - New: api.POST('/api/QuoteBook/Analytics/GetLiftings', { body: payload })
 */

import { type InferRequestBody, type InferResponse, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { useQuery } from '@tanstack/react-query'

type GetLiftingsResponse = InferResponse<'/api/QuoteBook/Analytics/GetLiftings'>

type GetLiftingsRequest = InferRequestBody<'/api/QuoteBook/Analytics/GetLiftings'>

// Query Keys

const queryKeys = {
  liftings: (QuoteConfigurationMappingId: number | null, StartDate: Date, EndDate: Date) =>
    [...queryKey('/api/QuoteBook/Analytics/GetLiftings'), QuoteConfigurationMappingId, StartDate, EndDate] as const,
} as const

export const useQuoteAnalyticsCustomerLiftingsTyped = () => {
  const api = useTypedApi()

  /**
   * Fetch quote analytics liftings
   */
  const useQuoteAnalyticsLiftings = (QuoteConfigurationMappingId: number | null, StartDate: Date, EndDate: Date) =>
    useQuery({
      queryKey: queryKeys.liftings(QuoteConfigurationMappingId, StartDate, EndDate),
      queryFn: () =>
        unwrap(
          api.POST('/api/QuoteBook/Analytics/GetLiftings', {
            body: {
              QuoteConfigurationMappingId,
              StartDate,
              EndDate,
            },
          })
        ),
      refetchOnWindowFocus: false,
      enabled: !!QuoteConfigurationMappingId && (!!StartDate || !!EndDate),
    })

  return {
    useQuoteAnalyticsLiftings,
  }
}
