import { type InferResponse, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { useQuery } from '@tanstack/react-query'

type QuoteHistoryResponse = InferResponse<'/api/QuoteBook/History/GetQuoteHistory'>
type QuoteHistoryMetadataResponse = InferResponse<'/api/QuoteBook/History/GetMetaData'>

export const useQuoteHistoryTyped = () => {
  const api = useTypedApi()

  const useQuoteHistoryQuery = (
    QuoteConfigurationMappingId: number | null,
    isQuoteHistoryDrawerOpen: boolean,
    DaysBack = 30
  ) =>
    useQuery({
      queryKey: [...queryKey('/api/QuoteBook/History/GetQuoteHistory'), { QuoteConfigurationMappingId, DaysBack }],
      queryFn: () =>
        unwrap(
          api.POST('/api/QuoteBook/History/GetQuoteHistory', {
            body: { QuoteConfigurationMappingId, DaysBack },
          })
        ),
      enabled: !!QuoteConfigurationMappingId && isQuoteHistoryDrawerOpen,
      refetchOnWindowFocus: false,
    })

  const useQuoteBookHistoryMetaData = (QuoteConfigurationMappingId: number | null, isQuoteHistoryDrawerOpen: boolean) =>
    useQuery({
      queryKey: [...queryKey('/api/QuoteBook/History/GetMetaData'), QuoteConfigurationMappingId],
      queryFn: () =>
        unwrap(
          api.POST('/api/QuoteBook/History/GetMetaData', {
            body: { QuoteConfigurationMappingId },
          })
        ),
      refetchOnWindowFocus: false,
      enabled: !!QuoteConfigurationMappingId && isQuoteHistoryDrawerOpen,
    })

  return { useQuoteHistoryQuery, useQuoteBookHistoryMetaData }
}
