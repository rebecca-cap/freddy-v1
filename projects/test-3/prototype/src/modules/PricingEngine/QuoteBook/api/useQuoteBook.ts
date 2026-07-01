import { toastApiError } from '@api/common'
import { NotificationMessage, useApi } from '@gravitate-js/excalibrr'
import {
  PublicationModes,
  QuoteBookEODPublishData,
  QuoteBookMetadataResponse,
  QuoteBookOverview,
  QuoteBookSaveSpreadOverride,
  QuoteBookUpdateAdjustment,
} from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const endpoints = {
  overview: 'QuoteBook/GetRows',
  metadata: 'QuoteBook/GetMetaData',
  publishQuoteBook: 'QuoteBook/Publish',
  quoteUpdateAdjustments: 'QuoteBook/UpdateAdjustments',
  saveSpreadOverrides: 'QuoteBook/SaveSpreadOverrides',
  getReferenceStrategyData: 'QuoteBook/Analytics/ReferenceStrategy/GetDataForAnalytic',
} as const
const seedUnimplementedData = (response: QuoteBookOverview): QuoteBookOverview => {
  return {
    ...response,
    Data: response?.Data?.map((row) => ({
      ...row,
      Allocation: Math.ceil(Math.random() * 100),
    })),
  }
}
export const useQuoteBook = () => {
  const queryClient = useQueryClient()
  const api = useApi()

  const useQuotes = (PublicationMode?: PublicationModes) =>
    useQuery(
      [endpoints.overview, PublicationMode],
      async () => {
        const data = (await api.post(endpoints.overview, { PublicationMode })) as QuoteBookOverview

        return seedUnimplementedData(data)
      },
      {
        enabled: !!PublicationMode,
        refetchOnWindowFocus: false,
      }
    )

  const useQuoteBookMetaData = (PublicationMode?: PublicationModes) =>
    useQuery<QuoteBookMetadataResponse>(
      [endpoints.metadata, PublicationMode],
      () => api.post(endpoints.metadata, { PublicationMode }),
      { refetchOnWindowFocus: false, enabled: !!PublicationMode }
    )

  const useQuoteBookPublishMutation = () =>
    useMutation(
      [endpoints.publishQuoteBook],
      (QuoteBookPublishData: QuoteBookEODPublishData) => api.post(endpoints.publishQuoteBook, QuoteBookPublishData),
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries([endpoints.overview])
        },
        onError: toastApiError,
      }
    )

  const useQuoteBookUpdateAdjustmentsMutation = () =>
    useMutation(
      [endpoints.quoteUpdateAdjustments],
      (payload: QuoteBookUpdateAdjustment) => api.post(endpoints.quoteUpdateAdjustments, { ...payload }),
      {
        onSuccess: async () => {
          NotificationMessage('Success', 'Adjustment(s) saved successfully', false)
          await queryClient.invalidateQueries([endpoints.overview])
        },
        onError: (e) => {
          toastApiError(e, 5)
        },
      }
    )

  const useQuoteBookSaveSpreadOverridesMutation = () =>
    useMutation(
      [endpoints.saveSpreadOverrides],
      (payload: QuoteBookSaveSpreadOverride) => api.post(endpoints.saveSpreadOverrides, { ...payload } as any),
      {
        onError: (e) => {
          toastApiError(e, 5)
        },
      }
    )

  const getReferenceStrategyData = (QuoteConfigurationMappingId?: number) =>
    useQuery(
      [endpoints.getReferenceStrategyData, QuoteConfigurationMappingId],
      (): { FormulaName: string } =>
        api.post<{ FormulaName: string }>(endpoints.getReferenceStrategyData, { QuoteConfigurationMappingId }),
      { refetchOnWindowFocus: false, enabled: !!QuoteConfigurationMappingId }
    )

  return {
    useQuotes,
    useQuoteBookMetaData,
    useQuoteBookPublishMutation,
    useQuoteBookUpdateAdjustmentsMutation,
    getReferenceStrategyData,
    useQuoteBookSaveSpreadOverridesMutation,
  }
}
