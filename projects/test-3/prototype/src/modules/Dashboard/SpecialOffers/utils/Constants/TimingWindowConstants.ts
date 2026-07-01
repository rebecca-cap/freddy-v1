import moment from 'moment'

export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const defaultStartTime = '08:00:00'
export const defaultEndTime = '17:00:00'

export function getDefaultStartTime(): moment.Moment {
  const now = moment()
  const eightAM = moment().hours(8).minutes(0).seconds(0).milliseconds(0)

  // If before 8 AM, return 8 AM
  if (now.isBefore(eightAM)) {
    return eightAM
  }

  // After 8 AM: round to nearest hour, then add 1 hour
  // If minutes >= 30, round up; otherwise round down
  const nearestHour = now.minutes() >= 30 ? now.clone().add(1, 'hour').startOf('hour') : now.clone().startOf('hour')

  return nearestHour.add(1, 'hour')
}

export function getDefaultEndTime(): moment.Moment {
  const fivePM = moment(defaultEndTime)
  const startTime = getDefaultStartTime()

  if (fivePM.isAfter(startTime)) {
    return fivePM
  }

  return startTime.clone().add(1, 'hour')
}
export const timingWindowList = [
  {
    title: 'Visibility Window',
    description: 'When customers can see and bid on your deal',
    startDateName: 'VisibilityWindowStartDate',
    startTimeName: 'VisibilityWindowStartTime',
    endDateName: 'VisibilityWindowEndDate',
    endTimeName: 'VisibilityWindowEndTime',
  },
  {
    title: 'Pickup Window',
    description: 'When customers can pickup their product',
    startDateName: 'PickupWindowStartDate',
    startTimeName: 'PickupWindowStartTime',
    endDateName: 'PickupWindowEndDate',
    endTimeName: 'PickupWindowEndTime',
  },
]
