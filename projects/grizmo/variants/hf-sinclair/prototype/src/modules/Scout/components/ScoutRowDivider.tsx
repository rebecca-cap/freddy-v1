// ScoutRowDivider — a quiet horizontal block boundary in the message list.
//
// Legibility + organization (this round, item #3): the flat message stream is
// grouped into blocks of CONSECUTIVE same-rowId + same-mode messages. At each
// block boundary we render ONE label so a row that was asked about twelve times
// carries a single header, not twelve repeated identity pills. A small note
// annotates what changed relative to the previous block ("Switched row",
// "Added cell", "New context"). Pure presentational; ScoutMessageList computes
// the label/note and decides where dividers land.

import { Tooltip } from 'antd'

import { compactLabel } from './scoutLabel'

import './ScoutRowDivider.css'

interface RowDividerProps {
  // Full human label for the block (product / location, or "All rows" /
  // "N selected rows" for non-row blocks). Empty string renders no label.
  label: string
  // Best-effort annotation of what changed vs the previous block.
  note?: string | null
  // Drop the component's own vertical margin so spacing is governed by the
  // surrounding layout (used for the in-turn "Processing…" separator, which
  // relies on the message-list item rhythm instead).
  tight?: boolean
}

export const ScoutRowDivider = ({ label, note, tight }: RowDividerProps) => {
  const compact = compactLabel(label)
  return (
    <div
      className={`scout-row-divider${tight ? ' scout-row-divider--tight' : ''}`}
      role='separator'
      aria-label={label}
    >
      <span className='scout-row-divider__rule' aria-hidden='true' />
      <span className='scout-row-divider__center'>
        {label ? (
          <Tooltip title={label} mouseEnterDelay={0.3}>
            <span className='scout-row-divider__label'>{compact}</span>
          </Tooltip>
        ) : null}
        {note ? (
          <span className='scout-row-divider__note'>{note}</span>
        ) : null}
      </span>
      <span className='scout-row-divider__rule' aria-hidden='true' />
    </div>
  )
}
