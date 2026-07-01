import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: ReactNode
  /** One concise line under the title. Keep it plain — it explains, it doesn't sell. */
  subtitle?: ReactNode
  /** Optional right-aligned slot (e.g. a status tag or a "Switch to…" link). */
  extra?: ReactNode
}

/**
 * The one section-header treatment for the quick-create flow: an h4 title with an optional
 * single muted subtitle line, and an optional right-aligned slot. Every major section (product,
 * price formula, customers, timeframe, timing) uses this so they all read at the same level —
 * replacing the old mix of tiny labels, uppercase grid headers, and oversized headings.
 */
export function SectionHeader({ title, subtitle, extra }: SectionHeaderProps) {
  return (
    // overflow:visible on both — excalibrr Vertical/Horizontal default to overflow:hidden, which
    // clips the bottom few px of the subtitle (the title column sizes ~5px short of its content).
    <Horizontal
      justifyContent={'space-between'}
      style={{ flexWrap: 'wrap', alignItems: 'flex-start', gap: 16, overflow: 'visible' }}
    >
      <Vertical flex={'0 1 auto'} style={{ gap: 4, overflow: 'visible' }}>
        <Texto category={'h4'} className={'text-18'}>
          {title}
        </Texto>
        {subtitle && (
          <Texto className={'text-14'} appearance={'medium'}>
            {subtitle}
          </Texto>
        )}
      </Vertical>
      {extra}
    </Horizontal>
  )
}
