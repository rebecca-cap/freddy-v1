import { toastApiError } from '@api/common'
import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'

import { APIResponse } from './../../../api/globalTypes'
import { AllPageViewResponseData, UpsertPageViewPayload, UpsertPageViewResponse } from './pageViewTypes.schema'

export const endpoints = {
  saveView: 'Application/UserDefinedPageView/Upsert',
  deleteView: 'Application/UserDefinedPageView/Delete',
  getViews: 'Application/UserDefinedPageView/Read',
} as const

export const usePageViews = () => {
  const api = useApi()

  const useSavePageViewMutation = useMutation(
    [endpoints.saveView],
    (view: UpsertPageViewPayload): Promise<UpsertPageViewResponse> => api.post(endpoints.saveView, view),
    {
      onError: toastApiError,
    }
  )

  const useDeletePageViewMutation = useMutation(
    [endpoints.deleteView],
    (UserPreferenceId: number) => api.post(endpoints.deleteView, { UserPreferenceId }),
    {
      onError: toastApiError,
    }
  )

  const useGetPageViewsQuery = () =>
    useQuery([endpoints.getViews], () => api.post(endpoints.getViews), {
      onError: toastApiError,
      refetchOnWindowFocus: false,
    }) as UseQueryResult<APIResponse<AllPageViewResponseData[]>, Error>

  return {
    useSavePageViewMutation,
    useDeletePageViewMutation,
    useGetPageViewsQuery,
  }
}
