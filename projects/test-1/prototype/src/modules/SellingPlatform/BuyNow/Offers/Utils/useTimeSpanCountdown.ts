import { useEffect, useMemo, useRef, useState } from 'react'

const parseTimespanToSeconds = (ts?: string | null): number => {
  if (!ts) return 0
  const m = ts.match(/^(-)?(?:(\d+)\.)?(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/)
  if (!m) return 0
  const sign = m[1] ? -1 : 1
  const days = parseInt(m[2] ?? '0', 10)
  const hours = parseInt(m[3] ?? '0', 10)
  const minutes = parseInt(m[4] ?? '0', 10)
  const seconds = parseInt(m[5] ?? '0', 10)
  const total = days * 86400 + hours * 3600 + minutes * 60 + seconds
  return Math.max(0, sign * total)
}

const formatSecondsDHM = (totalSeconds: number, showSeconds = false): string => {
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const parts: string[] = []
  if (days) parts.push(`${days}d`)
  parts.push(`${hours}h`)
  if (showSeconds) {
    parts.push(`${minutes}m`)
    parts.push(`${seconds}s`)
  } else {
    if (minutes) parts.push(`${minutes}m`)
  }
  return parts.join(' ')
}

export function useTimespanCountdown(
  initialTimespan: string | null | undefined,
  opts?: { showSeconds?: boolean; onExpire?: () => void; tickMs?: number }
) {
  const { showSeconds = true, onExpire, tickMs = 1000 } = opts || {}
  const [remaining, setRemaining] = useState(() => parseTimespanToSeconds(initialTimespan))
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  // reset when initial value changes
  useEffect(() => {
    setRemaining(parseTimespanToSeconds(initialTimespan))
  }, [initialTimespan])

  // tick down
  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          clearInterval(id)
          onExpireRef.current?.()
          return 0
        }
        return s - 1
      })
    }, tickMs)
    return () => clearInterval(id)
  }, [remaining, tickMs])

  const text = useMemo(() => formatSecondsDHM(remaining, showSeconds), [remaining, showSeconds])

  return { remaining, text, isExpired: remaining <= 0 }
}
