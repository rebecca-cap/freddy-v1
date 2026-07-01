import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviGrid, RangePicker } from '@gravitate-js/excalibrr'
import { PriceFileLineItemsReportRow } from '@modules/Admin/Integrations/PriceFileLineItems/api/types.schema'
import { columnDefs } from '@modules/Admin/Integrations/PriceFileLineItems/components/Grid/columnDefs'
import moment, { Moment } from 'moment'
import React, { useMemo } from 'react'

interface PriceFileLineItemsGridProps {
  data: PriceFileLineItemsReportRow[] | undefined
  filterDates: Moment[] | undefined
  setFilterDates: React.Dispatch<React.SetStateAction<Moment[]>>
  isLoading: boolean
}
export function PriceFileLineItemsReportGrid({
  data,
  filterDates,
  setFilterDates,
  isLoading,
}: PriceFileLineItemsGridProps) {
  const handleDateChange = (dates) => {
    const startDate = moment(dates[0]).startOf('day')
    const endDate = moment(dates[1]).endOf('day')
    setFilterDates([startDate, endDate])
  }

  const controlBarProps = useMemo(
    () => ({
      title: 'Price File Line Items',
      actionButtons: (
        <RangePicker inputKey='Dates' dates={filterDates} onChange={handleDateChange} placement='bottomRight' />
      ),
    }),
    [filterDates]
  )
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data.DtnPriceFileImportLineItemId,
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
      storageKey='PriceFileLineItemsReport'
      loading={isLoading}
    />
  )
}
