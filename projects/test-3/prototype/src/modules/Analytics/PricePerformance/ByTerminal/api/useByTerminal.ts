import { useApi } from '@gravitate-js/excalibrr'
import { PricePerformanceByTerminalResponse } from '@modules/Analytics/PricePerformance/ByTerminal/api/types'
import { PayloadDate } from '@modules/Analytics/PricePerformance/components/types'
import { useQuery } from '@tanstack/react-query'

export const endpoints = {
  byTerminal: 'PricePerformance/ByTerminal',
} as const

export const usePricePerformanceByTerminal = () => {
  const api = useApi()
  const useByTerminalQuery = (FromDate: PayloadDate, ToDate: PayloadDate) =>
    useQuery<PricePerformanceByTerminalResponse>(
      [endpoints.byTerminal, FromDate, ToDate],
      async () => api.post(endpoints.byTerminal, { FromDate, ToDate }),
      { refetchOnWindowFocus: false, enabled: !!FromDate && !!ToDate }
    )
  return { useByTerminalQuery }
}
