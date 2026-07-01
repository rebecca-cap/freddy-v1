import { Vertical } from '@gravitate-js/excalibrr'
import { useAppliedAllocationReport } from '@modules/Admin/AppliedAllocationReport/api/useAppliedAllocationReport'
import { AppliedAllocationReportGrid } from '@modules/Admin/AppliedAllocationReport/components/Grid'
import moment from 'moment/moment'
import React, { useState } from 'react'

export function AppliedAllocationReport() {
  const defaultDateFilter = [moment().startOf('day'), moment().endOf('day')]

  const [filterDates, setFilterDates] = useState(defaultDateFilter)

  const { useAppliedAllocationReportData } = useAppliedAllocationReport()
  const { data } = useAppliedAllocationReportData(filterDates[0], filterDates[1])

  return (
    <Vertical flex={1}>
      <AppliedAllocationReportGrid filterDates={filterDates} setFilterDates={setFilterDates} data={data} />
    </Vertical>
  )
}
