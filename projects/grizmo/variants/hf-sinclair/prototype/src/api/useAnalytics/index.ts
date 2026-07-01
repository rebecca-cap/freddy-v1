import { PricingAnalyticsResponse } from '@api/useAnalytics/types'
import { useApi } from '@gravitate-js/excalibrr'
import { useQuery } from '@tanstack/react-query'
import { Moment } from 'moment'

export const endpoints = {
  dashboard: 'Analytics/Dashboard',
} as const
type payloadDate = Date | Moment
export const useAnalytics = () => {
  const api = useApi()

  const useDashboard = (FromDate: payloadDate, ToDate: payloadDate) =>
    useQuery<PricingAnalyticsResponse>(
      [endpoints.dashboard, FromDate, ToDate],
      async () => api.post(endpoints.dashboard, { FromDate, ToDate }),
      {
        refetchOnWindowFocus: false,
        enabled: !!FromDate && !!ToDate,
      }
    )

  return { useDashboard }
}
