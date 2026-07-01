import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { alertIfErr, eagerlyUpdateRowData } from '@utils/api'
import { message } from 'antd'

import {
  GetMappingsResponse,
  QuoteConfigurationCreatePayload,
  QuoteConfigurationCreateResponse,
  QuoteConfigurationGroupUpsertPayload,
  QuoteConfigurationGroupUpsertResponse,
  QuoteConfigurationMappingUpsertPayload,
  QuoteConfigurationMetadata,
  QuoteConfigurationOverview,
  QuoteMappingMetadata,
} from './types.schema'

const endpoints = {
  configurations: 'QuoteConfigurationManagement/GetConfigurations',
  configurationsUpsert: 'QuoteConfigurationManagement/UpsertConfiguration',
  mappings: 'QuoteConfigurationManagement/GetMappings',
  mutate: 'QuoteConfigurationManagement/UpsertMappings',
  mappingMetadata: 'QuoteConfigurationManagement/GetMappingManagementMetaData',
  configMetadata: 'QuoteConfigurationManagement/GetConfigurationMetaDataViewModel',
  groups: 'QuoteConfigurationManagement/Groups/GetAll',
  upsertGroup: 'QuoteConfigurationManagement/Groups/Upsert',
  spreadAssign: 'QuoteConfigurationManagement/Spread/Assign',
  spreadRemove: 'QuoteConfigurationManagement/Spread/Remove',
} as const

export const useQuoteRows = () => {
  const queryClient = useQueryClient()
  const api = useApi()

  const useConfigurations = () =>
    useQuery([endpoints.configurations], async ({ queryKey }) => api.post(queryKey[0]) as QuoteConfigurationOverview, {
      refetchOnWindowFocus: false,
    })

  const createConfiguration = useMutation<QuoteConfigurationCreateResponse, unknown, QuoteConfigurationCreatePayload>({
    mutationFn: (payload) => api.post(endpoints.configurationsUpsert, payload),
    onSuccess: (response) => {
      if (alertIfErr(response, 'Something went wrong - failed to create configuration')) return
      eagerlyUpdateRowData(response?.Data, endpoints.configurations, 'ConfigurationName', queryClient)
      message.success('Configuration created')
    },
    onError: (error: any) => {
      const erroredJson = error?.json
      const fallbackError = 'Something went wrong - failed to create configuration'
      if (!alertIfErr(erroredJson, fallbackError)) {
        console.error(error)
        message.error(fallbackError)
      }
    },
  })

  const updateConfiguration = useMutation<QuoteConfigurationCreateResponse, unknown, QuoteConfigurationCreatePayload>({
    mutationFn: (row) => api.post(endpoints.configurationsUpsert, row),
    onSuccess: () => {
      // TODO: eager update row cache
      queryClient.invalidateQueries([endpoints.configurations])
      message.success('Configuration updated')
    },
    onError: (error: any) => {
      const erroredJson = error?.json
      const fallbackErr = 'Something went wrong - failed to update configuration'
      if (!alertIfErr(erroredJson, fallbackErr)) {
        console.error(error)
        message.error(fallbackErr)
      }
    },
  })

  const useGroups = () =>
    useQuery([endpoints.groups], async () => api.post(endpoints.groups), {
      refetchOnWindowFocus: false,
    })

  const upsertGroup = useMutation<QuoteConfigurationGroupUpsertResponse, unknown, QuoteConfigurationGroupUpsertPayload>(
    {
      mutationKey: [endpoints.upsertGroup],
      mutationFn: async (payload) => api.post(endpoints.upsertGroup, payload),
      onMutate: (payload) => {
        eagerlyUpdateRowData(payload, endpoints.groups, 'QuoteConfigurationMappingGroupId', queryClient)
      },
      onSuccess: (response) => {
        if (alertIfErr(response, 'Something went wrong - failed to update group')) return
        // TODO: would be nice to have a reusable eager update function for metadata as well.
        queryClient.invalidateQueries([endpoints.mappingMetadata])
      },
      onError: (error: any) => {
        const erroredJson = error?.json
        const fallbackErr = 'Something went wrong - failed to update group'
        if (!alertIfErr(erroredJson, fallbackErr)) {
          console.error(error)
          message.error(fallbackErr)
        }
      },
    }
  )

  const useMappings = () =>
    useQuery<GetMappingsResponse>([endpoints.mappings], async () => api.post(endpoints.mappings, {}), {
      // stale time of 5 minutes
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    })

  const useMappingMetadata = () =>
    useQuery([endpoints.mappingMetadata], async () => api.post(endpoints.mappingMetadata, {}) as QuoteMappingMetadata, {
      refetchOnWindowFocus: false,
    })

  const useConfigMetadata = () =>
    useQuery(
      [endpoints.configMetadata],
      async () => api.post(endpoints.configMetadata, {}) as QuoteConfigurationMetadata,
      {
        refetchOnWindowFocus: false,
      }
    )

  const upsertMapping = useMutation<QuoteConfigurationCreateResponse, unknown, QuoteConfigurationMappingUpsertPayload>({
    mutationKey: [endpoints.mutate],
    mutationFn: async ({ rowOrRows }) =>
      api.post(endpoints.mutate, {
        Inputs: Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows],
      }),
    onMutate: (response) => {
      const rows = Array.isArray(response.rowOrRows) ? response.rowOrRows : [response.rowOrRows]
      rows.forEach((row) => {
        eagerlyUpdateRowData(row, endpoints.mappings, 'QuoteConfigurationMappingId', queryClient, true)
      })
    },
    onSuccess: async (response) => {
      if (alertIfErr(response, 'Something went wrong - failed to update quote row')) return
    },
    onError: (error: any) => {
      const erroredJson = error?.json
      const fallbackErr = 'Something went wrong - failed to update quote row'
      if (!alertIfErr(erroredJson, fallbackErr)) {
        console.error(error)
        message.error(fallbackErr)
      }
    },
  })

  type QuoteSpreadPayload = {
    SpreadUpdates: {
      QuoteConfigurationMappingId: number
      SpreadParentMappingId: number
      SpreadAmount: number
    }[]
  }

  type QuoteSpreadRemovalPayload = {
    QCMappingIdsToRemove: number[]
  }

  const assignSpreadMutation = useMutation<unknown, unknown, QuoteSpreadPayload>({
    mutationKey: [endpoints.spreadAssign],
    mutationFn: async (payload) => api.post(endpoints.spreadAssign, payload),
    onSuccess: (_responseData, requestPayload, _) => {
      queryClient.setQueriesData([endpoints.mappings], (old: any) => {
        const oldData = old?.Data ?? []
        const newData = oldData.map((d) => {
          const found = requestPayload.SpreadUpdates.find(
            (u) => u.QuoteConfigurationMappingId === d.QuoteConfigurationMappingId
          )
          if (!found) return d
          return {
            ...d,
            ...found,
          }
        })
        return { ...old, Data: newData }
      })

      message.success('Spread saved')
    },
    onError: (...errorParams) => {
      message.error('Uncaught spread assignment error, see console for details')
    },
  })

  const removeSpreadMutation = useMutation<unknown, unknown, QuoteSpreadRemovalPayload>({
    mutationKey: [endpoints.spreadRemove],
    mutationFn: async (payload) => api.post(endpoints.spreadRemove, payload),
    onMutate: (params) => {
      const idsToRemove = params.QCMappingIdsToRemove.map((id) => id.toString())
      const existingCache = queryClient.getQueryData([endpoints.mappings])
      if (existingCache) {
        queryClient.setQueryData([endpoints.mappings], (old) => {
          const newData = old.Data.filter((row) => !idsToRemove.includes(row.QuoteConfigurationMappingId.toString()))

          return { Data: newData }
        })
      }
    },
    onSuccess: (_responseData, requestPayload, _) => {
      message.success('Spread removed')
    },
    onError: (...errorParams) => {
      message.error('Uncaught spread removal error, see console for details')
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
