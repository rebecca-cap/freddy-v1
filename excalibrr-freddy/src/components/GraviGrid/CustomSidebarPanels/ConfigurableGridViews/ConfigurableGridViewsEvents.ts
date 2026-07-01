import {
  GridView,
  GridViewManager,
} from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/schema.types'
import { GridConfigState } from '@components/GraviGrid/hooks/useAGGridEvent'
import { ColumnState } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import React, { MutableRefObject } from 'react'

export function getCurrentGridState(
  gridRef: MutableRefObject<AgGridReact | null>
): GridConfigState {
  const columnState =
    gridRef.current?.columnApi.getColumnState() as ColumnState[]
  const columnGroupState = gridRef.current?.columnApi.getColumnGroupState()
  const filterModel = gridRef.current?.api.getFilterModel()
  return {
    column: columnState,
    columnGroup: columnGroupState,
    filter: filterModel,
  }
}

export function applyView(
  view: GridView,
  gridRef: MutableRefObject<AgGridReact | null>,
  setSelectedView: React.Dispatch<React.SetStateAction<string | number | null>>,
  setGridConfig: React.Dispatch<React.SetStateAction<GridConfigState | null>>
) {
  const {
    state: { column, filter, columnGroup },
  } = view

  gridRef.current?.columnApi.applyColumnState({
    state: column,
    applyOrder: true,
  })

  if (columnGroup) {
    gridRef.current?.columnApi.setColumnGroupState(columnGroup)
  }
  gridRef.current?.api.setFilterModel(filter)
  setSelectedView(view.id)
  setGridConfig(view.state)
}

export function handleDeleteView(
  view: GridView,
  gridViewManager: GridViewManager,
  setGridViews: React.Dispatch<React.SetStateAction<GridView[] | null>>
) {
  const newViews = gridViewManager.deleteView(view)
  setGridViews(newViews)
}
export function saveNewViewState(
  saveView: (payload: GridView) => void,
  view: GridView,
  gridRef: MutableRefObject<AgGridReact | null>
) {
  saveView({
    id: view.id,
    name: view.name,
    state: getCurrentGridState(gridRef),
    gridKey: view.gridKey,
  })
}
