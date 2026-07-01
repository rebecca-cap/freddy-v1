import { GridViewManager } from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/schema.types'
import { AgGridReact } from 'ag-grid-react'
import React from 'react'

export const sidebarCreator = (
  handleGridReset: () => void,
  setGridConfig: React.Dispatch<React.SetStateAction<any>>,
  storageKey?: string,
  toolPanelWidth?: number | string,
  rowGroupPanelShow?: 'always' | 'onlyWhenGrouping' | 'never',
  gridViewManager?: GridViewManager,
  gridRef?: React.MutableRefObject<AgGridReact | null>,
  supressPivot = true,
  showColumnToolPanel = false
) => {
  const sidebar = [
    {
      id: 'filters',
      labelDefault: 'Filters',
      labelKey: 'filters',
      iconKey: 'filter',
      toolPanel: 'agFiltersToolPanel',
      minWidth: 180,
      maxWidth: 400,
      width: 250,
    },
  ]

  if (showColumnToolPanel) {
    const panelWidth =
      toolPanelWidth === 'auto'
        ? 0
        : toolPanelWidth && typeof toolPanelWidth === 'number'
        ? toolPanelWidth
        : 225
    sidebar.push({
      id: 'columns',
      labelDefault: 'Columns',
      labelKey: 'columns',
      iconKey: 'columns',
      toolPanel: 'agColumnsToolPanel',
      // TODO: Need to figure out why sidebar.push doesn't like toolPanelParams. Out of date package?
      // @ts-ignore
      toolPanelParams: {
        suppressPivotMode: supressPivot,
        suppressValues: supressPivot,
        suppressPivots: supressPivot,
        suppressRowGroups: rowGroupPanelShow === 'never',
      },
      minWidth: 225,
      maxWidth: toolPanelWidth ? 400 : 225,
      width: panelWidth,
    })
  }

  if (storageKey) {
    const panelWidth =
      toolPanelWidth === 'auto'
        ? 0
        : toolPanelWidth && typeof toolPanelWidth === 'number'
        ? toolPanelWidth
        : 250

    sidebar.push({
      id: 'gridViews',
      labelDefault: 'Grid Views',
      labelKey: 'gridViews',
      // iconKey: 'menu',
      toolPanel: 'gridViewPanel',
      // TODO: Need to figure out why sidebar.push doesn't like toolPanelParams. Out of date package?
      // @ts-ignore
      toolPanelParams: {
        onGridReset: handleGridReset,
        gridViewManager,
        width: panelWidth || 250,
        gridRef,
        storageKey,
        setGridConfig,
      },
      minWidth: 180,
      maxWidth: 400,
      width: panelWidth,
    })
  }

  return { toolPanels: sidebar }
}
