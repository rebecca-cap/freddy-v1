/**
 * Type-safe Forwards API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('MarketPlatform/OrderEntry/GetMarketPlatformInstruments')
 * - New: api.POST('/api/MarketPlatform/OrderEntry/GetMarketPlatformInstruments')
 */

import { type InferRequestBody, type InferResponse, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export type ForwardsInstrumentsResponse = InferResponse<'/api/MarketPlatform/OrderEntry/GetMarketPlatformInstruments'>
export type ForwardsPricesResponse = InferResponse<'/api/MarketPlatform/OrderEntry/GetItemsAvailableForOrder'>
export type ForwardsOrderEntryResponse = InferResponse<'/api/MarketPlatform/OrderEntry/GetOrderEntryData'>
export type ForwardsSubmitResponse = InferResponse<'/api/MarketPlatform/OrderEntry/SubmitOrder'>

type ForwardsPricesRequest = InferRequestBody<'/api/MarketPlatform/OrderEntry/GetItemsAvailableForOrder'>
type ForwardsOrderEntryRequest = InferRequestBody<'/api/MarketPlatform/OrderEntry/GetOrderEntryData'>
export type ForwardsSubmitRequest = InferRequestBody<'/api/MarketPlatform/OrderEntry/SubmitOrder'>
export type ForwardsSelectedItemKey = NonNullable<ForwardsOrderEntryRequest['SelectedItemKeys']>[number]

const queryKeys = {
  marketPlatformInstruments: queryKey('/api/MarketPlatform/OrderEntry/GetMarketPlatformInstruments'),
  priceInstruments: queryKey('/api/MarketPlatform/OrderEntry/GetItemsAvailableForOrder'),
  orderEntryData: queryKey('/api/MarketPlatform/OrderEntry/GetOrderEntryData'),
} as const

export const useForwardsTyped = () => {
  const api = useTypedApi()
  const queryClient = useQueryClient()

  /**
   * Fetch market platform instruments
   */
  const useMarketPlatformInstrumentsQuery = () => {
    return useQuery({
      queryKey: queryKeys.marketPlatformInstruments,
      queryFn: () => unwrap(api.POST('/api/MarketPlatform/OrderEntry/GetMarketPlatformInstruments')),
    })
  }

  /**
   * Helper to extract refresh interval from instruments data
   * Use this in components to derive the refresh interval from query data
   */
  const getRefreshIntervalFromInstruments = (data: ForwardsInstrumentsResponse | undefined) => {
    return data?.Data?.find((i) => i.Name === 'Forward')?.AutoRefreshIntervalInSeconds ?? 30
  }

  /** @deprecated Use useMarketPlatformInstrumentsQuery instead */
  const getMarketPlatformInstruments = useMarketPlatformInstrumentsQuery

  /**
   * Load forward prices for an instrument
   * @param refreshIntervalSeconds - Refresh interval in seconds (default 30). Pass the value from getRefreshIntervalFromInstruments()
   */
  const loadForwardPrices = (
    MarketPlatformInstrumentId: number | undefined,
    IgnoreProductLocationPermissions: boolean,
    refreshIntervalSeconds = 30
  ) => {
    const requestData = {
      MarketPlatformInstrumentId,
      IgnoreProductLocationPermissions: !IgnoreProductLocationPermissions,
      IncludeHistoricalPricingInformation: true,
    }
    return useQuery({
      queryKey: [queryKeys.priceInstruments[0], MarketPlatformInstrumentId, IgnoreProductLocationPermissions],
      queryFn: () =>
        unwrap(
          api.POST('/api/MarketPlatform/OrderEntry/GetItemsAvailableForOrder', {
            body: requestData,
          })
        ),
      refetchInterval: refreshIntervalSeconds * 1000,
      enabled: !!MarketPlatformInstrumentId,
      refetchOnWindowFocus: false,
    })
  }

  /**
   * Fetch order entry info for selected items
   */
  const getOrderEntryInfo = (selectedItemKeys: ForwardsSelectedItemKey[], onlyAssigned = true) =>
    useQuery({
      queryKey: [queryKeys.orderEntryData[0], selectedItemKeys],
      queryFn: () =>
        unwrap(
          api.POST('/api/MarketPlatform/OrderEntry/GetOrderEntryData', {
            body: {
              SelectedItemKeys: selectedItemKeys,
              OnlyAssignedAdditionalProducts: onlyAssigned,
            },
          })
        ),
      refetchOnWindowFocus: false,
    })

  /**
   * Refetch order entry info
   */
  const refetchOrderEntryInfo = (selectedItemKeys: ForwardsSelectedItemKey[]) => {
    queryClient.invalidateQueries({ queryKey: [queryKeys.orderEntryData[0], selectedItemKeys] })
  }

  /**
   * Submit an order
   */
  const submitOrder = async (order: ForwardsSubmitRequest) => {
    return unwrap(
      api.POST('/api/MarketPlatform/OrderEntry/SubmitOrder', {
        body: order,
      })
    )
  }

  return {
    getMarketPlatformInstruments,
    useMarketPlatformInstrumentsQuery,
    getRefreshIntervalFromInstruments,
    loadForwardPrices,
    getOrderEntryInfo,
    refetchOrderEntryInfo,
    submitOrder,
  }
}
