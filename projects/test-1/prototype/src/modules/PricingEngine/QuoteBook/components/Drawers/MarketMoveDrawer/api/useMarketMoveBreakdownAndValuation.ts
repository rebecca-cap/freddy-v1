import { FormulaBreakdownAndValuationDataResponse } from '@components/shared/Drawers/FormulaBreakdownAndValuationDrawer/api/schema.type'
import { useApi } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { useQuery } from '@tanstack/react-query'
import { PublicationMode } from '@modules/PricingEngine/QuoteBook/components/Drawers/QuoteBookPublishConfirmDrawer/schema.types'

const endpoints = {
  MarketMoveBreakdown: 'QuoteBook/GetMarketMoveBreakdown',
} as const
export const useMarketMoveBreakdownAndValuation = () => {
  const api = useApi()
  const getMarketMoveBreakdown = (row: Quote | null, publicationMode: PublicationMode) =>
    useQuery<FormulaBreakdownAndValuationDataResponse>(
      [endpoints.MarketMoveBreakdown, row],
      async () =>
        api.post(endpoints.MarketMoveBreakdown, {
          QuoteConfigurationMappingId: row?.QuoteConfigurationMappingId,
          PublicationMode: publicationMode,
        }),
      {
        refetchOnWindowFocus: false,
        enabled: !!row,
      }
    )
  return { getMarketMoveBreakdown }
}
