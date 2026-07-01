export function getSelectedCells(api) {
  const ranges = api.getCellRanges()
  const cellsByRow = {}

  ranges.forEach((range) => {
    const periodKeys = range.columns.map((x) => x.colDef.sourceData).filter((x) => !!x)
    for (let i = range.startRow.rowIndex; i <= range.endRow.rowIndex; i += 1) {
      if (!cellsByRow[i]) {
        cellsByRow[i] = []
      }
      const row = api.getDisplayedRowAtIndex(i).data
      periodKeys.forEach((key) => {
        const data = getItemFromRow(row, key)
        if (data.cell) {
          cellsByRow[i].push({ ...data, rowIndex: i })
        } else {
          cellsByRow[i].push({ cell: null, cellIndex: -1, rowIndex: i })
        }
      })
    }
  })

  const keys = Object.keys(cellsByRow)

  const selectedCells: any[] = []

  keys.forEach((key) => {
    const cellsForKey = cellsByRow[key]
    const validCells = cellsForKey.filter((x) => x.cell && x.cellIndex >= 0)
    validCells.forEach((cell) => selectedCells.push(cell))
  })

  return selectedCells
}

export function hasIndexGaps(indexes: number[]): boolean {
  const sorted = indexes.sort((a, b) => a - b)
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] - sorted[i] > 1) {
      return true
    }
  }
  return false
}

interface PeriodKey {
  DeliveryPeriodGroupId: number
  DeliveryPeriodConfigurationId: number
}

interface MarketPlatformItem {
  ItemKey?: PeriodKey
  [key: string]: unknown
}

const itemKeyMatches = (item: MarketPlatformItem, key: PeriodKey) =>
  !!item.ItemKey &&
  item.ItemKey.DeliveryPeriodGroupId === key.DeliveryPeriodGroupId &&
  item.ItemKey.DeliveryPeriodConfigurationId === key.DeliveryPeriodConfigurationId

export function getItemFromRow(row: { MarketPlatformItems: MarketPlatformItem[] }, key: PeriodKey) {
  const cellIndex = getItemIndexFromRow(row, key)
  const cell = cellIndex >= 0 ? row.MarketPlatformItems[cellIndex] : null
  return { cellIndex, cell }
}

export function getItemIndexFromRow(row: { MarketPlatformItems: MarketPlatformItem[] }, key: PeriodKey) {
  return row.MarketPlatformItems.findIndex((y) => itemKeyMatches(y, key))
}
