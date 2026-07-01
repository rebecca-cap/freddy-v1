import { GridConfigState } from '@components/GraviGrid/hooks/useAGGridEvent'
import type { AgGridReact } from 'ag-grid-react'
import { MutableRefObject } from 'react'

export type GridView = {
  id: number | string
  name: string
  state: GridConfigState
  gridKey: string
}
export type ViewPayload = {
  id?: number | string
  name: string
  state?: GridConfigState
  gridKey?: string
}
export type GridViewManager = {
  saveView: (view: ViewPayload) => Promise<GridView[]>
  deleteView: (view: GridView) => GridView[]
}
export type GridRef = MutableRefObject<AgGridReact | null>
