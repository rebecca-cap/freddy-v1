import { useApi } from '@gravitate-js/excalibrr'
import { PayloadDate } from '@modules/Analytics/PricePerformance/components/types'
import { useQuery } from '@tanstack/react-query'
import { PricePerformanceByContractResponse } from 'src/modules/Analytics/PricePerformance/ByContract/api/types'

export const endpoints = {
  byContract: 'PricePerformance/ByContract',
} as const

export const usePricePerformanceByContract = () => {
  const api = useApi()
  const useByContractQuery = (FromDate: PayloadDate, ToDate: PayloadDate) =>
    useQuery<PricePerformanceByContractResponse>(
      ['pricePerformanceContracts', [FromDate, ToDate]],
      async () => api.post(endpoints.byContract, { FromDate, ToDate }),
      { refetchOnWindowFocus: false, enabled: !!FromDate && !!ToDate }
    )
  return { useByContractQuery }
}
