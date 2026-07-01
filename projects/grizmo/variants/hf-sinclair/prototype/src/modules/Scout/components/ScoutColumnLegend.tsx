// Phase 4.2 — compact color-legend strip rendered in the QuoteBook toolbar.
//
// Visible ONLY when state.open is true. Mirrors the wireframe legend (5
// scope groups + 1 "No color · Whole row" entry). Lives outside any
// .scout-scope wrapper because it sits inside the host app's toolbar, so
// it stamps the class on its root for token access.

import { useScout } from '../state/ScoutContext'

import './ScoutColumnLegend.css'

interface LegendEntry {
  className: string
  label: string
}

const LEGEND_ENTRIES: ReadonlyArray<LegendEntry> = [
  { className: 'scout-legend__sw--row-none',  label: 'Whole row' },
  { className: 'scout-legend__sw--benchmark', label: 'Cost' },
  { className: 'scout-legend__sw--proposed',  label: 'Proposed' },
  { className: 'scout-legend__sw--margin',    label: 'Margin' },
  { className: 'scout-legend__sw--delta',     label: 'Change vs prior day' },
  { className: 'scout-legend__sw--flags',     label: 'Flags' },
]

export function ScoutColumnLegend() {
  const { state } = useScout()
  if (!state.open) return null
  return (
    <div className='scout-scope scout-legend' aria-label='Cell color legend'>
      <span className='scout-legend__hint'>Click any cell to focus Scout on it</span>
      {LEGEND_ENTRIES.map((e) => (
        <span key={e.label} className='scout-legend__row'>
          <span className={`scout-legend__sw ${e.className}`} aria-hidden />
          <span className='scout-legend__label'>{e.label}</span>
        </span>
      ))}
    </div>
  )
}
