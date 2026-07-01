import dayjs from '@utils/dayjs'

export const dateFilterParams = {
  comparator: (filterDate: Date, cellValue: Date) => {
    if (cellValue == null) return -1
    const cell = dayjs(cellValue).startOf('day')
    const filter = dayjs(filterDate).startOf('day')
    if (cell.isBefore(filter)) return -1
    if (cell.isAfter(filter)) return 1
    return 0
  },
}
