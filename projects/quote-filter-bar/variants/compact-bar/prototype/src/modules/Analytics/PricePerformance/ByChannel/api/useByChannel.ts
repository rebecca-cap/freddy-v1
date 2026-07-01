import { useApi } from '@gravitate-js/excalibrr'
import { PricePerformanceByChannelResponse } from '@modules/Analytics/PricePerformance/ByChannel/api/types'
import { PayloadDate } from '@modules/Analytics/PricePerformance/components/types'
import { useQuery } from '@tanstack/react-query'

export const endpoints = {
  byChannel: 'PricePerformance/ByChannel',
} as const
export const usePricePerformanceByChannel = () => {
  const api = useApi()
  const useByChannelQuery = (FromDate: PayloadDate, ToDate: PayloadDate) =>
    useQuery<PricePerformanceByChannelResponse>(
      [endpoints.byChannel, FromDate, ToDate],
      async () => api.post(endpoints.byChannel, { FromDate, ToDate }),
      { refetchOnWindowFocus: false, enabled: !!FromDate && !!ToDate }
    )
  return { useByChannelQuery }
}
