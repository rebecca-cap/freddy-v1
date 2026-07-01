import { useApi } from '@gravitate-js/excalibrr'
import {
  UseOnlineOrderUpdatePayload,
  UseOnlineOrderUpdateResponse,
  UseOnlineOrderViewResponse,
} from '@hooks/useOnlineOrderViewTypes'
import { useQuery } from '@tanstack/react-query'

export const endpoints = {
  getOrderView: 'MarketPlatform/OrderEntry/GetMarketPlatformOrderView',
  getAdminOrderView: 'MarketPlatform/OrderEntry/GetAdminMarketPlatformOrderView',
  updateOrder: 'MarketPlatform/OrderEntry/UpdateOrder',
}

export const useOnlineOrderView = () => {
  const api = useApi()

  const getOrderView = (primaryKey, currentItemId, isAdmin) =>
    useQuery<UseOnlineOrderViewResponse>(
      [isAdmin ? endpoints.getAdminOrderView : endpoints.getOrderView],
      () =>
        api.post(isAdmin ? endpoints.getAdminOrderView : endpoints.getOrderView, {
          [primaryKey]: currentItemId,
        }),
      {
        refetchOnWindowFocus: false,
        enabled: !!primaryKey && !!currentItemId,
      }
    )

  const updateOrder = async (order: UseOnlineOrderUpdatePayload): Promise<UseOnlineOrderUpdateResponse> => {
    return api.post(endpoints.updateOrder, order)
  }

  return { getOrderView, updateOrder }
}
