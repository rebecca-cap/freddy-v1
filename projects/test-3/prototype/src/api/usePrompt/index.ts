import {
  GetMarketPlatformInstrumentsResponse,
  ItemsAvailableForOrderResponse,
  OrderEntryDataResponse,
} from '@api/usePrompt/types.schema'
import { useApi } from '@gravitate-js/excalibrr'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export const endpoints = {
  getMarketPlatformInstruments: 'MarketPlatform/OrderEntry/GetMarketPlatformInstruments',
  getItemsAvailableForOrder: 'MarketPlatform/OrderEntry/GetItemsAvailableForOrder',
  getOrderEntryData: 'MarketPlatform/OrderEntry/GetOrderEntryData',
  submit: 'MarketPlatform/OrderEntry/SubmitOrder',
}

export const usePrompt = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const getMarketPlatformInstruments = () =>
    useQuery<GetMarketPlatformInstrumentsResponse>(
      [endpoints.getMarketPlatformInstruments],
      () => api.post(endpoints.getMarketPlatformInstruments),
      {
        refetchOnWindowFocus: false,
      }
    )

  const getItemsAvailableForOrder = (id, autoRefreshIntervalInSeconds, onlyAssigned?) =>
    useQuery<ItemsAvailableForOrderResponse>(
      [endpoints.getItemsAvailableForOrder, id, !onlyAssigned],
      () =>
        api.post(endpoints.getItemsAvailableForOrder, {
          MarketPlatformInstrumentId: id,
          IgnoreProductLocationPermissions: !onlyAssigned,
          IncludeHistoricalPricingInformation: true,
        }),
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
        refetchInterval: autoRefreshIntervalInSeconds * 1000,
      }
    )

  const getOrderEntryData = (itemKey, onlyAssigned = true) =>
    useQuery<OrderEntryDataResponse>(
      [endpoints.getOrderEntryData, itemKey],
      ({ queryKey }) =>
        api.post(endpoints.getOrderEntryData, {
          SelectedItemKeys: [queryKey[1]],
          OnlyAssignedAdditionalProducts: onlyAssigned,
        }),
      {
        onSuccess: async (response) => {
          queryClient.setQueriesData([endpoints.getItemsAvailableForOrder], (oldData) => {
            if (!oldData) return

            const updatedRows = oldData.Data?.ItemGroups?.map((item) => {
              const { TradeEntrySetupId } = response?.Data?.SelectedItems?.[0]?.ItemKey
              if (TradeEntrySetupId === item?.TradeEntrySetupId) {
                return {
                  ...item,
                  MarketPlatformItems: [
                    {
                      ...item.MarketPlatformItems?.[0],
                      Price: response?.Data?.SelectedItems?.[0]?.Price,
                    },
                  ],
                }
              }
              return item
            })

            const updatedData = { ...oldData, Data: { ...oldData?.Data, ItemGroups: updatedRows } }
            return updatedData
          })
        },
        enabled: !!itemKey,
        refetchOnWindowFocus: false,
      }
    )

  const submitOrder = async (order) => {
    return api.post(endpoints.submit, order)
  }

  return { getMarketPlatformInstruments, getItemsAvailableForOrder, getOrderEntryData, submitOrder }
}
