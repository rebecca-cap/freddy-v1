import { useApi } from '@gravitate-js/excalibrr'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'

const endpoints = {
  pendingPromptOrders: 'MarketPlatform/OrderReporting/GetPendingOrders',
  pendingForwardOrders: 'MarketPlatform/OrderReporting/GetPendingOrders',
  recentlyProcessedForwards: 'MarketPlatform/OrderReporting/GetRecentlyProcessedOrders',
  recentlyProcessedPrompts: 'MarketPlatform/OrderReporting/GetRecentlyProcessedOrders',
  creditWidget: 'MarketPlatform/OrderReporting/GetCreditWidget',
  productListings: 'MarketPlatform/OrderEntry/GetPricesForDashboard',
} as const

export const useOrderDashboard = () => {
  const api = useApi()
  const queryDate = moment().subtract(1, 'months')
  const pendingQueryDate = moment().subtract(10, 'years')

  const useOrderDashboardQuery = () =>
    useQuery(
      ['orderDashboard'],
      async () => {
        let pendingPromptOrders
        let pendingForwardOrders
        let recentlyProcessedForwards
        let recentlyProcessedPrompts
        let creditWidget
        let productListings

        try {
          pendingPromptOrders = await api.post(endpoints.pendingPromptOrders, {
            MinCreatedDateTime: pendingQueryDate,
            TradeTypeMeaning: 'Prompt',
          })
        } catch (error) {
          console.error('Error fetching pendingPromptOrders:', error)
        }

        try {
          pendingForwardOrders = await api.post(endpoints.pendingForwardOrders, {
            MinCreatedDateTime: pendingQueryDate,
            TradeTypeMeaning: 'Forward',
          })
        } catch (error) {
          console.error('Error fetching pendingForwardOrders:', error)
        }

        try {
          recentlyProcessedForwards = await api.post(endpoints.recentlyProcessedForwards, {
            MinCreatedDateTime: queryDate,
            TradeTypeMeaning: 'Forward',
          })
        } catch (error) {
          console.error('Error fetching recentlyProcessedForwards:', error)
        }

        try {
          recentlyProcessedPrompts = await api.post(endpoints.recentlyProcessedPrompts, {
            MinCreatedDateTime: queryDate,
            TradeTypeMeaning: 'Prompt',
          })
        } catch (error) {
          console.error('Error fetching recentlyProcessedPrompts:', error)
        }

        try {
          creditWidget = await api.post(endpoints.creditWidget)
        } catch (error) {
          console.error('Error fetching creditWidget:', error)
        }

        try {
          productListings = await api.post(endpoints.productListings)
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
      {
        refetchOnWindowFocus: false,
        refetchInterval: 30 * 1000,
      }
    )

  return {
    useOrderDashboardQuery,
  }
}
