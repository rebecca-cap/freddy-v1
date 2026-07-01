import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const endpoints = {
  metadata: 'MarketPlatform/Admin/TradeEntrySetup/GetMetaData',
  read: 'MarketPlatform/Admin/TradeEntrySetup/Read',
  update: 'MarketPlatform/Admin/TradeEntrySetup/Update',
} as const

export const useMarketPlatformSetups = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useMetadataQuery = () =>
    useQuery([endpoints.metadata], () => api.post(endpoints.metadata), {
      refetchOnWindowFocus: false,
    })

  const useMPSGetQuery = () =>
    useQuery([endpoints.read], () => api.post(endpoints.read, { ProductId: null, LocationId: null }), {
      refetchOnWindowFocus: true,
    })

  const useMarketPlatformSetupsMutation = () =>
    useMutation([endpoints.update], (rows: any[]) => api.post(endpoints.update, rows), {
      onMutate: async (rows) => {
        await queryClient.cancelQueries([endpoints.read])
        const previousQueries = queryClient.getQueriesData([endpoints.read])

        const updatedRows = rows.map((row) => row.TradeEntrySetupId)

        queryClient.setQueriesData([endpoints.read], (cache) => {
          return {
            ...cache,
            Data: cache.Data.map((d) =>
              updatedRows.includes(d.TradeEntrySetupId)
                ? rows.find((row) => row.TradeEntrySetupId.toString() === d.TradeEntrySetupId.toString())
                : d
            ),
          }
        })
        return rows
      },
    })
  return { useMetadataQuery, useMPSGetQuery, useMarketPlatformSetupsMutation }
}
