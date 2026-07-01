import { generateShades, numberToShortString } from '@utils/index'

export const chartColors = {
  greenTheme: '#0C5A58',
  lightGreenArea: `#82ca9d`,
  gold: '#d4af37',
}

type FormatterType = 'Profit' | 'Liftings' | 'Margin'

export const getFormatter = (format: FormatterType) => {
  switch (format) {
    case 'Profit':
    case 'Liftings':
      return (value) => numberToShortString(value)
    case 'Margin':
      return (value) => fmt.marginDecimal(value)
    default:
      return (value) => value
  }
}
export const shades = generateShades(chartColors.lightGreenArea, true)

export const addColorToRows = (row) => {
  const items = Object.keys(row).filter((key) => key !== 'Date' && key !== 'comparisonValue')
  const rowWithColors = { ...row }
  items.forEach((key, index) => (rowWithColors[`${key}Color`] = shades[index]))
  return rowWithColors
}

export const mergeRows = (acc, row) => {
  const existingRow = acc.find((r) => r.Date === row.Date)
  if (existingRow) {
    return acc.map((r) => (r.Date === row.Date ? { ...r, ...row } : r))
  }
  return [...acc, row]
}

export const getMax = (selectedGraphItems, selectedMetricType) => {
  const max = Math.max(
    ...selectedGraphItems.map((row) =>
      Math.max(row.CellMetrics?.[selectedMetricType], row.SystemAverageMetrics?.[selectedMetricType])
    )
  )
  return max * 1.1
}
