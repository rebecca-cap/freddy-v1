export function formatTimeSpanDHM(ts?: string | null, showSeconds = false): string {
  if (!ts) return ''

  const m = ts.match(/^(-)?(?:(\d+)\.)?(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/)
  if (!m) return ts

  const isNeg = !!m[1]
  const days = parseInt(m[2] ?? '0', 10)
  const hours = parseInt(m[3] ?? '0', 10)
  const minutes = parseInt(m[4] ?? '0', 10)
  const seconds = parseInt(m[5] ?? '0', 10)

  const parts: string[] = []

  if (days) parts.push(`${days}d`)
  parts.push(`${hours}h`)

  if (showSeconds) {
    parts.push(`${minutes}m`)
    parts.push(`${seconds}s`)
  } else {
    if (minutes) parts.push(`${minutes}m`)
  }

  const out = parts.join(' ')
  return isNeg ? `-${out}` : out
}

export function timeSpanToTotalMinutes(ts?: string | null): number | null {
  if (!ts) return null
  const m = ts.match(/^(-)?(?:(\d+)\.)?(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/)
  if (!m) return null
  const sign = m[1] ? -1 : 1
  const days = parseInt(m[2] ?? '0', 10)
  const hours = parseInt(m[3] ?? '0', 10)
  const minutes = parseInt(m[4] ?? '0', 10)
  const seconds = parseInt(m[5] ?? '0', 10)
  const totalSeconds = ((days * 24 + hours) * 60 + minutes) * 60 + seconds
  return sign * Math.trunc(totalSeconds / 60) // minutes
}

export function timeSpanHoursLeft(ts?: string | null): number | null {
  if (!ts) return null
  const m = ts.match(/^(-)?(?:(\d+)\.)?(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/)
  if (!m) return null
  const sign = m[1] ? -1 : 1
  const days = parseInt(m[2] ?? '0', 10)
  const hours = parseInt(m[3] ?? '0', 10)
  const minutes = parseInt(m[4] ?? '0', 10)
  const seconds = parseInt(m[5] ?? '0', 10)

  return sign * (days * 24 + hours + minutes / 60 + seconds / 3600)
}

export function isWithin24Hours(ts?: string | null): boolean {
  const hrs = timeSpanHoursLeft(ts)
  if (hrs == null) return false
  return hrs <= 24
}
