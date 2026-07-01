import { Vertical } from '@gravitate-js/excalibrr'
import { usePriceFileLineItemsReport } from '@modules/Admin/Integrations/PriceFileLineItems/api/usePriceFileLineItemsReport'
import { PriceFileLineItemsReportGrid } from '@modules/Admin/Integrations/PriceFileLineItems/components/Grid'
import moment from 'moment/moment'
import React, { useState } from 'react'

export function PriceFileLineItemsReport() {
  const defaultDateFilter = [moment().subtract(3,'day'), moment().endOf('day')]

  const [filterDates, setFilterDates] = useState(defaultDateFilter)

  const { usePriceFileLineItemsReportData } = usePriceFileLineItemsReport()
  const { data: reportData, isLoading } = usePriceFileLineItemsReportData(filterDates[0], filterDates[1])

  return (
    <Vertical flex={1}>
      <PriceFileLineItemsReportGrid
        filterDates={filterDates}
        setFilterDates={setFilterDates}
        data={reportData?.Data}
        isLoading={isLoading}
      />
    </Vertical>
  )
}
