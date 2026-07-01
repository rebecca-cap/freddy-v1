/**
 * Type-safe Special Offers API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('MarketPlatform/SpecialOfferAdmin/CreateSpecialOffer', payload as any)
 * - New: api.POST('/api/MarketPlatform/SpecialOfferAdmin/CreateSpecialOffer', { body: payload })
 */

import { NotificationMessage } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  useTypedApi,
  unwrap,
  queryKey,
  type InferResponse,
  type InferRequestBody,
} from '@hooks/useTypedApi'

type GetSpecialOffersResponse = InferResponse<'/api/MarketPlatform/SpecialOfferAdmin/GetSpecialOffers'>
type GetMetaDataResponse = InferResponse<'/api/MarketPlatform/SpecialOfferAdmin/GetMetaData'>
type GetAuthorizedCounterPartyIdsResponse = InferResponse<'/api/MarketPlatform/SpecialOfferAdmin/GetAuthorizedCounterPartyIds'>
type GetSpecialOfferBreakdownResponse = InferResponse<'/api/MarketPlatform/SpecialOfferAdmin/GetSpecialOfferBreakdown'>
export type CreateSpecialOfferResponse = InferResponse<'/api/MarketPlatform/SpecialOfferAdmin/CreateSpecialOffer'>
export type ApproveSpecialOfferOrderResponse = InferResponse<'/api/MarketPlatform/SpecialOfferAdmin/ApproveSpecialOfferOrder'>
export type RejectSpecialOfferOrderResponse = InferResponse<'/api/MarketPlatform/SpecialOfferAdmin/RejectSpecialOfferOrder'>
type UpdateInvitationTriggerTimeResponse = InferResponse<'/api/MarketPlatform/SpecialOfferNotification/UpdateInvitationTriggerTime'>
type TriggerInvitationNotificationResponse = InferResponse<'/api/MarketPlatform/SpecialOfferNotification/TriggerInvitationNotification'>
type TrackOfferViewedResponse = InferResponse<'/api/MarketPlatform/SpecialOfferNotification/TrackOfferViewed'>
type UpdateSpecialOfferResponse = InferResponse<'/api/MarketPlatform/SpecialOfferAdmin/UpdateSpecialOffer'>

type GetSpecialOfferBreakdownRequest = InferRequestBody<'/api/MarketPlatform/SpecialOfferAdmin/GetSpecialOfferBreakdown'>
export type CreateSpecialOfferRequest = InferRequestBody<'/api/MarketPlatform/SpecialOfferAdmin/CreateSpecialOffer'>
export type ApproveSpecialOfferOrderRequest = InferRequestBody<'/api/MarketPlatform/SpecialOfferAdmin/ApproveSpecialOfferOrder'>
export type RejectSpecialOfferOrderRequest = InferRequestBody<'/api/MarketPlatform/SpecialOfferAdmin/RejectSpecialOfferOrder'>
export type UpdateInvitationTriggerTimeRequest = InferRequestBody<'/api/MarketPlatform/SpecialOfferNotification/UpdateInvitationTriggerTime'>
export type TriggerInvitationNotificationRequest = InferRequestBody<'/api/MarketPlatform/SpecialOfferNotification/TriggerInvitationNotification'>
export type TrackOfferViewedRequest = InferRequestBody<'/api/MarketPlatform/SpecialOfferNotification/TrackOfferViewed'>
export type UpdateSpecialOfferRequest = InferRequestBody<'/api/MarketPlatform/SpecialOfferAdmin/UpdateSpecialOffer'>

// Query Keys

const queryKeys = {
  specialOffers: queryKey('/api/MarketPlatform/SpecialOfferAdmin/GetSpecialOffers'),
  metadata: queryKey('/api/MarketPlatform/SpecialOfferAdmin/GetMetaData'),
  authorizedCounterParties: (productId: number | undefined, locationId: number | undefined) =>
    ['/api/MarketPlatform/SpecialOfferAdmin/GetAuthorizedCounterPartyIds', productId ?? null, locationId ?? null] as const,
  breakdown: (specialOfferId: number) =>
    [...queryKey('/api/MarketPlatform/SpecialOfferAdmin/GetSpecialOfferBreakdown'), specialOfferId] as const,
} as const

export interface AuthorizedCounterPartiesArgs {
  productId?: number
  locationId?: number
}

export const useSpecialOffersTyped = () => {
  const api = useTypedApi()
  const queryClient = useQueryClient()

  /**
   * Fetch all special offers
   */
  const getSpecialOffers = () =>
    useQuery({
      queryKey: queryKeys.specialOffers,
      queryFn: () => unwrap(api.POST('/api/MarketPlatform/SpecialOfferAdmin/GetSpecialOffers')),
      refetchOnWindowFocus: false,
      refetchInterval: 30 * 1000,
    })

  /**
   * Fetch special offer metadata. The payload is intentionally free of per-counterparty
   * authorization — call `getAuthorizedCounterPartyIds` separately when the user has
   * selected a product-location.
   */
  const getSpecialOfferMetadata = () =>
    useQuery({
      queryKey: queryKeys.metadata,
      queryFn: () => unwrap(api.POST('/api/MarketPlatform/SpecialOfferAdmin/GetMetaData')),
      refetchOnWindowFocus: false,
    })

  /**
   * Fetch the list of counterparty IDs orderable-permissioned for the given product-location.
   * Frontend joins these against the eligible-counterparty list from `getSpecialOfferMetadata`
   * to derive the per-row authorization flag.
   */
  const getAuthorizedCounterPartyIds = (args: AuthorizedCounterPartiesArgs) =>
    useQuery({
      queryKey: queryKeys.authorizedCounterParties(args.productId, args.locationId),
      queryFn: () =>
        unwrap(
          api.POST('/api/MarketPlatform/SpecialOfferAdmin/GetAuthorizedCounterPartyIds', {
            body: { ProductId: args.productId, LocationId: args.locationId },
          })
        ),
      enabled: args.productId != null && args.locationId != null,
      refetchOnWindowFocus: false,
    })

  /**
   * Create a special offer
   */
  const createSpecialOffer = useMutation({
    mutationFn: (payload: CreateSpecialOfferRequest) =>
      unwrap(
        api.POST('/api/MarketPlatform/SpecialOfferAdmin/CreateSpecialOffer', {
          body: payload,
        })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.specialOffers })
      NotificationMessage('Success', 'Special offer created successfully', false)
    },
    onError: (error: any) => {
      NotificationMessage('Error', error?.json?.Validations?.[0]?.Message || 'Could not create special offer', true)
    },
  })

  /**
   * Get special offer breakdown
   */
  const getSpecialOfferBreakdown = (specialOfferId: number) =>
    useQuery({
      queryKey: queryKeys.breakdown(specialOfferId),
      queryFn: () =>
        unwrap(
          api.POST('/api/MarketPlatform/SpecialOfferAdmin/GetSpecialOfferBreakdown', {
            body: { SpecialOfferId: specialOfferId },
          })
        ),
      enabled: Number.isFinite(specialOfferId) && specialOfferId > 0,
      refetchOnWindowFocus: false,
      refetchInterval: 30 * 1000,
    })

  /**
   * Approve a special offer order
   */
  const approveSpecialOfferOrder = () =>
    useMutation({
      mutationFn: (payload: ApproveSpecialOfferOrderRequest) =>
        unwrap(
          api.POST('/api/MarketPlatform/SpecialOfferAdmin/ApproveSpecialOfferOrder', {
            body: payload,
          })
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.specialOffers })
        queryClient.invalidateQueries({ queryKey: queryKey('/api/MarketPlatform/SpecialOfferAdmin/GetSpecialOfferBreakdown') })
      },
    })

  /**
   * Reject a special offer order
   */
  const rejectSpecialOfferOrder = () =>
    useMutation({
      mutationFn: (payload: RejectSpecialOfferOrderRequest) =>
        unwrap(
          api.POST('/api/MarketPlatform/SpecialOfferAdmin/RejectSpecialOfferOrder', {
            body: payload,
          })
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.specialOffers })
        queryClient.invalidateQueries({ queryKey: queryKey('/api/MarketPlatform/SpecialOfferAdmin/GetSpecialOfferBreakdown') })
      },
    })

  /**
   * Save notification date
   */
  const saveNotificationDate = useMutation({
    mutationFn: (payload: UpdateInvitationTriggerTimeRequest) =>
      unwrap(
        api.POST('/api/MarketPlatform/SpecialOfferNotification/UpdateInvitationTriggerTime', {
          body: payload,
        })
      ),
    onSuccess: () => {
      NotificationMessage('Success', 'Notification date saved successfully', false)
    },
    onError: (error: any) => {
      NotificationMessage('Error', error?.json?.Validations?.[0]?.Message || 'Could not save notification date', true)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey('/api/MarketPlatform/SpecialOfferAdmin/GetSpecialOfferBreakdown') })
    },
  })

  /**
   * Trigger invitation notification
   */
  const triggerInvitationNotification = useMutation({
    mutationFn: (payload: TriggerInvitationNotificationRequest) =>
      unwrap(
        api.POST('/api/MarketPlatform/SpecialOfferNotification/TriggerInvitationNotification', {
          body: payload,
        })
      ),
    onSuccess: () => {
      NotificationMessage('Success', 'Invitation notification triggered successfully', false)
    },
    onError: (error: any) => {
      NotificationMessage(
        'Error',
        error?.json?.Validations?.[0]?.Message || 'Could not trigger invitation notification',
        true
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey('/api/MarketPlatform/SpecialOfferAdmin/GetSpecialOfferBreakdown') })
    },
  })

  /**
   * Track offer viewed
   */
  const trackOfferViewed = useMutation({
    mutationFn: (payload: TrackOfferViewedRequest) =>
      unwrap(
        api.POST('/api/MarketPlatform/SpecialOfferNotification/TrackOfferViewed', {
          body: payload,
        })
      ),
  })

  /**
   * Update a special offer
   */
  const updateSpecialOffer = useMutation({
    mutationFn: (payload: UpdateSpecialOfferRequest) =>
      unwrap(
        api.POST('/api/MarketPlatform/SpecialOfferAdmin/UpdateSpecialOffer', {
          body: payload,
        })
      ),
    onSuccess: () => {
      NotificationMessage('Success', 'Offer updated successfully', false)
      queryClient.invalidateQueries({ queryKey: queryKeys.specialOffers })
      queryClient.invalidateQueries({ queryKey: queryKey('/api/MarketPlatform/SpecialOfferAdmin/GetSpecialOfferBreakdown') })
    },
    onError: (error: any) => {
      NotificationMessage('Error', error?.Validations?.[0]?.Message || 'Could not update offer', true)
    },
  })

  return {
    getSpecialOffers,
    getSpecialOfferMetadata,
    getAuthorizedCounterPartyIds,
    createSpecialOffer,
    getSpecialOfferBreakdown,
    approveSpecialOfferOrder,
    rejectSpecialOfferOrder,
    saveNotificationDate,
    triggerInvitationNotification,
    trackOfferViewed,
    updateSpecialOffer,
  }
}
