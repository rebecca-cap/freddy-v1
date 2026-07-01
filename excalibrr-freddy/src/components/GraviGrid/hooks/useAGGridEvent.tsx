import {
  ColDef,
  ColumnEvent,
  ColumnGroupOpenedEvent,
  FilterChangedEvent,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { MutableRefObject, useEffect, useState } from 'react'

export type GridConfigState = {
  column: ReturnType<AgGridReact['columnApi']['getColumnState']>
  columnGroup?: ReturnType<AgGridReact['columnApi']['getColumnGroupState']>
  filter?: ReturnType<AgGridReact['api']['getFilterModel']>
}

type EventParams = {
  api: AgGridReact['api']
  columnApi: AgGridReact['columnApi']
  afterDataChange?: boolean
}

export function useAGGridEvent<T extends Record<string, any>>(
  gridRef: MutableRefObject<AgGridReact<T> | null>,
  gridConfig: GridConfigState,
  setGridConfig: React.Dispatch<React.SetStateAction<GridConfigState>>,
  clearConfigFromStore: () => void,
  onGridConfigChanged?: (config: GridConfigState) => void,
  storageKey?: string
) {
  const [isGridConfigLoaded, setIsGridConfigLoaded] = useState(false)

  useEffect(() => {
    if (onGridConfigChanged && typeof onGridConfigChanged === 'function') {
      onGridConfigChanged(gridConfig)
    }
  }, [gridConfig])

  const handleColumnStateRefresh = ({
    columnApi,
    source,
    type,
    ...rest
  }: ColumnEvent & { finished?: boolean }) => {
    if (!storageKey) return
    // TODO: See if we need to take this out

    // Some events are fired multiple times in succession, so we only want to save the config once all of them have finished
    // things like resizing and moving a column fall in this category
    if (Object.hasOwn(rest, 'finished') && !rest.finished) return

    // Most of the background events from the grid are just noise and we ignore those, but there are a few _api_ events that
    // actually originate from a user action and we want to save those. If we encounter more in the future, they go in this array
    const whitelistedApiEvents = ['columnVisible', 'columnResized']

    if (source === 'gridOptionsChanged') return
    if (source === 'api' && !whitelistedApiEvents.includes(type)) return

    setGridConfig((currentConfig) => ({
      ...gridConfig,
      column: columnApi.getColumnState(),
    }))
  }

  const handleRowGroupRefresh = ({
    columnApi,
    source,
    type,
    ...rest
  }: ColumnEvent) => {
    if (!storageKey) return

    // TODO: See if we need these checks now that row group events have their own handler
    // if (source === 'gridOptionsChanged') return
    // if (source === 'api' && type !== 'columnRowGroupChanged') return

    setGridConfig((currentConfig) => ({
      ...gridConfig,
      column: columnApi.getColumnState(),
    }))
  }

  const handleColumnGroupStateRefresh = ({
    columnApi,
    // @ts-ignore - `source` exists but the ag grid types aren't picking it up for some reason
    source,
    type,
  }: ColumnGroupOpenedEvent) => {
    if (!storageKey) return
    if (source === 'api') return
    setGridConfig((currentConfig) => ({
      ...currentConfig,
      columnGroup: columnApi.getColumnGroupState(),
    }))
  }

  const handleFilterStateRefresh = ({
    afterDataChange,
    api,
    // @ts-ignore - same issue with `source` as above
    source,
  }: FilterChangedEvent) => {
    if (!storageKey) return
    if (source === 'api' || afterDataChange) return

    setGridConfig((currentConfig) => ({
      ...currentConfig,
      filter: api.getFilterModel(),
    }))
  }

  // This gets called when the user clicks the 'Reset To Default' button in the grid toolbar under 'Grid Views'
  const handleGridConfigReset = () => {
    if (!storageKey) return
    gridRef.current?.columnApi.resetColumnState()
    gridRef.current?.columnApi.resetColumnGroupState()
    gridRef.current?.api.setFilterModel(null)
    clearConfigFromStore()
  }

  const applyStateFromConfig = ({ api, columnApi }: EventParams) => {
    if (!storageKey) return
    const storedConfig = gridConfig

    if (storedConfig?.column) {
      columnApi.applyColumnState({
        state: storedConfig?.column,
        applyOrder: true,
      })
    }

    if (storedConfig?.columnGroup) {
      columnApi.setColumnGroupState(storedConfig?.columnGroup || [])
    }

    if (storedConfig?.filter) {
      api.setFilterModel(storedConfig?.filter)
    }
  }

  return {
    isGridConfigLoaded,
    setIsGridConfigLoaded,
    handleColumnStateRefresh,
    handleRowGroupRefresh,
    handleFilterStateRefresh,
    handleColumnGroupStateRefresh,
    handleGridConfigReset,
    applyStateFromConfig,
  }
}

// For many column def props, there are two versions: one that is used to set the initial value and one that is used to set the current value always
// Because ag grid will always reapply these 'current' variants whenever column defs changed, we need to make sure that they aren't used when a grid
// is utilizing sticky state. This function will dynamically swap out these props for the initial variant. We added this so we wouldn't need to go back
// and change all of our grid implementations.
export const fixColumnDef = <T extends Record<string, any>>(def: ColDef<T>) => {
  const {
    // @ts-ignore
    children,
    flex,
    width,
    hide,
    sort,
    sortIndex,
    rowGroup,
    rowGroupIndex,
    pinned,
    pivot,
    pivotIndex,
    aggFunc,
    filterParams,
    ...rest
  } = def

  return {
    ...rest,
    ...(rest.checkboxSelection && { pinned: 'left' }),
    ...(flex && { initialFlex: flex }),
    ...(width && { initialWidth: width }),
    ...(hide && { initialHide: hide }),
    ...(sort && { initialSort: sort }),
    ...(sortIndex && { initialSortIndex: sortIndex }),
    ...(rowGroup && { initialRowGroup: rowGroup }),
    ...(rowGroupIndex && { initialRowGroupIndex: rowGroupIndex }),
    ...(pinned && { initialPinned: pinned }),
    ...(pivot && { initialPivot: pivot }),
    ...(pivotIndex && { initialPivotIndex: pivotIndex }),
    ...(aggFunc && { initialAggFunc: aggFunc }),
    ...(children && { children: children.map(fixColumnDef) }),
    filterParams: { ...filterParams, showTooltips: true },
  }
}
