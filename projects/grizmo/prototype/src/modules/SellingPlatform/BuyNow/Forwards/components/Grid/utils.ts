import _ from 'lodash'

export const staticColumns = [
  {
    field: 'LocationName',
    headerName: 'Location',
    minWidth: 100,
    pinned: 'left',
    cellStyle: { pointerEvents: 'none' },
    sort: 'asc',
    sortIndex: 0,
  },
  {
    sort: 'asc',
    sortIndex: 1,
    field: 'ProductName',
    headerName: 'Product',
    minWidth: 100,
    pinned: 'left',
    cellStyle: { pointerEvents: 'none' },
  },
]

export const getColumnDefs = (data) => {
  const columnDefs = [...staticColumns]

  const periodData = data?.flatMap((x) =>
    x.MarketPlatformItems.map((y) => ({
      DisplayName: y.DisplayName,
      FuturesMonth: y.FuturesMonth,
      DeliveryPeriodGroupId: y.ItemKey.DeliveryPeriodGroupId,
      DeliveryPeriodConfigurationId: y.ItemKey.DeliveryPeriodConfigurationId,
      ColumnKey: `${y.ItemKey.DeliveryPeriodGroupId}_${y.ItemKey.DeliveryPeriodConfigurationId}`,
      DeliveryPeriodFromDate: y.DeliveryPeriodFromDate,
    }))
  )

  const uniquePeriodData = _.chain(periodData)
    .uniqBy((item) => item.ColumnKey)
    .sortBy((x) => x.DeliveryPeriodFromDate)
    .value()

  uniquePeriodData.forEach((x) => {
    columnDefs.push({
      field: x.ColumnKey,
      headerName: x.DisplayName,
      minWidth: 125,
      sourceData: x,
      // disable cell select if no price is available
      cellStyle: (params) => (!params?.value ? { pointerEvents: 'none' } : {}),
      valueFormatter: (params) => fmt.decimal(params.value) || 'X',
      valueGetter: (params) => {
        const { cell } = getItemFromRow(params.data, x)
        return !cell ? null : cell.Price
      },
    })
  })

  return columnDefs
}

export const getSelectedCells = (api) => {
  const ranges = api.getCellRanges()
  const cellsByRow = {}

  ranges.forEach((range) => {
    const periodKeys = range.columns.map((x) => x.colDef.sourceData)
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

  const selectedCells = []

  keys.forEach((key) => {
    const cellsForKey = cellsByRow[key]
    const validCells = cellsForKey.filter((x) => x.cell && x.cellIndex >= 0)
    validCells.forEach((cell) => selectedCells.push(cell))
  })

  return selectedCells
}

export const hasIndexGaps = (indexes) => {
  const sorted = indexes.sort((a, b) => a - b)
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] - sorted[i] > 1) {
      return true
    }
  }
  return false
}

export const getItemFromRow = function (row, key) {
  const cellIndex = getItemIndexFromRow(row, key)
  const cell = cellIndex >= 0 ? row.MarketPlatformItems[cellIndex] : null
  return { cellIndex, cell }
}

export const getItemIndexFromRow = (row, key) =>
  row.MarketPlatformItems.findIndex(
    (y) =>
      y.ItemKey.DeliveryPeriodGroupId === key.DeliveryPeriodGroupId &&
      y.ItemKey.DeliveryPeriodConfigurationId === key.DeliveryPeriodConfigurationId
  )
