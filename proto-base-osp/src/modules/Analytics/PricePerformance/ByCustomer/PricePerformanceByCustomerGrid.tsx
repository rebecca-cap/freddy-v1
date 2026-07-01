import { selectRowsToShowGraphData } from '@modules/Analytics/PricePerformance/components/Grid/gridHelpers'
import React, { useCallback, useMemo } from 'react'

import { getSharedColumnDefs } from '../components/Grid/getSharedColumnDefs'
import { PricePerformanceGrid } from '../components/Grid/PricePerformanceGrid'

export function PricePerformanceByCustomerGrid({ gridAPIRef, data, isLoading, selectedRows, setSelectedRows }) {
  const storageKey = 'AnalyticsPricePerformanceByCustomerGrid'

  const onRowSelected = (e) => selectRowsToShowGraphData(e, selectedRows, setSelectedRows, 'CounterPartyId')
  const getRowId = useCallback((row) => row.data?.CounterPartyId, [])

  const columnDefs = useMemo(
    () =>
      getSharedColumnDefs({
        includeProfitTrend: true,
        nameColumnHeader: 'Customer',
        nameColumnField: 'CounterParty',
      }),
    []
  )
  return (
    <PricePerformanceGrid
      onRowSelected={onRowSelected}
      gridData={data?.GridRows}
      gridAPIRef={gridAPIRef}
      loading={isLoading}
      columnDefs={columnDefs}
      getRowId={getRowId}
      storageKey={storageKey}
    />
  )
}
