import { useApi } from '@gravitate-js/excalibrr'
import { PricePerformanceByCustomerResponse } from '@modules/Analytics/PricePerformance/ByCustomer/api/types'
import { PayloadDate } from '@modules/Analytics/PricePerformance/components/types'
import { useQuery } from '@tanstack/react-query'

export const endpoints = {
  byCustomer: 'PricePerformance/ByCustomer',
} as const

export const usePricePerformanceByCustomer = () => {
  const api = useApi()
  const useByCustomerQuery = (FromDate: PayloadDate, ToDate: PayloadDate) =>
    useQuery<PricePerformanceByCustomerResponse>(
      [endpoints.byCustomer, FromDate, ToDate],
      async () => api.post(endpoints.byCustomer, { FromDate, ToDate }),
      { refetchOnWindowFocus: false, enabled: !!FromDate && !!ToDate }
    )

  return { useByCustomerQuery }
}
