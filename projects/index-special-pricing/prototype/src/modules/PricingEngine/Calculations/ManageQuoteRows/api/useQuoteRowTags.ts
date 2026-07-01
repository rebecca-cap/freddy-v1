import { NotificationMessage } from '@gravitate-js/excalibrr'
import { type InferRequestBody, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { alertIfErr } from '@utils/api'

type ApplyAssignmentsRequest = InferRequestBody<'/api/QuoteConfigurationManagement/Tags/ApplyAssignments'>
type CreateAndAssignRequest = InferRequestBody<'/api/QuoteConfigurationManagement/Tags/CreateAndAssign'>
type UpsertTagsRequest = InferRequestBody<'/api/QuoteConfigurationManagement/Tags/Upsert'>
type DeleteTagRequest = InferRequestBody<'/api/QuoteConfigurationManagement/Tags/Delete'>

const tagsKey = queryKey('/api/QuoteConfigurationManagement/Tags/GetAll')
const mappingsKey = queryKey('/api/QuoteConfigurationManagement/GetMappings')

export const useQuoteRowTags = () => {
  const queryClient = useQueryClient()
  const api = useTypedApi()

  const useTagDefinitions = () =>
    useQuery({
      queryKey: tagsKey,
      queryFn: () => unwrap(api.POST('/api/QuoteConfigurationManagement/Tags/GetAll')),
      refetchOnWindowFocus: false,
    })

  const applyAssignmentsMutation = useMutation({
    mutationKey: queryKey('/api/QuoteConfigurationManagement/Tags/ApplyAssignments'),
    mutationFn: (payload: ApplyAssignmentsRequest) =>
      unwrap(api.POST('/api/QuoteConfigurationManagement/Tags/ApplyAssignments', { body: payload })),
    onMutate: (payload: ApplyAssignmentsRequest) => {
      queryClient.setQueryData(mappingsKey, (old: any) => {
        if (!old?.Data) return old
        const byMappingId = new Map(payload.Rows?.map((r) => [r.QuoteConfigurationMappingId, r.QuoteRowTagIds]) ?? [])
        const newData = old.Data.map((row: any) => {
          const next = byMappingId.get(row.QuoteConfigurationMappingId)
          return next === undefined ? row : { ...row, AssignedQuoteRowTagIds: next }
        })
        return { ...old, Data: newData }
      })
    },
    onSuccess: (response: any) => {
      if (alertIfErr(response, 'Something went wrong - failed to apply tag assignments')) return
    },
    onError: (error: any) => {
      const erroredJson = error?.json
      const fallbackErr = 'Something went wrong - failed to apply tag assignments'
      if (!alertIfErr(erroredJson, fallbackErr)) {
        console.error(error)
        NotificationMessage('Error', fallbackErr, true)
      }
      queryClient.invalidateQueries({ queryKey: mappingsKey })
    },
  })

  const createAndAssignMutation = useMutation({
    mutationKey: queryKey('/api/QuoteConfigurationManagement/Tags/CreateAndAssign'),
    mutationFn: (payload: CreateAndAssignRequest) =>
      unwrap(api.POST('/api/QuoteConfigurationManagement/Tags/CreateAndAssign', { body: payload })),
    onSuccess: (response: any, payload: CreateAndAssignRequest) => {
      if (alertIfErr(response, 'Something went wrong - failed to create tag')) return

      const newTag = response?.Data
      if (!newTag?.QuoteRowTagId) return

      queryClient.setQueryData(tagsKey, (old: any) => {
        if (!old?.Data) return old
        const exists = old.Data.some((t: any) => t.QuoteRowTagId === newTag.QuoteRowTagId)
        if (exists) return old
        return { ...old, Data: [...old.Data, newTag].sort((a, b) => (a.TagName ?? '').localeCompare(b.TagName ?? '')) }
      })

      queryClient.setQueryData(mappingsKey, (old: any) => {
        if (!old?.Data) return old
        const newData = old.Data.map((row: any) => {
          if (row.QuoteConfigurationMappingId !== payload.QuoteConfigurationMappingId) return row
          const existing: number[] = row.AssignedQuoteRowTagIds ?? []
          if (existing.includes(newTag.QuoteRowTagId)) return row
          return { ...row, AssignedQuoteRowTagIds: [...existing, newTag.QuoteRowTagId] }
        })
        return { ...old, Data: newData }
      })
    },
    onError: (error: any) => {
      const erroredJson = error?.json
      const fallbackErr = 'Something went wrong - failed to create tag'
      if (!alertIfErr(erroredJson, fallbackErr)) {
        console.error(error)
        NotificationMessage('Error', fallbackErr, true)
      }
    },
  })

  const upsertMutation = useMutation({
    mutationKey: queryKey('/api/QuoteConfigurationManagement/Tags/Upsert'),
    mutationFn: (payload: UpsertTagsRequest) =>
      unwrap(api.POST('/api/QuoteConfigurationManagement/Tags/Upsert', { body: payload })),
    onSuccess: (response: any) => {
      if (alertIfErr(response, 'Something went wrong - failed to save tag')) return
      queryClient.invalidateQueries({ queryKey: tagsKey })
      NotificationMessage('Success', 'Tag saved', false)
    },
    onError: (error: any) => {
      const erroredJson = error?.json
      const fallbackErr = 'Something went wrong - failed to save tag'
      if (!alertIfErr(erroredJson, fallbackErr)) {
        console.error(error)
        NotificationMessage('Error', fallbackErr, true)
      }
    },
  })

  const deleteMutation = useMutation({
    mutationKey: queryKey('/api/QuoteConfigurationManagement/Tags/Delete'),
    mutationFn: (payload: DeleteTagRequest) =>
      unwrap(api.POST('/api/QuoteConfigurationManagement/Tags/Delete', { body: payload })),
    onSuccess: (response: any, payload: DeleteTagRequest) => {
      if (alertIfErr(response, 'Something went wrong - failed to delete tag')) return
      queryClient.setQueryData(tagsKey, (old: any) => {
        if (!old?.Data) return old
        return { ...old, Data: old.Data.filter((t: any) => t.QuoteRowTagId !== payload.QuoteRowTagId) }
      })
      NotificationMessage('Success', 'Tag deleted', false)
    },
    onError: (error: any) => {
      const erroredJson = error?.json
      const fallbackErr = 'Something went wrong - failed to delete tag'
      if (!alertIfErr(erroredJson, fallbackErr)) {
        console.error(error)
        NotificationMessage('Error', fallbackErr, true)
      }
    },
  })

  return {
    useTagDefinitions,
    applyAssignmentsMutation,
    createAndAssignMutation,
    upsertMutation,
    deleteMutation,
  }
}
