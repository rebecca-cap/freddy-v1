// Cell-selection constraint (Wireframe 5) — pure eligibility logic.
// Mirrors the PRD §5 decision table. No DOM required.

import { describe, it, expect } from 'vitest'

import { isCellEligible, getConstraintHint } from '../scoutScope'
import type { ContextChip } from '../../types'

// Field shortcuts (see SCOPE_FIELDS in scoutScope.ts):
//   benchmark: Cost, StrategyBase.Value
//   proposed:  ProposedPrice, Adjustment, ...
//   margin:    Margin, TCIValue
const F = {
  cost: 'Cost', // benchmark
  benchAlt: 'StrategyBase.Value', // benchmark (different field, same group)
  proposed: 'ProposedPrice', // proposed
  margin: 'Margin', // margin
  identity: 'CustomerName', // identity
}

function cellChip(rowId: string, field: string): ContextChip {
  return {
    id: ['cell', rowId, field].join('::'),
    kind: 'cell',
    rowId,
    columnId: field,
    label: `${rowId} · ${field}`,
    explicit: true,
  }
}

function rowChip(rowId: string): ContextChip {
  return { id: ['row', rowId].join('::'), kind: 'row', rowId, label: rowId }
}

describe('isCellEligible', () => {
  it('zero cell chips → every data cell eligible', () => {
    expect(isCellEligible('3', F.cost, [])).toBe(true)
    expect(isCellEligible('5', F.margin, [])).toBe(true)
  })

  it('identity cells are always eligible regardless of state', () => {
    const ctx = [cellChip('3', F.cost), cellChip('3', F.proposed)]
    expect(isCellEligible('9', F.identity, ctx)).toBe(true)
    expect(isCellEligible('3', F.identity, [])).toBe(true)
  })

  describe('one cell chip at (R3, benchmark)', () => {
    const ctx = [cellChip('3', F.cost)]

    it('same row is eligible', () => {
      expect(isCellEligible('3', F.proposed, ctx)).toBe(true)
      expect(isCellEligible('3', F.margin, ctx)).toBe(true)
    })

    it('same column (scope group) is eligible — even a different field', () => {
      expect(isCellEligible('5', F.cost, ctx)).toBe(true)
      expect(isCellEligible('5', F.benchAlt, ctx)).toBe(true) // both benchmark
    })

    it('diagonal is blocked', () => {
      expect(isCellEligible('5', F.proposed, ctx)).toBe(false)
      expect(isCellEligible('7', F.margin, ctx)).toBe(false)
    })

    it('the picked cell itself stays eligible (click removes it)', () => {
      expect(isCellEligible('3', F.cost, ctx)).toBe(true)
    })
  })

  describe('2+ cell chips sharing row R3 (axis = row)', () => {
    const ctx = [cellChip('3', F.cost), cellChip('3', F.proposed)]

    it('data cells in R3 are eligible', () => {
      expect(isCellEligible('3', F.margin, ctx)).toBe(true)
    })

    it('every other row is blocked, including same-column cells', () => {
      expect(isCellEligible('5', F.cost, ctx)).toBe(false) // same column, wrong row
      expect(isCellEligible('5', F.proposed, ctx)).toBe(false)
    })
  })

  describe('2+ cell chips sharing column benchmark (axis = column)', () => {
    const ctx = [cellChip('3', F.cost), cellChip('5', F.benchAlt)]

    it('benchmark cells on any row are eligible (scope-group match)', () => {
      expect(isCellEligible('7', F.cost, ctx)).toBe(true)
      expect(isCellEligible('9', F.benchAlt, ctx)).toBe(true)
    })

    it('other columns are blocked, including cells on a chip row', () => {
      expect(isCellEligible('3', F.proposed, ctx)).toBe(false) // chip row, wrong column
      expect(isCellEligible('7', F.margin, ctx)).toBe(false)
    })
  })

  it('row chips do not lock the axis', () => {
    // One cell chip + a whole-row chip elsewhere → still "same row OR column".
    const ctx = [cellChip('3', F.cost), rowChip('5')]
    expect(isCellEligible('3', F.proposed, ctx)).toBe(true) // same row as cell chip
    expect(isCellEligible('8', F.cost, ctx)).toBe(true) // same column as cell chip
    expect(isCellEligible('8', F.margin, ctx)).toBe(false) // diagonal
  })

  it('coerces numeric rowId against string chip rowId', () => {
    const ctx = [cellChip('3', F.cost)]
    expect(isCellEligible(3, F.proposed, ctx)).toBe(true)
    expect(isCellEligible(5, F.cost, ctx)).toBe(true)
    expect(isCellEligible(5, F.proposed, ctx)).toBe(false)
  })
})

describe('getConstraintHint', () => {
  it('returns null with no cell chips', () => {
    expect(getConstraintHint([])).toBeNull()
    expect(getConstraintHint([rowChip('3')])).toBeNull()
  })

  it('returns the row-or-column hint with one cell chip', () => {
    expect(getConstraintHint([cellChip('3', F.cost)])).toBe(
      'Same row or column as the picked cell',
    )
  })

  it('locks to row when 2+ chips share a row', () => {
    expect(
      getConstraintHint([cellChip('3', F.cost), cellChip('3', F.proposed)]),
    ).toBe('Locked to this row')
  })

  it('locks to column when 2+ chips share a scope group', () => {
    expect(
      getConstraintHint([cellChip('3', F.cost), cellChip('5', F.benchAlt)]),
    ).toBe('Locked to this column')
  })
})
