import {
  GridView,
  GridViewManager,
} from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/schema.types'
import type {
  ColDef,
  ColumnApi,
  GetRowIdParams,
  GridApi,
  MenuItemDef,
} from 'ag-grid-community'
import type { AgGridReactProps } from 'ag-grid-react'
import { type MutableRefObject, type ReactNode } from 'react'

import type {
  BaseFieldProps,
  Filter,
} from '../Grid/SearchGridHeader/DynamicFilterForm/types'
import { ChangeMeta } from './BulkChangeBar'
import type { useDirtyGridChanges } from './hooks/useDirtyGrid'
import { useRowPinning } from './RowPinning/useRowPinning'

// Normally, we would never call getRowId directly. It is called by ag grid indirectly and as a result,
// other variables are passed to the function. We're just taking advantage of the same function to get the row id
// when diffing the rows.
export type CallableGetRowId<T> = (
  params: Pick<GetRowIdParams<T>, 'data'>
) => T[keyof T]

export type BulkCellEditorHandle<T> = {
  getChanges: (row: T) => Partial<T>
  isChangeReady: () => boolean
}

export type ControlBarProps<F extends Filter> = {
  title?: string
  showSelectedCount?: boolean
  customSearchBar?: ReactNode
  actionButtons?: ReactNode
  serverParams?: BaseFieldProps<F>[]
  filters?: F
  setFilters?: (filters: F) => void
  customFilterDrawer?: JSX.Element
  hiddenFilterKeys?: string[]
  defaultFilter?: F
  hideActiveFilters: boolean
  warning?: string
  maxFilterTagsArrayLength?: number
  filterDrawerDefaultExpanded?: boolean
}

export type GraviGridProps<T extends Record<string, any>, F extends Filter> = {
  children?: ReactNode
  loading?: boolean
  rowData?: T[]
  columnDefs: Array<ColDef<T>>
  columnDefaultOverrides?: AgGridReactProps<T>['defaultColDef']
  controlBarProps?: ControlBarProps<F>
  externalRef?: React.MutableRefObject<GridApi>
  columnApiRef?: React.MutableRefObject<ColumnApi>
  primaryKey?: keyof T
  storageKey?: string
  updateEP?: (row: T | T[], meta?: ChangeMeta<T>) => Promise<any>
  createEP?: (row: T | T[], meta?: ChangeMeta<T>) => Promise<any>
  createConfig?: any
  createSelectOptions?: any
  shouldInsertCreated?: boolean
  showColumnsToolbar?: boolean
  supressPivot?: boolean
  spreadCreateResponse?: boolean
  customFilterDrawer?: ReactNode
  hideSaveDisplay?: boolean
  onGridConfigChanged?: any
  isDirtyEdit?: boolean
  onDirtyChangeSave?: any
  onDirtyChangeDiscard?: any
  dirtyChangesRef?: MutableRefObject<ReturnType<typeof useDirtyGridChanges<T>>> // should be a ref to the dirtyGridApi
  isBulkChangeVisible?: boolean
  setIsBulkChangeVisible?: React.Dispatch<React.SetStateAction<boolean>>
  bulkDrawerTitle?: string
  onSelectionChanged?: AgGridReactProps['onSelectionChanged']
  toolPanelWidth?: number
  agPropOverrides: Partial<
    AgGridReactProps<T> & {
      frameworkComponents?: any
      getAdditionContextMenuItems?: (
        colId: string | undefined,
        rowData: T | undefined
      ) => (MenuItemDef | string)[] | null
    }
  >
  suppressSaveMessage?: boolean
  hideBulkSaveButtons?: boolean
  enableRowPinning?: boolean
  rowPinningRef?: React.MutableRefObject<ReturnType<typeof useRowPinning<T>>>
  pinnedRowPosition?: 'top' | 'bottom'
  showUnpinAllButton?: boolean
  bulkChangePropertiesComparator?: (a: ColDef<T>, b: ColDef<T>) => number
  gridViewManager?: GridViewManager
  isBulkChangeCompactMode?: boolean
}

export interface ExtendedGridApi<T> extends GridApi<T> {
  applyGridView?: (view: GridView) => void
  resetGridToDefault?: () => void
}
