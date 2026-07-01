import { dateFormat } from '@components/TheArmory/helpers'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import type {
  SpecialOfferBreakdownCustomerEngagement,
  SpecialOfferBreakdownOfferInfo,
  SpecialOfferStatus,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import dayjs from '@utils/dayjs'
import type { Dayjs } from '@utils/dayjs'

export function getRemainingLabel(end: string | Date | Dayjs, now: Dayjs = dayjs()): string {
  const visEnd = dayjs(end)
  if (!visEnd.isValid()) return '—'

  // diff in minutes so sub-hour windows don't truncate to 0 and read as "Ended"
  const totalMinutes = visEnd.diff(now, 'minute')

  if (totalMinutes <= 0) return 'Ended'
  if (totalMinutes < 60) return `${totalMinutes}m remaining`

  const hours = Math.floor(totalMinutes / 60)
  if (hours < 24) return `${hours}h remaining`

  const days = Math.floor(hours / 24)
  const remHours = hours % 24
  return `${days}d ${remHours}h remaining`
}

function getStatusPalette(status: SpecialOfferStatus): { bg: string; fg: string } {
  switch (status) {
    case 'Active':
      return { bg: 'var(--theme-success)', fg: '#fff' } // green
    case 'Completed':
      return { bg: 'var(--theme-color-2)', fg: '#fff' } // blue
    default:
      return { bg: 'rgba(156,163,175,0.2)', fg: 'rgb(107,114,128)' } // gray
  }
}

export function getStatusTagStyle(status: SpecialOfferStatus): React.CSSProperties {
  const { bg, fg } = getStatusPalette(status)
  return {
    background: bg,
    color: fg,
    borderColor: fg,
    width: '80px',
    textAlign: 'center',
  }
}

export function formatDateTimeRange(
  start: Dayjs | string | Date,
  end: Dayjs | string | Date,
  fmt = dateFormat.MONTH_DATE_TIME,
  timeZoneAlias?: string | null
): string {
  const s = dayjs(start)
  const e = dayjs(end)
  if (!s.isValid() || !e.isValid()) return '—'
  const suffix = timeZoneAlias ? ` ${timeZoneAlias}` : ''
  return `${s.format(fmt)} - ${e.format(fmt)}${suffix}`
}

type ResponsesDescriptionProps = {
  offer: Pick<SpecialOfferBreakdownOfferInfo, 'TotalResponses'>
  engagement?: SpecialOfferBreakdownCustomerEngagement
  showPercent?: boolean
}

export function ResponsesDescription({ offer, engagement, showPercent = true }: ResponsesDescriptionProps) {
  const bids = offer.TotalResponses ?? 0
  const invited = engagement?.InvitedCount ?? 0
  const pct = invited > 0 ? (bids / invited) * 100 : undefined

  return (
    <Horizontal gap={10} verticalCenter style={{ alignItems: 'center' }}>
      <Texto category={'h4'}>{invited > 0 ? `${bids}/${invited}` : `${bids}`}</Texto>
      {showPercent && invited > 0 && pct != null && (
        <Texto category={'h4'} className='ml-3'>
          {fmt.decimal(pct, 2)}%
        </Texto>
      )}
    </Horizontal>
  )
}

export function getResponsePercent(
  offer: Pick<SpecialOfferBreakdownOfferInfo, 'TotalResponses'>,
  engagement?: SpecialOfferBreakdownCustomerEngagement
): number | null {
  const bids = offer.TotalResponses ?? 0
  const invited = engagement?.InvitedCount ?? 0
  if (invited <= 0) return bids === 0 ? 0 : null // if no invited, 0 -> red; >0 -> treat as "unknown"
  return Math.round((bids / invited) * 100)
}

export function getResponsesAccentColor(pct: number | null): string {
  if (pct == null) return ''

  if (pct === 0) return 'var(--theme-error)'
  if (pct >= 100) return 'var(--theme-success)'
  return 'var(--theme-warning)'
}
