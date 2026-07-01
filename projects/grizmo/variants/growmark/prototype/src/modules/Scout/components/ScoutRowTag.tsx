// ScoutRowTag — the always-visible identity label at the top of an answer card.
//
// The row a response is about is its single most important attribute, so it is
// shown inline on EVERY scout answer card (not buried in Details). Aggregate
// answers read "All rows · aggregate"; multi-row answers read "N selected rows";
// row/cell answers show the COMPACT product/location label with an antd Tooltip
// exposing the full string. ScoutBubble resolves the text + tooltip; this
// component renders the pill and (when a long label is compacted) the tooltip.

import { Tooltip } from 'antd'

import { compactLabel } from './scoutLabel'

import './ScoutRowTag.css'

interface RowTagProps {
  // The display text. When `full` is provided this is treated as a long context
  // label and rendered compact with a tooltip; otherwise rendered verbatim.
  text: string
  // Full human label to expose via tooltip (row/cell answers). Omit for
  // aggregate / multi-row tags that are already short.
  full?: string
  // Quieter when the answer is about the currently active row (the row label is
  // redundant with the grid selection); louder when it differs.
  muted?: boolean
}

export const ScoutRowTag = ({ text, full, muted }: RowTagProps) => {
  const cls = `scout-row-tag${muted ? ' scout-row-tag--muted' : ''}`

  if (full) {
    return (
      <Tooltip title={full} mouseEnterDelay={0.3}>
        <span className={cls}>{compactLabel(text)}</span>
      </Tooltip>
    )
  }

  return <span className={cls}>{text}</span>
}
