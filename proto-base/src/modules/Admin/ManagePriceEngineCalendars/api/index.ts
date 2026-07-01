import { APIResponse } from '@api/globalTypes'
import { NotificationMessage, useApi } from '@gravitate-js/excalibrr'
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'

import {
  CalendarMetadata,
  CalendarPeriodDTO,
  CalendarUploadResponseData,
  InactivateCalendarRequest,
  ReadCalendarsRequest,
  SubmitUploadedHolidaysRequest,
  UpsertCalendarsRequest,
} from './types'

export const endpoints = {
  metadata: 'PricingEngine/Admin/Calendar/GetMetadata',
  getCalendars: 'PricingEngine/Admin/Calendar/Read',
  upsertCalendars: 'PricingEngine/Admin/Calendar/UpsertCalendars',
  deleteHolidays: 'PricingEngine/Admin/Calendar/DeleteHolidays',
  downloadTemplate: 'PricingEngine/Admin/Calendar/GetTemplate',
  uploadTemplate: 'PricingEngine/Admin/Calendar/UploadCalendarHolidays',
  submitUploadedHolidays: 'PricingEngine/Admin/Calendar/SubmitUploadedHolidays',
}

export const usePriceEngineCalendars = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const getMetadata = () =>
    useQuery({
      queryKey: [endpoints.metadata],
      queryFn: () => api.post(endpoints.metadata),
    }) as UseQueryResult<APIResponse<CalendarMetadata>, Error>

  const getHolidays = (payload: Partial<ReadCalendarsRequest>) =>
    useQuery({
      queryKey: [endpoints.getCalendars, payload],
      queryFn: () => api.post(endpoints.getCalendars, payload),
      enabled: !!payload.StartDate && !!payload.EndDate,
    }) as UseQueryResult<APIResponse<CalendarPeriodDTO[]>, Error>

  const upsertCalendars = useMutation({
    mutationFn: (request: UpsertCalendarsRequest[]) => api.post(endpoints.upsertCalendars, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoints.metadata] })
    },
  }) as UseMutationResult<APIResponse<void>, Error, UpsertCalendarsRequest[]>

  const deleteHolidays = useMutation({
    mutationFn: (request: InactivateCalendarRequest) => api.post(endpoints.deleteHolidays, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoints.getCalendars] })
      NotificationMessage('Success', 'Calendar period deleted successfully', false)
    },
    onError: () => {
      NotificationMessage('Error', 'Failed to inactivate calendar period', true)
    },
  }) as UseMutationResult<APIResponse<void>, Error, InactivateCalendarRequest>

  const downloadTemplate = (startDate: string, endDate: string) =>
    api.post(
      endpoints.downloadTemplate,
      { StartDate: startDate, EndDate: endDate },
      { responseType: 'blob' }
    ) as Promise<Blob>

  const uploadTemplate = (formData: FormData) => {
    return api.uploadFile(endpoints.uploadTemplate, formData, {
      headers: {
        Accept: 'application/json',
      },
    }) as Promise<CalendarUploadResponseData>
  }

  const submitUploadedHolidays = useMutation({
    mutationFn: (payload: SubmitUploadedHolidaysRequest) => api.post(endpoints.submitUploadedHolidays, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoints.getCalendars] }).then()
      NotificationMessage('Success', 'Holidays submitted successfully', false)
    },
    onError: () => {
      NotificationMessage('Error', 'Failed to submit holidays', true)
    },
  })

  return {
    getMetadata,
    getHolidays,
    downloadTemplate,
    uploadTemplate,
    submitUploadedHolidays,
    upsertCalendars,
    deleteHolidays,
  }
}
