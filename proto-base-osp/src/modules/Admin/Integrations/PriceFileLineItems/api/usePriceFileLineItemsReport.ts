import { useApi } from '@gravitate-js/excalibrr'
import { PriceFileLineItemsReportResponse } from '@modules/Admin/Integrations/PriceFileLineItems/api/types.schema'
import { useQuery } from '@tanstack/react-query'
import { Moment } from 'moment'

const endpoints = {
  read: 'Admin/PriceFileLineItemData/read',
} as const

export const usePriceFileLineItemsReport = () => {
  const api = useApi()

  const usePriceFileLineItemsReportData = (FromDate: Moment, ToDate: Moment) =>
    useQuery<PriceFileLineItemsReportResponse>(
      [endpoints.read, FromDate, ToDate],
      () =>
        api.post(endpoints.read, {
          minPriceFileImportLineItemEffectiveDateTime: FromDate,
          maxPriceFileImportLineItemEffectiveDateTime: ToDate,
        }),
      { refetchOnWindowFocus: false, enabled: !!FromDate && !!ToDate }
    )

  return {
    usePriceFileLineItemsReportData,
  }
}
