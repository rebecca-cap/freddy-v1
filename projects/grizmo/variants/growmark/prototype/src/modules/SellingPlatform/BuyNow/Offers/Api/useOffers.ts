import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  GetAllSpecialOffersResponse,
  GetOrderEntryDataRequest,
  GetOrderEntryDataResponse,
  IndexOfferBeginOrderRequest,
  IndexOfferBeginOrderResponse,
  IndexOfferSubmitOrderRequest,
  IndexOfferSubmitOrderResponse,
  IndexOfferUpdateOrderRequest,
  IndexOfferUpdateOrderResponse,
  ItemKey,
  SubmitOrderRequest,
  SubmitOrderResponse,
} from './types.schema'

const baseUrl = 'MarketPlatform/MarketPlatformAllSpecialOffers'

const endpoints = {
  getAllSpecialOffers: `${baseUrl}/GetAllSpecialOffers`,
  beginStandardOfferOrder: `${baseUrl}/BeginStandardOfferOrder`,
  submitStandardOfferOrder: `${baseUrl}/SubmitStandardOfferOrder`,
  beginIndexOfferOrder: `${baseUrl}/BeginIndexOfferOrder`,
  submitIndexOfferOrder: `${baseUrl}/SubmitIndexOfferOrder`,
  updateIndexOfferOrder: 'MarketPlatform/MarketPlatformIndexOfferEntry/UpdateIndexOfferOrder',
} as const

export const offerQueryKeys = {
  all: ['offers'] as const,
  list: () => [...offerQueryKeys.all, 'list'] as const,
}

export const useOffers = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const invalidateOffersList = () => {
    queryClient.invalidateQueries(offerQueryKeys.list())
  }

  const getAllSpecialOffers = () =>
    useQuery<GetAllSpecialOffersResponse>(
      offerQueryKeys.list(),
      async () => {
        return api.post<GetAllSpecialOffersResponse>(endpoints.getAllSpecialOffers)
      },
      { refetchOnWindowFocus: false }
    )

  const beginStandardOfferOrder = async (itemKey: ItemKey): Promise<GetOrderEntryDataResponse> => {
    const payload: GetOrderEntryDataRequest = {
      SelectedItemKeys: [itemKey],
      OnlyAssignedAdditionalProducts: true,
    }

    return api.post<GetOrderEntryDataResponse>(endpoints.beginStandardOfferOrder, payload as any)
  }

  const useSubmitStandardOfferOrder = () =>
    useMutation<SubmitOrderResponse, Error, SubmitOrderRequest>({
      mutationFn: (order) => api.post<SubmitOrderResponse>(endpoints.submitStandardOfferOrder, order as any),
      onSuccess: invalidateOffersList,
    })

  const beginIndexOfferOrder = async (itemKey: ItemKey): Promise<IndexOfferBeginOrderResponse> => {
    const payload: IndexOfferBeginOrderRequest = { ItemKey: itemKey }
    return api.post<IndexOfferBeginOrderResponse>(endpoints.beginIndexOfferOrder, payload as any)
  }

  const useSubmitIndexOfferOrder = () =>
    useMutation<IndexOfferSubmitOrderResponse, Error, IndexOfferSubmitOrderRequest>({
      mutationFn: (order) => api.post<IndexOfferSubmitOrderResponse>(endpoints.submitIndexOfferOrder, order as any),
      onSuccess: invalidateOffersList,
    })

  const useUpdateIndexOfferOrder = () =>
    useMutation<IndexOfferUpdateOrderResponse, Error, IndexOfferUpdateOrderRequest>({
      mutationFn: (order) => api.post<IndexOfferUpdateOrderResponse>(endpoints.updateIndexOfferOrder, order as any),
      onSuccess: invalidateOffersList,
    })

  return {
    getAllSpecialOffers,
    getOrderEntryDataBySpecialOfferId: beginStandardOfferOrder,
    submitOrder: useSubmitStandardOfferOrder,
    beginIndexOfferOrder,
    submitIndexOfferOrder: useSubmitIndexOfferOrder,
    updateIndexOfferOrder: useUpdateIndexOfferOrder,
  }
}
