import { isDefinedAndNotNull } from '@utils/index'
import { ColDef } from 'ag-grid-community'

import { StatusColumn } from '../sharedComponents/sharedColumns'

export function MarginSummaryColumnDefs(columnHeadersByColumnId?: { [key: number]: string }) {
  return [StatusColumn(), ...createMarginColumns(columnHeadersByColumnId)] as ColDef[]
}
function createMarginColumns(columnHeadersByColumnId?: { [key: number]: string }) {
  if (!columnHeadersByColumnId) return []
  return Object.keys(columnHeadersByColumnId).map((key) => ({
    headerName: columnHeadersByColumnId[key],
    field: `MarginColumns.${key}.AverageMargin`,
    valueFormatter: (params) => (isDefinedAndNotNull(params.value) ? fmt.decimal(params.value) : ''),
    filter: 'agNumberColumnFilter',
  }))
}
