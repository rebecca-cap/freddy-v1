import { MetadataListResponseItem } from '@api/globalTypes'
import { dateFormat } from '@components/TheArmory/helpers'
import { getDefaultStartTime } from '@modules/Dashboard/SpecialOffers/utils/Constants/TimingWindowConstants'
import type { Dayjs } from '@utils/dayjs'
import dayjs from '@utils/dayjs'
import type { FormInstance } from 'antd'
import { MutableRefObject } from 'react'

export function nowInTimezone(timezone?: string) {
  return timezone ? dayjs().tz(timezone) : dayjs()
}

export function getTimezoneIana(
  timeZoneId: number | undefined,
  validTimeZones: MetadataListResponseItem[] | undefined
): string | undefined {
  if (!timeZoneId || !validTimeZones) return undefined
  return validTimeZones.find((tz) => Number(tz.Value) === timeZoneId)?.Text
}

export function buildDateTimeInTimezone(date: Dayjs, hours: number, minutes: number, timezone?: string): Dayjs {
  const dt = nowInTimezone(timezone)
  return dt.year(date.year()).month(date.month()).date(date.date()).hour(hours).minute(minutes).second(0)
}

export interface DisabledTimeConfig {
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
}

/**
 * Creates a disabled time config that disables past hours/minutes when the date is today.
 * Returns an empty config if the date is not today or is undefined.
 * When a timezone IANA string is provided, "now" is calculated in that timezone
 * instead of the browser's local time.
 */
export function createDisabledTimeForDate(dateValue: Dayjs | undefined, timezone?: string): DisabledTimeConfig {
  if (!dateValue) {
    return {}
  }

  const now = nowInTimezone(timezone)
  const isToday = dayjs(dateValue).isSame(now, 'day')
  if (!isToday) {
    return {}
  }

  return {
    disabledHours: () => {
      const hours: number[] = []
      for (let i = 0; i < now.hour(); i++) {
        hours.push(i)
      }
      return hours
    },
    disabledMinutes: (selectedHour: number) => {
      if (selectedHour === now.hour()) {
        const minutes: number[] = []
        for (let i = 0; i <= now.minute(); i++) {
          minutes.push(i)
        }
        return minutes
      }
      return []
    },
  }
}

export interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isPast: boolean
}

export function generateCalendarDays(currentDate): CalendarDay[] {
  const startOfMonth = dayjs(currentDate).startOf('month')
  const endOfMonth = dayjs(currentDate).endOf('month')
  const startOfWeek = startOfMonth.startOf('week')
  const endOfWeek = endOfMonth.endOf('week')

  const days: CalendarDay[] = []
  let current = startOfWeek

  while (current.isSameOrBefore(endOfWeek)) {
    days.push({
      date: current.format(dateFormat.DATE_SLASH),
      day: current.date(),
      isCurrentMonth: current.isSame(currentDate, 'month'),
      isToday: current.isSame(dayjs(), 'day'),
      isPast: current.isBefore(dayjs(), 'day'),
    })
    current = current.add(1, 'day')
  }
  return days
}

export function isValidDateSelection({
  newDate,
  windowType,
  position,
  selectedVisibilityWindowStart,
  selectedPickupWindowStart,
  form,
}: {
  newDate: string | undefined
  windowType: 'visibility' | 'pickup'
  position: 'start' | 'end'
  selectedVisibilityWindowStart?: Dayjs
  selectedPickupWindowStart?: Dayjs
  form?: FormInstance
}): boolean {
  const selectedDate = dayjs(newDate)
  if (form) {
    const visStartTime = form.getFieldValue('VisibilityWindowStartTime')
    const visEndTime = form.getFieldValue('VisibilityWindowEndTime')
    const pickStartTime = form.getFieldValue('PickupWindowStartTime')
    const pickEndTime = form.getFieldValue('PickupWindowEndTime')
    const selectedVisEndDate = form.getFieldValue('VisibilityWindowEndDate')
    const toTime = (val: Dayjs | string) => (typeof val === 'string' ? dayjs(val, 'HH:mm:ss') : dayjs(val))

    if (windowType === 'visibility' && position === 'end' && selectedVisibilityWindowStart) {
      if (selectedDate.isSame(selectedVisibilityWindowStart, 'day') && visStartTime && visEndTime) {
        if (toTime(visEndTime).isBefore(toTime(visStartTime))) {
          return false
        }
      }
    } else if (windowType === 'pickup') {
      if (position === 'start' && selectedVisibilityWindowStart) {
        if (selectedDate.isSame(selectedVisibilityWindowStart, 'day') && visStartTime && pickStartTime) {
          if (toTime(pickStartTime).isBefore(toTime(visStartTime))) {
            return false
          }
        }
      } else if (position === 'end' && selectedPickupWindowStart && selectedVisEndDate) {
        if (selectedDate.isBefore(selectedVisEndDate, 'day')) {
          return false
        }
        if (selectedDate.isSame(selectedVisEndDate, 'day') && visEndTime && pickEndTime) {
          if (toTime(pickEndTime).isBefore(toTime(visEndTime))) {
            return false
          }
        }
        if (selectedDate.isSame(selectedPickupWindowStart, 'day') && pickStartTime && pickEndTime) {
          if (toTime(pickEndTime).isBefore(toTime(pickStartTime))) {
            return false
          }
        }
      }
    }
  }

  return true
}

export function getAndSetClickResult({
  clickRef,
  dayInfo,
  selectedVisibilityWindowStart,
  selectedPickupWindowStart,
  form,
  visibilityStartNow,
  pickupStartNow,
  selectedTimezone,
}: {
  clickRef: MutableRefObject<number>
  dayInfo: CalendarDay
  selectedVisibilityWindowStart?: Dayjs
  selectedPickupWindowStart?: Dayjs
  form: FormInstance
  visibilityStartNow?: boolean
  pickupStartNow?: boolean
  selectedTimezone?: string
}) {
  switch (clickRef.current) {
    case 0:
      form.setFieldsValue({ VisibilityWindowStartDate: dayjs(dayInfo.date) })
      clickRef.current = 1
      break
    case 1: {
      if (
        !isValidDateSelection({
          newDate: dayInfo.date,
          windowType: 'visibility',
          position: 'end',
          selectedVisibilityWindowStart,
          selectedPickupWindowStart,
          form,
        })
      ) {
        return
      }
      form.setFieldsValue({ VisibilityWindowEndDate: dayjs(dayInfo.date) })
      // Skip pickup start if "Start Now" is checked
      clickRef.current = pickupStartNow ? 3 : 2
      break
    }
    case 2:
      if (
        !isValidDateSelection({
          newDate: dayInfo.date,
          windowType: 'pickup',
          position: 'start',
          selectedVisibilityWindowStart,
          selectedPickupWindowStart,
          form,
        })
      ) {
        return
      }
      form.setFieldsValue({ PickupWindowStartDate: dayjs(dayInfo.date) })
      clickRef.current = 3
      break
    case 3: {
      if (
        !isValidDateSelection({
          newDate: dayInfo.date,
          windowType: 'pickup',
          position: 'end',
          selectedVisibilityWindowStart,
          selectedPickupWindowStart,
          form,
        })
      ) {
        return
      }

      form.setFieldsValue({ PickupWindowEndDate: dayjs(dayInfo.date) })
      clickRef.current = 4
      break
    }
    case 4:
      form.setFieldsValue({ VisibilityWindowStartDate: undefined })
      form.setFieldsValue({ VisibilityWindowEndDate: undefined })
      form.setFieldsValue({ PickupWindowStartDate: undefined })
      form.setFieldsValue({ PickupWindowEndDate: undefined })
      if (visibilityStartNow) {
        const startTime = getDefaultStartTime(selectedTimezone)
        form.setFieldsValue({ VisibilityWindowStartDate: startTime, VisibilityWindowStartTime: startTime })
      }
      if (pickupStartNow) {
        const startTime = getDefaultStartTime(selectedTimezone)
        form.setFieldsValue({ PickupWindowStartDate: startTime, PickupWindowStartTime: startTime })
      }
      // Reset to appropriate step based on StartNow checkboxes
      clickRef.current = visibilityStartNow ? 1 : 0
      break
    default:
      break
  }
}
