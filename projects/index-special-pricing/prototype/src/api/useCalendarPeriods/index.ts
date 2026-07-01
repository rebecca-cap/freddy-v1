import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { CalendarPeriodMetadataResponse, CalendarPeriodOverviewResponse } from './types'

export const endpoints = {
  metadata: 'MarketPlatform/Admin/Calendar/GetMetadata',
  read: 'MarketPlatform/Admin/Calendar/ReadCalendarPeriods',
  update: 'MarketPlatform/Admin/Calendar/UpdateCalendarPeriod',
  create: 'MarketPlatform/Admin/Calendar/CreateCalendarPeriod',
  delete: 'MarketPlatform/Admin/Calendar/InactivateCalendarPeriods',
}

export const useCalendarPeriods = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useCalendarPeriodsQuery = (startDate, endDate, calendarId) =>
    useQuery(
      [endpoints.read, startDate, endDate, calendarId],
      ({ queryKey }) =>
        api.post(queryKey[0], {
          StartDate: startDate,
          EndDate: endDate,
          CalendarId: calendarId,
        }) as CalendarPeriodOverviewResponse,
      {
        enabled: !!startDate && !!endDate && !!calendarId,
      }
    )

  const useCalendarPeriodsMetadataQuery = () =>
    useQuery([endpoints.metadata], ({ queryKey }) => api.post(queryKey[0]) as CalendarPeriodMetadataResponse)

  const useCalendarPeriodsUpdateMutation = () =>
    useMutation([endpoints.update], (period: any) => api.post(endpoints.update, period))

  const useCalendarPeriodsDeleteMutation = () =>
    useMutation([endpoints.delete], (period: any) => api.post(endpoints.delete, period), {
      onSuccess: async (newRow) => {
        const previousQueries = queryClient.getQueriesData([endpoints.read])

        queryClient.invalidateQueries([endpoints.read])

        return { previousQueries, newRow }
      },
    })

  const useCalendarPeriodsCreateMutation = () =>
    useMutation([endpoints.create], (period: any) => api.post(endpoints.create, period), {
      onSuccess: async (newRow) => {
        const previousQueries = queryClient.getQueriesData([endpoints.read])

        queryClient.invalidateQueries([endpoints.read])

        return { previousQueries, newRow }
      },
    })

  return {
    useCalendarPeriodsQuery,
    useCalendarPeriodsMetadataQuery,
    useCalendarPeriodsUpdateMutation,
    useCalendarPeriodsDeleteMutation,
    useCalendarPeriodsCreateMutation,
  }
}
