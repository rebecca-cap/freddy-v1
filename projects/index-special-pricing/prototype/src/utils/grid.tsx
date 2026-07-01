import { Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { isDefinedAndNotNull } from '@utils/index'
import { MenuItemDef } from 'ag-grid-community'

export const hiddenColumn = ({ title, field }: { title: string; field?: string }) => ({
  headerName: title,
  field: field || title,
  editable: false,
  hide: true,
})

function findNextEditableCell(params) {
  const { columnApi, rowIndex, column } = params

  const columns = columnApi.getAllDisplayedColumns()
  const currentColId = column.colId

  const currentColIndex = columns.findIndex((col) => col.getColId() === currentColId)
  for (let i = currentColIndex + 1; i < columns.length; i++) {
    const col = columns[i]
    const colDef = col.getColDef()
    if (colDef.isBulkEditable) {
      return { nextRowIndex: rowIndex, colDef }
    }
  }

  const nextRowIndex = rowIndex + 1
  const nextNode = params.api.getDisplayedRowAtIndex(nextRowIndex)

  if (nextNode) {
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i]
      const colDef = col.getColDef()

      // Check if the cell in the next row is editable
      if (colDef.isBulkEditable) {
        return { nextRowIndex, colDef }
      }
    }
  }
  return null
}

export function customOnCellKeyDown(params) {
  const isEnterKey = params?.event?.key === 'Enter'
  const isTabKey = params?.event?.key === 'Tab'

  if (isEnterKey || isTabKey) {
    const { rowIndex, column } = params
    const currentColId = column.colId
    const nextCell = findNextEditableCell(params)
    if (nextCell) {
      const { nextRowIndex, colDef } = nextCell

      params.api.stopEditing()
      params.api.clearFocusedCell()

      if (isEnterKey) {
        const nextRow = rowIndex + 1
        params.api.setFocusedCell(nextRow, currentColId, null)
        params.api.ensureIndexVisible(nextRow)
        params.api.startEditingCell({
          rowIndex: nextRow,
          colKey: currentColId,
          keyPress: null,
        })
        params.node.setSelected(false)
        const nextRowNode = params.api.getDisplayedRowAtIndex(rowIndex + 1)
        nextRowNode.setSelected(true)
      } else if (isTabKey) {
        params.api.setFocusedCell(nextRowIndex, colDef.field, null)
        params.api.ensureColumnVisible(colDef.field)
        if (rowIndex !== nextRowIndex) params.node.setSelected(false)

        const nextRowNode = params.api.getDisplayedRowAtIndex(nextRowIndex)
        nextRowNode.setSelected(true)

        params.api.startEditingCell({
          rowIndex: nextRowIndex,
          colKey: colDef.field,
          keyPress: null,
        })
      }
    }
  }
}

const saveColumnState = (columnState, storageKey) => {
  window.localStorage.setItem(storageKey, JSON.stringify(columnState))
}

export const loadColumnState = (columnApi, storageKey) => {
  const savedState = window.localStorage.getItem(storageKey)
  if (savedState) {
    const columnState = JSON.parse(savedState)
    columnApi.current.applyColumnState({ state: columnState, applyOrder: true, defaultState: { sort: null } })
  }
}

export const onColumnVisible = (event, storageKey) => {
  if (event.source !== 'api') {
    const columnState = event.columnApi.getColumnState()
    saveColumnState(columnState, storageKey)
  }
}

const targetColumnIds: string[] = ['Adjustment']

export const getContextMenuAdditionalMenuItems = (
  colId: string,
  setIsSpreadOverrideModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedSpreadOverrideRow: React.Dispatch<React.SetStateAction<Quote | undefined>>,
  contextMenuRowData?: Quote
): (MenuItemDef | string)[] | null => {
  const isSpreadRow = isDefinedAndNotNull(contextMenuRowData?.SpreadParentMappingId)
  if (targetColumnIds.includes(colId) && isSpreadRow) {
    return [
      {
        name: 'Override Spread for Current Period',
        action: () => {
          setIsSpreadOverrideModalOpen(true)
          setSelectedSpreadOverrideRow(contextMenuRowData ?? undefined)
        },
      },
    ]
  }

  return null // null items
}
