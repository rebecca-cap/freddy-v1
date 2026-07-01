import { CHART_COLORS } from '@constants/colors'

export const statusColor = (status?: string) => {
  switch ((status ?? '').toLowerCase()) {
    case 'accepted':
      return CHART_COLORS.success
    case 'completed':
      return CHART_COLORS.success
    case 'active':
      return 'var(--theme-color-2)'
    case 'pending':
      return CHART_COLORS.warning
    case 'scheduled':
      return CHART_COLORS.warning
    case 'remaining volume':
    case 'remaining':
      return CHART_COLORS.remaining
    case 'declined':
      return 'var(--theme-error)'
    case 'expired':
      return CHART_COLORS.labelMuted
    default:
      return CHART_COLORS.remaining
  }
}
