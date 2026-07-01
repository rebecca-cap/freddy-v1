import { ByChannelCustomerGridRow, ByCustomerGridRow, ByTerminalGridRow } from '@api/useAnalytics/types'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { ContractWithPriceLocationGridRow } from '@modules/Analytics/PricePerformance/ByContract/api/types'
import { ColDef, IRowNode, RowGroupingDisplayType } from 'ag-grid-community'
import React, { useMemo } from 'react'

type RowData = ContractWithPriceLocationGridRow | ByTerminalGridRow | ByCustomerGridRow | ByChannelCustomerGridRow
interface RowNodeSelectedEvent<TData = RowData> {
  node: IRowNode<TData>
  type: 'rowSelected'
}
interface PricePerformanceGridProps {
  gridData: RowData[] | []
  loading: boolean
  gridAPIRef: React.MutableRefObject<any>
  onRowSelected: (event: RowNodeSelectedEvent) => void
  storageKey: string
  columnDefs: ColDef[]
  getRowId: (object: RowData) => string | number
  groupDisplayType?: RowGroupingDisplayType
}

export function PricePerformanceGrid({
  gridData = [] as RowData[],
  loading,
  gridAPIRef,
  onRowSelected,
  storageKey,
  getRowId,
  columnDefs,
  groupDisplayType = 'groupRows',
}: PricePerformanceGridProps) {
  const agPropOverrides = useMemo(
    () => ({
      onRowSelected,
      rowGroupPanelShow: 'onlyWhenGrouping',
      rowMultiSelectWithClick: true,
      suppressCellSelection: true,
      rowSelection: 'multiple',
      getRowId,
      rowHeight: 35,
      groupDefaultExpanded: -1,
      enableRangeSelection: true,
      showSelectedCount: true,
      groupDisplayType,
      suppressAggFuncInHeader: true,
    }),
    [getRowId, onRowSelected]
  )

  return (
    <GraviGrid
      agPropOverrides={agPropOverrides}
      headerHeight={35}
      toolPanelWidth={260}
      rowData={gridData}
      loading={loading}
      externalRef={gridAPIRef}
      storageKey={storageKey}
      columnDefs={columnDefs}
    />
  )
}
