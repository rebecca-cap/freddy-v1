/**
 * Type-safe Online Order View API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('MarketPlatform/OrderEntry/GetMarketPlatformOrderView')
 * - New: api.POST('/api/MarketPlatform/OrderEntry/GetMarketPlatformOrderView')
 */

import {
  queryKey,
  unwrap,
  useTypedApi,
  type InferRequestBody,
  type InferResponse,
} from '@hooks/useTypedApi'
import { useQuery } from '@tanstack/react-query'

export type OrderViewResponse = InferResponse<'/api/MarketPlatform/OrderEntry/GetMarketPlatformOrderView'>
export type AdminOrderViewResponse = InferResponse<'/api/MarketPlatform/OrderEntry/GetAdminMarketPlatformOrderView'>
export type UpdateOrderResponse = InferResponse<'/api/MarketPlatform/OrderEntry/UpdateOrder'>

export type UpdateOrderRequest = InferRequestBody<'/api/MarketPlatform/OrderEntry/UpdateOrder'>

const queryKeys = {
  orderView: queryKey('/api/MarketPlatform/OrderEntry/GetMarketPlatformOrderView'),
  adminOrderView: queryKey('/api/MarketPlatform/OrderEntry/GetAdminMarketPlatformOrderView'),
} as const

export const useOnlineOrderViewTyped = () => {
  const api = useTypedApi()

  /**
   * Fetch order view data
   * Uses different endpoints based on isAdmin flag
   *
   * @param primaryKey - The key name for the item ID (e.g., 'TradeEntryId')
   * @param currentItemId - The ID of the item to fetch
   * @param isAdmin - Whether to use the admin endpoint
   */
  const useOrderViewQuery = (primaryKey: string, currentItemId: number, isAdmin: boolean) =>
    useQuery({
      queryKey: isAdmin
        ? [...queryKeys.adminOrderView, currentItemId]
        : [...queryKeys.orderView, currentItemId],
      queryFn: () => {
        const body = { [primaryKey]: currentItemId }
        return isAdmin
          ? unwrap(
              api.POST('/api/MarketPlatform/OrderEntry/GetAdminMarketPlatformOrderView', {
                body,
              })
            )
          : unwrap(
              api.POST('/api/MarketPlatform/OrderEntry/GetMarketPlatformOrderView', {
                body,
              })
            )
      },
      refetchOnWindowFocus: false,
      enabled: !!primaryKey && !!currentItemId,
    })

  /**
   * Update an order
   *
   * @param order - The order update request payload
   * @returns Promise with the update response
   */
  const updateOrder = async (order: UpdateOrderRequest): Promise<UpdateOrderResponse> =>
    unwrap(
      api.POST('/api/MarketPlatform/OrderEntry/UpdateOrder', {
        body: order,
      })
    )

  return {
    useOrderViewQuery,
    updateOrder,
    queryKeys,
  }
}
