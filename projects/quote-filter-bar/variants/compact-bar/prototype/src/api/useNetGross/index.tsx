import { NetGrossDefaultResponse, NetGrossMetadataResponse, NetGrossRulesResponse } from '@api/useNetGross/types'
import { useApi } from '@gravitate-js/excalibrr'
import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

const endpoints = {
  metadata: 'Admin/NetGrossRules/Metadata',
  read: 'Admin/NetGrossRules/GetAll',
  createOrUpdate: 'Admin/NetGrossRules/CreateOrUpdate',
  delete: 'Admin/NetGrossRules/Delete',
  move: 'Admin/NetGrossRules/Move',
  default: 'Admin/NetGrossRules/GetQuoteDefault',
} as const

export const useNetOrGross = () => {
  const api = useApi()
  const queryClient = useQueryClient()

  const useMetadataQuery = () =>
    useQuery([endpoints.metadata], () => api.post(endpoints.metadata) as NetGrossMetadataResponse, {
      refetchOnWindowFocus: false,
    })
  const useNetGrossRulesRead = (NetOrGrossDefaultTypeCvId) =>
    useQuery(
      [endpoints.read, NetOrGrossDefaultTypeCvId],
      () => api.post(endpoints.read, { NetOrGrossDefaultTypeCvId }) as NetGrossRulesResponse,
      {
        refetchOnWindowFocus: false,
        enabled: !!NetOrGrossDefaultTypeCvId,
      }
    )

  const createUpdateNetGrossRulesMutation = useMutation(
    [endpoints.createOrUpdate],
    (newRules: any[]) => {
      return api.post(endpoints.createOrUpdate, newRules)
    },
    {
      onSuccess: (resp) => {
        if (resp.Validations?.length > 0) {
          const firstError = resp.Validations[0]
          message.error(firstError.Message)
        } else {
          queryClient.invalidateQueries([endpoints.read], { force: true })
        }
      },
    }
  )

  const useNetGrossRulesDeleteMutation = () =>
    useMutation([endpoints.delete], (NetGrossDefaultIds: any) => api.post(endpoints.delete, NetGrossDefaultIds), {
      onSuccess: async (newRow) => {
        const previousQueries = queryClient.getQueriesData([endpoints.read])

        queryClient.invalidateQueries([endpoints.read])

        return { previousQueries, newRow }
      },
    })

  const useNetGrossRulesMoveMutation = () =>
    useMutation(
      [endpoints.move],
      ({ NetGrossDefaultId, NewIndex }) => api.post(endpoints.move, { NetGrossDefaultId, NewIndex }),
      {
        onSuccess: async (newRow) => {
          const previousQueries = queryClient.getQueriesData([endpoints.read])

          queryClient.invalidateQueries([endpoints.read], { force: true })

          return { previousQueries, newRow }
        },
      }
    )

  // TODO: Need type for single QuoteRow (derive from return type of useQuoteRows -> useMappings?)
  const useNetGrossGetDefault = (quoteRow: any, options: UseQueryOptions = {}) =>
    useQuery(
      [endpoints.default],
      () => api.post(endpoints.default, quoteRow) as Promise<NetGrossDefaultResponse>,
      options as any
    )

  return {
    useMetadataQuery,
    useNetGrossRulesRead,
    createUpdateNetGrossRulesMutation,
    useNetGrossRulesDeleteMutation,
    useNetGrossRulesMoveMutation,
    useNetGrossGetDefault,
  }
}
