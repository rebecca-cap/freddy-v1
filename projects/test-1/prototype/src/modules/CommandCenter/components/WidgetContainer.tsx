import { GraviGrid } from '@gravitate-js/excalibrr'
import { GridSettings } from '@modules/CommandCenter/api/pageViewTypes.schema'
import { DataTypeWithStatus, GraviGridRef, WidgetTitle } from '@modules/CommandCenter/api/types.schema'
import { ColDef, GetRowIdParams, GridApi, RowClassParams, ValueGetterParams } from 'ag-grid-community'
import { MutableRefObject, useCallback, useEffect, useMemo } from 'react'

import { ActionButtons } from './Grids/sharedComponents/ActionButtons'

export interface WidgetContainerProps {
  title: WidgetTitle
  openCloseDrawer?: (title: WidgetTitle) => void
  openCloseModal?: (title: WidgetTitle) => void
  columnDefs: (columnHeadersByColumnId?: { [key: number]: string }) => ColDef[]
  gridDataWithStatus: DataTypeWithStatus[]
  isLoading: boolean
  gridSettings: GridSettings
  setGridSettings: (settings: GridSettings) => void
  storageKey: string
  gridApiRef: MutableRefObject<GraviGridRef<DataTypeWithStatus> | undefined>
  columnHeadersByColumnId?: { [key: number]: string }
  alertsOnly: boolean
}

export function WidgetContainer({
  title,
  openCloseDrawer,
  openCloseModal,
  columnDefs,
  gridDataWithStatus,
  isLoading,
  gridSettings,
  storageKey,
  gridApiRef,
  columnHeadersByColumnId,
  alertsOnly,
}: WidgetContainerProps) {
  const getDataPath = useCallback((data: DataTypeWithStatus) => data?.Path, [gridDataWithStatus])

  function filterToAlerts(data: DataTypeWithStatus[]) {
    return data?.filter((item) => item?.Status === 'Critical' || item?.Status === 'At Risk')
  }

  const autoGroupColumnDef = useMemo<ColDef>(() => {
    return {
      headerName: 'Location',
      field: 'Location',
      cellRendererParams: {
        suppressCount: true,
      },
      valueGetter: (params: ValueGetterParams<DataTypeWithStatus>) => {
        if (!params.data) {
          // this happens when the top row is filtered out,
          // but it has children that match the filter
          const id =
            params.node?.key && typeof params.node?.key === 'string' ? parseInt(params.node?.key) : params.node?.key
          const location = gridDataWithStatus?.find((item) => item.LocationId === id)
          return location?.Location || ''
        }
        return params.data?.Location
      },
    }
  }, [gridDataWithStatus])
  const getRowStyle = useCallback(
    (params: RowClassParams<DataTypeWithStatus>) => {
      if (params.node.data?.Status === 'Critical') {
        return {
          backgroundColor: 'var(--theme-error-dim)',
        }
      }
      if (params.node.data?.Status === 'At Risk') {
        return {
          backgroundColor: 'var(--theme-warning-dim)',
        }
      }
      return ''
    },
    [gridSettings, gridDataWithStatus]
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row: GetRowIdParams<DataTypeWithStatus>) => row.data?.LocationId,
      groupDefaultExpanded: -1,
      autoGroupColumnDef: autoGroupColumnDef,
      rowGroupPanelShow: 'onlyWhenGrouping',
      getRowStyle,
      groupDisplayType: 'none', // for the tree data to display properly
    }),
    [gridDataWithStatus, autoGroupColumnDef, getRowStyle, gridSettings]
  )

  const getColumnDefs = useMemo(() => columnDefs(columnHeadersByColumnId), [columnHeadersByColumnId])

  const controlBarProps = useMemo(
    () => ({
      title: title || '',
      hideActiveFilters: true,
      customSearchBar: <div />,
      actionButtons:
        openCloseDrawer && openCloseModal ? (
          <ActionButtons openDrawer={openCloseDrawer} openModal={openCloseModal} title={title} />
        ) : null,
    }),
    [openCloseDrawer, openCloseModal, title, getDataPath, gridSettings, gridDataWithStatus]
  )
  useEffect(() => {
    gridApiRef?.current?.redrawRows()
  }, [gridSettings])

  const rowData = useMemo(() => {
    if (alertsOnly) {
      return filterToAlerts(gridDataWithStatus || [])
    }
    return gridDataWithStatus || []
  }, [gridDataWithStatus, alertsOnly])
  return (
    <GraviGrid
      agPropOverrides={agPropOverrides}
      storageKey={storageKey}
      externalRef={gridApiRef as MutableRefObject<GridApi<DataTypeWithStatus>>}
      columnDefs={getColumnDefs}
      rowData={rowData}
      controlBarProps={controlBarProps}
      loading={isLoading}
      treeData={true}
      getDataPath={getDataPath}
    />
  )
}
