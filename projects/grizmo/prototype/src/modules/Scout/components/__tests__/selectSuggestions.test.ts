import { describe, expect, it } from 'vitest'

import { selectSuggestions } from '../ScoutChips'
import type { ContextChip } from '../../types'

const cell = (rowId: string, columnId: string): ContextChip => ({
  id: `cell-${rowId}-${columnId}`,
  kind: 'cell',
  label: `${columnId}`,
  rowId,
  columnId,
})

const row = (rowId: string): ContextChip => ({
  id: `row-${rowId}`,
  kind: 'row',
  label: 'row',
  rowId,
})

describe('selectSuggestions', () => {
  it('shows aggregate starters when nothing is selected', () => {
    const { label, chipIds } = selectSuggestions([])
    expect(label).toBe('Ask about all your rows')
    expect(chipIds).toEqual(['agg-flagged', 'agg-top', 'agg-move', 'agg-sinclair-opis-rank'])
  })

  it('maps a benchmark cell (Cost) to benchmark-specific starters', () => {
    const { label, chipIds } = selectSuggestions([cell('r1', 'Cost')])
    expect(label).toBe('Ask about this cell')
    expect(chipIds).toEqual(['bench-why', 'bench-fresh', 'bench-trend'])
  })

  it('maps a proposed cell (ProposedPrice) to proposed starters', () => {
    const { chipIds } = selectSuggestions([cell('r1', 'ProposedPrice')])
    expect(chipIds).toEqual(['prop-why', 'prop-whatif'])
  })

  it('maps a margin cell (Margin) to margin starters', () => {
    const { chipIds } = selectSuggestions([cell('r1', 'Margin')])
    expect(chipIds).toEqual(['marg-trend', 'prop-whatif'])
  })

  it('falls back to row-level starters for an ungrouped column', () => {
    const { label, chipIds } = selectSuggestions([
      cell('r1', 'PriorQuotePeriod.LastCost'),
    ])
    expect(label).toBe('Ask about this cell')
    expect(chipIds).toEqual(['prop-why', 'prop-whatif', 'marg-trend', 'bench-why'])
  })

  it('uses "this row" label for a whole-row chip', () => {
    const { label, chipIds } = selectSuggestions([row('r1')])
    expect(label).toBe('Ask about this row')
    expect(chipIds).toEqual(['prop-why', 'prop-whatif', 'marg-trend', 'bench-why'])
  })

  it('unions groups and caps at 4 for a multi-cell selection', () => {
    const { label, chipIds } = selectSuggestions([
      cell('r1', 'Cost'),
      cell('r1', 'ProposedPrice'),
    ])
    expect(label).toBe('Ask about your selection')
    expect(chipIds).toHaveLength(4)
    // benchmark chips first, then proposed, deduped, capped at 4
    expect(chipIds).toEqual(['bench-why', 'bench-fresh', 'bench-trend', 'prop-why'])
  })
})
