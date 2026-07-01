import { GraviGrid, Horizontal } from '@gravitate-js/excalibrr'
import { FilterSwitch } from '@modules/Admin/ManageAllocationAssociations/components/FilterSwitch'
import {
  GetAllocationAssociationsResponse,
  GetAllocationsResponse,
} from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/api/types.schema'
import { GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useMemo, useRef } from 'react'

import { getColumnDefs } from './columnDefs'

interface AllocationsGridProps {
  data: GetAllocationsResponse[]
  isLoading: boolean
  setSelectedAllocationRow: React.Dispatch<React.SetStateAction<GetAllocationsResponse | undefined>>
  isFilteringToRelatedData: boolean | null
  setIsFilteringToRelatedData: React.Dispatch<React.SetStateAction<boolean | null>>
  selectedAllocationRow?: GetAllocationsResponse
  associationsData?: GetAllocationAssociationsResponse[]
}
export function AllocationsGrid({
  data,
  isLoading,
  setSelectedAllocationRow,
  isFilteringToRelatedData,
  setIsFilteringToRelatedData,
  selectedAllocationRow,
  associationsData,
}: AllocationsGridProps) {
  const gridRef = useRef() as MutableRefObject<GridApi>
  const columnDefs = useMemo(getColumnDefs, [])
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data?.AllocationId,
      rowSelection: 'single' as const,
      rowGroupPanelShow: 'never' as const,
      onRowSelected: (params) => setSelectedAllocationRow(params.api.getSelectedRows()[0]),
      onCellKeyDown: (params) => {
        if (params.event.key === 'ArrowDown') {
          const newRow = params.api.getDisplayedRowAtIndex(params.rowIndex + 1)
          newRow.setSelected(true)
          setSelectedAllocationRow(newRow.data)
        }
        if (params.event.key === 'ArrowUp') {
          const newRow = params.api.getDisplayedRowAtIndex(params.rowIndex - 1)
          newRow.setSelected(true)
          setSelectedAllocationRow(newRow.data)
        }
      },
    }),
    [isFilteringToRelatedData, setSelectedAllocationRow, selectedAllocationRow]
  )
  const controlBarProps = useMemo(
    () => ({
      title: 'Allocations Data',
      actionButtons: (
        <Horizontal>
          <FilterSwitch
            title='Show Related Data'
            tooltipTitle={!selectedAllocationRow ? 'Select an allocation row to enable' : 'Show Related Data'}
            valueSetter={setIsFilteringToRelatedData}
            value={isFilteringToRelatedData}
            disabled={!selectedAllocationRow}
          />
        </Horizontal>
      ),
    }),
    [isFilteringToRelatedData, selectedAllocationRow]
  )
  const rowData = useMemo(() => {
    if (!data) return []
    if (!associationsData) return data
    return data.map((row) => {
      const AllocationMappings = associationsData.filter((associationsRow) =>
        associationsRow.LinkedAllocationIds.some((assoc) => assoc.AllocationId === row.AllocationId)
      )
      return {
        ...row,
        AllocationMappings,
      }
    })
  }, [data, associationsData])

  return (
    <GraviGrid
      externalRef={gridRef}
      rowData={rowData}
      loading={isLoading}
      columnDefs={columnDefs}
      agPropOverrides={agPropOverrides}
      controlBarProps={controlBarProps}
      storageKey='gridConfig::QuoteRowAllocationAnalyticsAdmin-AllocationsGrid::'
    />
  )
}
