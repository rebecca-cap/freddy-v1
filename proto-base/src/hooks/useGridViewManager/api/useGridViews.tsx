import { toastApiError } from '@api/common'
import { useApi } from '@gravitate-js/excalibrr'
import { ApiResponse, GridViewPayload } from '@hooks/useGridViewManager/api/types.schema'
import { useMutation } from '@tanstack/react-query'

export const endpoints = {
  saveView: 'Application/UserDefinedGridView/Upsert', // edit a view name or state
  deleteView: 'Application/UserDefinedGridView/Delete',
} as const

export const useGridViews = () => {
  const api = useApi()

  const useSaveViewMutation = useMutation(
    [endpoints.saveView],
    (view: GridViewPayload): Promise<ApiResponse> => api.post(endpoints.saveView, view),
    {
      onError: toastApiError,
    }
  )
  const useDeleteViewMutation = useMutation(
    [endpoints.deleteView],
    (UserPreferenceId: number) => api.post(endpoints.deleteView, { UserPreferenceId }),
    {
      onError: toastApiError,
    }
  )

  return { useSaveViewMutation, useDeleteViewMutation }
}
