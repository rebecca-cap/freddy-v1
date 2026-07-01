/**
 * Type-safe Grid Views API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('Application/UserDefinedGridView/Upsert')
 * - New: api.POST('/api/Application/UserDefinedGridView/Upsert')
 */

import { toastApiError } from '@api/common'
import {
  queryKey,
  unwrap,
  useTypedApi,
  type components,
  type InferRequestBody,
  type InferResponse,
} from '@hooks/useTypedApi'
import { useMutation } from '@tanstack/react-query'

export type UpsertRequest = InferRequestBody<'/api/Application/UserDefinedGridView/Upsert'>
export type DeleteRequest = InferRequestBody<'/api/Application/UserDefinedGridView/Delete'>

export type UpsertResponse = InferResponse<'/api/Application/UserDefinedGridView/Upsert'>
export type DeleteResponse = InferResponse<'/api/Application/UserDefinedGridView/Delete'>

// Schema types - using generated types from OpenAPI
export type GridViewPayload = components['schemas']['Application.UserPreferences.UserDefinedGridView']
export type GridViewDeleteRequest = components['schemas']['Application.UserPreferences.UserDefinedGridDeleteRequest']

const mutationKeys = {
  upsert: queryKey('/api/Application/UserDefinedGridView/Upsert'),
  delete: queryKey('/api/Application/UserDefinedGridView/Delete'),
} as const

export const useGridViewsTyped = () => {
  const api = useTypedApi()

  /**
   * Save (create or update) a grid view
   */
  const useSaveViewMutation = () =>
    useMutation({
      mutationKey: mutationKeys.upsert,
      mutationFn: (view: GridViewPayload) =>
        unwrap(
          api.POST('/api/Application/UserDefinedGridView/Upsert', {
            body: view,
          })
        ),
      onError: (e) => toastApiError(e as Parameters<typeof toastApiError>[0]),
    })

  /**
   * Delete a grid view by UserPreferenceId
   */
  const useDeleteViewMutation = () =>
    useMutation({
      mutationKey: mutationKeys.delete,
      mutationFn: (UserPreferenceId: number) =>
        unwrap(
          api.POST('/api/Application/UserDefinedGridView/Delete', {
            body: { UserPreferenceId },
          })
        ),
      onError: (e) => toastApiError(e as Parameters<typeof toastApiError>[0]),
    })

  return { useSaveViewMutation, useDeleteViewMutation }
}
