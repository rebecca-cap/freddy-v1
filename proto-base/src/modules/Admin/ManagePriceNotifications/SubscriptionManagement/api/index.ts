import { APIResponse } from '@api/globalTypes'
import { NotificationMessage, useApi } from '@gravitate-js/excalibrr'
import {
  Location,
  MetadataData,
  Product,
  RecipientData,
  SubscriptionData,
} from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/api/schema.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const endpoints = {
  getSubscriptions: 'PriceNotifications/SubscriptionManagement/GetSubscriptions',
  getRecipientData: 'PriceNotifications/SubscriptionManagement/GetRecipientData',
  getProducts: 'PriceNotifications/SubscriptionManagement/GetAvailableProducts',
  getLocations: 'PriceNotifications/SubscriptionManagement/GetAvailableLocations',
  upsertSubscriptions: 'PriceNotifications/SubscriptionManagement/UpsertSubscriptions',
  upsertRecipientData: 'PriceNotifications/SubscriptionManagement/UpsertRecipientData',
  getMetadata: 'PriceNotifications/SubscriptionManagement/GetMetadata',
}

export const usePriceNotifications = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useGetSubscriptionsQuery = () =>
    useQuery<APIResponse<SubscriptionData[]>>(
      [endpoints.getSubscriptions],
      () => api.post(endpoints.getSubscriptions),
      {
        refetchOnWindowFocus: false,
      }
    )

  const useGetRecipientDataQuery = () =>
    useQuery<APIResponse<RecipientData[]>>([endpoints.getRecipientData], () => api.post(endpoints.getRecipientData), {
      refetchOnWindowFocus: false,
    })

  const useProductsQuery = () =>
    useQuery<APIResponse<Product[]>>([endpoints.getProducts], () => api.post(endpoints.getProducts), {
      refetchOnWindowFocus: false,
    })

  const useLocationsQuery = () =>
    useQuery<APIResponse<Location[]>>([endpoints.getLocations], () => api.post(endpoints.getLocations), {
      refetchOnWindowFocus: false,
    })

  const useMetadataQuery = () =>
    useQuery<APIResponse<MetadataData>>([endpoints.getMetadata], () => api.post(endpoints.getMetadata), {
      refetchOnWindowFocus: false,
    })

  const upsertSubscriptionMutation = useMutation(
    [endpoints.upsertSubscriptions],
    (payload: Partial<SubscriptionData>[]): Promise<APIResponse<SubscriptionData[]>> =>
      api.post(endpoints.upsertSubscriptions, payload),
    {
      onSuccess: (response: APIResponse<SubscriptionData[]>, payload) => {
        NotificationMessage('Subscriptions Updated', 'Subscription updated successfully', false)

        queryClient.setQueryData([endpoints.getSubscriptions], (oldData) => {
          let newData = oldData?.Data?.map((item) => {
            const updatedItem = response.Data.find(
              (responseItem) => responseItem.PriceNotificationSubscriptionId == item.PriceNotificationSubscriptionId
            )
            if (updatedItem) {
              return { ...item, ...updatedItem }
            }

            return item
          })
          if (!payload[0].PriceNotificationSubscriptionId) {
            newData = [...newData, ...response.Data]
          }
          return { ...oldData, Data: newData }
        })
      },
      onError: (error) => {
        NotificationMessage('Update Failed', 'Failed to update subscriptions data', true)
        console.error(error)
      },
    }
  )
  const upsertRecipientDataMutation = useMutation(
    [endpoints.upsertRecipientData],
    (payload: Partial<RecipientData>[]): Promise<APIResponse<RecipientData[]>> =>
      api.post(endpoints.upsertRecipientData, payload),
    {
      onSuccess: (response) => {
        NotificationMessage('Status Updated', 'Recipient data updated successfully', false)

        queryClient.setQueryData([endpoints.getSubscriptions], (oldData) => {
          const newData = oldData?.Data?.map((item) => {
            const updatedItem = response.Data.find((responseItem) => responseItem.CounterPartyId == item.CounterPartyId)
            if (updatedItem) {
              return { ...item, ...updatedItem }
            }

            return item
          })

          return { ...oldData, Data: newData }
        })
      },
      onError: (error) => {
        NotificationMessage('Update Failed', 'Failed to update recipient data', true)
        console.error(error)
      },
    }
  )

  return {
    useGetSubscriptionsQuery,
    useGetRecipientDataQuery,
    useProductsQuery,
    useLocationsQuery,
    useMetadataQuery,
    upsertSubscriptionMutation,
    upsertRecipientDataMutation,
  }
}
