import dayjs from '@utils/dayjs'

import { dateFormat } from '../components/TheArmory/helpers'

/**
 * Strips a trailing `Z` or `±HH:MM` offset from an ISO string so it renders as a literal
 * wall-clock value instead of being shifted into the browser's local timezone.
 */
export function stripTimezoneOffset(value: string): string {
  return value.replace(/(Z|[+-]\d{2}:?\d{2})$/, '')
}

/**
 * Formats a date/time value with a timezone alias suffix.
 * Falls back to the global server timezone if no timeZoneAlias is provided.
 * Returns empty string for null/undefined values.
 *
 * @example
 * formatDateWithTimezone('2025-03-15T15:45:00', dateFormat.MONTH_DATE_YEAR_TIME, 'CST')
 * // => "Mar 15, 2025 3:45 PM CST"
 *
 * formatDateWithTimezone('2025-03-15T15:45:00')
 * // => "Mar 15, 2025 3:45 PM CST" (falls back to server timezone)
 */
export function formatDateWithTimezone(
  value: string | Date | null | undefined,
  format: string = dateFormat.MONTH_DATE_YEAR_TIME,
  timeZoneAlias?: string | null
): string {
  if (!value) return ''
  const input = typeof value === 'string' ? stripTimezoneOffset(value) : value
  const formatted = dayjs(input).format(format)
  const alias = timeZoneAlias || serverTimeZoneAlias
  return alias ? `${formatted} ${alias}` : formatted
}

/**
 * Reformats BE time-range strings like "06:00:00 PM - 05:59:59 PM"
 * into "6 PM - 5:59 PM" — strips leading zeros and seconds, keeps minutes
 * only when non-zero, preserves AM/PM.
 */
export function formatTimeRange(value: string): string {
  return value.replace(/(\d{1,2}):(\d{2}):\d{2}\s*(AM|PM)/gi, (_, h, m, ampm) => {
    const hour = Number.parseInt(h, 10)
    const period = ampm.toUpperCase()
    return m === '00' ? `${hour} ${period}` : `${hour}:${m} ${period}`
  })
}
