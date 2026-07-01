import { useApi } from '@gravitate-js/excalibrr'
import { QuoteHistoryResponse } from '@modules/PricingEngine/QuoteBook/components/Drawers/HistoryDrawer/api/schema.types'
import { useQuery } from '@tanstack/react-query'

const endpoints = {
  quoteHistoryMetadata: 'Quotebook/History/GetMetaData',
  quoteHistory: 'QuoteBook/History/GetQuoteHistory',
} as const

export const useQuoteHistory = () => {
  const api = useApi()

  const useQuoteHistoryQuery = (
    QuoteConfigurationMappingId: number | null,
    isQuoteHistoryDrawerOpen: boolean,
    DaysBack = 30
  ) =>
    useQuery<QuoteHistoryResponse>(
      [endpoints.quoteHistory, { QuoteConfigurationMappingId, DaysBack }],
      async () =>
        api.post(endpoints.quoteHistory, {
          QuoteConfigurationMappingId,
          DaysBack,
        }),
      {
        enabled: !!QuoteConfigurationMappingId && isQuoteHistoryDrawerOpen,
        refetchOnWindowFocus: false,
      }
    )
  const useQuoteBookHistoryMetaData = (QuoteConfigurationMappingId: number | null, isQuoteHistoryDrawerOpen: boolean) =>
    useQuery(
      [endpoints.quoteHistoryMetadata, QuoteConfigurationMappingId],
      () => api.post(endpoints.quoteHistoryMetadata, { QuoteConfigurationMappingId }),
      {
        refetchOnWindowFocus: false,
        enabled: !!QuoteConfigurationMappingId && isQuoteHistoryDrawerOpen,
      }
    )
  return { useQuoteHistoryQuery, useQuoteBookHistoryMetaData }
}
