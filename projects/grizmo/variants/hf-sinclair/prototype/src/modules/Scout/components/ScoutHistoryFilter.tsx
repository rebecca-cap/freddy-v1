// ScoutHistoryFilter — compact "This row" vs "All rows" toggle.
//
// Organization (this round, item #4): pins the conversation to a single row's
// history. Wired to state.filterMode via setFilterMode. When 'row', the message
// list shows only messages whose rowId matches the active row context; the list
// owns that filtering. "This row" is disabled when there is no active row chip
// (nothing to scope to) and we fall back to 'all'.

import { Segmented, Tooltip } from 'antd'

import { useScout } from '../state/ScoutContext'
import type { FilterMode } from '../types'

import './ScoutHistoryFilter.css'

export const ScoutHistoryFilter = () => {
  const { state, actions } = useScout()

  const activeRowId = state.contexts.find(
    (c) => c.kind === 'row' || c.kind === 'cell',
  )?.rowId
  const hasActiveRow = Boolean(activeRowId)

  // Without an active row there is nothing to scope to — force 'all'.
  const value: FilterMode = hasActiveRow ? state.filterMode : 'all'

  const control = (
    <Segmented
      size='small'
      className='scout-history-filter__control'
      value={value}
      onChange={(v) => actions.setFilterMode(v as FilterMode)}
      options={[
        { label: 'All rows', value: 'all' },
        { label: 'This row', value: 'row', disabled: !hasActiveRow },
      ]}
    />
  )

  return (
    <div className='scout-history-filter'>
      {hasActiveRow ? (
        control
      ) : (
        <Tooltip
          title='Select a row to scope the conversation to it'
          mouseEnterDelay={0.3}
        >
          {control}
        </Tooltip>
      )}
    </div>
  )
}
