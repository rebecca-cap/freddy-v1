import { useApi } from '@gravitate-js/excalibrr'
import { useMutation } from '@tanstack/react-query'

import { OptOutRequest } from './types'

export const endpoints = {
  optOut: 'NotificationPreferences/OptOut',
}

export const useNotificationPreferences = () => {
  const api = useApi()

  const useOptOutMutation = () =>
    useMutation({
      mutationFn: (payload: OptOutRequest) => api.post(endpoints.optOut, payload),
    })

  return {
    useOptOutMutation,
  }
}
