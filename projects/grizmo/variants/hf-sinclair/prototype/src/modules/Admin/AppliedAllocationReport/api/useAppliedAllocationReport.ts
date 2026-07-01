import { useApi } from '@gravitate-js/excalibrr'
import { AppliedAllocationStatusReportResponse } from '@modules/Admin/AppliedAllocationReport/api/types.schema'
import { useQuery } from '@tanstack/react-query'
import { Moment } from 'moment'

const endpoints = {
  read: 'MarketPlatform/Admin/OrderAllocationStatus/GetOrderAllocationData',
} as const

export const useAppliedAllocationReport = () => {
  const api = useApi()

  const useAppliedAllocationReportData = (FromDate: Moment, ToDate: Moment) =>
    useQuery<AppliedAllocationStatusReportResponse>(
      [endpoints.read, FromDate, ToDate],
      () => api.post(endpoints.read, { MinContractEffective: FromDate, MaxContractEffective: ToDate }),
      { refetchOnWindowFocus: false, enabled: !!FromDate && !!ToDate }
    )

  return {
    useAppliedAllocationReportData,
  }
}
