import { APIResponse } from '@api/globalTypes'
import { NotificationMessage, useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  ApproveSpecialOfferOrderRequest,
  ApproveSpecialOfferOrderResponseData,
  CreateSpecialOfferRequest,
  RejectSpecialOfferOrderRequest,
  RejectSpecialOfferOrderResponseData,
  SpecialOfferBreakdownResponseData,
  SpecialOfferListResponse,
  SpecialOfferMetadataResponseData,
  UpdateSpecialOfferRequest,
  UpdateSpecialOfferResponseData,
} from './types.schema'

const endpoints = {
  getSpecialOffers: 'MarketPlatform/SpecialOfferAdmin/GetSpecialOffers',
  getSpecialOfferMetadata: 'MarketPlatform/SpecialOfferAdmin/GetMetadata',
  createSpecialOffer: 'MarketPlatform/SpecialOfferAdmin/CreateSpecialOffer',
  validateSpecialOffer: 'MarketPlatform/SpecialOfferAdmin/ValidateSpecialOffer',
  getSpecialOfferBreakdown: 'MarketPlatform/SpecialOfferAdmin/GetSpecialOfferBreakdown',
  approveSpecialOfferOrder: 'MarketPlatform/SpecialOfferAdmin/ApproveSpecialOfferOrder',
  rejectSpecialOfferOrder: 'MarketPlatform/SpecialOfferAdmin/RejectSpecialOfferOrder',
  updateNotificationDate: 'MarketPlatform/SpecialOfferNotification/UpdateInvitationTriggerTime',
  trackOfferViewed: 'MarketPlatform/SpecialOfferNotification/TrackOfferViewed',
  triggerInvitationNotification: 'MarketPlatform/SpecialOfferNotification/TriggerInvitationNotification',
  updateSpecialOffer: 'MarketPlatform/SpecialOfferAdmin/UpdateSpecialOffer',
} as const

export const useSpecialOffers = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const getSpecialOffers = () =>
    useQuery<SpecialOfferListResponse>(
      [endpoints.getSpecialOffers],
      async ({ queryKey }) => {
        const res = await api.post(queryKey[0] as string)
        return res as SpecialOfferListResponse
      },
      {
        refetchOnWindowFocus: false,
      }
    )
  const getSpecialOfferMetadata = () =>
    useQuery(
      [endpoints.getSpecialOfferMetadata],
      ({ queryKey }): Promise<APIResponse<SpecialOfferMetadataResponseData>> => api.post(queryKey[0] as string),
      {
        refetchOnWindowFocus: false,
      }
    )

  const createSpecialOffer = useMutation(
    (payload: CreateSpecialOfferRequest) => api.post(endpoints.createSpecialOffer, payload as any),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([endpoints.getSpecialOffers]).then()
        NotificationMessage('Success', 'Special offer created successfully', false)
      },
      onError: (error) => {
        NotificationMessage('Error', error?.json?.Validations?.[0]?.Message || 'Could not create special offer', true)
      },
    }
  )

  const getSpecialOfferBreakdown = (specialOfferId: number) =>
    useQuery<APIResponse<SpecialOfferBreakdownResponseData>>(
      [endpoints.getSpecialOfferBreakdown, specialOfferId],
      ({ queryKey }) => {
        const [url, id] = queryKey as [string, number]
        return api.post<APIResponse<SpecialOfferBreakdownResponseData>>(url, { SpecialOfferId: id } as any)
      },
      {
        enabled: Number.isFinite(specialOfferId) && specialOfferId > 0,
        refetchOnWindowFocus: false,
      }
    )

  const approveSpecialOfferOrder = () =>
    useMutation<APIResponse<ApproveSpecialOfferOrderResponseData>, unknown, ApproveSpecialOfferOrderRequest>(
      (payload) =>
        api.post<APIResponse<ApproveSpecialOfferOrderResponseData>>(endpoints.approveSpecialOfferOrder, payload as any),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([endpoints.getSpecialOffers]).then()
          queryClient.invalidateQueries([endpoints.getSpecialOfferBreakdown]).then()
        },
      }
    )

  const rejectSpecialOfferOrder = () =>
    useMutation<APIResponse<RejectSpecialOfferOrderResponseData>, unknown, RejectSpecialOfferOrderRequest>(
      (payload) =>
        api.post<APIResponse<RejectSpecialOfferOrderResponseData>>(endpoints.rejectSpecialOfferOrder, payload as any),
      {
        onSuccess: () => {
          queryClient.invalidateQueries([endpoints.getSpecialOffers]).then()
          queryClient.invalidateQueries([endpoints.getSpecialOfferBreakdown]).then()
        },
      }
    )

  const saveNotificationDate = useMutation<
    APIResponse<any>,
    unknown,
    { SpecialOfferId: number; InvitationTriggerDateTimeTZ: Date }
  >((payload) => api.post(endpoints.updateNotificationDate, payload as any), {
    onSuccess: () => {
      NotificationMessage('Success', 'Notification date saved successfully', false)
    },
    onError: (error) => {
      NotificationMessage('Error', error?.json?.Validations?.[0]?.Message || 'Could not save notification date', true)
    },
    onSettled: () => {
      queryClient.invalidateQueries([endpoints.getSpecialOfferBreakdown]).then()
    },
  })

  const triggerInvitationNotification = useMutation<
    APIResponse<any>,
    unknown,
    { SpecialOfferId: number | undefined; CounterPartyIds: number[] }
  >((payload) => api.post(endpoints.triggerInvitationNotification, payload as any), {
    onSuccess: () => {
      NotificationMessage('Success', 'Invitation notification triggered successfully', false)
    },
    onError: (error) => {
      NotificationMessage(
        'Error',
        error?.json?.Validations?.[0]?.Message || 'Could not trigger invitation notification',
        true
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries([endpoints.getSpecialOfferBreakdown]).then()
    },
  })

  const trackOfferViewed = useMutation<APIResponse<any>, unknown, { SpecialOfferId: number | string }>((payload) =>
    api.post<APIResponse<any>>(endpoints.trackOfferViewed, payload as any)
  )

  const updateSpecialOffer = useMutation<
    APIResponse<UpdateSpecialOfferResponseData>,
    unknown,
    UpdateSpecialOfferRequest
  >((payload) => api.post<APIResponse<UpdateSpecialOfferResponseData>>(endpoints.updateSpecialOffer, payload as any), {
    onSuccess: () => {
      NotificationMessage('Success', 'Offer updated successfully', false)
      queryClient.invalidateQueries([endpoints.getSpecialOffers]).then()
      queryClient.invalidateQueries([endpoints.getSpecialOfferBreakdown]).then()
    },
    onError: (error) => {
      NotificationMessage('Error', error?.json?.Validations?.[0]?.Message || 'Could not update offer', true)
    },
  })

  return {
    getSpecialOffers,
    getSpecialOfferMetadata,
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
