import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eagerlyUpdateRowData } from '@utils/api'
import { cloneDeep } from 'lodash'

import { LoadingNumberMetadataResponse, LoadingNumberOverviewResponse } from './types'

export const endpoints = {
  metadata: 'Admin/LoadingNumberAdmin/GetMetaData',
  read: 'Admin/LoadingNumberAdmin/Read',
  upsert: 'Admin/LoadingNumberAdmin/Upsert',
}

export const useLoadingNumber = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useLoadingNumberQuery = () =>
    useQuery([endpoints.read], ({ queryKey }) => api.post(queryKey[0]) as LoadingNumberOverviewResponse)

  const useLoadingNumberMetadataQuery = () =>
    useQuery([endpoints.metadata], ({ queryKey }) => api.post(queryKey[0]) as LoadingNumberMetadataResponse)

  const createOrUpdateLoadingNumberMutation = useMutation(
    [endpoints.upsert],
    (loadingNumberData: any[]) => {
      return api.post(endpoints.upsert, Array.isArray(loadingNumberData) ? loadingNumberData : [loadingNumberData])
    },
    {
      onMutate: async (newRow) => {
        const newRowCopy = cloneDeep(newRow[0])
        await queryClient.cancelQueries([endpoints.read])
        eagerlyUpdateRowData(newRowCopy, endpoints.read, 'LoadingNumberId', queryClient)
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries([endpoints.read])
      },
      onError: (err, newRow, context) => {
        queryClient.setQueriesData([endpoints.read], context)
      },
    }
  )

  return {
    useLoadingNumberQuery,
    useLoadingNumberMetadataQuery,
    createOrUpdateLoadingNumberMutation,
  }
}
