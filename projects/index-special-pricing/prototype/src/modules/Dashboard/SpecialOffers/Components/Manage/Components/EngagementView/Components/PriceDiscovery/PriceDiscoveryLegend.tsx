import { CHART_COLORS } from '@constants/colors'
import { Horizontal } from '@gravitate-js/excalibrr'
import { useMemo } from 'react'

export const renderCustomPriceDiscoveryLegend = (bidPrices) => {
  const getRangeString = useMemo(() => {
    const prices = (bidPrices ?? []).map((d) => d?.Price)
    if (prices.length === 0) return 'Range: —'

    const min = Math.min(...prices)
    const max = Math.max(...prices)

    return `Range: ${fmt.currency(min, 4)} - ${fmt.currency(max, 4)}`
  }, [bidPrices])

  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 8, justifyContent: 'space-between', width: '100%' }}>
      <Horizontal gap={20}>
        <LegendItem color={CHART_COLORS.success} label='Accepted' />
        <LegendItem color={CHART_COLORS.warning} label='Pending' />
        <LegendItem color='var(--theme-error)' label='Declined' />
      </Horizontal>

      <Horizontal
        style={{
          alignItems: 'center',
          gap: 6,
          fontSize: 14,
        }}
      >
        {getRangeString}
      </Horizontal>
    </div>
  )
}

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <span style={{ width: 12, height: 12, background: color, display: 'inline-block', borderRadius: 2 }} />
    <span style={{ fontSize: 12 }}>{label}</span>
  </div>
)
