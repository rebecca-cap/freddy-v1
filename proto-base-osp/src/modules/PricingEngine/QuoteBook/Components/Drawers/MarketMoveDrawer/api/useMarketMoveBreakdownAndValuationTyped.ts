import { type InferResponse, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { PublicationMode } from '@modules/PricingEngine/QuoteBook/Components/Drawers/QuoteBookPublishConfirmDrawer/schema.types'
import { useQuery } from '@tanstack/react-query'

type MarketMoveBreakdownResponse = InferResponse<'/api/QuoteBook/GetMarketMoveBreakdown'>

export const useMarketMoveBreakdownAndValuationTyped = () => {
  const api = useTypedApi()

  const getMarketMoveBreakdown = (row: Quote | null, publicationMode: PublicationMode) =>
    useQuery({
      queryKey: [...queryKey('/api/QuoteBook/GetMarketMoveBreakdown'), row],
      queryFn: () =>
        unwrap(
          api.POST('/api/QuoteBook/GetMarketMoveBreakdown', {
            body: {
              QuoteConfigurationMappingId: row?.QuoteConfigurationMappingId,
              PublicationMode: publicationMode,
            },
          })
        ),
      refetchOnWindowFocus: false,
      enabled: !!row,
    })

  return { getMarketMoveBreakdown }
}
