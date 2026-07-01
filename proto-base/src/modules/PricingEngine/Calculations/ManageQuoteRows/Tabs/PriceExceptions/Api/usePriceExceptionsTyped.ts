import { toastApiError } from '@api/common'
import { queryKey, unwrap, useTypedApi, type InferResponse, type InferRequestBody } from '@hooks/useTypedApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const paths = {
  getMetaData: '/api/PricingEngine/PricingExceptionThreshold/GetMetaData',
  getForConfiguration: '/api/PricingEngine/PricingExceptionThreshold/GetForConfiguration',
  save: '/api/PricingEngine/PricingExceptionThreshold/Save',
} as const
export type GetMetaDataResponse = InferResponse<typeof paths.getMetaData>
export type GetForConfigurationResponse = InferResponse<typeof paths.getForConfiguration>
export type SavePayload = InferRequestBody<typeof paths.save>

export const usePriceExceptionsTyped = () => {
  const queryClient = useQueryClient()
  const api = useTypedApi()

  const useMetadataQuery = () =>
    useQuery({
      queryKey: queryKey(paths.getMetaData),
      queryFn: () => unwrap(api.POST(paths.getMetaData)),
      refetchOnWindowFocus: false,
    })

  const useThresholdsQuery = () =>
    useQuery({
      queryKey: queryKey(paths.getForConfiguration),
      queryFn: () => unwrap(api.POST(paths.getForConfiguration, { body: {} })),
      refetchOnWindowFocus: false,
    })

  const saveThresholdsMutation = useMutation({
    mutationFn: (body: SavePayload) => unwrap(api.POST(paths.save, { body })),
    onSuccess: (response) => {
      const updatedRows = response?.Data ?? []
      if (updatedRows.length === 0) return
      queryClient.setQueryData<GetForConfigurationResponse | undefined>(
        queryKey(paths.getForConfiguration),
        (prev) => {
          if (!prev) return prev
          const updatedById = new Map(updatedRows.map((r) => [r.QuoteConfigurationMappingId, r]))
          return {
            ...prev,
            Data: prev.Data?.map((r) => updatedById.get(r.QuoteConfigurationMappingId) ?? r) ?? prev.Data,
          }
        }
      )
    },
    onError: (e) => toastApiError(e as Parameters<typeof toastApiError>[0]),
  })

  return {
    useThresholdsQuery,
    useMetadataQuery,
    saveThresholdsMutation,
  }
}
