/**
 * Type-safe Net/Gross Rules API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('Admin/NetGrossRules/GetAll')
 * - New: api.POST('/api/Admin/NetGrossRules/GetAll')
 */

import { UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NotificationMessage } from '@gravitate-js/excalibrr'

import {
  useTypedApi,
  unwrap,
  queryKey,
  type InferResponse,
  type InferRequestBody,
} from '@hooks/useTypedApi'

export type NetGrossMetadataTypedResponse = InferResponse<'/api/Admin/NetGrossRules/Metadata'>
export type NetGrossGetAllTypedResponse = InferResponse<'/api/Admin/NetGrossRules/GetAll'>
export type NetGrossCreateOrUpdateTypedResponse = InferResponse<'/api/Admin/NetGrossRules/CreateOrUpdate'>
type NetGrossDeleteTypedResponse = InferResponse<'/api/Admin/NetGrossRules/Delete'>
type NetGrossMoveTypedResponse = InferResponse<'/api/Admin/NetGrossRules/Move'>
export type NetGrossGetQuoteDefaultTypedResponse = InferResponse<'/api/Admin/NetGrossRules/GetQuoteDefault'>

// Re-export types for consumer compatibility
export type NetGrossMetadataResponse = NetGrossMetadataTypedResponse
export type NetGrossRulesItem = NonNullable<NonNullable<NetGrossGetAllTypedResponse>['Data']>[number]

type NetGrossGetAllTypedRequest = InferRequestBody<'/api/Admin/NetGrossRules/GetAll'>
type NetGrossCreateOrUpdateTypedRequest = InferRequestBody<'/api/Admin/NetGrossRules/CreateOrUpdate'>
type NetGrossDeleteTypedRequest = InferRequestBody<'/api/Admin/NetGrossRules/Delete'>
type NetGrossMoveTypedRequest = InferRequestBody<'/api/Admin/NetGrossRules/Move'>
type NetGrossGetQuoteDefaultTypedRequest = InferRequestBody<'/api/Admin/NetGrossRules/GetQuoteDefault'>

const queryKeys = {
  metadata: queryKey('/api/Admin/NetGrossRules/Metadata'),
  read: queryKey('/api/Admin/NetGrossRules/GetAll'),
  default: queryKey('/api/Admin/NetGrossRules/GetQuoteDefault'),
} as const

export const useNetOrGrossTyped = () => {
  const api = useTypedApi()
  const queryClient = useQueryClient()

  /**
   * Fetch net/gross metadata
   */
  const useMetadataQuery = () =>
    useQuery({
      queryKey: queryKeys.metadata,
      queryFn: () => unwrap(api.POST('/api/Admin/NetGrossRules/Metadata')),
      refetchOnWindowFocus: false,
    })

  /**
   * Fetch net/gross rules
   */
  const useNetGrossRulesRead = (NetOrGrossDefaultTypeCvId: string | number | undefined) =>
    useQuery({
      queryKey: [queryKeys.read[0], NetOrGrossDefaultTypeCvId],
      queryFn: () =>
        unwrap(
          api.POST('/api/Admin/NetGrossRules/GetAll', {
            body: { NetOrGrossDefaultTypeCvId },
          })
        ),
      refetchOnWindowFocus: false,
      enabled: !!NetOrGrossDefaultTypeCvId,
    })

  /**
   * Create or update net/gross rules
   */
  const createUpdateNetGrossRulesMutation = useMutation({
    mutationKey: ['/api/Admin/NetGrossRules/CreateOrUpdate'],
    mutationFn: (newRules: NetGrossCreateOrUpdateTypedRequest) =>
      unwrap(
        api.POST('/api/Admin/NetGrossRules/CreateOrUpdate', {
          body: newRules,
        })
      ),
    onSuccess: (resp) => {
      if (resp.Validations && resp.Validations.length > 0) {
        const firstError = resp.Validations[0]
        NotificationMessage('Error', firstError?.Message ?? 'Unknown error', true)
      } else {
        queryClient.invalidateQueries({ queryKey: [queryKeys.read[0]] })
      }
    },
  })

  /**
   * Delete net/gross rules
   */
  const useNetGrossRulesDeleteMutation = () =>
    useMutation({
      mutationKey: ['/api/Admin/NetGrossRules/Delete'],
      mutationFn: (NetGrossDefaultIds: NetGrossDeleteTypedRequest) =>
        unwrap(
          api.POST('/api/Admin/NetGrossRules/Delete', {
            body: NetGrossDefaultIds,
          })
        ),
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.read[0]] })
      },
    })

  /**
   * Move net/gross rules
   */
  const useNetGrossRulesMoveMutation = () =>
    useMutation({
      mutationKey: ['/api/Admin/NetGrossRules/Move'],
      mutationFn: ({ NetGrossDefaultId, NewIndex }: { NetGrossDefaultId: number; NewIndex: number }) =>
        unwrap(
          api.POST('/api/Admin/NetGrossRules/Move', {
            body: { NetGrossDefaultId, NewIndex },
          })
        ),
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.read[0]] })
      },
    })

  /**
   * Get quote default
   */
  const useNetGrossGetDefault = (quoteRow: NetGrossGetQuoteDefaultTypedRequest, options: Omit<UseQueryOptions<NetGrossGetQuoteDefaultTypedResponse>, 'queryKey' | 'queryFn'> = {}) =>
    useQuery({
      queryKey: queryKeys.default,
      queryFn: () =>
        unwrap(
          api.POST('/api/Admin/NetGrossRules/GetQuoteDefault', {
            body: quoteRow,
          })
        ),
      ...options,
    })

  return {
    useMetadataQuery,
    useNetGrossRulesRead,
    createUpdateNetGrossRulesMutation,
    useNetGrossRulesDeleteMutation,
    useNetGrossRulesMoveMutation,
    useNetGrossGetDefault,
  }
}
