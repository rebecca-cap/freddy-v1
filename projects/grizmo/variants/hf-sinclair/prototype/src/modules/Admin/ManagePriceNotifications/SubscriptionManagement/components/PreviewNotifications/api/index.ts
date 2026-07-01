import { APIResponse } from '@api/globalTypes'
import { NotificationMessage, useApi } from '@gravitate-js/excalibrr'
import { PriceNotification } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/PreviewNotifications/api/schema.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Define all endpoints
export const endpoints = {
  getPreviewData: 'PriceNotifications/Distribution/GetNotificationPreviewData',
  sendNotifications: 'PriceNotifications/Distribution/BuildNotificationBatch',
}

export const usePriceNotificationsPreview = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  // Get all published quotes that are ready for notification
  const getPriceNotificationPreviewData = (mode) =>
    useQuery<APIResponse<PriceNotification[]>>(
      [endpoints.getPreviewData, mode],
      () =>
        api.post(endpoints.getPreviewData, {
          Mode: mode,
          ExplicitMappings: [],
        }),
      {
        refetchOnWindowFocus: false,
      }
    )

  // Send notifications for selected quotes
  const sendNotificationsMutation = useMutation(
    [endpoints.sendNotifications],
    (selectedRows: PriceNotification[]) => {
      const NotificationQuotes = selectedRows.map((row) => ({
        QuotedValueId: row.QuotedValueId,
        PriceDelta: row.PriceDelta,
      }))
      return api.post(endpoints.sendNotifications, { NotificationQuotes, ExplicitCounterPartyIds: [] })
    },
    {
      onSuccess: (response, selectedRows) => {
        NotificationMessage('Notifications Sent', 'Price notifications have been sent successfully', false)

        // Update cache with new data - mark selected as sent
        queryClient.setQueriesData([endpoints.getPreviewData], (oldData: APIResponse<PriceNotification[]>) => {
          if (!oldData?.Data) return oldData
          return {
            ...oldData,
            Data: oldData.Data.map((row) => {
              const rowShouldBeUpdated = selectedRows.some(
                (selectedRow) => selectedRow.QuoteConfigurationMappingId === row.QuoteConfigurationMappingId
              )

              return rowShouldBeUpdated ? { ...row, HasBeenSent: true, LastNotificationTime: new Date() } : row
            }),
          }
        })
      },
      onError: (error) => {
        NotificationMessage('Failed to Send', 'Failed to send price notifications', true)
        console.error(error)
      },
    }
  )

  return {
    getPriceNotificationPreviewData,
    sendNotificationsMutation,
  }
}
