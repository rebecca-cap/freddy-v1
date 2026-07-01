import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { QuantityDistributionBulkUpsertRequest, QuantityDistributionResponse } from './type.schema'

const endpoints = {
  getQuantityDistribution: 'MarketPlatform/QuantityDistribution/GetQuantityDistributionWeights',
  upsertQuantityDistribution: 'MarketPlatform/QuantityDistribution/UpsertQuantityDistributionWeights',
} as const

export function useQuantityDistribution() {
  const api = useApi()
  const queryClient = useQueryClient()

  const useQuantityDistributionQuery = () =>
    useQuery<QuantityDistributionResponse>({
      queryKey: [endpoints.getQuantityDistribution],
      queryFn: () => {
        return api.post(endpoints.getQuantityDistribution)
      },
      refetchOnWindowFocus: false,
    })

  const useUpsertQuantityDistributionMutation = () =>
    useMutation({
      mutationFn: (data: QuantityDistributionBulkUpsertRequest) => api.post(endpoints.upsertQuantityDistribution, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [endpoints.getQuantityDistribution] })
      },
    })

  return { useQuantityDistributionQuery, useUpsertQuantityDistributionMutation }
}
