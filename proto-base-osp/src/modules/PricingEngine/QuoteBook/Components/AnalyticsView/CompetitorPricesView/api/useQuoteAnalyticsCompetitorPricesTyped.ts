import { type InferResponse, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { useQuery } from '@tanstack/react-query'

type CompetitorPricesResponse = InferResponse<'/api/QuoteBook/Analytics/CompetitorPrices/Get'>

export const useQuoteAnalyticsCompetitorPricesTyped = () => {
  const api = useTypedApi()

  const getCompetitorPricesQuery = (QuoteConfigurationMappingId: number, UseOpisPrices = false) =>
    useQuery({
      queryKey: [
        ...queryKey('/api/QuoteBook/Analytics/CompetitorPrices/Get'),
        { QuoteConfigurationMappingId, UseOpisPrices },
      ],
      queryFn: () =>
        unwrap(
          api.POST('/api/QuoteBook/Analytics/CompetitorPrices/Get', {
            body: { QuoteConfigurationMappingId, UseOpisPrices },
          })
        ),
      refetchOnWindowFocus: false,
      enabled: !!QuoteConfigurationMappingId,
    })

  return { getCompetitorPricesQuery }
}
