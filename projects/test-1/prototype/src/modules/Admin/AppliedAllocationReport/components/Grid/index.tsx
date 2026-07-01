import { GraviGrid, RangePicker } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { AppliedAllocationStatusReportResponse } from '@modules/Admin/AppliedAllocationReport/api/types.schema'
import { columnDefs } from '@modules/Admin/AppliedAllocationReport/components/Grid/columnDefs'
import moment, { Moment } from 'moment'
import React, { useMemo } from 'react'

interface AppliedAllocationReportGridProps {
  data: AppliedAllocationStatusReportResponse | undefined
  filterDates: Moment[] | undefined
  setFilterDates: React.Dispatch<React.SetStateAction<Moment[]>>
}
export function AppliedAllocationReportGrid({ data, filterDates, setFilterDates }: AppliedAllocationReportGridProps) {
  const storageKey = 'AppliedAllocationStatusReport'
  const gridViewManager = useGridViewManager(storageKey)

  const handleDateChange = (dates) => {
    const startDate = moment(dates[0]).startOf('day')
    const endDate = moment(dates[1]).endOf('day')
    setFilterDates([startDate, endDate])
  }

  const controlBarProps = useMemo(
    () => ({
      title: 'Allocation Status Report',
      actionButtons: (
        <RangePicker inputKey='Dates' dates={filterDates} onChange={handleDateChange} placement='bottomRight' />
      ),
    }),
    [filterDates]
  )
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => `${row?.data?.TradeEntryDetailId?.toString()}${row?.data?.AllocationType}`,
    }),
    []
  )
  const getColumnDefs = useMemo(() => {
    return columnDefs()
  }, [])

  return (
    <GraviGrid
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      rowData={data}
      columnDefs={getColumnDefs}
      storageKey={storageKey}
      gridViewManager={gridViewManager}
    />
  )
}
