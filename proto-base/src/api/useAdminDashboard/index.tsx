import { useApi } from '@gravitate-js/excalibrr'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'

const endpoints = {
  pendingOrders: 'MarketPlatform/AdminOrderDashboard/GetPendingOrders',
  recentlyProcessed: 'MarketPlatform/AdminOrderDashboard/GetRecentlyProcessedOrders',
  processedVolume: 'MarketPlatform/AdminOrderDashboard/GetProcessedVolume',
  processedProfit: 'MarketPlatform/AdminOrderDashboard/GetProcessedProfit',
  processedPromptVolume: 'MarketPlatform/AdminOrderDashboard/GetProcessedPromptVolume',
  processedForwardVolume: 'MarketPlatform/AdminOrderDashboard/GetProcessedForwardVolume',
} as const

export const useAdminDashboard = () => {
  const api = useApi()
  const queryDate = moment().subtract(1, 'months')
  const pendingQueryDate = moment().subtract(10, 'years')

  const useAdminDashboardQuery = () =>
    useQuery(
      ['adminDashboard'],
      async () => {
        let pendingPromptOrders
        let pendingForwardOrders
        let recentlyProcessedForwards
        let recentlyProcessedPrompts

        try {
          pendingPromptOrders = await api.post(endpoints.pendingOrders, {
            MinCreatedDateTime: pendingQueryDate,
            TradeTypeMeaning: 'Prompt',
          })
        } catch (error) {
          console.error('Error fetching pendingPromptOrders:', error)
        }

        try {
          pendingForwardOrders = await api.post(endpoints.pendingOrders, {
            MinCreatedDateTime: pendingQueryDate,
            TradeTypeMeaning: 'Forward',
          })
        } catch (error) {
          console.error('Error fetching pendingForwardOrders:', error)
        }

        try {
          recentlyProcessedForwards = await api.post(endpoints.recentlyProcessed, {
            MinCreatedDateTime: queryDate,
            TradeTypeMeaning: 'Forward',
          })
        } catch (error) {
          console.error('Error fetching recentlyProcessedForwards:', error)
        }

        try {
          recentlyProcessedPrompts = await api.post(endpoints.recentlyProcessed, {
            MinCreatedDateTime: queryDate,
            TradeTypeMeaning: 'Prompt',
          })
        } catch (error) {
          console.error('Error fetching recentlyProcessedPrompts:', error)
        }

        return {
          pendingPromptOrders,
          pendingForwardOrders,
          recentlyProcessedForwards,
          recentlyProcessedPrompts,
        }
      },
      {
        refetchOnWindowFocus: false,
        refetchInterval: 30 * 1000,
      }
    )

  const useProcessedVolumeQuery = (FromDate, ToDate) =>
    useQuery(
      [endpoints.processedVolume, FromDate, ToDate],
      ({ queryKey }) =>
        api.post(queryKey[0], {
          FromDate: queryKey[1],
          ToDate: queryKey[2],
        }),
      {
        refetchOnWindowFocus: false,
        refetchInterval: 30 * 1000,
      }
    )

  const useProcessedProfitQuery = (FromDate, ToDate) =>
    useQuery(
      [endpoints.processedProfit, FromDate, ToDate],
      ({ queryKey }) =>
        api.post(queryKey[0], {
          FromDate: queryKey[1],
          ToDate: queryKey[2],
        }),
      {
        refetchOnWindowFocus: false,
        refetchInterval: 30 * 1000,
      }
    )

  const useProcessedPromptVolumeQuery = (FromDate, ToDate) =>
    useQuery(
      [endpoints.processedPromptVolume, FromDate, ToDate],
      ({ queryKey }) =>
        api.post(queryKey[0], {
          FromDate: queryKey[1],
          ToDate: queryKey[2],
        }),
      {
        refetchOnWindowFocus: false,
        refetchInterval: 30 * 1000,
      }
    )

  const useProcessedForwardVolumeQuery = (FromDate, ToDate) =>
    useQuery(
      [endpoints.processedForwardVolume, FromDate, ToDate],
      ({ queryKey }) =>
        api.post(queryKey[0], {
          FromDate: queryKey[1],
          ToDate: queryKey[2],
        }),
      {
        refetchOnWindowFocus: false,
        refetchInterval: 30 * 1000,
      }
    )

  return {
    useAdminDashboardQuery,
    useProcessedVolumeQuery,
    useProcessedProfitQuery,
    useProcessedPromptVolumeQuery,
    useProcessedForwardVolumeQuery,
  }
}
