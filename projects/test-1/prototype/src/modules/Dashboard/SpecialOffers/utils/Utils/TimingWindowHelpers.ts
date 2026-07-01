import { dateFormat } from '@components/TheArmory/helpers'
import { FormInstance } from 'antd/lib/form/Form'
import moment from 'moment/moment'
import { MutableRefObject } from 'react'

export interface DisabledTimeConfig {
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
}

/**
 * Creates a disabled time config that disables past hours/minutes when the date is today.
 * Returns an empty config if the date is not today or is undefined.
 */
export function createDisabledTimeForDate(dateValue: moment.Moment | undefined): DisabledTimeConfig {
  if (!dateValue) {
    return {}
  }

  const isToday = moment(dateValue).isSame(moment(), 'day')
  if (!isToday) {
    return {}
  }

  const now = moment()
  return {
    disabledHours: () => {
      const hours: number[] = []
      for (let i = 0; i < now.hours(); i++) {
        hours.push(i)
      }
      return hours
    },
    disabledMinutes: (selectedHour: number) => {
      if (selectedHour === now.hours()) {
        const minutes: number[] = []
        for (let i = 0; i <= now.minutes(); i++) {
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
  const startOfMonth = currentDate.clone().startOf('month')
  const endOfMonth = currentDate.clone().endOf('month')
  const startOfWeek = startOfMonth.clone().startOf('week')
  const endOfWeek = endOfMonth.clone().endOf('week')

  const days: CalendarDay[] = []
  const current = startOfWeek.clone()

  while (current.isSameOrBefore(endOfWeek)) {
    days.push({
      date: current.format(dateFormat.DATE_SLASH),
      day: current.date(),
      isCurrentMonth: current.isSame(currentDate, 'month'),
      isToday: current.isSame(moment(), 'day'),
      isPast: current.isBefore(moment(), 'day'),
    })
    current.add(1, 'day')
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
  selectedVisibilityWindowStart?: moment.Moment
  selectedPickupWindowStart?: moment.Moment
  form?: FormInstance
}): boolean {
  const selectedDate = moment(newDate)
  if (form) {
    const visStartTime = form.getFieldValue('VisibilityWindowStartTime')
    const visEndTime = form.getFieldValue('VisibilityWindowEndTime')
    const pickStartTime = form.getFieldValue('PickupWindowStartTime')
    const pickEndTime = form.getFieldValue('PickupWindowEndTime')
    const selectedVisEndDate = form.getFieldValue('VisibilityWindowEndDate')

    if (windowType === 'visibility' && position === 'end' && selectedVisibilityWindowStart) {
      if (selectedDate.isSame(selectedVisibilityWindowStart, 'day') && visStartTime && visEndTime) {
        if (moment(visEndTime, 'HH:mm:ss').isBefore(moment(visStartTime, 'HH:mm:ss'))) {
          return false
        }
      }
    } else if (windowType === 'pickup') {
      if (position === 'start' && selectedVisibilityWindowStart) {
        if (selectedDate.isSame(selectedVisibilityWindowStart, 'day') && visStartTime && pickStartTime) {
          if (moment(pickStartTime, 'HH:mm:ss').isBefore(moment(visStartTime, 'HH:mm:ss'))) {
            return false
          }
        }
      } else if (position === 'end' && selectedPickupWindowStart && selectedVisEndDate) {
        if (selectedDate.isBefore(selectedVisEndDate, 'day')) {
          return false
        }
        if (selectedDate.isSame(selectedVisEndDate, 'day') && visEndTime && pickEndTime) {
          if (moment(pickEndTime, 'HH:mm:ss').isBefore(moment(visEndTime, 'HH:mm:ss'))) {
            return false
          }
        }
        if (selectedDate.isSame(selectedPickupWindowStart, 'day') && pickStartTime && pickEndTime) {
          if (moment(pickEndTime, 'HH:mm:ss').isBefore(moment(pickStartTime, 'HH:mm:ss'))) {
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
}: {
  clickRef: MutableRefObject<number>
  dayInfo: CalendarDay
  selectedVisibilityWindowStart?: moment.Moment
  selectedPickupWindowStart?: moment.Moment
  form: FormInstance
}) {
  switch (clickRef.current) {
    case 0:
      form.setFieldsValue({ VisibilityWindowStartDate: moment(dayInfo.date) })
      clickRef.current = 1
      break
    case 1: {
      if (
        !isValidDateSelection(
          dayInfo.date,
          'visibility',
          'end',
          selectedVisibilityWindowStart,
          selectedPickupWindowStart
        )
      ) {
        return
      }
      form.setFieldsValue({ VisibilityWindowEndDate: moment(dayInfo.date) })
      clickRef.current = 2
      break
    }
    case 2:
      if (
        !isValidDateSelection(dayInfo.date, 'pickup', 'start', selectedVisibilityWindowStart, selectedPickupWindowStart)
      ) {
        return
      }
      form.setFieldsValue({ PickupWindowStartDate: moment(dayInfo.date) })
      clickRef.current = 3
      break
    case 3: {
      if (
        !isValidDateSelection(dayInfo.date, 'pickup', 'end', selectedVisibilityWindowStart, selectedPickupWindowStart)
      ) {
        return
      }

      form.setFieldsValue({ PickupWindowEndDate: moment(dayInfo.date) })
      clickRef.current = 4
      break
    }
    case 4:
      form.setFieldsValue({ VisibilityWindowStartDate: undefined })
      form.setFieldsValue({ VisibilityWindowEndDate: undefined })
      form.setFieldsValue({ PickupWindowStartDate: undefined })
      form.setFieldsValue({ PickupWindowEndDate: undefined })
      clickRef.current = 0
      break
    default:
      break
  }
}
