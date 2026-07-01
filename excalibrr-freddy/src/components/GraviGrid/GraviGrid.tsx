import './styles.css'

import {
  EditFilled,
  ExpandAltOutlined,
  PlusCircleOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons'
import { GridView } from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/schema.types'
import { applyView } from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/ConfigurableGridViewsEvents'
import { type Filter } from '@components/Grid/SearchGridHeader/DynamicFilterForm/types'
import { useDeepCompareMemo } from '@react-hookz/web'
import {
  CellClassParams,
  ColDef,
  ColumnMenuTab,
  GridReadyEvent,
  RowClassParams,
  RowDataUpdatedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community'
import { GetContextMenuItemsParams, GetRowIdParams } from 'ag-grid-enterprise'
import { AgGridReact, AgGridReactProps } from 'ag-grid-react'
import classNames from 'classnames'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { sidebarCreator } from '../../constants/agGridConst'
import { excelStyles } from '../../constants/graviGridConst'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { GraviButton } from '../Controls/Buttons/GraviButton'
import { GridControlBar } from '../Layout/GridControlBar'
import { useThemeContext } from '../Theming/ThemeContext'
import { BulkChangeDrawer } from './BulkChangeBar'
import { SaveDisplay } from './Controls/SaveDisplay'
import { SpinningOverlay } from './Controls/SpinningOverlay'
import { CreateModal } from './CreateModal/CreateModal'
import { GridViewPanel } from './CustomSidebarPanels/GridViewPanel'
import { getDirtyCellClass } from './DirtyEdit/defaultProps'
import { DirtyEditBar } from './DirtyEdit/DirtyEditBar'
import { CustValSelectEditor } from './Editors/CustValSelectEditor'
import { DatePickerEditor } from './Editors/DatePickerEditor'
import { NumericEditor } from './Editors/NumericEditor'
import { SelectEditor } from './Editors/SelectEditor'
import { SwitchEditor } from './Editors/SwitchEditor'
import {
  fixColumnDef,
  GridConfigState,
  useAGGridEvent,
} from './hooks/useAGGridEvent'
import { useDirtyGridChanges } from './hooks/useDirtyGrid'
import { useEditableGrid } from './hooks/useEditableGrid'
import type {
  CallableGetRowId,
  ExtendedGridApi,
  GraviGridProps,
} from './index.types'
import { useRowPinning } from './RowPinning/useRowPinning'

export type SelectedRow<T extends Record<string, any>> = T & {
  $updatedRowIndex: number | null
}

type MaybeAsyncFn = (...args: any[]) => Promise<any> | any

function isAsyncFn(fn: MaybeAsyncFn): fn is (...args: any[]) => Promise<any> {
  return fn.constructor.name === 'AsyncFunction'
}

export function GraviGrid<T extends Record<string, any>, F extends Filter>({
  loading,
  columnDefs,
  columnDefaultOverrides,
  rowData,
  controlBarProps,
  externalRef,
  columnApiRef,
  agPropOverrides,
  primaryKey,
  storageKey,
  updateEP,
  createEP,
  createConfig,
  createSelectOptions,
  onSelectionChanged,
  toolPanelWidth,
  shouldInsertCreated = false,
  showColumnsToolbar = true,
  supressPivot = true,
  spreadCreateResponse = true,
  hideSaveDisplay = false,
  onGridConfigChanged,
  // dirty edit mode
  isDirtyEdit = false,
  dirtyChangesRef,
  onDirtyChangeSave,
  onDirtyChangeDiscard,
  // bulk changes
  bulkDrawerTitle,
  isBulkChangeVisible,
  setIsBulkChangeVisible,
  hideBulkSaveButtons = false,
  bulkChangePropertiesComparator,
  // row pinning
  enableRowPinning = false,
  rowPinningRef,
  pinnedRowPosition = 'top',
  showUnpinAllButton = true,
  gridViewManager,
  isBulkChangeCompactMode = false,
  ...others
}: GraviGridProps<T, F>) {
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [viewCreateModal, setViewCreateModal] = useState(false)
  const [lastSaved, setLastSaved] = useState<string>()
  const [selectedRows, setSelectedRows] = useState<SelectedRow<T>[]>([])
  const { isDarkTheme } = useThemeContext()

  const gridRef = useRef<AgGridReact<T>>(null)
  const defaultGetRowId = (row: GetRowIdParams<T>) => row?.data?.id

  const getRowId = useMemo(
    () => agPropOverrides?.getRowId ?? defaultGetRowId,
    [agPropOverrides?.getRowId]
  )

  const rowPinningApi = useRowPinning<T>({
    enableRowPinning,
    getRowId,
    pinnedRowPosition,
    rowData,
  })

  if (rowPinningRef) {
    rowPinningRef.current = rowPinningApi
  }

  const {
    value: gridConfig,
    setValue: setGridConfig,
    clearFromStore: clearConfigFromStore,
  } = useLocalStorage<GridConfigState>(`gridConfig::${storageKey}`)

  const configSyncApi = useAGGridEvent(
    gridRef,
    // @ts-ignore
    gridConfig,
    setGridConfig,
    clearConfigFromStore,
    onGridConfigChanged,
    storageKey
  )

  const clearSelection = useCallback(() => {
    externalRef?.current?.deselectAll()
  }, [externalRef])

  const clonedRowData = useDeepCompareMemo(() => {
    if (!isDirtyEdit) return []

    try {
      return structuredClone(rowData)
    } catch (error) {
      return rowData
    }
  }, [rowData, isDirtyEdit])

  const checkboxSelectionColumn = {
    pinned: 'left',
    lockPosition: 'left',
    field: '$checkboxSelect',
    headerCheckboxSelection: true,
    checkboxSelection: true,
    maxWidth: 50,
    headerCheckboxSelectionFilteredOnly: true,
  } as ColDef<T>

  const realColumnDefs = useMemo(
    () => columnDefs ?? agPropOverrides.columnDefs,
    [columnDefs, agPropOverrides.columnDefs]
  )

  const displayedColumnDefs = useMemo(() => {
    return isBulkChangeVisible
      ? [checkboxSelectionColumn, ...realColumnDefs]
      : realColumnDefs
  }, [isBulkChangeVisible, realColumnDefs])

  useEffect(() => {
    if (!gridRef.current) return
    if (
      gridRef.current.api &&
      gridRef.current.columnApi &&
      displayedColumnDefs
    ) {
      const fixedDefs = displayedColumnDefs.map(fixColumnDef)
      gridRef.current.api.setColumnDefs(fixedDefs)

      if (gridConfig) {
        configSyncApi.applyStateFromConfig({
          api: gridRef.current.api,
          columnApi: gridRef.current.columnApi,
        })
      }
    }
  }, [displayedColumnDefs, gridRef?.current])

  const dirtyGridApi = useDirtyGridChanges({
    isEnabled: isDirtyEdit,
    getRowId,
    onDirtyChangeSave,
    onDirtyChangeDiscard,
    gridRef,
    primaryKey,
    rowData: clonedRowData,
    colDefs: columnDefs,
  })

  if (dirtyChangesRef && isDirtyEdit) {
    dirtyChangesRef.current = dirtyGridApi
  }

  const { saving, onCellValueChanged, handleCreate } = useEditableGrid(
    gridRef,
    isDirtyEdit ? dirtyGridApi.updateDirtyRow : updateEP,
    isDirtyEdit ? dirtyGridApi.updateDirtyRow : createEP,
    spreadCreateResponse,
    shouldInsertCreated,
    lastSaved,
    setLastSaved
  )

  const onGridReady = (params: GridReadyEvent) => {
    // Hook up the grid api to outside listener refs
    if (externalRef) {
      externalRef.current = params.api
    }

    if (columnApiRef) {
      columnApiRef.current = params.columnApi
    }
    if (externalRef?.current) {
      const extendedApi = externalRef.current as ExtendedGridApi<T>

      extendedApi.applyGridView = (view: GridView) => {
        if (gridRef.current) {
          // Import the applyView function from ConfigurableGridViewsEvents
          applyView(view, gridRef, () => null, setGridConfig)
        }
      }

      extendedApi.resetGridToDefault = () => {
        configSyncApi.handleGridConfigReset()
      }
    }
    configSyncApi.applyStateFromConfig(params)
  }

  const gridWrapperClasses = useMemo(
    () =>
      classNames(
        'flex-1',
        { 'ag-theme-alpine-dark': isDarkTheme },
        { 'ag-theme-alpine': !isDarkTheme }
      ),
    [isDarkTheme]
  )

  useEffect(() => {
    // Wait until we have a handle to the grid
    if (!gridRef?.current) return

    if (loading) {
      setTimeout(() => {
        gridRef?.current?.api?.showLoadingOverlay()
      })
    } else if (rowData?.length === 0) {
      gridRef?.current?.api?.showNoRowsOverlay()
      setIsFirstLoad(false)
    } else {
      gridRef?.current?.api?.hideOverlay()
      setIsFirstLoad(false)
    }
  }, [rowData, loading, gridRef?.current])

  const getContextMenuItems = useCallback(
    (params: GetContextMenuItemsParams<T>) => {
      const colId =
        params?.column?.getColId?.() ??
        params?.column?.getColDef?.().field ??
        ''

      const additionalMenuItems = agPropOverrides?.getAdditionContextMenuItems
        ? agPropOverrides?.getAdditionContextMenuItems(
            colId,
            params?.node?.data
          )
        : null

      const items = [
        'autoSizeAll',
        'copy',

        {
          name: 'Expand All',
          action: () => {
            params.api.forEachNode((node) => {
              if ((node.group || node.master) && !node.expanded) {
                node.setExpanded(true)
              }
            })
          },
          icon: <ExpandAltOutlined />,
        },
        {
          name: 'Collapse All',
          action: () => {
            params.api.forEachNode((node) => {
              if ((node.group || node.master) && node.expanded) {
                node.setExpanded(false)
              }
            })
          },
          icon: <VerticalAlignTopOutlined />,
        },
      ] as any[]

      const isRowPinned =
        params?.node?.data &&
        rowPinningApi.pinnedRowIds.includes(
          (getRowId as CallableGetRowId<T>)({ data: params.node.data })
        )

      if (rowPinningApi.pinnedRowIds.length > 0 && enableRowPinning) {
        items.unshift({
          name: `Clear Pinned (${rowPinningApi.pinnedRowIds.length})`,
          icon: '<span class="ag-icon ag-icon-pin" unselectable="on" role="presentation"></span>',
          action: () => {
            rowPinningApi.unpinAllRows?.()
          },
        })
      }

      if (!isRowPinned && enableRowPinning) {
        items.unshift({
          name: 'Pin Row',
          icon: '<span class="ag-icon ag-icon-pin" unselectable="on" role="presentation"></span>',
          action: () => {
            const row = params?.node?.data
            if (row) {
              rowPinningApi.pinRow?.(
                (getRowId as CallableGetRowId<T>)({ data: row })
              )
            }
          },
        })
      } else {
        items.unshift({
          name: 'Unpin Row',
          icon: '<span class="ag-icon ag-icon-pin" unselectable="on" role="presentation"></span>',
          action: () => {
            const row = params?.node?.data
            if (row) {
              rowPinningApi.unpinRow?.(
                (getRowId as CallableGetRowId<T>)({ data: row })
              )
            }
          },
        })
      }

      return additionalMenuItems ? additionalMenuItems.concat(items) : items
    },
    [gridRef, rowPinningApi.pinnedRowIds]
  )

  const dirtyCellClassFn = useMemo(
    () =>
      getDirtyCellClass(isDirtyEdit, dirtyChangesRef, dirtyGridApi, getRowId),
    [
      dirtyGridApi.originalRows,
      isDirtyEdit,
      dirtyChangesRef,
      dirtyGridApi.dirtyCells,
      dirtyGridApi.dirtyChanges,
    ]
  )

  const cellClass = useCallback(
    (params: CellClassParams<T>) => {
      const dirtyCellClass = dirtyCellClassFn?.(params)

      const colIndex = params.columnApi
        .getAllDisplayedColumns()
        .findIndex((col) => col.getColId() === params.column.getColId())

      const className = classNames({
        'dirty-grid-edited': dirtyCellClass,
        'gravi-grid-column-pinned':
          params.data &&
          !colIndex &&
          rowPinningApi.pinnedRowIds.includes(
            (getRowId as CallableGetRowId<T>)({ data: params.data })
          ),
      })

      return className
    },
    [dirtyCellClassFn, rowPinningApi.pinnedRowIds]
  )

  const getRowClass = useCallback(
    (params: RowClassParams<T>) => {
      const userProvidedClass = agPropOverrides.getRowClass?.(params)
      const isPinned =
        params?.data &&
        rowPinningApi.pinnedRowIds.includes(
          (getRowId as CallableGetRowId<T>)({ data: params.data })
        )
      const finalClass = classNames(userProvidedClass, {
        'gravi-grid-row-pinned': isPinned,
      })

      return finalClass
    },
    [agPropOverrides.getRowClass, rowPinningApi.pinnedRowIds]
  )

  const defaultColDef = useDeepCompareMemo(
    () => ({
      initialFlex: 1,
      minWidth: 100,
      editable: !!updateEP,
      sortable: true,
      enableRowGroup: true,
      filter: true,
      resizable: true,
      menuTabs: ['filterMenuTab', 'generalMenuTab'] as ColumnMenuTab[],
      cellClass,
      ...columnDefaultOverrides,
    }),
    [columnDefaultOverrides, cellClass, updateEP, rowPinningApi.pinnedRowIds]
  )

  const defaultSideBar = useMemo(
    () =>
      sidebarCreator(
        configSyncApi.handleGridConfigReset,
        setGridConfig,
        storageKey,
        toolPanelWidth,
        agPropOverrides.rowGroupPanelShow,
        gridViewManager,
        gridRef,
        supressPivot,
        showColumnsToolbar
      ),
    [
      setGridConfig,
      storageKey,
      toolPanelWidth,
      agPropOverrides.rowGroupPanelShow,
      gridViewManager,
      gridRef?.current,
      supressPivot,
      showColumnsToolbar,
    ]
  )

  const handleSelectionChanged = useCallback(
    (event: SelectionChangedEvent<T>) => {
      // If the outside world is listening to row selection events, proxy the event to them
      if (onSelectionChanged) {
        onSelectionChanged(event)
      }

      if (setIsBulkChangeVisible) {
        const userSelectedRows = event.api.getSelectedNodes()
        if (!userSelectedRows) return

        setSelectedRows(
          userSelectedRows.map((sr) => ({
            $updatedRowIndex: sr.rowIndex,
            ...((sr.data ?? {}) as T),
          }))
        )
      }
    },
    [onSelectionChanged]
  )

  const actionButtons = useMemo(
    () => (
      <>
        {!hideSaveDisplay && (
          <SaveDisplay saving={saving} lastSaved={lastSaved} />
        )}
        {setIsBulkChangeVisible && (
          <GraviButton
            icon={<EditFilled />}
            buttonText='Bulk Change'
            onClick={() => {
              setIsBulkChangeVisible(!isBulkChangeVisible)
              clearSelection()
            }}
            className='mr-4'
          />
        )}
        {controlBarProps?.actionButtons ? controlBarProps.actionButtons : null}
        {createEP && (
          <GraviButton
            buttonText='Create'
            icon={<PlusCircleOutlined />}
            success
            onClick={() => setViewCreateModal(true)}
          />
        )}
      </>
    ),
    [
      lastSaved,
      hideSaveDisplay,
      controlBarProps,
      isBulkChangeVisible,
      setIsBulkChangeVisible,
      createEP,
    ]
  )

  const defaultGridProps = useDeepCompareMemo((): AgGridReactProps => {
    return {
      maintainColumnOrder: true,
      ...agPropOverrides,
      rowHeight: agPropOverrides.rowHeight || 50,
      groupDisplayType: agPropOverrides.groupDisplayType || 'groupRows',
      rowGroupPanelShow: agPropOverrides.rowGroupPanelShow || 'always',
      defaultColDef,
      sideBar: defaultSideBar,
      getRowClass,
      components: {
        gridViewPanel: GridViewPanel,
        spinningOverlay: SpinningOverlay,
        GraviDatePicker: DatePickerEditor,
        GraviNumberEditor: NumericEditor,
        GraviSelectEditor: SelectEditor,
        GraviSwitchEditor: SwitchEditor,
        GraviCustValSelectEditor: CustValSelectEditor,
        ...(agPropOverrides.frameworkComponents ?? {}),
      },
    }
  }, [
    gridRef?.current,
    defaultColDef,
    agPropOverrides,
    rowPinningApi.pinnedRowIds,
    getRowClass,
  ])

  function getCallbackProxyFn(
    internalCallback: (...args: any[]) => any,
    userCallback?: MaybeAsyncFn
  ) {
    return async function cb(event: any) {
      if (userCallback) {
        if (isAsyncFn(userCallback)) {
          await userCallback(event)
        } else {
          userCallback(event)
        }
      }
      internalCallback(event)
    }
  }

  const handleRowDataChanged = useCallback(
    (event: RowDataUpdatedEvent) => {
      if (!gridConfig || !storageKey) return
      // filters need to always be reapplied whenever row data changes
      if (gridConfig.filter) {
        event.api.setFilterModel(gridConfig.filter)
      }

      // column state only needs to be applied when row data changes once, then no more after that. We do this once to beat the grid to the punch
      if (rowData && rowData.length && !configSyncApi.isGridConfigLoaded) {
        if (gridConfig.column) {
          event.columnApi.applyColumnState({
            state: gridConfig.column,
            applyOrder: true,
          })
        }

        configSyncApi.setIsGridConfigLoaded(true)
      }
    },
    [
      rowData,
      configSyncApi.isGridConfigLoaded,
      gridConfig?.column,
      gridConfig?.filter,
    ]
  )

  return (
    <div className='vertical-flex'>
      {createEP && (
        <CreateModal
          viewCreateModal={viewCreateModal}
          setViewCreateModal={setViewCreateModal}
          createSelectOptions={createSelectOptions}
          sections={createSelectOptions && createConfig(createSelectOptions)}
          onCreate={handleCreate}
        />
      )}
      {controlBarProps && (
        <>
          <GridControlBar
            title={controlBarProps.title}
            showSelectedCount={controlBarProps?.showSelectedCount}
            gridRef={gridRef}
            customSearchBar={controlBarProps.customSearchBar}
            onSearch={(e) =>
              gridRef?.current?.api?.setQuickFilter(e.target.value)
            }
            actionButtons={actionButtons}
            customFilterDrawer={controlBarProps.customFilterDrawer}
            serverParams={controlBarProps.serverParams}
            filters={controlBarProps.filters}
            setFilters={controlBarProps.setFilters}
            hiddenFilterKeys={controlBarProps.hiddenFilterKeys}
            pinnedRowIds={rowPinningApi.pinnedRowIds}
            onRowUnpinnedAll={rowPinningApi.unpinAllRows}
            showUnpinAllButton={showUnpinAllButton}
            hideActiveFilters={controlBarProps.hideActiveFilters}
            warning={controlBarProps.warning}
            maxFilterTagsArrayLength={controlBarProps.maxFilterTagsArrayLength}
            rowCount={rowData?.length}
            filterDrawerDefaultExpanded={
              controlBarProps.filterDrawerDefaultExpanded
            }
          />
          {isDirtyEdit && dirtyGridApi.hasUnsavedChanges && (
            <DirtyEditBar dirtyGridApi={dirtyGridApi} />
          )}
        </>
      )}
      <div className={gridWrapperClasses}>
        <AgGridReact
          {...defaultGridProps}
          rowData={rowPinningApi.rowDataWithoutPinned}
          ref={gridRef}
          animateRows
          excelStyles={excelStyles}
          getRowId={getRowId}
          onGridReady={onGridReady}
          enableRangeSelection
          undoRedoCellEditing
          undoRedoCellEditingLimit={25}
          loadingOverlayComponent='spinningOverlay'
          onCellValueChanged={onCellValueChanged}
          onSortChanged={configSyncApi.handleColumnStateRefresh}
          onColumnMoved={configSyncApi.handleColumnStateRefresh}
          onColumnPinned={configSyncApi.handleColumnStateRefresh}
          onColumnResized={configSyncApi.handleColumnStateRefresh}
          onColumnRowGroupChanged={configSyncApi.handleRowGroupRefresh}
          onFilterChanged={getCallbackProxyFn(
            configSyncApi.handleFilterStateRefresh,
            agPropOverrides.onFilterChanged
          )}
          onRowDataUpdated={getCallbackProxyFn(
            handleRowDataChanged,
            agPropOverrides.onRowDataUpdated
          )}
          onColumnGroupOpened={configSyncApi.handleColumnGroupStateRefresh}
          onSelectionChanged={handleSelectionChanged}
          getContextMenuItems={
            agPropOverrides.getContextMenuItems || getContextMenuItems
          }
          pinnedTopRowData={rowPinningApi.pinnedRowData.top}
          pinnedBottomRowData={rowPinningApi.pinnedRowData.bottom}
          {...others}
        />
      </div>
      {isBulkChangeVisible && (
        <BulkChangeDrawer
          // @ts-ignore
          columnDefs={realColumnDefs}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          setIsBulkChangeVisible={setIsBulkChangeVisible}
          updateEP={isDirtyEdit ? dirtyGridApi.updateDirtyRow : updateEP}
          clearSelection={clearSelection}
          bulkDrawerTitle={bulkDrawerTitle}
          isDirtyEdit={isDirtyEdit}
          gridRef={gridRef}
          setLastSaved={setLastSaved}
          hideSaveDisplay={hideSaveDisplay}
          hideBulkSaveButtons={hideBulkSaveButtons}
          bulkChangePropertiesComparator={bulkChangePropertiesComparator}
          isBulkChangeCompactMode={isBulkChangeCompactMode}
        />
      )}
    </div>
  )
}
