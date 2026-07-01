import {
  CalendarHolidayItem,
  CalendarListItem,
  CalendarPeriodDTO,
} from '@modules/Admin/ManagePriceEngineCalendars/api/types'
import moment from 'moment'

export interface HolidayValidationResult {
  rowIndex: number
  originalData: CalendarHolidayItem
  validationErrors: string[]
}

/**
 * Creates a unique key for duplicate detection based on calendar name, holiday name, and date
 */
function createHolidayKey(calendarName: string, holidayName: string, holidayDate: string): string {
  const normalizedCalendar = calendarName?.toLowerCase().trim() || ''
  const normalizedName = holidayName?.toLowerCase().trim() || ''
  const normalizedDate = moment(holidayDate).format('YYYY-MM-DD')
  return `${normalizedCalendar}|${normalizedName}|${normalizedDate}`
}

export function validateUploadedHolidays(
  uploadedData: CalendarHolidayItem[],
  calendarList: CalendarListItem[],
  existingHolidays: CalendarPeriodDTO[]
): HolidayValidationResult[] {
  // Create lookup set for calendar names (case-insensitive)
  const calendarNameSet = new Set(calendarList.map((c) => c.Text?.toLowerCase().trim()))

  // Map of CalendarId -> Set of existing holiday CalendarPeriodIds
  const holidayIdsByCalendar = new Map<string, Set<number>>()
  existingHolidays.forEach((holiday) => {
    const calendarId = holiday.CalendarId.toString()
    if (!holidayIdsByCalendar.has(calendarId)) {
      holidayIdsByCalendar.set(calendarId, new Set())
    }
    holidayIdsByCalendar.get(calendarId)!.add(holiday.CalendarPeriodId)
  })

  // Map calendar name to calendar id for HolidayId validation
  const calendarNameToId = new Map<string, string>()
  calendarList.forEach((c) => {
    calendarNameToId.set(c.Text?.toLowerCase().trim(), c.Value)
  })

  // Map calendar id to calendar name for existing holiday lookup
  const calendarIdToName = new Map<string, string>()
  calendarList.forEach((c) => {
    calendarIdToName.set(c.Value, c.Text?.toLowerCase().trim())
  })

  // Build set of existing holidays for duplicate detection (calendar + name + date)
  const existingHolidayKeys = new Set<string>()
  existingHolidays.forEach((holiday) => {
    const calendarName = calendarIdToName.get(holiday.CalendarId.toString()) || ''
    const key = createHolidayKey(calendarName, holiday.Name, holiday.PeriodFromDate)
    existingHolidayKeys.add(key)
  })

  // Track duplicates within uploaded file
  const uploadedHolidayKeysWithRows = new Map<string, number[]>()
  uploadedData.forEach((row, index) => {
    if (row.CalendarName && row.HolidayName && row.HolidayDate) {
      const key = createHolidayKey(row.CalendarName, row.HolidayName, row.HolidayDate)
      if (!uploadedHolidayKeysWithRows.has(key)) {
        uploadedHolidayKeysWithRows.set(key, [])
      }
      uploadedHolidayKeysWithRows.get(key)!.push(index + 2) // Excel row number
    }
  })

  return uploadedData.map((row, index) => {
    const errors: string[] = []
    const rowNumber = index + 2 // Excel row number (1-indexed + header row)

    // Validation 1: CalendarName = null
    if (!row.CalendarName || row.CalendarName.trim() === '') {
      errors.push("Calendar Name can't be null")
    } else {
      // Validation 2: CalendarName not found
      const normalizedCalendarName = row.CalendarName.toLowerCase().trim()
      if (!calendarNameSet.has(normalizedCalendarName)) {
        errors.push('A Calendar with that name does not exist')
      }
    }

    // Validation 3: HolidayName = null
    if (!row.HolidayName || row.HolidayName.trim() === '') {
      errors.push("Holiday Name can't be null")
    }

    // Validation 4: HolidayDate = null
    if (!row.HolidayDate) {
      errors.push("Holiday Date can't be null")
    } else {
      const holidayMoment = moment(row.HolidayDate)
      if (!holidayMoment.isValid()) {
        errors.push('Holiday Date is not a valid date')
      } else {
        // Validation 5: HolidayDate has time component other than 00:00:00
        const timeComponent = holidayMoment.format('HH:mm:ss')
        if (timeComponent !== '00:00:00') {
          errors.push(
            'Holiday Date cannot begin at the specified time. Please remove time component before trying again'
          )
        }
      }
    }

    // Validation 6: HolidayId doesn't exist in the specified Calendar
    if (row.HolidayId && row.CalendarName) {
      const normalizedCalendarName = row.CalendarName.toLowerCase().trim()
      const calendarId = calendarNameToId.get(normalizedCalendarName)

      if (calendarId) {
        const calendarHolidays = holidayIdsByCalendar.get(calendarId)
        if (calendarHolidays && !calendarHolidays.has(row.HolidayId)) {
          errors.push(
            `Holiday on row ${rowNumber} does not exist in Calendar Name. Please review the holiday and calendar name before trying again`
          )
        }
      }
    }

    return {
      rowIndex: index + 1,
      originalData: row,
      validationErrors: errors,
    }
  })
}

/**
 * Check if any rows have validation errors
 */
export function hasValidationErrors(results: HolidayValidationResult[]): boolean {
  return results.some((row) => row.validationErrors.length > 0)
}

/**
 * Get count of rows with errors
 */
export function getErrorCount(results: HolidayValidationResult[]): number {
  return results.filter((row) => row.validationErrors.length > 0).length
}
