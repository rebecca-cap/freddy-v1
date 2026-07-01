import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NotificationMessage } from '@gravitate-js/excalibrr'
import {
  useTypedApi,
  unwrap,
  queryKey,
  type InferResponse,
  type InferRequestBody,
} from '@hooks/useTypedApi'

type GetOrdersResponse = InferResponse<'/api/MarketPlatform/OnlineOrders/GetOrders'>
type GetMetaDataResponse = InferResponse<'/api/MarketPlatform/OnlineOrders/GetMetaData'>
type GetOrdersRequest = InferRequestBody<'/api/MarketPlatform/OnlineOrders/GetOrders'>

export const useOnlineOrdersTyped = () => {
  const api = useTypedApi()
  const queryClient = useQueryClient()

  const getOnlineOrders = (payload: GetOrdersRequest) =>
    useQuery({
      queryKey: [...queryKey('/api/MarketPlatform/OnlineOrders/GetOrders'), payload],
      queryFn: () =>
        unwrap(api.POST('/api/MarketPlatform/OnlineOrders/GetOrders', { body: payload })),
      enabled: !!payload?.DateRangeStart && !!payload?.DateRangeEnd,
      refetchOnWindowFocus: false,
    })

  const getMetaData = () =>
    useQuery({
      queryKey: queryKey('/api/MarketPlatform/OnlineOrders/GetMetaData'),
      queryFn: () =>
        unwrap(api.POST('/api/MarketPlatform/OnlineOrders/GetMetaData')),
      refetchOnWindowFocus: false,
    })

  const toggleIsHedged = useMutation({
    mutationFn: (TradeEntryId: number) =>
      unwrap(api.POST('/api/MarketPlatform/OrderEntry/ToggleIsHedged', {
        body: { TradeEntryId },
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey('/api/MarketPlatform/OnlineOrders/GetOrders') })
    },
    onError: (error: unknown) => {
      console.error(error)
      NotificationMessage('Error', 'Failed to toggle hedged status', true)
    },
  })

  const resubmitOrder = useMutation({
    mutationFn: (TradeEntryId: number) =>
      unwrap(api.POST('/api/MarketPlatform/OrderEntry/Resubmit', {
        body: { TradeEntryId },
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey('/api/MarketPlatform/OnlineOrders/GetOrders') })
    },
    onError: (error: unknown) => {
      console.error(error)
      NotificationMessage('Error', 'Failed to resubmit order', true)
    },
  })

  const cancelOrder = useMutation({
    mutationFn: (TradeEntryId: number) =>
      unwrap(api.POST('/api/MarketPlatform/OrderEntry/Cancel', {
        body: { TradeEntryId },
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey('/api/MarketPlatform/OnlineOrders/GetOrders') })
    },
    onError: (error: unknown) => {
      console.error(error)
      NotificationMessage('Error', 'Failed to cancel order', true)
    },
  })

  return { getOnlineOrders, getMetaData, toggleIsHedged, resubmitOrder, cancelOrder }
}
