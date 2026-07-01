import { selectRowsToShowGraphData } from '@modules/Analytics/PricePerformance/components/Grid/gridHelpers'
import React, { useCallback, useMemo } from 'react'

import { getSharedColumnDefs } from '../components/Grid/getSharedColumnDefs'
import { PricePerformanceGrid } from '../components/Grid/PricePerformanceGrid'

export function PricePerformanceByTerminalGrid({ gridAPIRef, data, isLoading, selectedRows, setSelectedRows }) {
  const storageKey = 'AnalyticsPricePerformanceByTerminalGrid'

  const onRowSelected = (e) => selectRowsToShowGraphData(e, selectedRows, setSelectedRows, 'LocationId')

  const getRowId = useCallback((row) => row.data?.LocationId, [])
  const columnDefs = useMemo(
    () =>
      getSharedColumnDefs({
        includeProfitTrend: true,
        nameColumnHeader: 'Terminal',
        nameColumnField: 'Location',
      }),
    []
  )
  return (
    <PricePerformanceGrid
      gridAPIRef={gridAPIRef}
      gridData={data?.GridRows}
      loading={isLoading}
      columnDefs={columnDefs}
      getRowId={getRowId}
      onRowSelected={onRowSelected}
      storageKey={storageKey}
    />
  )
}
