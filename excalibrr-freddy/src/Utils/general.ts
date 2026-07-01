import _ from 'lodash'
import moment from 'moment'

// python API digest methods
export function titleCase(string: string) {
  const words = string.toLowerCase().split('_')
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1)
  }
  return words.join(' ')
}

export function addCommasToNumber(value: number, toFixed: number = 0) {
  if (!value && value !== 0) {
    return
  }
  return value.toLocaleString('en-US', {
    minimumFractionDigits: toFixed,
    maximumFractionDigits: toFixed,
  })
}

// antd column config generator method
// This function is getting the ts-ignore escape hatch treatment because honestly it doesn't make any sense.
export function antDColumns(
  data: any,
  overrides: any = {},
  ignoredColumns: any[] = [],
  extraColumn: any[] = [],
  columnOrder: any[] = [], // sets the order for all of the columns
  explicitColumns: any[] = [] // if this has any values, only the passed in columns will be displayed
) {
  if (!data || data.length === 0) {
    return []
  }

  const ignore = (ignoredColumns || []).concat(['key'])
  const firstRow = data[0]
  const cols = Object.keys(firstRow)
    .filter((k) => !ignore.includes(k))
    .filter((k) => explicitColumns.length === 0 || explicitColumns.includes(k))
    .map((k, i) => ({
      title: titleCase(k),
      dataIndex: k,
      key: i,
      ...overrides[k],
    }))
    // @ts-ignore
    .concat(extraColumns)
    .map((o) => {
      const orderedIndex = columnOrder.indexOf(o.dataIndex)
      return { ...o, order: orderedIndex > -1 ? orderedIndex : undefined }
    })
  // undefined compares greater than defined, so they go to the end of the list
  return _.orderBy(cols, 'order')
}

export const translateDateToReadable = (dateString: string) => {
  const duration = moment.duration(moment(dateString).diff(moment()))
  return `${duration.days()}d ${duration.hours()}h`
}
export const getNextWeekdayDate = (dayIndex: number) => {
  // const dayIndex = 4 // for Thursday
  const today = moment().isoWeekday()

  // if we haven't yet passed the day of the week that I need:
  if (today <= dayIndex) {
    // then just give me this week's instance of that day
    return moment().isoWeekday(dayIndex)
  }
  // otherwise, give me *next week's* instance of that same day
  return moment().add(1, 'weeks').isoWeekday(dayIndex)
}

export const formatDateStringToTime = (dateString: string) => {
  return moment(dateString).local().format('h:mm A')
}

export const formatDateStringToReadable = (dateString: string) => {
  return moment(dateString).local().format('M/DD/YYYY, h:mm A')
}

export const ReadableDifference = (
  dateTo: string | Date,
  dateFrom = moment().local()
) => {
  const runoutDate = moment(dateTo).local()
  const seconds = Math.abs(runoutDate.diff(dateFrom, 'seconds'))
  return humanReadableSecondDifferenceFromToday(seconds)
}

export const humanReadableSecondDifferenceFromToday = (seconds: number) => {
  const numdays = Math.floor((seconds % 31536000) / 86400)
  const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600)
  const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60)

  const daysString = numdays !== 0 ? `${Math.abs(numdays)}d ` : ''
  const hoursString = numhours !== 0 ? `${Math.abs(numhours)}h ` : ''
  const minutesString =
    numminutes !== 0 && (numdays === 0 || numdays === -1)
      ? `${Math.abs(numminutes)}m `
      : ''
  const agoString = numdays < 0 || numhours < 0 || numminutes < 0 ? 'ago' : ''

  if (agoString !== '' && numdays === -1) {
    return `${hoursString}${minutesString}${agoString}`
  }

  return `${daysString}${hoursString}${minutesString}${agoString}`
}

export const translateDateStringFromToday = (dateString: string) => {
  if (dateString) {
    const parts = dateString.split('-')
    // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
    // January - 0, February - 1, etc.
    // @ts-ignore - TS doesn't think this overload with string parts is valid, but I'm not changing anything here :)
    const dateVersion = new Date(parts[0], parts[1] - 1, parts[2])

    const today = new Date()

    // handle overflow here
    dateVersion.setHours(today.getHours())
    dateVersion.setMinutes(today.getMinutes())
    dateVersion.setSeconds(today.getSeconds())

    return dateVersion
  }
}
export const translateDateStringToToday = (
  dateString: string,
  isPm = false
) => {
  const pmAdjust = isPm ? 12 : 0
  if (dateString) {
    const dateVersion = new Date(dateString)
    const today = new Date()
    let hoursAdjust = dateVersion.getHours() - pmAdjust
    // handle overflow here
    if (hoursAdjust < 0) {
      hoursAdjust += 24
    }

    today.setHours(hoursAdjust)
    today.setMinutes(dateVersion.getMinutes())
    today.setSeconds(dateVersion.getSeconds())

    return today.toISOString()
  }
}

export const sortByColumn = <T>(
  array: T[],
  sortByAccessor: any,
  sortDirection: any,
  secondColumnAccessor: any
) => {
  const arrayCopy = array.slice()
  return _.orderBy(
    arrayCopy,
    [sortByAccessor, secondColumnAccessor],
    [sortDirection, 'asc']
  )
}

export const getElapsedTime = (
  dateString: string,
  relativeTimeCutoff: number,
  relativeTimeUnits: moment.unitOfTime.Diff,
  nonRelativeDateFormat: string
) => {
  moment.locale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: 's',
      m: '1 min',
      mm: '%d min',
      h: '1 h',
      hh: '%d h',
      d: '1 d',
      dd: '%d d',
      M: '1 mth',
      MM: '%d mth',
      y: '1 y',
      yy: '%d y',
    },
  })
  const date = moment(dateString)
  const elapsedSeconds = moment(dateString).diff(moment(), relativeTimeUnits)
  if (Math.abs(elapsedSeconds) <= relativeTimeCutoff) {
    return date.fromNow()
  }
  return date.format(nonRelativeDateFormat)
}

export const inBrowser = () => typeof window !== 'undefined'

export const getStoreValue = (key: string) => {
  try {
    const inStore = window?.localStorage.getItem(key)
    if (inStore) return JSON.parse(inStore)
    return null
  } catch (error) {
    return null
  }
}

export const setStoreValue = <T>(key: string, value: T) =>
  window?.localStorage.setItem(key, JSON.stringify(value))

export const clearStoreValue = (key: string) =>
  window?.localStorage.removeItem(key)

export const isDefined = (v: any) => typeof v !== 'undefined' && v !== null

export const sortListByKeys = <T>(
  list: T[],
  keys: string[],
  sortProperty: keyof T
) => {
  return list.sort((a, b) => {
    return (
      keys.indexOf(String(a[sortProperty])) -
      keys.indexOf(String(b[sortProperty]))
    )
  })
}

export function generateRandomString(length: number): string {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}
