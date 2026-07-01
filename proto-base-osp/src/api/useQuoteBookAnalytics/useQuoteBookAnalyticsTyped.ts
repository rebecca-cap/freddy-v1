/**
 * Type-safe Quote Book Analytics API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('QuoteBook/Analytics/GetLiftings')
 * - New: api.POST('/api/QuoteBook/Analytics/GetLiftings')
 */

import { type InferRequestBody, type InferResponse, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { useQuery } from '@tanstack/react-query'

export type QuoteAnalyticsLiftingsResponse = InferResponse<'/api/QuoteBook/Analytics/GetLiftings'>
export type QuoteAnalyticsLiftingVsBenchmarkResponse = InferResponse<'/api/QuoteBook/Analytics/GetLiftingVsBenchmark'>
export type QuoteAnalyticsLiftingVsMarginResponse = InferResponse<'/api/QuoteBook/Analytics/GetLiftingVsMargin'>

type QuoteAnalyticsLiftingsRequest = InferRequestBody<'/api/QuoteBook/Analytics/GetLiftings'>
type QuoteAnalyticsLiftingVsBenchmarkRequest = InferRequestBody<'/api/QuoteBook/Analytics/GetLiftingVsBenchmark'>
type QuoteAnalyticsLiftingVsMarginRequest = InferRequestBody<'/api/QuoteBook/Analytics/GetLiftingVsMargin'>

const queryKeys = {
  liftings: queryKey('/api/QuoteBook/Analytics/GetLiftings'),
  liftingVsBenchmark: queryKey('/api/QuoteBook/Analytics/GetLiftingVsBenchmark'),
  liftingVsMargin: queryKey('/api/QuoteBook/Analytics/GetLiftingVsMargin'),
} as const

export const useQuoteBookAnalyticsTyped = () => {
  const api = useTypedApi()

  /**
   * Fetch liftings analytics
   */
  const useQuoteAnalyticsLiftings = (
    QuoteConfigurationMappingId: number | null,
    StartDate: string | undefined,
    EndDate: string | undefined,
    showAnalytics: boolean
  ) =>
    useQuery({
      queryKey: [queryKeys.liftings[0], QuoteConfigurationMappingId, StartDate, EndDate],
      queryFn: () =>
        unwrap(
          api.POST('/api/QuoteBook/Analytics/GetLiftings', {
            body: {
              QuoteConfigurationMappingId: QuoteConfigurationMappingId ?? undefined,
              StartDate,
              EndDate,
            },
          })
        ),
      refetchOnWindowFocus: false,
      enabled: !!QuoteConfigurationMappingId && showAnalytics,
    })

  /**
   * Fetch lifting vs benchmark analytics
   */
  const useQuoteAnalyticsLiftingVsBenchmark = (
    QuoteRowId: number | null,
    FromDate: string | undefined,
    ToDate: string | undefined,
    BenchmarkId: number | null = null
  ) =>
    useQuery({
      queryKey: [queryKeys.liftingVsBenchmark[0], QuoteRowId, FromDate, ToDate, BenchmarkId],
      queryFn: () =>
        unwrap(
          api.POST('/api/QuoteBook/Analytics/GetLiftingVsBenchmark', {
            body: {
              QuoteRowId: QuoteRowId ?? undefined,
              FromDate,
              ToDate,
              BenchmarkId,
            },
          })
        ),
      refetchOnWindowFocus: false,
      enabled: !!QuoteRowId,
    })

  /**
   * Fetch lifting vs margin analytics
   */
  const useQuoteAnalyticsLiftingVsMargin = (
    QuoteRowId: number | null,
    FromDate: string | undefined,
    ToDate: string | undefined
  ) =>
    useQuery({
      queryKey: [queryKeys.liftingVsMargin[0], QuoteRowId, FromDate, ToDate],
      queryFn: () =>
        unwrap(
          api.POST('/api/QuoteBook/Analytics/GetLiftingVsMargin', {
            body: {
              QuoteRowId: QuoteRowId ?? undefined,
              FromDate,
              ToDate,
            },
          })
        ),
      refetchOnWindowFocus: false,
      enabled: !!QuoteRowId,
    })

  return {
    useQuoteAnalyticsLiftings,
    useQuoteAnalyticsLiftingVsBenchmark,
    useQuoteAnalyticsLiftingVsMargin,
  }
}
