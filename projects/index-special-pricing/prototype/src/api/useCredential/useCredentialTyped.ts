/**
 * Type-safe Credential API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('Credential/GetUserInfo')
 * - New: api.POST('/api/Credential/GetUserInfo')
 */

import { useQuery } from '@tanstack/react-query'

import {
  useTypedApi,
  unwrap,
  queryKey,
  type InferResponse,
} from '@hooks/useTypedApi'

export type CredentialUserInfoResponse = InferResponse<'/api/Credential/GetUserInfo'>
export type CredentialImpersonationResponse = InferResponse<'/api/Credential/GetImpersonationCounterparties'>

const queryKeys = {
  userInfo: queryKey('/api/Credential/GetUserInfo'),
  impersonationCounterparties: queryKey('/api/Credential/GetImpersonationCounterparties'),
} as const

export const useCredentialTyped = () => {
  const api = useTypedApi()

  /**
   * Fetch user info
   */
  const useUserInfoQuery = () =>
    useQuery({
      queryKey: queryKeys.userInfo,
      queryFn: () => unwrap(api.POST('/api/Credential/GetUserInfo')),
      refetchOnWindowFocus: false,
    })

  /**
   * Fetch impersonation options
   */
  const getImpersonationOptionsQuery = () =>
    useQuery({
      queryKey: queryKeys.impersonationCounterparties,
      queryFn: async () => {
        const data = await unwrap(api.POST('/api/Credential/GetImpersonationCounterparties'))
        const newData = data?.Data
          ? [{ Value: 'All', Label: 'All Companies', GroupingValue: null, Text: 'All Companies' }, ...data.Data]
          : []
        return newData
      },
      refetchOnWindowFocus: false,
    })

  return { useUserInfoQuery, getImpersonationOptionsQuery }
}
