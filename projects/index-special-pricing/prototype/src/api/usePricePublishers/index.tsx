import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eagerlyUpdateRowData } from '@utils/api'
import { cloneDeep } from 'lodash'

import { PricePublisherGet } from './responseTypes'

const endpoints = {
  overview: 'ReferenceData/PricePublisher/Get',
  mutate: 'ReferenceData/PricePublisher/CreateOrUpdate',
} as const

export const usePricePublishers = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const usePublishersGetQuery = (query?: Partial<{ count: number; offset: number }>) =>
    useQuery(
      [endpoints.overview, query],
      async ({ queryKey: [url, query] }) => {
        const resp = (await api.post(url, undefined, query)) as PricePublisherGet
        const withRowIds = resp.Data.map((d) => ({ ...d, id: d.PricePublisherId }))
        return { ...resp, Data: withRowIds.reverse() }
      },
      {
        refetchOnWindowFocus: false,
      }
    )

  const usePublishersMutation = () =>
    useMutation(
      [endpoints.mutate],
      (publisher: any | any[]) => api.post(endpoints.mutate, Array.isArray(publisher) ? publisher : [publisher]),
      {
        onMutate: async (newRow) => {
          await queryClient.cancelQueries([endpoints.overview])
          const previousQueries = queryClient.getQueriesData([endpoints.overview])

          // Optimistically update to the new value

          queryClient.setQueriesData([endpoints.overview], (cache: any) => ({
            ...cache,
            Data: cache.Data.map((row) => (newRow.id === row.id ? { ...row, ...newRow } : row)),
          }))

          return { newRow }
        },
        onError: (err, newRow, context) => {
          queryClient.setQueriesData([endpoints.overview], context.previousQueries)
        },
      }
    )

  const usePublishersCreateMutation = () =>
    useMutation(
      [endpoints.mutate],
      (publisher: any | any[]) => api.post(endpoints.mutate, Array.isArray(publisher) ? publisher : [publisher]),
      {
        onMutate: async (newRow) => {
          const newRowCopy = cloneDeep(newRow)
          await queryClient.cancelQueries([endpoints.overview])
          eagerlyUpdateRowData(newRowCopy, endpoints.overview, 'PricePublisherId', queryClient)
        },
        onSuccess: (data) => {
          queryClient.invalidateQueries([endpoints.overview])
        },
        onError: (err, newRow, context) => {
          queryClient.setQueriesData([endpoints.overview], context)
        },
      }
    )

  return { usePublishersGetQuery, usePublishersMutation, usePublishersCreateMutation }
}
