import { IRowNode, RowDragEndEvent } from 'ag-grid-community'

export function onRowDragMove(
  event: RowDragEndEvent,
  currentData: any[],
  updateData: (data: any[]) => void,
  orderStorageKey: string
) {
  const { api } = event
  const movingNode = event.node
  const { overNode } = event
  if (!movingNode || !overNode || overNode.group || movingNode.group) return

  const movingData = movingNode.data
  const overData = overNode.data

  const groupField = 'ColumnGroup'
  const movingGroup = movingData[groupField]
  const overGroup = overData[groupField]

  if (movingGroup !== overGroup) return

  // if no data
  if (!currentData.length) return

  // Collect rows in this group only (IN DISPLAY ORDER!)
  const displayedGroupNodes: IRowNode[] = []
  api.forEachNodeAfterFilterAndSort((node) => {
    if (!node.group && node.data?.[groupField] === movingGroup) {
      displayedGroupNodes.push(node)
    }
  })

  const groupRows = displayedGroupNodes.map((n) => n?.data)

  const fromIndex = displayedGroupNodes.findIndex((n) => n === movingNode)
  const toIndex = displayedGroupNodes.findIndex((n) => n === overNode)
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return

  // Reorder just the group
  const updatedGroup = [...groupRows]
  const [movedRow] = updatedGroup.splice(fromIndex, 1)
  updatedGroup.splice(toIndex, 0, movedRow)

  // Replace group rows back into fullData by AllocationId
  const groupIdSet = new Set(updatedGroup.map((row) => row.AllocationId))
  const updatedFullData = currentData.map((row) =>
    row[groupField] === movingGroup && groupIdSet.has(row.AllocationId) ? updatedGroup.shift()! : row
  )

  api.setRowData(updatedFullData)
  updateData(updatedFullData)

  const saved = JSON.parse(localStorage.getItem(orderStorageKey) || '{}')
  saved[movingGroup] = updatedFullData.filter((r) => r[groupField] === movingGroup).map((r) => r.AllocationId)
  localStorage.setItem(orderStorageKey, JSON.stringify(saved))
}

export function applySavedOrder(data: any[], orderMap: Record<string, string[]>, groupField: string): any[] {
  const grouped: Record<string, any[]> = {}

  // Group rows by their groupField value
  for (const row of data) {
    const group = row[groupField]
    if (!grouped[group]) grouped[group] = []
    grouped[group].push(row)
  }

  const result: any[] = []

  for (const group in grouped) {
    const groupRows = grouped[group]
    const savedOrder = orderMap[group]

    if (Array.isArray(savedOrder) && savedOrder.length > 0) {
      const ordered = savedOrder.map((id) => groupRows.find((r) => r.AllocationId === id)).filter(Boolean)

      const leftovers = groupRows.filter((r) => !savedOrder.includes(r.AllocationId))

      result.push(...ordered, ...leftovers)
    } else {
      // No saved order: use the default order
      result.push(...groupRows)
    }
  }

  return result
}
