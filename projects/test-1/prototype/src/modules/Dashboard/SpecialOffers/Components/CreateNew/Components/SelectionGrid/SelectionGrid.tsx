import { GraviGrid } from '@gravitate-js/excalibrr'
import { SpecialOfferMetadataResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { ColDef } from 'ag-grid-community'
import { useEffect, useMemo } from 'react'

export interface CustomerSelectGridProps {
  metadata?: SpecialOfferMetadataResponseData
  handleFormChange: (rows: any[]) => void
  colDefFunc: () => ColDef[]
  idField: string
  rowData: any[]
  rowSelection: 'multiple' | 'single'
  currentValue: any[]
  isLoading?: boolean
  gridRef: React.MutableRefObject<any>
}

export function SelectionGrid({
  handleFormChange,
  colDefFunc,
  idField,
  rowData,
  rowSelection,
  currentValue,
  isLoading,
  gridRef,
}: CustomerSelectGridProps) {
  const onSelectionChanged = (params) => {
    const selection = params.api.getSelectedRows()
    handleFormChange(selection)
  }
  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (params) => params.data[idField],
      rowHeight: 30,
      rowSelection,
      rowGroupPanelShow: 'onlyWhenGrouping' as const,
      headerHeight: 30,
    }
  }, [idField])
  const controlBarProps = useMemo(() => {
    return { hideActiveFilters: false, showSelectedCount: true }
  }, [currentValue])
  const columnDefs = useMemo(() => colDefFunc(), [colDefFunc, currentValue])

  useEffect(() => {
    gridRef?.current?.deselectAll()
  }, [gridRef?.current])

  return (
    <div style={{ height: '400px' }}>
      <GraviGrid
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        rowData={rowData}
        controlBarProps={controlBarProps}
        loading={isLoading}
        externalRef={gridRef}
        onSelectionChanged={onSelectionChanged}
      />
    </div>
  )
}
