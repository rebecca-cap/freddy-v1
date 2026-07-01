import { NotificationMessage } from '@gravitate-js/excalibrr'
import { useApi } from '@gravitate-js/excalibrr'
import { QuoteConfigurationCompetitorPricesOverview } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/types.schema'
import { UpsertQuoteCompetitorDetailsRequest } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/QuoteCompetitorDetails/api/types.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

const endpoints = {
  competitorPrices: 'Quotebook/Analytics/CompetitorPriceAdmin/Get',
  upsertDetails: 'QuoteBook/Analytics/CompetitorPriceAdmin/Upsert',
} as const

export const useQuoteCompetitorDetails = () => {
  const api = useApi()
  const useCompetitorPrices = (QuoteConfigurationMappingId: number) =>
    useQuery(
      [endpoints.competitorPrices, QuoteConfigurationMappingId],
      async ({ queryKey }) =>
        api.post(queryKey[0], { QuoteConfigurationMappingId }) as QuoteConfigurationCompetitorPricesOverview,
      {
        refetchOnWindowFocus: false,
        enabled: !!QuoteConfigurationMappingId,
      }
    )
  const upsertQuoteCompetitorDetails = useMutation(
    [endpoints.upsertDetails],
    (request: UpsertQuoteCompetitorDetailsRequest) => api.post(endpoints.upsertDetails, request),
    {
      onSuccess: () => {
        return NotificationMessage('Save Successful', '1 record updated.', false)
      },
    }
  )
  return { useCompetitorPrices, upsertQuoteCompetitorDetails }
}
