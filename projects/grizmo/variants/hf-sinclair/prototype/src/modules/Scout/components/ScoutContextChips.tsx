// Phase 4.4 / 4.5 — context chips strip.
//
// Renders inside the panel between the header and the message area. Shows
// every ContextChip in state.contexts as a removable pill, plus a "+ Add"
// pill that toggles state.addContextMode. When state.contexts is empty the
// strip shows a single quiet line of guidance.
//
// Composition:
//   <Horizontal>
//     [chip pill] × N      (built as raw <button> for a11y but visually a chip)
//     +Add / Pick a cell   (Excalibrr GraviButton, brand-tinted when active)
//
// All click handlers dispatch ScoutContext actions — no local state.

import { CloseOutlined, PlusOutlined } from '@ant-design/icons'

import { useScout } from '../state/ScoutContext'
import { getConstraintHint } from '../grid/scoutScope'

import './ScoutContextChips.css'

export function ScoutContextChips() {
  const { state, actions } = useScout()
  const { contexts, addContextMode } = state

  const handleRemove = (id: string) => actions.removeContext(id)
  const handleToggleAdd = () => actions.toggleAddContextMode()

  const empty = contexts.length === 0

  // Wireframe 5: while +Add is on, reflect the active selection constraint in
  // the button label and tooltip so the rule is legible before clicking.
  const hint = addContextMode ? getConstraintHint(contexts) : null
  const addLabel = addContextMode
    ? hint
      ? `Pick a cell · ${hint.toLowerCase()}`
      : 'Pick a cell'
    : 'Add a cell'
  const addTitle = addContextMode
    ? hint
      ? 'Cells outside this row or column are disabled to prevent invalid comparisons'
      : 'Click a cell to add it (or click again to cancel)'
    : "Add another cell to Scout's focus"

  return (
    <div className='scout-scope scout-ctx-chips' role='toolbar' aria-label='Scout context'>
      {empty ? (
        <span className='scout-ctx-chips__empty'>
          {addContextMode
            ? 'Click a cell to tell Scout what to look at'
            : 'Nothing in focus · click a cell'}
        </span>
      ) : (
        contexts.map((c) => (
          <span
            key={c.id}
            className={`scout-ctx-chip scout-ctx-chip--${c.kind}${
              c.explicit ? ' is-explicit' : ''
            }`}
          >
            <span className='scout-ctx-chip__label'>{c.label}</span>
            <button
              type='button'
              className='scout-ctx-chip__x'
              aria-label={`Remove ${c.label}`}
              onClick={() => handleRemove(c.id)}
            >
              <CloseOutlined />
            </button>
          </span>
        ))
      )}

      <button
        type='button'
        className={`scout-ctx-chips__add${addContextMode ? ' is-active' : ''}`}
        title={addTitle}
        onClick={handleToggleAdd}
      >
        <span className='scout-ctx-chips__add-plus'>
          <PlusOutlined />
        </span>
        {addLabel}
      </button>

      {contexts.length >= 2 ? (
        <button
          type='button'
          className='scout-ctx-chips__clear-all'
          onClick={() => actions.clearContexts()}
        >
          Clear all cells
        </button>
      ) : null}
    </div>
  )
}
