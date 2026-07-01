import { ColumnPinnedType, IAggFunc } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

export type GridConfigFilterState = ReturnType<AgGridReact['api']['getFilterModel']>
export type GridConfigState = {
  column: ReturnType<AgGridReact['columnApi']['getColumnState']>
  filter?: GridConfigFilterState
}

export interface ColumnState {
  colId: string
  width?: number
  hide?: boolean | null
  pinned?: ColumnPinnedType
  sort?: 'asc' | 'desc' | null
  sortIndex?: number | null
  aggFunc?: string | IAggFunc | null
  rowGroup?: boolean | null
  rowGroupIndex?: number | null
  pivot?: boolean | null
  pivotIndex?: number | null
  flex?: number | null
}

export type GridView = {
  id: number
  name: string
  gridKey: string
  state: GridConfigState
}

export type ViewPayload = {
  id?: number | string
  name: string
  gridKey?: string
  state?: GridConfigState
}

// from and to the grid
export interface GridConfigContent {
  name: string
  gridKey: string
  id: string
  state: GridConfigState
}
type FilterModels = {
  filterType?: string | null
  type?: string | null
  filter?: string | number | null
  dateFrom?: Date | string | null
  dateTo?: Date | string | null
  values?: string[]
  conditions?: FilterModels[]
  condition1?: FilterModels
  condition2?: FilterModels
  operator?: 'AND' | 'OR' | null
}

// for BE to and from
export interface GridViewPayloadFilter {
  colId: string
  filterType?: string | null
  type?: string | null
  filter?: string | number | null
  dateFrom?: Date | string | null
  dateTo?: Date | string | null
  values?: string[]
  operator?: string | null
  conditions?: FilterModels[]
  filterModels?: FilterModels[]
}
// for BE to and from
export interface GridViewPayload {
  Name: string
  UserPreferenceId?: number
  Display: string
  Columns: ColumnState[]
  Filters?: GridViewPayloadFilter[]
}
export interface GridViewResponse {
  Name: string
  UserPreferenceId: number
  Display: string
  Columns: ColumnState[]
  Filters?: GridViewPayloadFilter[]
}

export interface ApiResponse {
  Data: GridViewResponse
  Validations: []
}
