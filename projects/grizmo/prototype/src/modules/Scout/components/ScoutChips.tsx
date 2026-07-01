// ScoutChips — closed-prompt suggestion chips for the pre-conversation state.
//
// Two modes, chosen automatically from `state.contexts`:
//   • No contexts → whole-book AGGREGATE starters ("Ask about all your rows").
//   • Contexts present (cells / row selected) → scope-appropriate starters for
//     the selected cell's scope group (benchmark / proposed / margin / …), so a
//     selection gets questions about THAT data instead of aggregates. This is
//     why ScoutPanel renders <ScoutChips standalone /> once a cell is picked.
//
// Each chip is { id, label, promptId } where promptId matches a scenario seeded
// in `services/fakeLlm.ts`. Clicking routes through `useScoutAsk`.
//
// Per the design-system policy, the chip primitive is Excalibrr's `GraviButton`
// with `shape="round"` + `size="small"`.

import { GraviButton } from '@gravitate-js/excalibrr'

import { columnKeyForField, type ScoutScopeGroup } from '../grid/scoutScope'
import { useScout } from '../state/ScoutContext'
import { useScoutAsk } from '../state/useScoutAsk'
import type { ContextChip } from '../types'

import './ScoutChips.css'

interface Chip {
  id: string
  label: string
  promptId: string
}

// Chip catalog keyed by promptId (labels track the SCENARIOS map in fakeLlm).
const CHIP: Record<string, Chip> = {
  'agg-flagged': { id: 'agg-flagged', label: 'Why are 23 rows flagged?', promptId: 'agg-flagged' },
  'agg-top': { id: 'agg-top', label: 'Where am I leaving margin?', promptId: 'agg-top' },
  'agg-move': { id: 'agg-move', label: "How did today's market move affect us?", promptId: 'agg-move' },
  'agg-unpub': { id: 'agg-unpub', label: 'Why are 412 rows unpublished?', promptId: 'agg-unpub' },
  'agg-sinclair-opis-rank': { id: 'agg-sinclair-opis-rank', label: 'Where does Sinclair rank vs OPIS Unbranded?', promptId: 'agg-sinclair-opis-rank' },
  'bench-why': { id: 'bench-why', label: 'Why this cost?', promptId: 'bench-why' },
  'bench-fresh': { id: 'bench-fresh', label: 'How fresh is the benchmark?', promptId: 'bench-fresh' },
  'bench-trend': { id: 'bench-trend', label: '7-day benchmark trend', promptId: 'bench-trend' },
  'prop-why': { id: 'prop-why', label: 'Why this proposed price?', promptId: 'prop-why' },
  'prop-whatif': { id: 'prop-whatif', label: 'What if I lift margin $0.0050/gal?', promptId: 'prop-whatif' },
  'marg-trend': { id: 'marg-trend', label: '30-day margin trend', promptId: 'marg-trend' },
}

const AGGREGATE_CHIPS = ['agg-flagged', 'agg-top', 'agg-move', 'agg-sinclair-opis-rank']

// Scope-appropriate starters keyed by the cell's scope group, so a selection
// gets questions about THAT data rather than whole-book aggregates.
const GROUP_CHIPS: Record<ScoutScopeGroup, string[]> = {
  benchmark: ['bench-why', 'bench-fresh', 'bench-trend'],
  proposed: ['prop-why', 'prop-whatif'],
  margin: ['marg-trend', 'prop-whatif'],
  delta: ['prop-why', 'marg-trend'],
  flags: ['prop-why', 'marg-trend'],
}

// Whole-row (or ungrouped) selection: a balanced mix of row-level questions.
const ROW_CHIPS = ['prop-why', 'prop-whatif', 'marg-trend', 'bench-why']

interface Suggestion {
  label: string
  chipIds: string[]
}

const dedupe = (ids: string[]): string[] => [...new Set(ids)]

// Maps the current cell/row selection to a label + the right starter chips.
// Exported for unit testing; the component reads it from state.contexts.
export const selectSuggestions = (contexts: ReadonlyArray<ContextChip>): Suggestion => {
  if (contexts.length === 0) {
    return { label: 'Ask about all your rows', chipIds: AGGREGATE_CHIPS }
  }

  const groups = new Set<ScoutScopeGroup>()
  let hasRow = false
  let cellCount = 0
  for (const c of contexts) {
    if (c.kind === 'row') {
      hasRow = true
      continue
    }
    cellCount += 1
    const key = c.kind === 'selection' ? c.columnId : columnKeyForField(c.columnId)
    if (key && key in GROUP_CHIPS) groups.add(key as ScoutScopeGroup)
  }

  const chipIds =
    groups.size > 0
      ? dedupe([...groups].flatMap((g) => GROUP_CHIPS[g])).slice(0, 4)
      : ROW_CHIPS.slice(0, 4)

  let label: string
  if (cellCount === 0 && hasRow) label = 'Ask about this row'
  else if (cellCount === 1 && !hasRow) label = 'Ask about this cell'
  else label = 'Ask about your selection'

  return { label, chipIds }
}

interface ScoutChipsProps {
  // Rendered outside the centered empty state (i.e. once a cell is picked);
  // adds panel-edge padding so the block aligns under the context-chip strip.
  standalone?: boolean
}

export const ScoutChips = ({ standalone = false }: ScoutChipsProps) => {
  const { state } = useScout()
  const ask = useScoutAsk()

  const { label, chipIds } = selectSuggestions(state.contexts)

  return (
    <div className={`scout-chips${standalone ? ' scout-chips--standalone' : ''}`}>
      <div className='scout-chips__label'>{label}</div>
      <div className='scout-chips__row'>
        {chipIds.map((id) => {
          const chip = CHIP[id]
          if (!chip) return null
          return (
            <GraviButton
              key={chip.id}
              size='small'
              shape='round'
              className='scout-chip'
              data-prompt-id={chip.promptId}
              buttonText={chip.label}
              onClick={() => {
                void ask({ promptId: chip.promptId, label: chip.label })
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
