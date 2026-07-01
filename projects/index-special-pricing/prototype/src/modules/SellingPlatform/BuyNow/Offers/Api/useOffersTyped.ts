/**
 * Type-safe Offers API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('MarketPlatform/MarketPlatformAllSpecialOffers/GetAllSpecialOffers')
 * - New: api.POST('/api/MarketPlatform/MarketPlatformAllSpecialOffers/GetAllSpecialOffers')
 */

import { NotificationMessage } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  useTypedApi,
  unwrap,
  type InferResponse,
  type InferRequestBody,
} from '@hooks/useTypedApi'

type GetAllSpecialOffersResponse = InferResponse<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/GetAllSpecialOffers'>
type BeginStandardOfferOrderResponse = InferResponse<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/BeginStandardOfferOrder'>
type SubmitStandardOfferOrderResponse = InferResponse<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/SubmitStandardOfferOrder'>
type BeginIndexOfferOrderResponse = InferResponse<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/BeginIndexOfferOrder'>
type SubmitIndexOfferOrderResponse = InferResponse<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/SubmitIndexOfferOrder'>
type UpdateIndexOfferOrderResponse = InferResponse<'/api/MarketPlatform/MarketPlatformIndexOfferEntry/UpdateOrder'>

type SubmitStandardOfferOrderRequest = InferRequestBody<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/SubmitStandardOfferOrder'>
type BeginIndexOfferOrderRequest = InferRequestBody<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/BeginIndexOfferOrder'>
type SubmitIndexOfferOrderRequest = InferRequestBody<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/SubmitIndexOfferOrder'>
type UpdateIndexOfferOrderRequest = InferRequestBody<'/api/MarketPlatform/MarketPlatformIndexOfferEntry/UpdateOrder'>

// ItemKey extracted from BeginStandardOfferOrder request body
type BeginStandardOfferOrderRequest = InferRequestBody<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/BeginStandardOfferOrder'>
type ItemKey = NonNullable<BeginStandardOfferOrderRequest['SelectedItemKeys']>[number]

// Query Keys

const offerQueryKeys = {
  all: ['offers'] as const,
  list: (onlyAssigned: boolean) => [...offerQueryKeys.all, 'list', onlyAssigned] as const,
}

export const useOffersTyped = () => {
  const api = useTypedApi()
  const queryClient = useQueryClient()

  const invalidateOffersList = () => {
    queryClient.invalidateQueries({ queryKey: offerQueryKeys.all })
  }

  const getAllSpecialOffers = (onlyAssigned: boolean) =>
    useQuery({
      queryKey: offerQueryKeys.list(onlyAssigned),
      queryFn: () =>
        unwrap(
          api.POST('/api/MarketPlatform/MarketPlatformAllSpecialOffers/GetAllSpecialOffers', {
            body: { SkipCounterPartyInvitationFilter: !onlyAssigned },
          })
        ),
      refetchOnWindowFocus: false,
    })

  /**
   * Get order entry data by special offer ID (begin standard offer order)
   */
  const getOrderEntryDataBySpecialOfferId = async (itemKey: ItemKey) => {
    return unwrap(
      api.POST('/api/MarketPlatform/MarketPlatformAllSpecialOffers/BeginStandardOfferOrder', {
        body: {
          SelectedItemKeys: [itemKey],
          OnlyAssignedAdditionalProducts: true,
        },
      })
    )
  }

  /**
   * Submit standard offer order (mutation hook factory)
   */
  const submitOrder = () =>
    useMutation({
      mutationFn: (order: SubmitStandardOfferOrderRequest) =>
        unwrap(
          api.POST('/api/MarketPlatform/MarketPlatformAllSpecialOffers/SubmitStandardOfferOrder', {
            body: order,
          })
        ),
      onSuccess: invalidateOffersList,
      onError: (error: unknown) => {
        console.error(error)
        NotificationMessage('Error', 'Failed to submit order', true)
      },
    })

  /**
   * Begin index offer order
   */
  const beginIndexOfferOrder = async (itemKey: ItemKey) => {
    return unwrap(
      api.POST('/api/MarketPlatform/MarketPlatformAllSpecialOffers/BeginIndexOfferOrder', {
        body: { ItemKey: itemKey },
      })
    )
  }

  /**
   * Submit index offer order (mutation hook factory)
   */
  const submitIndexOfferOrder = () =>
    useMutation({
      mutationFn: (order: SubmitIndexOfferOrderRequest) =>
        unwrap(
          api.POST('/api/MarketPlatform/MarketPlatformAllSpecialOffers/SubmitIndexOfferOrder', {
            body: order,
          })
        ),
      onSuccess: invalidateOffersList,
      onError: (error: unknown) => {
        console.error(error)
        NotificationMessage('Error', 'Failed to submit index offer order', true)
      },
    })

  /**
   * Update index offer order (mutation hook factory)
   */
  const updateIndexOfferOrder = () =>
    useMutation({
      mutationFn: (order: UpdateIndexOfferOrderRequest) =>
        unwrap(
          api.POST('/api/MarketPlatform/MarketPlatformIndexOfferEntry/UpdateOrder', {
            body: order,
          })
        ),
      onSuccess: invalidateOffersList,
      onError: (error: unknown) => {
        console.error(error)
        NotificationMessage('Error', 'Failed to update index offer order', true)
      },
    })

  return {
    getAllSpecialOffers,
    getOrderEntryDataBySpecialOfferId,
    submitOrder,
    beginIndexOfferOrder,
    submitIndexOfferOrder,
    updateIndexOfferOrder,
  }
}
