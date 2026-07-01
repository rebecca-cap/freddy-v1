import type { Dayjs } from '@utils/dayjs'
import dayjs from '@utils/dayjs'

export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function getDefaultStartTime(timezone?: string): Dayjs {
  const base = timezone ? dayjs().tz(timezone) : dayjs()
  return base.add(2, 'minutes').second(0).millisecond(0)
}

export function getDefaultEndTime(timezone?: string): Dayjs {
  const base = timezone ? dayjs().tz(timezone) : dayjs()
  return base.hour(23).minute(59).second(0).millisecond(0)
}
export const timingWindowList = [
  {
    title: 'Visibility Window',
    description: 'When customers can see and bid on your deal',
    startNowFieldName: 'VisibilityStartNow',
    startDateName: 'VisibilityWindowStartDate',
    startTimeName: 'VisibilityWindowStartTime',
    endDateName: 'VisibilityWindowEndDate',
    endTimeName: 'VisibilityWindowEndTime',
  },
  {
    title: 'Pickup Window',
    description: 'When customers can pickup their product',
    startNowFieldName: 'PickupStartNow',
    startDateName: 'PickupWindowStartDate',
    startTimeName: 'PickupWindowStartTime',
    endDateName: 'PickupWindowEndDate',
    endTimeName: 'PickupWindowEndTime',
  },
]
