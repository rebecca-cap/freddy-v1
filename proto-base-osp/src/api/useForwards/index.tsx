import { useApi } from '@gravitate-js/excalibrr'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import type { ForwardPrice, InstrumentID, MarketPlatformInstrument, OrderEntryResponse } from './types'

export const endpoints = {
  marketPlatformInstruments: 'MarketPlatform/OrderEntry/GetMarketPlatformInstruments',
  priceInstruments: 'MarketPlatform/OrderEntry/GetItemsAvailableForOrder',
  orderEntryData: 'MarketPlatform/OrderEntry/GetOrderEntryData',
  submit: 'MarketPlatform/OrderEntry/SubmitOrder',
}

export const useForwards = () => {
  const api = useApi()
  const queryClient = useQueryClient()
  const [refreshInterval, setRefreshInterval] = useState(30)

  const getMarketPlatformInstruments = () =>
    useQuery(
      [endpoints.marketPlatformInstruments],
      () => api.post(endpoints.marketPlatformInstruments) as MarketPlatformInstrument[],
      {
        onSuccess: (resp) => {
          const forwardsRefreshInterval = resp.Data.find((i) => i.Name === 'Forward')?.AutoRefreshIntervalInSeconds
          if (forwardsRefreshInterval) {
            setRefreshInterval(forwardsRefreshInterval)
          }
        },
      }
    )

  const loadForwardPrices = (MarketPlatformInstrumentId: InstrumentID, IgnoreProductLocationPermissions: boolean) => {
    const requestData = {
      MarketPlatformInstrumentId,
      IgnoreProductLocationPermissions: !IgnoreProductLocationPermissions,
      IncludeHistoricalPricingInformation: true,
    }
    return useQuery(
      [endpoints.priceInstruments, MarketPlatformInstrumentId, IgnoreProductLocationPermissions],
      () => api.post(endpoints.priceInstruments, requestData) as ForwardPrice[],
      {
        refetchInterval: refreshInterval * 1000,
        enabled: !!MarketPlatformInstrumentId,
        refetchOnWindowFocus: false,
      }
    )
  }
  const getOrderEntryInfo = (selectedItemKeys: string[], onlyAssigned = true) =>
    useQuery<OrderEntryResponse>(
      [endpoints.orderEntryData, selectedItemKeys],
      () =>
        api.post(endpoints.orderEntryData, {
          SelectedItemKeys: selectedItemKeys,
          OnlyAssignedAdditionalProducts: onlyAssigned,
        }),
      { refetchOnWindowFocus: false }
    )

  const refetchOrderEntryInfo = (selectedItemKeys: string[]) => {
    queryClient.invalidateQueries([endpoints.orderEntryData, selectedItemKeys])
  }

  const submitOrder = async (order) => {
    return api.post(endpoints.submit, order)
  }

  return { getMarketPlatformInstruments, loadForwardPrices, getOrderEntryInfo, refetchOrderEntryInfo, submitOrder }
}
