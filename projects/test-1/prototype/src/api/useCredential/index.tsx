import { useApi } from '@gravitate-js/excalibrr'
import { useQuery } from '@tanstack/react-query'

import { GetUserInfoResponse } from './responseTypes'

export const useCredential = () => {
  const api = useApi()

  // function useSecurityContext() {
  //   return api.post<SecurityContext>('Credential/GetCurrentSecurityContext')
  // }

  const useUserInfoQuery = () =>
    useQuery(['userInfo'], () => api.post<GetUserInfoResponse>('Credential/GetUserInfo'), {
      refetchOnWindowFocus: false,
    })

  const getImpersonationOptionsQuery = () =>
    useQuery(
      ['impersonationCounterparties'],
      async () => {
        const data = await api.post('Credential/GetImpersonationCounterparties')
        const newData = data?.Data
          ? [{ Value: 'All', Label: 'All Companies', GroupingValue: null, Text: 'All Companies' }, ...data.Data]
          : []
        return newData
      },
      { refetchOnWindowFocus: false }
    )

  // const getImpersonationOptionsQuery = useQuery(['getImpersonationOptions'], () =>
  //   api.post('Credential/GetImpersonationList')
  // )

  // const updateImpersonationMutation = useMutation(['updateImpersonation', cpId], (newCounterPartyId: string) =>
  //   api.post('Credential/SaveImpersonation', null, {
  //     queryParams: new URLSearchParams({ newCounterPartyId }),
  //   })
  // )

  return { useUserInfoQuery, getImpersonationOptionsQuery }
}
