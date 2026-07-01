import { useApi } from '@gravitate-js/excalibrr'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const useImpersonation = () => {
  const api = useApi()
  const [currentCounterParty, setCurrentCounterParty] = useState<string | null>('')
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
  const { data: impersonationCounterparties } = getImpersonationOptionsQuery()

  useEffect(() => {
    if (impersonationCounterparties?.length) {
      const currentCP = localStorage.getItem('Gravitate-Current-CounterParty')
      if (currentCP !== 'All') {
        const selectedCP = impersonationCounterparties?.find((cp) => cp.Value === currentCP)
        setCurrentCounterParty(selectedCP?.Text)
      } else {
        setCurrentCounterParty(null)
      }
    }
  }, [impersonationCounterparties?.length])

  return [currentCounterParty]
}
