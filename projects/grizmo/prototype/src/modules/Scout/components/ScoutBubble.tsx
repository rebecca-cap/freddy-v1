// ScoutBubble — single message bubble for either role.
//
// Wireframe source (Kit Round 4 - Gizmo Option A/gizmo-demo.html):
//   - `.msg-user`  — right-aligned, info-tinted, quiet.
//   - `.msg-gizmo` — left-aligned, neutral surface-2 card.
//
// The scout card has two lives, gated on `thinkingComplete`:
//   - WHILE STREAMING — render only the Thinking card (header + live steps).
//   - ONCE RESOLVED — render the full Answer card per the response-cards spec,
//     top to bottom: row tag → confidence → body → action chips → details
//     (steps + sources, collapsed) → footer (thumbs + bookmark) → one inline
//     aux (feedback form OR receipt). The streamed steps are preserved into the
//     Details panel; nothing about the thinking is thrown away.
//
// Region components own their own markup/CSS; this file composes them and holds
// the small amount of derivation (display steps, row-tag text) that needs the
// conversation context.

import { useScout } from '../state/ScoutContext'
import type { ScoutMessage, ThinkingStep } from '../types'

import { ScoutActionChips } from './ScoutActionChips'
import { ScoutAnswerBody } from './ScoutAnswerBody'
import { ScoutAnswerFooter } from './ScoutAnswerFooter'
import { ScoutConfidence } from './ScoutConfidence'
import { ScoutDetails, type DetailStep } from './ScoutDetails'
import { ScoutFeedbackForm } from './ScoutFeedbackForm'
import { ScoutFeedbackReceipt } from './ScoutFeedbackReceipt'
import { ScoutRowTag } from './ScoutRowTag'
import { ScoutThinkingSteps, type DisplayStep } from './ScoutThinkingSteps'

import './ScoutBubble.css'

interface BubbleProps {
  message: ScoutMessage
}

// No shared sr-only utility class exists in this module's CSS, so inline the
// standard visually-hidden recipe for the screen-reader-only speaker cue.
const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
}

// Convert raw `ThinkingStep[]` + the `thinkingComplete` flag into the
// `{ label, status }` shape the steps component renders. The reasoning lives
// here (not in `ScoutThinkingSteps`) so the steps component stays a pure view.
const computeDisplaySteps = (
  steps: ThinkingStep[] | undefined,
  complete: boolean | undefined,
): DisplayStep[] => {
  if (!steps || steps.length === 0) return []
  if (complete) {
    return steps.map((s) => ({ id: s.id, label: s.label, status: 'done' }))
  }
  return steps.map((s, i) => ({
    id: s.id,
    label: s.label,
    status: i === steps.length - 1 ? 'active' : 'done',
  }))
}

const bodyIsEmpty = (m: ScoutMessage): boolean => {
  if (typeof m.body === 'string') return m.body.length === 0
  return m.body.length === 0
}

interface RowTagInfo {
  text: string
  full?: string
  muted?: boolean
}

// Resolve the ALWAYS-VISIBLE top-of-card row tag — the row is the single most
// important attribute of an answer, so every scout card shows one.
//   - aggregate  -> "All rows"
//   - multi-row  -> "N selected rows"
//   - row/cell   -> the product/location label (compacted + tooltip by RowTag).
//     Prefer the stamped `message.contextLabel`; fall back to the active /
//     matching context chip's label, then a graceful placeholder. Rendered
//     quiet when it matches the active row (redundant with the grid selection),
//     louder when it differs so a row-switch reads at a glance.
const resolveRowTag = (
  message: ScoutMessage,
  activeRowId: string | undefined,
  contextLabelFor: (rowId: string) => string | undefined,
): RowTagInfo | null => {
  if (message.mode === 'aggregate') return { text: 'All rows' }
  if (message.mode === 'multi-row') {
    // Selection asks stamp the full label; otherwise show a generic count tag.
    return { text: message.contextLabel ?? 'Selected rows' }
  }
  if (message.rowId) {
    const full =
      message.contextLabel ??
      contextLabelFor(message.rowId) ??
      'Row no longer in context'
    return { text: full, full, muted: message.rowId === activeRowId }
  }
  return null
}

export const ScoutBubble = ({ message }: BubbleProps) => {
  const { state } = useScout()

  if (message.role === 'user') {
    const text =
      typeof message.body === 'string'
        ? message.body
        : message.body.map((b) => ('text' in b ? b.text : '')).join(' ')
    return (
      <div className='scout-msg scout-msg--user'>
        <span style={srOnly}>You:</span>
        {text}
      </div>
    )
  }

  const isComplete = Boolean(message.thinkingComplete)

  // --- Streaming: Thinking card only ---------------------------------------
  if (!isComplete) {
    const displaySteps = computeDisplaySteps(message.thinking, false)
    return (
      <div className='scout-msg scout-msg--scout'>
        <span style={srOnly}>Scout:</span>
        <div className='scout-msg__avatar' aria-hidden='true'>
          G
        </div>
        <div className='scout-msg__card'>
          {displaySteps.length > 0 ? (
            <ScoutThinkingSteps steps={displaySteps} />
          ) : null}
        </div>
      </div>
    )
  }

  // --- Resolved: full Answer card ------------------------------------------
  const activeRowId = state.contexts.find(
    (c) => c.kind === 'row' || c.kind === 'cell',
  )?.rowId
  const contextLabelFor = (rowId: string): string | undefined =>
    state.contexts.find((c) => c.rowId === rowId)?.label
  const rowTag = resolveRowTag(message, activeRowId, contextLabelFor)

  const detailSteps: DetailStep[] = (message.thinking ?? []).map((s) => ({
    id: s.id,
    label: s.label,
  }))

  const showFeedbackForm = message.rating === 'down' && !message.feedback
  const showReceipt = Boolean(message.feedback)

  return (
    <div className='scout-msg scout-msg--scout'>
      <span style={srOnly}>Scout:</span>
      <div className='scout-msg__avatar' aria-hidden='true'>
        G
      </div>
      <div className='scout-msg__card'>
        {rowTag ? (
          <ScoutRowTag
            text={rowTag.text}
            full={rowTag.full}
            muted={rowTag.muted}
          />
        ) : null}

        {message.confidence ? (
          <ScoutConfidence
            confidence={message.confidence}
            note={message.confidenceNote}
          />
        ) : null}

        {!bodyIsEmpty(message) ? (
          <div className='scout-msg__slot scout-msg__slot--body'>
            <ScoutAnswerBody body={message.body} />
          </div>
        ) : null}

        <ScoutActionChips actions={message.actions ?? []} />

        <ScoutDetails steps={detailSteps} sources={message.sources ?? []} />

        <ScoutAnswerFooter message={message} />

        {showFeedbackForm ? <ScoutFeedbackForm message={message} /> : null}
        {showReceipt && message.feedback ? (
          <ScoutFeedbackReceipt feedback={message.feedback} />
        ) : null}
      </div>
    </div>
  )
}
