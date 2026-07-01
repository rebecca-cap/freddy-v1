import { APIResponse } from '@api/globalTypes'
import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  ReadTradeEntrySetupVolumeThresholdsResponse,
  TradeEntrySetupVolumeThreshold,
  UpdateTradeEntrySetupVolumeThresholdsRequest,
  UpdateTradeEntrySetupVolumeThresholdsResponse,
} from './types.schema'

const endpoints = {
  read: 'MarketPlatform/Admin/TradeEntrySetupVolumeConstraints/ReadTradeEntrySetupVolumeThresholds',
  update: 'MarketPlatform/Admin/TradeEntrySetupVolumeConstraints/UpdateTradeEntrySetupVolumeThresholds',
} as const

const queryKeys = {
  thresholds: [endpoints.read] as const,
}

export const useManageVolumeThresholds = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const getVolumeThresholds = () =>
    useQuery<ReadTradeEntrySetupVolumeThresholdsResponse>(
      queryKeys.thresholds,
      async ({ queryKey }) => {
        const res = await api.post(queryKey[0] as string)
        return res as ReadTradeEntrySetupVolumeThresholdsResponse
      },
      {
        refetchOnWindowFocus: false,
      }
    )

  const updateVolumeThresholds = () =>
    useMutation<UpdateTradeEntrySetupVolumeThresholdsResponse, unknown, UpdateTradeEntrySetupVolumeThresholdsRequest>(
      (payload) =>
        api.post<APIResponse<TradeEntrySetupVolumeThreshold[]>>(
          endpoints.update,
          payload as any
        ) as Promise<UpdateTradeEntrySetupVolumeThresholdsResponse>,
      {
        onSuccess: () => {
          queryClient.invalidateQueries(queryKeys.thresholds).then()
        },
      }
    )

  return {
    getVolumeThresholds,
    updateVolumeThresholds,
  }
}
