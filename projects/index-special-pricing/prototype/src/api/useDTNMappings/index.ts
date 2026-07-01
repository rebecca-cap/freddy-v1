import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { CreateOrUpdateMappingsPayload, DTNMappingsResponse, DTNMetadataResponse } from './types'

export const endpoints = {
  dtnMappingsRead: 'PriceImport/TranslationManagement/GetPriceTranslationData',
  dtnMetadataRead: 'PriceImport/TranslationManagement/GetMetadata',
  dtnMappingsUpdate: 'PriceImport/TranslationManagement/UpdateTranslations',
}

export const useDTNMappings = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useDTNMappingsQuery = () =>
    useQuery([endpoints.dtnMappingsRead], () => api.post(endpoints.dtnMappingsRead) as DTNMappingsResponse, {
      refetchOnWindowFocus: false,
    })

  const useDTNMetadataQuery = () =>
    useQuery([endpoints.dtnMetadataRead], () => api.post(endpoints.dtnMetadataRead) as DTNMetadataResponse, {
      refetchOnWindowFocus: false,
    })

  const useDTNMappingsUpdateMutation = useMutation({
    mutationFn: (payload: CreateOrUpdateMappingsPayload) => api.post(endpoints.dtnMappingsUpdate, payload),
    onSuccess: (resp) => {
      queryClient.invalidateQueries([endpoints.dtnMappingsRead]).then()
    },
  })

  return {
    useDTNMappingsQuery,
    useDTNMetadataQuery,
    useDTNMappingsUpdateMutation,
  }
}
