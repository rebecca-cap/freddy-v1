import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { SpecialOfferMetadataResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { ColDef } from 'ag-grid-community'
import { useCallback, useMemo } from 'react'

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
  storageKey: string
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
  storageKey,
}: CustomerSelectGridProps) {
  const gridViewManager = useGridViewManager(storageKey)

  const onSelectionChanged = useCallback(
    (params) => {
      const selection = params.api.getSelectedRows()
      handleFormChange(selection)
      // The selection column uses a custom cellRenderer (e.g. RadioCheckboxColumn) whose
      // visual state reads `node.isSelected()` — AG Grid won't re-invoke it on selection
      // changes by default, so refresh that column explicitly. Built-in `checkboxSelection`
      // columns also accept this no-op refresh without harm.
      params.api.refreshCells({ columns: [idField], force: true })
    },
    [handleFormChange, idField]
  )
  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (params) => params.data[idField]?.toString(),
      rowHeight: 35,
      rowSelection,
      rowGroupPanelShow: 'onlyWhenGrouping' as const,
      headerHeight: 30,
      suppressRowClickSelection: true,
    }
  }, [idField])

  const controlBarProps = useMemo(() => {
    return { hideActiveFilters: false, showSelectedCount: true }
  }, [currentValue])

  const columnDefs = useMemo(() => colDefFunc(), [colDefFunc])

  return (
    <div style={{ height: '400px' }}>
      <GraviGrid
        enableFilterContextMenu
        storageKey={storageKey}
        gridViewManager={gridViewManager}
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
