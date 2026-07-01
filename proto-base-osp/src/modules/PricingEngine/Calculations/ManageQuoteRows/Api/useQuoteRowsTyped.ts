import { NotificationMessage } from '@gravitate-js/excalibrr'
import { type InferRequestBody, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { alertIfErr, eagerlyUpdateRowData } from '@utils/api'
import type { QuoteConfigurationMappingUpsertPayload } from './types.schema'

type UpsertConfigRequest = InferRequestBody<'/api/QuoteConfigurationManagement/UpsertConfiguration'>
type UpsertGroupRequest = InferRequestBody<'/api/QuoteConfigurationManagement/Groups/Upsert'>
type SpreadAssignRequest = InferRequestBody<'/api/QuoteConfigurationManagement/Spread/Assign'>
type SpreadRemoveRequest = InferRequestBody<'/api/QuoteConfigurationManagement/Spread/Remove'>

const configurationsKey = queryKey('/api/QuoteConfigurationManagement/GetConfigurations')
const mappingsKey = queryKey('/api/QuoteConfigurationManagement/GetMappings')
const mappingMetadataKey = queryKey('/api/QuoteConfigurationManagement/GetMappingManagementMetaData')
const groupsKey = queryKey('/api/QuoteConfigurationManagement/Groups/GetAll')

export const useQuoteRowsTyped = () => {
  const queryClient = useQueryClient()
  const api = useTypedApi()

  const useConfigurations = () =>
    useQuery({
      queryKey: configurationsKey,
      queryFn: () => unwrap(api.POST('/api/QuoteConfigurationManagement/GetConfigurations')),
      refetchOnWindowFocus: false,
    })

  const createConfiguration = useMutation({
    mutationFn: (payload: UpsertConfigRequest) =>
      unwrap(api.POST('/api/QuoteConfigurationManagement/UpsertConfiguration', { body: payload })),
    onSuccess: (response: any) => {
      if (alertIfErr(response, 'Something went wrong - failed to create configuration')) return
      eagerlyUpdateRowData(response?.Data, configurationsKey[0], 'ConfigurationName', queryClient)
      NotificationMessage('Success', 'Configuration created', false)
    },
    onError: (error: any) => {
      const erroredJson = error?.json
      const fallbackError = 'Something went wrong - failed to create configuration'
      if (!alertIfErr(erroredJson, fallbackError)) {
        console.error(error)
        NotificationMessage('Error', fallbackError, true)
      }
    },
  })

  const updateConfiguration = useMutation({
    mutationFn: (row: UpsertConfigRequest) =>
      unwrap(api.POST('/api/QuoteConfigurationManagement/UpsertConfiguration', { body: row })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: configurationsKey })
      NotificationMessage('Success', 'Configuration updated', false)
    },
    onError: (error: any) => {
      const erroredJson = error?.json
      const fallbackErr = 'Something went wrong - failed to update configuration'
      if (!alertIfErr(erroredJson, fallbackErr)) {
        console.error(error)
        NotificationMessage('Error', fallbackErr, true)
      }
    },
  })

  const useGroups = () =>
    useQuery({
      queryKey: groupsKey,
      queryFn: () => unwrap(api.POST('/api/QuoteConfigurationManagement/Groups/GetAll')),
      refetchOnWindowFocus: false,
    })

  const upsertGroup = useMutation({
    mutationKey: queryKey('/api/QuoteConfigurationManagement/Groups/Upsert'),
    mutationFn: (payload: UpsertGroupRequest) =>
      unwrap(api.POST('/api/QuoteConfigurationManagement/Groups/Upsert', { body: payload })),
    onMutate: (payload: any) => {
      eagerlyUpdateRowData(payload, groupsKey[0], 'QuoteConfigurationMappingGroupId', queryClient)
    },
    onSuccess: (response: any, payload: UpsertGroupRequest) => {
      if (alertIfErr(response, 'Something went wrong - failed to update group')) return
      queryClient.invalidateQueries({ queryKey: groupsKey })
      queryClient.invalidateQueries({ queryKey: mappingMetadataKey })
      const isUpdate = (payload?.QuoteConfigurationMappingGroupId ?? 0) > 0
      NotificationMessage('Success', isUpdate ? 'Quote Group updated' : 'Quote Group created', false)
    },
    onError: (error: any) => {
      const erroredJson = error?.json
      const fallbackErr = 'Something went wrong - failed to update group'
      if (!alertIfErr(erroredJson, fallbackErr)) {
        console.error(error)
        NotificationMessage('Error', fallbackErr, true)
      }
    },
  })

  const useMappings = () =>
    useQuery({
      queryKey: mappingsKey,
      queryFn: () => unwrap(api.POST('/api/QuoteConfigurationManagement/GetMappings', { body: {} })),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    })

  const useMappingMetadata = () =>
    useQuery({
      queryKey: mappingMetadataKey,
      queryFn: () => unwrap(api.POST('/api/QuoteConfigurationManagement/GetMappingManagementMetaData')),
      refetchOnWindowFocus: false,
    })

  const useConfigMetadata = () =>
    useQuery({
      queryKey: queryKey('/api/QuoteConfigurationManagement/GetConfigurationMetaDataViewModel'),
      queryFn: () => unwrap(api.POST('/api/QuoteConfigurationManagement/GetConfigurationMetaDataViewModel')),
      refetchOnWindowFocus: false,
    })

  const upsertMapping = useMutation({
    mutationKey: queryKey('/api/QuoteConfigurationManagement/UpsertMappings'),
    mutationFn: async ({ rowOrRows }: QuoteConfigurationMappingUpsertPayload) =>
      unwrap(
        api.POST('/api/QuoteConfigurationManagement/UpsertMappings', {
          body: { Inputs: Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows] },
        })
      ),
    onMutate: (response: any) => {
      const rows = Array.isArray(response.rowOrRows) ? response.rowOrRows : [response.rowOrRows]
      rows.forEach((row: any) => {
        eagerlyUpdateRowData(row, mappingsKey[0], 'QuoteConfigurationMappingId', queryClient, true)
      })
    },
    onSuccess: async (response: any) => {
      if (alertIfErr(response, 'Something went wrong - failed to update quote row')) return
    },
    onError: (error: any) => {
      const erroredJson = error?.json
      const fallbackErr = 'Something went wrong - failed to update quote row'
      if (!alertIfErr(erroredJson, fallbackErr)) {
        console.error(error)
        NotificationMessage('Error', fallbackErr, true)
      }
    },
  })

  const assignSpreadMutation = useMutation({
    mutationKey: queryKey('/api/QuoteConfigurationManagement/Spread/Assign'),
    mutationFn: (payload: SpreadAssignRequest) =>
      unwrap(api.POST('/api/QuoteConfigurationManagement/Spread/Assign', { body: payload })),
    onSuccess: (_responseData: any, requestPayload: any) => {
      queryClient.setQueriesData({ queryKey: mappingsKey }, (old: any) => {
        const oldData = old?.Data ?? []
        const newData = oldData.map((d: any) => {
          const found = requestPayload.SpreadUpdates.find(
            (u: any) => u.QuoteConfigurationMappingId === d.QuoteConfigurationMappingId
          )
          if (!found) return d
          return { ...d, ...found }
        })
        return { ...old, Data: newData }
      })
      NotificationMessage('Success', 'Spread saved', false)
    },
    onError: () => {
      NotificationMessage('Error', 'Uncaught spread assignment error, see console for details', true)
    },
  })

  const removeSpreadMutation = useMutation({
    mutationKey: queryKey('/api/QuoteConfigurationManagement/Spread/Remove'),
    mutationFn: (payload: SpreadRemoveRequest) =>
      unwrap(api.POST('/api/QuoteConfigurationManagement/Spread/Remove', { body: payload })),
    onMutate: (params: any) => {
      const idsToRemove = params.QCMappingIdsToRemove.map((id: number) => id.toString())
      const existingCache = queryClient.getQueryData(mappingsKey)
      if (existingCache) {
        queryClient.setQueryData(mappingsKey, (old: any) => {
          const newData = old.Data.filter(
            (row: any) => !idsToRemove.includes(row.QuoteConfigurationMappingId.toString())
          )
          return { Data: newData }
        })
      }
    },
    onSuccess: () => {
      NotificationMessage('Success', 'Spread removed', false)
    },
    onError: () => {
      NotificationMessage('Error', 'Uncaught spread removal error, see console for details', true)
    },
  })

  return {
    useConfigurations,
    createConfiguration,
    updateConfiguration,
    useMappings,
    useMappingMetadata,
    useConfigMetadata,
    upsertMapping,
    useGroups,
    upsertGroup,
    assignSpreadMutation,
    removeSpreadMutation,
  }
}
