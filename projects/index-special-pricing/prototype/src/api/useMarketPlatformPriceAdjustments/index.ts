import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const endpoints = {
  metadata: 'MarketPlatform/Admin/PriceAdjustment/GetMetadata',
  upsert: 'MarketPlatform/Admin/PriceAdjustment/UpsertPriceAdjustments',
  read: 'MarketPlatform/Admin/PriceAdjustment/ReadPriceAdjustments',
  delete: 'MarketPlatform/Admin/PriceAdjustment/EndDateAdjustments',
}

export const useMarketPlatformPriceAdjustments = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const usePriceAdjustmentQuery = () =>
    useQuery([endpoints.read], () => api.post(endpoints.read), {
      refetchOnWindowFocus: false,
    })

  const useMetadataQuery = () =>
    useQuery([endpoints.metadata], () => api.post(endpoints.metadata), {
      refetchOnWindowFocus: false,
    })

  const upsertPriceAdjustmentsMutation = useMutation(
    [endpoints.upsert],
    (priceAdjustmentData: any[]) => {
      return api.post(
        endpoints.upsert,
        Array.isArray(priceAdjustmentData) ? priceAdjustmentData : [priceAdjustmentData]
      )
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([endpoints.read])
      },
      onError: (err, newRow, context) => {
        queryClient.setQueriesData([endpoints.read], context)
      },
    }
  )

  const deletePriceAdjustmentsMutation = useMutation(
    [endpoints.delete],
    (priceAdjustmentData: any[]) => {
      return api.post(
        endpoints.delete,
        Array.isArray(priceAdjustmentData) ? priceAdjustmentData : [priceAdjustmentData]
      )
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([endpoints.read])
      },
      onError: (err, newRow, context) => {
        queryClient.setQueriesData([endpoints.read], context)
      },
    }
  )

  return {
    usePriceAdjustmentQuery,
    useMetadataQuery,
    upsertPriceAdjustmentsMutation,
    deletePriceAdjustmentsMutation,
  }
}
