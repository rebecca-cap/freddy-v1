// detectPathCandidate — pure selector that flags a path candidate after every
// Scout answer. Pulled out of ScoutContext / useScoutAsk so it stays
// testable and free of React state plumbing.
//
// Phase 6.5 — mirrors the wireframe's `detectPathCandidate()` (gizmo-demo.html
// ~line 3756) but reads from our `ScoutMessage[]` instead of the wireframe's
// global state object. Rules:
//
//   - need at least one prior Scout answer (so the candidate covers ≥ 2 steps)
//   - if the latest answer is aggregate (mode === 'agg' OR no rowId), the
//     candidate covers all *prior* aggregate Scout answers + the latest one
//   - otherwise it covers all *prior* Scout answers with the same rowId
//   - messages already marked `usedInPath` are skipped so the candidate shrinks
//     after each save (per wireframe)
//   - consecutive identical promptIds collapse (we never want "ask the same
//     question twice in a row" in a saved path)
//   - returns null when fewer than 2 unique steps remain
//
// `latest.candidateScope` is what the candidate prompt + modal read to label
// the surface ("aggregate" vs "row").

import type {
  ScoutMessage,
  SavedItem,
  SaveModalState,
  SaveModalStep,
  PathScope,
  Thread,
} from '../types'

export interface PathCandidate {
  /** Message that triggered the candidate (the latest scout answer). */
  latestId: string
  scope: PathScope
  // Steps in chronological order. Each carries the originating message id +
  // metadata needed for replay.
  steps: Array<{
    messageId: string
    promptId: string
    label: string
    mode?: PathScope
  }>
}

const isScoutAnswer = (m: ScoutMessage): boolean =>
  m.role === 'scout' && !!m.promptId

/** Determine if the message is aggregate-scoped (no row id OR mode === 'agg'). */
const isAggregate = (m: ScoutMessage): boolean =>
  m.mode === 'aggregate' || m.mode === 'multi-row' || !m.rowId

export function detectPathCandidate(
  messages: ScoutMessage[],
): PathCandidate | null {
  if (messages.length === 0) return null
  // Find the latest scout answer (must have a promptId — placeholders without
  // an answer have body === '' and no promptId in our stamping convention).
  let latest: ScoutMessage | undefined
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (isScoutAnswer(messages[i])) {
      latest = messages[i]
      break
    }
  }
  if (!latest) return null
  // Latest message can't itself be "used" — but if it was, no candidate.
  if (latest.usedInPath) return null

  const aggregate = isAggregate(latest)
  const scope: PathScope = aggregate ? 'agg' : 'row'
  const targetRow = aggregate ? null : latest.rowId

  const steps: PathCandidate['steps'] = []
  for (const m of messages) {
    if (!isScoutAnswer(m)) continue
    if (m.usedInPath) continue
    if (aggregate) {
      // Only aggregate-shaped prior answers + the latest one.
      if (!isAggregate(m)) continue
    } else {
      // Same row.
      if (m.rowId !== targetRow) continue
    }
    steps.push({
      messageId: m.id,
      promptId: m.promptId as string,
      label: m.question || (m.promptId as string),
      mode: m.mode === 'multi-row' || m.mode === 'aggregate' ? 'agg' : aggregate ? 'agg' : 'row',
    })
  }

  // Deduplicate consecutive identical promptIds.
  const dedup: PathCandidate['steps'] = []
  for (const s of steps) {
    if (
      dedup.length === 0 ||
      dedup[dedup.length - 1].promptId !== s.promptId
    ) {
      dedup.push(s)
    }
  }
  if (dedup.length < 2) return null

  return { latestId: latest.id, scope, steps: dedup }
}

// Build the Save modal state from a detected *path* candidate. Shared by the
// inline save prompt (ScoutPathCandidate) and the header Save button
// (ScoutPanel) so both open the identical modal. `sourceMessageId` is the
// message whose candidate flag should clear on save (the candidate's latest).
export function buildSaveModalState(
  candidate: PathCandidate,
  sourceMessageId: string,
): SaveModalState {
  const steps: SaveModalStep[] = candidate.steps.map((s, i) => ({
    id: `step-${i}-${s.messageId}`,
    label: s.label,
    promptId: s.promptId,
    mode: s.mode === 'agg' ? 'aggregate' : 'row',
    dropped: false,
  }))
  const name =
    candidate.steps[0]?.label ??
    (candidate.scope === 'agg' ? 'Quote-book review path' : 'Row review path')
  const description =
    candidate.scope === 'agg'
      ? 'Runs across the whole quote book.'
      : 'Runs on the row you have selected.'
  return {
    sourceMessageId,
    scope: candidate.scope,
    name,
    description,
    steps,
    editorOpen: false,
  }
}

// Build the Save modal state from a *single* answer — the "save this question
// as a prompt" path used by the answer footer and activity rows. Produces a
// one-step modal (kind 'prompt' at save time). `editorOpen` stays false; a
// single step has nothing useful to reorder/drop.
export function buildSaveModalStateForMessage(
  message: ScoutMessage,
): SaveModalState {
  const scope: PathScope = isAggregate(message) ? 'agg' : 'row'
  const label = message.question || message.promptId || 'Saved question'
  const step: SaveModalStep = {
    id: `step-0-${message.id}`,
    label,
    ...(message.promptId ? { promptId: message.promptId } : {}),
    mode: scope === 'agg' ? 'aggregate' : 'row',
    dropped: false,
  }
  return {
    sourceMessageId: message.id,
    scope,
    name: label,
    description:
      scope === 'agg'
        ? 'Runs across the whole quote book.'
        : 'Runs on the row you have selected.',
    steps: [step],
    editorOpen: false,
  }
}

// Build the Save modal state from an ENTIRE chat thread — the inbox card ⋯ Save.
// Collects the thread's user questions as steps (a multi-question chat becomes a
// path, a single question a prompt) and INHERITS the chat's favorite (`starred`)
// so a favorited chat produces a starred Library item.
export function buildSaveModalStateForThread(thread: Thread): SaveModalState {
  const scope: PathScope = thread.rowId ? 'row' : 'agg'
  const steps: SaveModalStep[] = thread.messages
    .filter((m) => m.role === 'user')
    .map((m, i) => ({
      id: `step-${i}-${m.id}`,
      label:
        m.question ||
        (typeof m.body === 'string' ? m.body : '') ||
        'Saved question',
      ...(m.promptId ? { promptId: m.promptId } : {}),
      mode: scope === 'agg' ? 'aggregate' : 'row',
      dropped: false,
    }))
  const name =
    thread.lastQuestion || steps[0]?.label || thread.contextLabel || 'Saved chat'
  return {
    sourceMessageId: null,
    scope,
    name,
    description:
      scope === 'agg'
        ? 'Runs across the whole quote book.'
        : 'Runs on the row you have selected.',
    steps,
    // A multi-question chat is worth reviewing/reordering before saving.
    editorOpen: steps.length > 1,
    starred: Boolean(thread.starred),
  }
}

// SAV-3 — build the Save modal state from an EXISTING saved item so the user
// can edit it (rename, re-describe, retag, and for paths drop/reorder/relabel
// steps). `editingItemId` flags the modal as an edit; `saveItem` then replaces
// the item in place instead of appending a new one. The step editor opens
// expanded for paths (there's something to edit) and stays closed for prompts.
export function buildSaveModalStateForItem(item: SavedItem): SaveModalState {
  const steps: SaveModalStep[] = item.steps.map((s, i) => ({
    id: s.id || `step-${i}-${item.id}`,
    label: s.label,
    ...(s.promptId ? { promptId: s.promptId } : {}),
    ...(s.mode ? { mode: s.mode } : {}),
    dropped: false,
  }))
  return {
    sourceMessageId: null,
    editingItemId: item.id,
    scope: item.scope,
    name: item.name,
    description: item.description,
    steps,
    editorOpen: item.kind === 'path',
    ...(item.subject ? { subject: item.subject } : {}),
  }
}
