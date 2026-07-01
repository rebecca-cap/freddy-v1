export const isDefined = (v: any) => typeof v !== 'undefined' && v !== null

export const getNumSign = (number: number) => (number > 0 ? '+' : '')

export const numberToShortString = (
  number: number | null,
  decimals = 0,
  showDecimalsOnlyMillions?: boolean
): string => {
  if (!isDefinedAndNotNull(number)) return 'N/A'
  const formattedNumber = Math.abs(number)
  if (!number && number !== 0) {
    return 'N/A'
  }
  if (formattedNumber >= 1000000) {
    return `${fmt.decimal(number / 1000000, decimals)}M`
  }
  if (formattedNumber >= 1000) {
    return `${fmt.decimal(number / 1000, showDecimalsOnlyMillions ? 0 : decimals)}K`
  }
  return fmt.decimal(number, decimals)
}

export const isDefinedAndNotNull = <T>(v: T): v is NonNullable<T> => typeof v !== 'undefined' && v !== null

export const toAntOption = <T extends { Text: string; Value: any; value?: any; label?: any }>(item: T) => ({
  value: item.Value ?? item.value,
  label: item.Text ?? item.label,
})

export const toAntOptionParsedNumberValue = <T extends { Text: string; Value: string }>(item: T) => ({
  // eslint-disable-next-line radix
  value: parseInt(item.Value),
  label: item.Text,
})

export const searchFilter = (input, option) => {
  return (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
}
export const areObjectsIdentical = (leftSide, rightSide) =>
  Object.keys(leftSide).every((key) => rightSide.hasOwnProperty(key) && rightSide[key] === leftSide[key])

export function deepCopy(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepCopy)
  }
  if (typeof obj === 'object' && obj !== null) {
    const newObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = deepCopy(obj[key])
      }
    }
    return newObj
  }
  return obj
}

/**
 * Formats a number with thousand separators (commas)
 * Used with Ant Design InputNumber formatter prop
 * @example 1000000 -> "1,000,000"
 */
export const formatWithCommas = (value: number | string | undefined): string => {
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Parses a formatted string back to a number by removing commas
 * Used with Ant Design InputNumber parser prop
 * @example "1,000,000" -> 1000000
 */
export const parseCommas = (value: string | undefined): number => {
  return value?.replace(/,/g, '') as unknown as number
}

/**
 * Formats a differential value as currency with sign prefix
 * Shows '+' for positive, '-' for negative, and '-' for null/undefined
 * @example 0.0025 -> "+$0.0025", -0.0025 -> "-$0.0025", 0 -> "$0.0000", null -> "-"
 */
export const formatDifferentialAsCurrency = (value: number | null | undefined): string => {
  if (value == null) return '-'
  const sign = value === 0 ? '' : value > 0 ? '+' : '-'
  return `${sign}$${Math.abs(value).toFixed(4)}`
}

export function generateShades(baseColorVar, isHex = false) {
  // Get computed color from CSS variable
  const getComputedColor = (variableName) =>
    getComputedStyle(document.documentElement).getPropertyValue(variableName).trim()

  const baseColor = isHex ? baseColorVar : getComputedColor(baseColorVar)

  // Convert hex to RGB
  const hexToRgb = (hex) => hex?.match(/[A-Za-z0-9]{2}/g)?.map((v) => parseInt(v, 16))

  // Convert RGB to hex with optional #
  const rgbToHex = (rgb, includeHash = true) => {
    const hex = rgb?.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')
    return includeHash ? `#${hex}` : hex
  }

  // Generate 5 shades darker
  const darkerShades = Array.from({ length: 5 }, (_, index) => {
    const rgb = hexToRgb(baseColor)?.map((v) => Math.max(0, v - 30 * (index + 1)))
    return rgbToHex(rgb)
  })

  // Generate 4 shades lighter
  const lighterShades = Array.from({ length: 4 }, (_, index) => {
    const rgb = hexToRgb(baseColor)?.map((v) => Math.min(255, v + 30 * (index + 1)))
    return rgbToHex(rgb)
  })

  // Combine the shades and return
  return [...darkerShades.reverse(), baseColor, ...lighterShades]
}
