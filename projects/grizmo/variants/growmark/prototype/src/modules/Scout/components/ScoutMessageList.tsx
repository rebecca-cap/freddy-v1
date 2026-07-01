// ScoutMessageList — scrollable region inside the panel body.
//
// Wireframe source: `.gizmo-body` in Kit Round 4 - Gizmo Option A/gizmo-demo.html
// (line ~995). Owns the column-flex + gap layout and the scroll-to-bottom
// behavior on new messages. Renders empty state as a child when
// `state.messages.length === 0` (caller controls this — see `ScoutPanel`).
//
// One container owns scroll. Per the Round-4 lesson: when each bubble managed
// its own scroll, layout flickered as bubbles streamed in.
//
// Organization (this round): the flat message stream is grouped into BLOCKS of
// consecutive same-rowId + same-mode messages. Each block gets ONE divider
// header (product/location label shown once) annotated with what changed vs the
// previous block. A compact "This row / All rows" filter pins the conversation
// to the active row.

import { Fragment, useEffect, useRef } from 'react'

import { useScout } from '../state/ScoutContext'
import type { ScoutMessage } from '../types'

import { ScoutBubble } from './ScoutBubble'
import { ScoutFollowUps } from './ScoutFollowUps'
import { ScoutHistoryFilter } from './ScoutHistoryFilter'
import { ScoutPathCandidate } from './ScoutPathCandidate'
import { ScoutRowDivider } from './ScoutRowDivider'
import { ScoutThinkingDivider } from './ScoutThinkingDivider'

import './ScoutMessageList.css'

// A block is a run of adjacent messages that share the same rowId AND mode.
interface MessageBlock {
  key: string
  rowId?: string
  mode?: ScoutMessage['mode']
  label: string
  messages: ScoutMessage[]
}

const blockLabel = (m: ScoutMessage): string => {
  if (m.mode === 'aggregate') return 'All rows'
  if (m.mode === 'multi-row') return m.contextLabel ?? 'Selected rows'
  return m.contextLabel ?? ''
}

// Two adjacent messages belong to the same block when row + mode match.
const sameBlock = (a: ScoutMessage, b: ScoutMessage): boolean =>
  a.rowId === b.rowId && a.mode === b.mode

const groupIntoBlocks = (messages: ScoutMessage[]): MessageBlock[] => {
  const blocks: MessageBlock[] = []
  for (const m of messages) {
    const prev = blocks[blocks.length - 1]
    if (prev && sameBlock(prev.messages[0], m)) {
      prev.messages.push(m)
      // A later message in the block may carry the human label the opener
      // lacked (e.g. user msg before its scout answer) — keep the first label
      // we can resolve.
      if (!prev.label) prev.label = blockLabel(m)
      continue
    }
    blocks.push({
      key: m.id,
      rowId: m.rowId,
      mode: m.mode,
      label: blockLabel(m),
      messages: [m],
    })
  }
  return blocks
}

// Best-effort annotation of what changed at a block boundary vs the previous
// block. First block carries no note (nothing to compare against).
const dividerNote = (
  block: MessageBlock,
  prev: MessageBlock | undefined,
): string | null => {
  if (!prev) return null
  if (block.mode === 'aggregate') return 'All rows'
  if (block.mode === 'multi-row') return 'New selection'
  // Row-scoped block.
  if (prev.rowId && block.rowId && prev.rowId !== block.rowId) {
    return 'Switched row'
  }
  if (prev.rowId === block.rowId) {
    // Same row, new block — most likely a cell was added to the context.
    return 'Added cell'
  }
  return 'New context'
}

export const ScoutMessageList = () => {
  const { state } = useScout()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scope filter: when 'row', show only messages for the active row context.
  // Falls back to the full list when there is no active row (nothing to scope).
  const activeRowId = state.contexts.find(
    (c) => c.kind === 'row' || c.kind === 'cell',
  )?.rowId
  const messages =
    state.filterMode === 'row' && activeRowId
      ? state.messages.filter((m) => m.rowId === activeRowId)
      : state.messages

  // Scroll to bottom whenever a message is added or its content changes.
  // Watching the message count alone misses progressive thinking-step updates
  // and final-answer arrival — we want the bottom of the latest bubble to stay
  // visible as it grows.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Phase 6.1 — find the latest scout message carrying the candidate flag so
  // the save-as-path prompt renders directly below its bubble.
  let candidateMessageId: string | null = null
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const m = messages[i]
    if (m.role === 'scout' && m.candidate) {
      candidateMessageId = m.id
      break
    }
  }

  // Follow-up chips trail the latest completed answer. Reading the last message
  // (rather than scanning) keeps them hidden during streaming — the in-flight
  // placeholder is `thinkingComplete: false` with no `followUps`.
  const last = messages[messages.length - 1]
  const tailFollowUps =
    last?.role === 'scout' && last.thinkingComplete && last.followUps?.length
      ? last.followUps
      : null

  const blocks = groupIntoBlocks(messages)

  return (
    <>
      <ScoutHistoryFilter />
      <div className='scout-message-list' ref={scrollRef}>
        {blocks.map((block, bi) => {
          const prev = blocks[bi - 1]
          const note = dividerNote(block, prev)
          // Render a divider when the block carries a label OR a change-note,
          // so a 12-interaction row shows its label once at the top.
          const showDivider = Boolean(block.label) || Boolean(note)
          return (
            <div key={block.key} className='scout-message-list__block'>
              {showDivider ? (
                <ScoutRowDivider label={block.label} note={note} />
              ) : null}
              {block.messages.map((m) => {
                // While an answer is still thinking, head it with a shimmering
                // "thinking" separator — the same rule treatment as a row
                // divider — so the ask bubble and the thinking card get real air
                // between them instead of touching.
                const isThinking =
                  m.role === 'scout' && !m.thinkingComplete
                return (
                  <Fragment key={m.id}>
                    {isThinking ? (
                      <div className='scout-message-list__item'>
                        <ScoutThinkingDivider />
                      </div>
                    ) : null}
                    <div className='scout-message-list__item'>
                      <ScoutBubble message={m} />
                      {/* One inline aux per parent (spec §rules): the save-path
                          prompt yields to an engaged feedback form/receipt on
                          the same answer. */}
                      {m.id === candidateMessageId &&
                      m.rating !== 'down' &&
                      !m.feedback ? (
                        <ScoutPathCandidate message={m} />
                      ) : null}
                    </div>
                  </Fragment>
                )
              })}
            </div>
          )
        })}
        {tailFollowUps ? <ScoutFollowUps chips={tailFollowUps} /> : null}
      </div>
    </>
  )
}
