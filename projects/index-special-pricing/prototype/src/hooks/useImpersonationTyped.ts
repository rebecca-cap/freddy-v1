/**
 * Type-safe Impersonation API hook using OpenAPI generated types
 *
 * Migration notes:
 * - Old: api.post('Credential/GetImpersonationCounterparties')
 * - New: api.POST('/api/Credential/GetImpersonationCounterparties')
 */

import { queryKey, unwrap, useTypedApi, type InferResponse } from '@hooks/useTypedApi'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export type ImpersonationCounterpartiesResponse = InferResponse<'/api/Credential/GetImpersonationCounterparties'>

const queryKeys = {
  impersonationCounterparties: queryKey('/api/Credential/GetImpersonationCounterparties'),
} as const

/**
 * Typed hook for fetching and managing impersonation counterparties
 *
 * This hook provides access to the impersonation options query and tracks
 * the current counterparty selection from localStorage.
 */
export const useImpersonationTyped = () => {
  const api = useTypedApi()
  const [currentCounterParty, setCurrentCounterParty] = useState<string | null>('')

  /**
   * Fetch impersonation counterparties with "All" option prepended
   */
  const useImpersonationOptionsQuery = () =>
    useQuery({
      queryKey: queryKeys.impersonationCounterparties,
      queryFn: async () => {
        const data = await unwrap(api.POST('/api/Credential/GetImpersonationCounterparties'))
        return data?.Data
          ? [{ Value: 'All', Label: 'All Companies', GroupingValue: null, Text: 'All Companies' }, ...data.Data]
          : []
      },
      refetchOnWindowFocus: false,
    })

  const { data: impersonationCounterparties } = useImpersonationOptionsQuery()

  useEffect(() => {
    if (impersonationCounterparties?.length) {
      const currentCP = localStorage.getItem('Gravitate-Current-CounterParty')
      if (currentCP !== 'All') {
        const selectedCP = impersonationCounterparties?.find((cp) => cp.Value === currentCP)
        setCurrentCounterParty(selectedCP?.Text ?? null)
      } else {
        setCurrentCounterParty(null)
      }
    }
  }, [impersonationCounterparties?.length])

  return {
    currentCounterParty,
    useImpersonationOptionsQuery,
    queryKeys,
  }
}
