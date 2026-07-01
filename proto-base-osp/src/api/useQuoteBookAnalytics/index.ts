import { QuoteHistoryDTO } from '@api/useQuoteBook/types'
import { LiftingsToBenchmarkResponse, LiftingVsMarginResponseDTO } from '@api/useQuoteBookAnalytics/response'
import { useApi } from '@gravitate-js/excalibrr'
import { useQuery } from '@tanstack/react-query'

const endpoints = {
  quoteAnalyticsLiftings: 'QuoteBook/Analytics/GetLiftings',
  quoteAnalyticsLiftingVsBenchmark: 'QuoteBook/Analytics/GetLiftingVsBenchmark',
  quoteAnalyticsLiftingVsMargin: 'QuoteBook/Analytics/GetLiftingVsMargin',
  quoteAnalyticsCompetitorPrices: 'QuoteBook/Analytics/CompetitorPrices/Get',
}
export const useQuoteBookAnalytics = () => {
  const api = useApi()

  const useQuoteAnalyticsLiftings = (
    QuoteRowId: number | null,
    Count: number,
    FromDate: Date,
    ToDate: Date,
    showAnalytics: boolean
  ) =>
    useQuery<QuoteHistoryDTO>(
      [endpoints.quoteAnalyticsLiftings, QuoteRowId, FromDate, ToDate],
      async () =>
        api.post(endpoints.quoteAnalyticsLiftings, {
          QuoteRowId,
          Count,
          FromDate,
          ToDate,
        }),
      {
        refetchOnWindowFocus: false,
        enabled: !!QuoteRowId && showAnalytics,
      }
    )

  const useQuoteAnalyticsLiftingVsBenchmark = (
    QuoteRowId: number | null,
    FromDate: Date,
    ToDate: Date,
    BenchmarkId: number | null = null
  ) =>
    useQuery<LiftingsToBenchmarkResponse>(
      [endpoints.quoteAnalyticsLiftingVsBenchmark, QuoteRowId, FromDate, ToDate, BenchmarkId],
      async () =>
        api.post(endpoints.quoteAnalyticsLiftingVsBenchmark, {
          QuoteRowId,
          FromDate,
          ToDate,
          BenchmarkId,
        }),
      {
        refetchOnWindowFocus: false,
        enabled: !!QuoteRowId,
      }
    )

  const useQuoteAnalyticsLiftingVsMargin = (QuoteRowId: number | null, FromDate: Date, ToDate: Date) =>
    useQuery<LiftingVsMarginResponseDTO>(
      [endpoints.quoteAnalyticsLiftingVsMargin, QuoteRowId, FromDate, ToDate],
      async () =>
        api.post(endpoints.quoteAnalyticsLiftingVsMargin, {
          QuoteRowId,
          FromDate,
          ToDate,
        }),
      {
        refetchOnWindowFocus: false,
        enabled: !!QuoteRowId,
      }
    )

  return {
    useQuoteAnalyticsLiftings,
    useQuoteAnalyticsLiftingVsBenchmark,
    useQuoteAnalyticsLiftingVsMargin,
  }
}
