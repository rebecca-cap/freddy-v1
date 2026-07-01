import { showRowSelectionError } from '@modules/Analytics/PricePerformance/components/Messages'
import { RowGetter } from '@modules/Analytics/PricePerformance/components/types'
import { ValueGetterParams } from 'ag-grid-community'

export const getGroupValue = (params: ValueGetterParams, getGroupRowData: RowGetter, field: string) => {
  const gridRow = getGroupRowData(params)
  if (!gridRow) return null
  return gridRow?.[field]
}

export const selectRowsToShowGraphData = (e, selectedRows, setSelectedRows, identifier) => {
  const rows = e.api.getSelectedRows()
  if (rows.length > 5) {
    handleRowSelectionError(e, selectedRows, identifier)
  }
  setSelectedRows(rows)
}

export const handleRowSelectionError = (e, selectedRows, identifier) => {
  showRowSelectionError()
  const nodes = e.api
    .getSelectedNodes()
    .filter((node) => !selectedRows.find((row) => row[identifier] === node.data[identifier]))
  e.api.setNodesSelected({ nodes, newValue: false })
}

export const mapRowsToData = (selectedNodes, setSelectedRows, data, keyName) => {
  const selectedData = selectedNodes.map((node) => {
    if (node.group) {
      return data.GridRows.find((row) => row?.[keyName] == node.key)
    }
    return node.data
  })
  setSelectedRows(selectedData)
}
