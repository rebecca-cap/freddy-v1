import { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor'
import { isDefinedAndNotNull } from '@utils/index'
import { ColDef } from 'ag-grid-community'

import { QuantityDistributionRow } from '../api/type.schema'

export function getColumnDefs(
  sampleRow: QuantityDistributionRow,
  canWrite: boolean,
  periodMappings: Record<string, string> = {}
): ColDef[] {
  return [ProductName(), LocationName(), ...periodColumns(sampleRow, canWrite, periodMappings)]
}

export function nonInteractiveColumn() {
  return {
    suppressMovable: true,
    enableRowGroup: false,
    editable: false,
    pinned: 'left' as const,
  }
}

export function ProductName(): ColDef {
  return {
    ...nonInteractiveColumn(),
    field: 'ProductName',
    headerName: 'Product',
    comparator: (valueA, valueB) => {
      return (valueA || '')?.toLowerCase().localeCompare((valueB || '')?.toLowerCase())
    },
  }
}

export function LocationName(): ColDef {
  return {
    field: 'LocationName',
    headerName: 'Location',
    ...nonInteractiveColumn(),
    comparator: (valueA, valueB) => {
      return (valueA || '')?.toLowerCase().localeCompare((valueB || '')?.toLowerCase())
    },
  }
}
export interface ExtendedDirtyColDef extends ColDef {
  $periodIndex: number
  $isCellDirty: (params: { data: QuantityDistributionRow; originalRow: QuantityDistributionRow }) => boolean
}

export function periodColumns(
  row: QuantityDistributionRow,
  canWrite: boolean,
  periodMappings: Record<string, string> = {}
): ColDef[] {
  return row.Cells.map((cell, index) => ({
    enableRowGroup: false,
    suppressMovable: true,
    editable: canWrite,
    isEditable: canWrite,
    $periodIndex: index,
    $isCellDirty: (params: { data: QuantityDistributionRow; originalRow: QuantityDistributionRow }) => {
      if (params.originalRow) {
        const a = params.originalRow.Cells[index].Weight
        const b = params.data.Cells[index].Weight
        return a !== b
      }

      return false
    },
    field: `Cells.${index}.Weight`,
    cellEditor: NumberCellEditor,
    cellEditorParams: {
      allowZero: true,
      min: 0,
      step: 1,
      accessor: `Cells.${index}.Weight`,
    },
    valueGetter: (params: { data: QuantityDistributionRow }) => {
      return !params?.data?.Cells[index]?.Weight ? null : params?.data?.Cells[index]?.Weight
    },
    valueSetter: (params: { data: QuantityDistributionRow; newValue: string }) => {
      params.data.Cells[index].IsChanged = true
      params.data.Cells[index].Weight = parseInt(params.newValue) ?? null
      return true
    },
    valueFormatter: (params) => fmt.integer(params.value),
    headerName: periodMappings[cell.PeriodId?.toString()] || `Period ${cell.PeriodId}`,
    colId: periodMappings[cell.PeriodId?.toString()] || `Period ${cell.PeriodId}`,
  }))
}
