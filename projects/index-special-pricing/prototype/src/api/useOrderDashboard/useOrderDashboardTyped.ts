/**
 * Type-safe Order Dashboard API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('MarketPlatform/OrderReporting/GetPendingOrders')
 * - New: api.POST('/api/MarketPlatform/OrderReporting/GetPendingOrders')
 */

import { useQuery } from '@tanstack/react-query'
import dayjs from '@utils/dayjs'

import {
  useTypedApi,
  unwrap,
  type InferResponse,
} from '@hooks/useTypedApi'

export type OrderDashboardPendingOrdersResponse = InferResponse<'/api/MarketPlatform/OrderReporting/GetPendingOrders'>
export type OrderDashboardProcessedOrdersResponse = InferResponse<'/api/MarketPlatform/OrderReporting/GetRecentlyProcessedOrders'>
export type OrderDashboardCreditWidgetResponse = InferResponse<'/api/MarketPlatform/OrderReporting/GetCreditWidget'>
export type OrderDashboardPricesResponse = InferResponse<'/api/MarketPlatform/OrderEntry/GetPricesForDashboard'>

export const useOrderDashboardTyped = () => {
  const api = useTypedApi()
  const queryDate = dayjs().subtract(1, 'months')
  const pendingQueryDate = dayjs().subtract(10, 'years')

  /**
   * Fetch all order dashboard data
   */
  const useOrderDashboardQuery = () =>
    useQuery({
      queryKey: ['orderDashboard'],
      queryFn: async () => {
        let pendingPromptOrders: OrderDashboardPendingOrdersResponse | undefined
        let pendingForwardOrders: OrderDashboardPendingOrdersResponse | undefined
        let recentlyProcessedForwards: OrderDashboardProcessedOrdersResponse | undefined
        let recentlyProcessedPrompts: OrderDashboardProcessedOrdersResponse | undefined
        let creditWidget: OrderDashboardCreditWidgetResponse | undefined
        let productListings: OrderDashboardPricesResponse | undefined

        try {
          pendingPromptOrders = await unwrap(
            api.POST('/api/MarketPlatform/OrderReporting/GetPendingOrders', {
              body: {
                MinCreatedDateTime: pendingQueryDate.toDate(),
                TradeTypeMeaning: 'Prompt',
              },
            })
          )
        } catch (error) {
          console.error('Error fetching pendingPromptOrders:', error)
        }

        try {
          pendingForwardOrders = await unwrap(
            api.POST('/api/MarketPlatform/OrderReporting/GetPendingOrders', {
              body: {
                MinCreatedDateTime: pendingQueryDate.toDate(),
                TradeTypeMeaning: 'Forward',
              },
            })
          )
        } catch (error) {
          console.error('Error fetching pendingForwardOrders:', error)
        }

        try {
          recentlyProcessedForwards = await unwrap(
            api.POST('/api/MarketPlatform/OrderReporting/GetRecentlyProcessedOrders', {
              body: {
                MinCreatedDateTime: queryDate.toDate(),
                TradeTypeMeaning: 'Forward',
              },
            })
          )
        } catch (error) {
          console.error('Error fetching recentlyProcessedForwards:', error)
        }

        try {
          recentlyProcessedPrompts = await unwrap(
            api.POST('/api/MarketPlatform/OrderReporting/GetRecentlyProcessedOrders', {
              body: {
                MinCreatedDateTime: queryDate.toDate(),
                TradeTypeMeaning: 'Prompt',
              },
            })
          )
        } catch (error) {
          console.error('Error fetching recentlyProcessedPrompts:', error)
        }

        try {
          creditWidget = await unwrap(api.POST('/api/MarketPlatform/OrderReporting/GetCreditWidget'))
        } catch (error) {
          console.error('Error fetching creditWidget:', error)
        }

        try {
          productListings = await unwrap(api.POST('/api/MarketPlatform/OrderEntry/GetPricesForDashboard'))
        } catch (error) {
          console.error('Error fetching productListings:', error)
        }

        return {
          pendingPromptOrders,
          pendingForwardOrders,
          recentlyProcessedForwards,
          recentlyProcessedPrompts,
          creditWidget,
          productListings,
        }
      },
      refetchOnWindowFocus: false,
      refetchInterval: 30 * 1000,
    })

  return {
    useOrderDashboardQuery,
  }
}
