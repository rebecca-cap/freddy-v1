import { CellRange, GridApi } from 'ag-grid-community'
import { MutableRefObject } from 'react'

import { ExtendedDirtyColDef } from './components/columnDefs'
import { CellAction } from './components/PeriodValueEditor'

export function handleCellChange(
  gridRef: MutableRefObject<GridApi>,
  value: number | null,
  action: CellAction,
  dirtyRef?: MutableRefObject<any>
) {
  const gridApi = gridRef.current
  if (!gridApi) return

  const transactions: any[] = []
  const ranges: CellRange[] = gridRef.current.getCellRanges() || []

  if (!ranges || ranges.length < 1) return

  ranges.forEach((range) => {
    // The beginning and end rows of the range selection
    let rowIndexStart = range.startRow?.rowIndex || 0
    let rowIndexEnd = range.endRow?.rowIndex || 0

    // If range selection was bottom to top, reverse the order
    if (rowIndexStart > rowIndexEnd) [rowIndexStart, rowIndexEnd] = [rowIndexEnd, rowIndexStart]
    const selectedCells = range.columns.map((col) => {
      const colDef = col.getColDef() as ExtendedDirtyColDef
      return {
        index: colDef.$periodIndex,
        id: col.getColId(),
      }
    })

    for (let i = rowIndexStart; i <= rowIndexEnd; i++) {
      const node = gridRef.current?.getDisplayedRowAtIndex(i)
      if (!node) continue
      const updatedCells = structuredClone(node.data.Cells)
      const change = {
        ...node.data,
        Cells: node.data.Cells.map((cell, cellIndex) => {
          if (selectedCells.some((c) => c.index === cellIndex)) {
            const { newValue } = getMutatedCellValue(node, cellIndex, value, action)
            if (newValue < 0) return { ...cell, Weight: 0 }
            return { ...cell, Weight: newValue, IsChanged: true }
          }
          return { ...cell }
        }),
      }

      const changePayload = {
        updatedRowIndex: i,
        oldValue: updatedCells,
        newValue: change.Cells,
        colId: 'Cells',
      }

      dirtyRef?.current?.updateDirtyRow(change, changePayload)
      transactions.push(change)
    }
  })

  gridRef.current.applyTransaction({ update: transactions })
}

export function getMutatedCellValue(node: { data: any }, cellIndex: number, value: number, action: CellAction) {
  const oldValue = node.data.Cells[cellIndex].Weight
  switch (action) {
    case 'add':
      return { oldValue, newValue: oldValue + value }
    case 'subtract':
      return { oldValue, newValue: oldValue - value }
    case 'replace':
      return { oldValue, newValue: value }
    default:
      return {}
  }
}
