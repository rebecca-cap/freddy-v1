// Get credit status display text
export const getCreditStatusText = (cvId: number | null | undefined, metadata) => {
  if (!cvId) return 'No value set'
  return metadata?.Data?.CreditStatusList?.find((item) => item.Value === cvId.toString())?.Text || 'No value set'
}

export const getCreditStatusOverrideText = (cvId: number | null | undefined, metadata) => {
  if (!cvId) return 'No value set'
  return metadata?.Data?.CreditStatusList?.find((item) => item.Value === cvId.toString())?.Text || 'No value set'
}

export const CREDIT_STATUS_INFO = [
  {
    title: 'No value set',
    description:
      'No declared credit status applied. Gravitate calculates credit status based on integrated credit limit and thresholds. If no credit limit integrated, no purchase limitations apply.',
    color: 'var(--credit-text-secondary)',
  },
  {
    title: 'Good Standing',
    description: 'Credit monitoring active. Orders that exceed credit hold limits prevented.',
    color: 'var(--credit-status-success)',
  },
  {
    title: 'Credit Watch',
    description:
      'Credit watch threshold surpassed, which presents a warning state to users but does not impact purchasing ability.',
    color: 'var(--credit-status-warning)',
  },
  {
    title: 'Credit Hold',
    description:
      'Credit hold threshold surpassed, which presents a warning state to users and prevents purchasing ability.',
    color: 'var(--credit-status-danger)',
  },
  {
    title: 'Not Applicable',
    description: 'Credit enforcement disabled. Counterparty may purchase without limitation.',
    color: 'var(--credit-text-secondary)',
  },
]

export const CREDIT_STATUS_INFO_MAP: Record<string, (typeof CREDIT_STATUS_INFO)[number]> = CREDIT_STATUS_INFO.reduce(
  (acc, item) => {
    acc[item.title] = item
    return acc
  },
  {} as Record<string, (typeof CREDIT_STATUS_INFO)[number]>
)
