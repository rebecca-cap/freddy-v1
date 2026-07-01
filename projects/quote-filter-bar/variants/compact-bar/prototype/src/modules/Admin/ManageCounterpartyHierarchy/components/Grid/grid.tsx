import { useCounterparties } from '@api/useCounterparties'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviGrid } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

import { getColumnDefs } from './columnDefs'
export interface CounterpartyHierarchyGridProps {
  title?: string
  counterpartyIds?: number[]
  onChangeSelectedLocationIds: (counterpartyIds: number[]) => void
  canWrite?: boolean
}
export function CounterpartyHierarchyGrid({
  title = 'Counterparties',
  counterpartyIds,
  onChangeSelectedLocationIds,
  canWrite,
}: CounterpartyHierarchyGridProps) {
  const { useCounterpartiesQuery } = useCounterparties()
  const { data: counterparties } = useCounterpartiesQuery()
  const columnDefs = useMemo(() => getColumnDefs(canWrite), [canWrite])
  const rowData = useMemo(() => {
    if (!counterparties?.Data) return []
    if (counterpartyIds?.length) {
      return counterparties.Data.filter((row) => counterpartyIds.includes(row.CounterPartyId))
    }
    return counterparties.Data
  }, [counterpartyIds, counterparties?.Data])
  return (
    <GraviGrid
      controlBarProps={{ title, hideActiveFilters: false }}
      onSelectionChanged={({ api }) => {
        onChangeSelectedLocationIds(api.getSelectedRows().map((row) => row.CounterPartyId))
      }}
      agPropOverrides={{
        getRowId: (row) => row.data?.CounterPartyId,
        frameworkComponents: { SearchableSelect },
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
      }}
      storageKey='ReferenceData/CounterpartyHierachyGrid'
      rowData={rowData}
      columnDefs={columnDefs}
    />
  )
}
