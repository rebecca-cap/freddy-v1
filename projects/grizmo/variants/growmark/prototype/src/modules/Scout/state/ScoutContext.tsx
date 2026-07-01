// Scout state — React Context + reducer store.
//
// Codebase convention: React Context + hooks (no Redux / Zustand / MobX).
// Shape of state lives in `../types.ts` (`ScoutState`). This module owns the
// reducer, the provider, and the `useScout` consumer hook. In dev builds we
// also pin a `window.__scout__` hook for ad-hoc inspection / scripted drives.
//
// IMPORTANT: the reducer is pure and never mutates state — every action returns
// a new top-level object. Adding a new action? Extend `ScoutAction`, add a
// case below, and add a matching bound dispatcher in `useMemo(actions, ...)`.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react'

import { askScout } from '../services/fakeLlm'
import { toPlainText } from '../services/answerToPlainText'

import { useScoutTimer } from './useScoutTimer'
import type {
  ActivityEntry,
  AnswerBody,
  BatchRun,
  ContextChip,
  FilterMode,
  ScoutActivityState,
  ScoutMessage,
  ScoutState,
  ScoutView,
  LibraryFilter,
  PanelMode,
  SaveModalState,
  SavedItem,
  ShareTarget,
  Thread,
  ThinkingStep,
  Toast,
} from '../types'

// Re-export multi-threading types through the state barrel so `index.ts` can
// surface them without anyone reaching into `../types.ts` directly.
export type { Thread, ThreadStatus, ScoutActivityState } from '../types'

// Re-export the canonical state type so `index.ts`'s
// `export type { ScoutState } from './state/ScoutContext'` keeps working
// without anyone reaching into `../types.ts` directly.
export type { ScoutState } from '../types'

// --- Initial state ------------------------------------------------------------

// Seed timestamps for activity entries — staggered so "X min ago" ordering is
// stable across reloads. Computed once on module load.
const _now = Date.now()
const MIN = 60_000

// Deterministic id source for runtime-generated message / batch-run ids.
// Intentionally NOT clock/random based so scripted drives are reproducible.
let _idSeq = 0
const nextId = (prefix: string): string => `${prefix}-${++_idSeq}`

// ACT-3 — entries older than this window are hidden at read time.
const ACTIVITY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

// TMR-1 — simulated "thinking" duration. ~20s stands in for a realistic
// ~1–2 minute model response so the user has time to click around and watch
// every surface react. A thread asked at T flips to 'ready' at T + this.
export const SCOUT_THINK_MS = 20_000

// The fixed id of the single default stream thread (OBJ-3 / THR-7). The stream
// thread is rowId-less and active by default; the existing partition / row-
// divider chat is this thread's internal view.
export const STREAM_THREAD_ID = 'thread-stream'

// --- Active-thread mirror helpers --------------------------------------------
//
// MIGRATION STRATEGY: 47 existing reducer actions read/write state.messages /
// state.contexts. To keep them (and every component reading state.messages)
// working untouched, the top-level state.messages / state.contexts stay the
// SOURCE the existing cases mutate, and we MIRROR them back into the active
// thread's own slices after each relevant action via `syncActiveThread`.
//
// On `setActiveThread` we do the reverse: load the target thread's slices into
// the top-level mirror.

// Write the current top-level messages/contexts back into the active thread.
// Also refreshes lastActivityAt + lastQuestion/answerPreview so inbox cards and
// alert cards stay current. Status is NOT touched here (the timer owns it).
const syncActiveThread = (state: ScoutState): ScoutState => {
  if (!state.activeThreadId) return state
  let touched = false
  const threads = state.threads.map((t) => {
    if (t.id !== state.activeThreadId) return t
    touched = true
    const firstUser = state.messages.find((m) => m.role === 'user')
    const lastScout = [...state.messages]
      .reverse()
      .find((m) => m.role === 'scout' && m.body)
    const lastQuestion =
      firstUser && typeof firstUser.body === 'string'
        ? firstUser.body
        : firstUser?.question ?? t.lastQuestion
    return {
      ...t,
      messages: state.messages,
      contexts: state.contexts,
      lastActivityAt: state.simNow || Date.now(),
      ...(lastQuestion !== undefined ? { lastQuestion } : {}),
      ...(lastScout
        ? { answerPreview: toPlainText(lastScout.body).slice(0, 140) }
        : {}),
    }
  })
  if (!touched) return state
  return { ...state, threads }
}

// Derived selectors — computed in the provider value, exposed via useScout().

// THR-6 / ALR-3 — count of threads with a Ready/unseen answer waiting.
export const selectUnseenCount = (state: ScoutState): number =>
  state.threads.filter((t) => t.status === 'ready').length

// ALR-4 — the cross-page name-tag state. 'thinking' wins over 'ready'.
export const selectScoutActivityState = (
  state: ScoutState,
): ScoutActivityState => {
  if (state.threads.some((t) => t.status === 'in-progress')) return 'thinking'
  if (state.threads.some((t) => t.status === 'ready')) return 'ready'
  return 'idle'
}

// ACT-3 — filter out activity entries older than the 7-day window. `now` is
// passed in by the caller (the standard JS current-millis call in app code).
export const activeActivityEntries = (
  items: ActivityEntry[],
  now: number,
): ActivityEntry[] =>
  items.filter((e) => now - e.when <= ACTIVITY_WINDOW_MS)

// Gather the unique rowIds a conversation touched, from each message's rowId.
const gatherRowIds = (messages: ScoutMessage[]): string[] => {
  const seen = new Set<string>()
  for (const m of messages) {
    if (m.rowId) seen.add(m.rowId)
  }
  return [...seen]
}

export const initialScoutState: ScoutState = {
  open: false,
  // Land on the Chats list (the chat-first home). With zero chats the panel
  // shows the welcome screen instead (see ScoutPanel render gating).
  view: 'activity',
  messages: [],
  contexts: [],
  library: {
    // Single unified list. Paths (steps > 1) and prompts (steps === 1) are
    // the same object now, distinguished only by `kind`.
    items: [
      {
        id: 'path-margin-check',
        name: 'Daily cost-tracking check',
        description:
          'Pulls Cost build-up, OPIS Low 6 PM comparison, and 7-day price-vs-cost trend for the active row.',
        steps: [
          { id: 'mc-1', label: 'Why this cost?' },
          { id: 'mc-2', label: 'Cost vs OPIS Low 6 PM' },
          { id: 'mc-3', label: '7-day price vs cost' },
        ],
        scope: 'row',
        starred: false,
        kind: 'path',
        subject: 'valuation',
      },
      {
        id: 'path-flagged-rows',
        name: 'Triage flagged cost rows',
        description:
          'Walks every flag, explains the trigger, and suggests a next action.',
        steps: [
          { id: 'fr-1', label: 'Why was this flagged?' },
          { id: 'fr-2', label: 'How does Cost track OPIS Low 6 PM?' },
          { id: 'fr-3', label: 'Recommended next action' },
        ],
        scope: 'agg',
        starred: true,
        kind: 'path',
        subject: 'lower-of-contract',
        // Received item — the manager's team playbook (demonstrates the
        // "standardize how the team works" outcome on the recipient side).
        sharedBy: 'Adam Wallace',
      },
      {
        id: 'prompt-explain-price',
        name: 'Explain this published price',
        description:
          'One-shot: why Output(Price) = Build-Up Cost + Adjustment.',
        steps: [
          { id: 'ep-1', label: 'Explain this price', promptId: 'prop-why' },
        ],
        scope: 'row',
        starred: false,
        kind: 'prompt',
        subject: 'valuation',
      },
      {
        id: 'prompt-what-if-margin',
        name: 'What if Adjustment shifts $0.0050/gal?',
        description:
          'Models the lift impact and downside risk of a $0.0100/gal margin move on the active row.',
        steps: [
          {
            id: 'wim-1',
            label: 'What if I raise the Adjustment $0.0050/gal?',
            promptId: 'prop-whatif',
          },
        ],
        scope: 'row',
        starred: true,
        kind: 'prompt',
        subject: 'terminal-arbs',
      },
    ],
  },
  activity: [
    {
      id: 'act-1',
      title: 'Why is the #2 ULS CL build-up rising at NORTH LITTLE ROCK?',
      description:
        'OPIS Low 6 PM eased but the user Adjustment widened $0.0150/gal over the window — published Price held above Cost.',
      when: _now - 3 * MIN,
      rowIds: [],
      source: 'seed',
    },
    {
      id: 'act-2',
      title: 'Compare published Cost vs OPIS Low 6 PM at 1207',
      description:
        'EOD Cost avg $3.4570/gal vs OPIS Low 6 PM benchmark basis; tracking within band, no liftings to volume-weight.',
      when: _now - 22 * MIN,
      rowIds: [],
      source: 'seed',
    },
    {
      id: 'act-3',
      title: 'Summarize today’s flagged cost rows',
      description:
        '14 flagged: 6 stale OPIS Low 6 PM, 5 Adjustment out of band, 3 Build-Up vs Output mismatch.',
      when: _now - 90 * MIN,
      rowIds: [],
      source: 'seed',
    },
  ],
  messagesBackup: null,
  contextsBackup: null,
  lastClearedAt: null,
  filterMode: 'all',
  toasts: [],
  bubbleDismissed: false,
  addContextMode: false,
  tourDismissed: false,
  search: { library: '', activity: '' },
  starredOnly: { library: false, activity: false },
  saveModal: null,
  isPathRunning: false,
  closeConfirmOpen: false,
  isMinimized: false,
  position: null,
  panelHeight: null,
  panelMode: 'floating',
  panelWidth: 380,
  savePathOffered: false,
  composerPrefill: null,
  shareModalItemId: null,
  libraryFilter: 'all',
  batchRun: null,
  // Chat-first model: start with ZERO chats so a fresh session shows the
  // welcome screen. The first prompt (or "+ New chat") creates chat #1. A
  // non-row ask continues the active chat, or creates a new general chat if
  // none is active (see ensureThreadForRow).
  threads: [],
  activeThreadId: null,
  simNow: _now,
}

// --- Action union -------------------------------------------------------------

export type ScoutAction =
  | { type: 'setOpen'; open: boolean }
  | { type: 'toggleOpen' }
  | { type: 'setView'; view: ScoutView }
  | { type: 'dismissBubble' }
  | { type: 'pushMessage'; message: ScoutMessage }
  | { type: 'updateMessage'; id: string; partial: Partial<ScoutMessage> }
  | { type: 'appendThinking'; id: string; step: ThinkingStep }
  | { type: 'clearConversation'; at?: number }
  | { type: 'restoreLast' }
  // Step back one conversational turn (remove the trailing scout answer + its
  // paired user question) and stash the removed question for the composer.
  | { type: 'undoLastTurn' }
  | { type: 'clearComposerPrefill' }
  | { type: 'addContext'; context: ContextChip }
  | { type: 'replaceContexts'; contexts: ContextChip[] }
  | { type: 'clearContexts' }
  | { type: 'removeContext'; id: string }
  | { type: 'setAddContextMode'; on: boolean }
  | { type: 'toggleAddContextMode' }
  | { type: 'dismissTour' }
  | {
      type: 'setSearch'
      view: 'library' | 'activity'
      query: string
    }
  | { type: 'setStarredOnly'; view: 'library' | 'activity'; on: boolean }
  | { type: 'toggleItemStar'; id: string }
  | { type: 'toggleThreadStar'; id: string }
  | { type: 'deleteThread'; id: string }
  | { type: 'addToast'; toast: Toast }
  | { type: 'dismissToast'; id: string }
  | { type: 'setFilterMode'; mode: FilterMode }
  | { type: 'replaceState'; partial: Partial<ScoutState> }
  // Save-as candidate prompt + Save modal lifecycle.
  | { type: 'dismissCandidate'; messageId: string }
  | { type: 'openSaveModal'; modal: SaveModalState }
  | { type: 'closeSaveModal' }
  | { type: 'updateSaveModal'; partial: Partial<SaveModalState> }
  | { type: 'updateSaveStep'; index: number; partial: Partial<SaveModalState['steps'][number]> }
  | { type: 'reorderSaveStep'; index: number; direction: -1 | 1 }
  | { type: 'saveItem'; item: SavedItem; sourceMessageId: string | null }
  // Sharing: push a saved item to teammates, + Share modal lifecycle + the
  // Library ownership filter.
  | { type: 'shareItem'; id: string; target: ShareTarget }
  | { type: 'openShareModal'; id: string }
  | { type: 'closeShareModal' }
  | { type: 'setLibraryFilter'; filter: LibraryFilter }
  | { type: 'setPathRunning'; running: boolean }
  // Phase 7.2 — close-confirm modal lifecycle.
  | { type: 'openCloseConfirm' }
  | { type: 'closeCloseConfirm' }
  // Phase 7.2 — discard + close in one shot: stash backups, wipe live, set
  // open=false, dismiss the modal. Mirrors `actuallyClosePanel` in the
  // wireframe (`gizmo-demo.html` ~line 2526).
  | { type: 'discardSession'; at?: number }
  // Phase 7.5 — clear backups when the user takes a new irreversible step
  // (the next ask after a clear/discard). Hides the Undo control.
  | { type: 'clearBackups' }
  // Phase 7.1b — minimize the panel: closes it but flips `isMinimized` so the
  // floating mini-bubble appears. Distinct from `setOpen(false)` (which is the
  // catch-all "panel goes away" used by close/discard/etc.).
  | { type: 'minimize' }
  // Phase 7.1c — user-dragged panel position. setPosition commits the new
  // coords; resetPosition returns the panel to its default top:50 right:16
  // dock (used by discardSession + future "snap back" UX).
  | { type: 'setPosition'; position: { x: number; y: number } }
  | { type: 'resetPosition' }
  // Phase 7.1d — explicit panel height (null = auto-fit to content).
  | { type: 'setPanelHeight'; height: number | null }
  // PNL-1..4 — panel docking mode + sidebar width.
  | { type: 'setPanelMode'; mode: PanelMode }
  | { type: 'setPanelWidth'; px: number }
  // ACT-5 — reopen an archived conversation: switch to chat + reload its
  // message snapshot into a fresh conversation.
  | { type: 'reopenActivity'; id: string }
  // Mark the inline save-path prompt as having been auto-offered (gates it to
  // a single appearance per conversation).
  | { type: 'markSavePathOffered' }
  // Batch "run path across selection" lifecycle.
  | { type: 'startBatchRun'; run: BatchRun }
  | { type: 'completeBatchRun'; answers: Record<string, AnswerBody> }
  // --- Multi-threading (THR-*) ---
  // Create a new thread for a row (or stream) and return nothing here — the
  // bound creator returns the id. Stacks on top of existing threads (THR-4).
  | {
      type: 'createThread'
      id: string
      rowId: string | null
      contextLabel: string
      at: number
      isStream?: boolean
    }
  // Make a thread active: snapshot the current active thread back into its
  // slices, then load the target's slices into the top-level mirror and mark
  // the target 'viewed' (THR-1/5, ROW-2).
  | { type: 'setActiveThread'; id: string }
  // Mark a thread 'viewed' without necessarily activating it (ROW-3).
  | { type: 'markThreadSeen'; id: string }
  // Begin thinking on a thread: status 'in-progress', readyAt set. Timer flips
  // it to 'ready' once simNow >= readyAt (TMR-4).
  | { type: 'startThreadThinking'; id: string; readyAt: number }
  // The single shell timer tick. Advances simNow and flips any in-progress
  // thread whose readyAt <= now to 'ready' (stamping lastActivityAt).
  | { type: 'tickTimer'; now: number }

// --- Reducer ------------------------------------------------------------------

// Outer reducer: runs the existing per-action logic, then mirrors the
// (possibly changed) top-level messages/contexts back into the active thread.
// The multi-threading actions are handled directly here (they manage the
// mirror themselves) and bypass the auto-sync.
export function scoutReducer(
  state: ScoutState,
  action: ScoutAction,
): ScoutState {
  switch (action.type) {
    case 'createThread': {
      // THR-4 — new threads stack on top. Does not change the mirror; the
      // bound creator calls setActiveThread separately when it wants to focus.
      const thread: Thread = {
        id: action.id,
        rowId: action.rowId,
        contextLabel: action.contextLabel,
        status: 'viewed',
        messages: [],
        contexts: [],
        createdAt: action.at,
        lastActivityAt: action.at,
        readyAt: null,
        ...(action.isStream ? { isStream: true } : {}),
      }
      return { ...state, threads: [thread, ...state.threads] }
    }

    case 'setActiveThread': {
      if (state.activeThreadId === action.id) {
        // Already active — just ensure it's marked seen (opening clears unseen).
        const threads = state.threads.map((t) =>
          t.id === action.id && t.status === 'ready'
            ? { ...t, status: 'viewed' as const }
            : t,
        )
        return { ...state, threads }
      }
      const target = state.threads.find((t) => t.id === action.id)
      if (!target) return state
      // 1. snapshot the current active thread's live mirror back into it.
      const snapped = syncActiveThread(state)
      // 2. load target's slices into the top-level mirror + mark it viewed.
      const threads = snapped.threads.map((t) =>
        t.id === action.id ? { ...t, status: 'viewed' as const } : t,
      )
      return {
        ...snapped,
        threads,
        activeThreadId: action.id,
        messages: target.messages,
        contexts: target.contexts,
        // Switching threads re-arms the one-shot save-path nudge for the
        // newly-focused conversation.
        savePathOffered: false,
      }
    }

    case 'markThreadSeen': {
      let touched = false
      const threads = state.threads.map((t) => {
        if (t.id !== action.id || t.status === 'viewed') return t
        touched = true
        return { ...t, status: 'viewed' as const }
      })
      if (!touched) return state
      return { ...state, threads }
    }

    case 'startThreadThinking': {
      let touched = false
      const threads = state.threads.map((t) => {
        if (t.id !== action.id) return t
        touched = true
        return {
          ...t,
          status: 'in-progress' as const,
          readyAt: action.readyAt,
          lastActivityAt: state.simNow || Date.now(),
        }
      })
      if (!touched) return state
      return { ...state, threads }
    }

    case 'tickTimer': {
      const now = action.now
      let flipped = false
      const threads = state.threads.map((t) => {
        if (
          t.status === 'in-progress' &&
          t.readyAt != null &&
          t.readyAt <= now
        ) {
          flipped = true
          return {
            ...t,
            status: 'ready' as const,
            readyAt: null,
            lastActivityAt: now,
          }
        }
        return t
      })
      // Always advance simNow (drives the countdown bar) but avoid a new object
      // when nothing material changed AND simNow is unchanged.
      if (!flipped && state.simNow === now) return state
      return { ...state, simNow: now, ...(flipped ? { threads } : {}) }
    }
  }

  // All other (pre-existing) actions run through the inner reducer, then we
  // mirror messages/contexts into the active thread.
  const next = scoutInnerReducer(state, action)
  if (next === state) return state
  // Only re-sync the active thread when the top-level mirror actually moved.
  if (next.messages !== state.messages || next.contexts !== state.contexts) {
    return syncActiveThread(next)
  }
  return next
}

function scoutInnerReducer(
  state: ScoutState,
  action: ScoutAction,
): ScoutState {
  switch (action.type) {
    case 'setOpen':
      if (state.open === action.open && (!action.open || !state.isMinimized)) {
        return state
      }
      // Opening always exits the minimized state (the mini-bubble would
      // otherwise linger under the panel). Closing leaves `isMinimized` alone
      // so the dedicated `minimize` action can flip it on without a race.
      // Opening also permanently dismisses the intro bubble for the session so
      // it never pops back when the panel is later closed.
      return {
        ...state,
        open: action.open,
        isMinimized: action.open ? false : state.isMinimized,
        bubbleDismissed: action.open ? true : state.bubbleDismissed,
      }

    case 'toggleOpen':
      return {
        ...state,
        open: !state.open,
        isMinimized: !state.open ? false : state.isMinimized,
        bubbleDismissed: !state.open ? true : state.bubbleDismissed,
      }

    case 'setView':
      if (state.view === action.view) return state
      return { ...state, view: action.view }

    case 'dismissBubble':
      if (state.bubbleDismissed) return state
      return { ...state, bubbleDismissed: true }

    case 'pushMessage':
      return { ...state, messages: [...state.messages, action.message] }

    case 'updateMessage': {
      let touched = false
      const next = state.messages.map((m) => {
        if (m.id !== action.id) return m
        touched = true
        return { ...m, ...action.partial }
      })
      if (!touched) return state
      return { ...state, messages: next }
    }

    case 'appendThinking': {
      let touched = false
      const next = state.messages.map((m) => {
        if (m.id !== action.id) return m
        touched = true
        return { ...m, thinking: [...(m.thinking ?? []), action.step] }
      })
      if (!touched) return state
      return { ...state, messages: next }
    }

    case 'clearConversation': {
      const hadContent =
        state.messages.length > 0 || state.contexts.length > 0
      const clearedAt = hadContent ? action.at ?? Date.now() : null

      // ACT-1/2/5 — archive the just-ended conversation as a single Activity
      // entry scoped to the rows it touched. Only when there were messages
      // (a contexts-only clear has no conversation worth archiving).
      let activity = state.activity
      if (state.messages.length > 0) {
        const firstUser = state.messages.find((m) => m.role === 'user')
        const lastScout = [...state.messages]
          .reverse()
          .find((m) => m.role === 'scout' && m.body)
        const rawTitle =
          (firstUser && typeof firstUser.body === 'string'
            ? firstUser.body
            : firstUser?.question) ?? 'Scout conversation'
        const title =
          rawTitle.length > 80 ? `${rawTitle.slice(0, 79)}…` : rawTitle
        const description = lastScout ? toPlainText(lastScout.body) : ''
        const entry: ActivityEntry = {
          id: nextId('act'),
          title,
          description,
          when: clearedAt ?? Date.now(),
          rowIds: gatherRowIds(state.messages),
          source: 'clear',
          messages: state.messages,
        }
        activity = [entry, ...state.activity]
      }

      return {
        ...state,
        activity,
        messages: [],
        contexts: [],
        messagesBackup: hadContent ? state.messages : null,
        contextsBackup: hadContent ? state.contexts : null,
        lastClearedAt: clearedAt,
        // Fresh conversation may offer the save-path prompt again.
        savePathOffered: false,
      }
    }

    case 'restoreLast': {
      if (!state.messagesBackup && !state.contextsBackup) return state
      return {
        ...state,
        messages: state.messagesBackup ?? state.messages,
        contexts: state.contextsBackup ?? state.contexts,
        messagesBackup: null,
        contextsBackup: null,
        lastClearedAt: null,
      }
    }

    case 'undoLastTurn': {
      // Remove the last turn: the trailing scout answer + its paired user
      // question. Repeatable — each dispatch peels off one more turn. The
      // removed question text is stashed in `composerPrefill` so the composer
      // can offer it back for editing/re-sending.
      if (state.messages.length === 0) return state
      const msgs = state.messages.slice()
      const last = msgs[msgs.length - 1]
      let removed: string | null = null
      if (last.role === 'scout') {
        msgs.pop()
        const prev = msgs[msgs.length - 1]
        if (prev?.role === 'user') {
          removed = typeof prev.body === 'string' ? prev.body : null
          msgs.pop()
        }
      } else {
        // Trailing user message with no answer yet (rare) — drop just it.
        removed = typeof last.body === 'string' ? last.body : null
        msgs.pop()
      }
      return {
        ...state,
        messages: msgs,
        composerPrefill: removed ?? state.composerPrefill,
        // Stepping back to an empty thread re-arms the one-shot save-path nudge.
        savePathOffered: msgs.length === 0 ? false : state.savePathOffered,
      }
    }

    case 'clearComposerPrefill':
      if (state.composerPrefill === null) return state
      return { ...state, composerPrefill: null }

    case 'addContext': {
      if (state.contexts.some((c) => c.id === action.context.id)) return state
      return { ...state, contexts: [...state.contexts, action.context] }
    }

    case 'replaceContexts':
      return { ...state, contexts: action.contexts }

    case 'clearContexts':
      if (state.contexts.length === 0) return state
      return { ...state, contexts: [] }

    case 'removeContext':
      return {
        ...state,
        contexts: state.contexts.filter((c) => c.id !== action.id),
      }

    case 'setAddContextMode':
      if (state.addContextMode === action.on) return state
      return { ...state, addContextMode: action.on }

    case 'toggleAddContextMode':
      return { ...state, addContextMode: !state.addContextMode }

    case 'dismissTour':
      if (state.tourDismissed) return state
      return { ...state, tourDismissed: true }

    case 'setSearch':
      if (state.search[action.view] === action.query) return state
      return {
        ...state,
        search: { ...state.search, [action.view]: action.query },
      }

    case 'setStarredOnly':
      if (state.starredOnly[action.view] === action.on) return state
      return {
        ...state,
        starredOnly: { ...state.starredOnly, [action.view]: action.on },
      }

    case 'toggleItemStar': {
      let touched = false
      const items = state.library.items.map((it) => {
        if (it.id !== action.id) return it
        touched = true
        return { ...it, starred: !it.starred }
      })
      if (!touched) return state
      return { ...state, library: { items } }
    }

    case 'toggleThreadStar': {
      let touched = false
      const threads = state.threads.map((t) => {
        if (t.id !== action.id) return t
        touched = true
        return { ...t, starred: !t.starred }
      })
      if (!touched) return state
      return { ...state, threads }
    }

    case 'deleteThread': {
      if (!state.threads.some((t) => t.id === action.id)) return state
      const threads = state.threads.filter((t) => t.id !== action.id)
      // If the deleted thread was the active one, drop the focus and clear the
      // mirrored conversation so the panel doesn't show a stale chat.
      if (state.activeThreadId === action.id) {
        return {
          ...state,
          threads,
          activeThreadId: null,
          messages: [],
          contexts: [],
        }
      }
      return { ...state, threads }
    }

    case 'addToast':
      // Single-toast policy (wireframe `showToast` semantics) — a new toast
      // replaces any in-flight one. Phase 7.4 audit: keeping toasts as a
      // single-element list (instead of a boolean + text pair) makes the
      // auto-dismiss timer in ScoutToastHost key cleanly off `toast.id`.
      return { ...state, toasts: [action.toast] }

    case 'dismissToast':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      }

    case 'setFilterMode':
      if (state.filterMode === action.mode) return state
      return { ...state, filterMode: action.mode }

    case 'replaceState':
      return { ...state, ...action.partial }

    case 'dismissCandidate': {
      let touched = false
      const next = state.messages.map((m) => {
        if (m.id !== action.messageId) return m
        if (!m.candidate) return m
        touched = true
        return { ...m, candidate: false }
      })
      if (!touched) return state
      return { ...state, messages: next }
    }

    case 'openSaveModal':
      return { ...state, saveModal: action.modal }

    case 'closeSaveModal':
      if (!state.saveModal) return state
      return { ...state, saveModal: null }

    case 'updateSaveModal': {
      if (!state.saveModal) return state
      return { ...state, saveModal: { ...state.saveModal, ...action.partial } }
    }

    case 'updateSaveStep': {
      if (!state.saveModal) return state
      const steps = state.saveModal.steps.map((s, i) =>
        i === action.index ? { ...s, ...action.partial } : s,
      )
      return { ...state, saveModal: { ...state.saveModal, steps } }
    }

    case 'reorderSaveStep': {
      if (!state.saveModal) return state
      const { index, direction } = action
      const target = index + direction
      const steps = state.saveModal.steps
      if (target < 0 || target >= steps.length) return state
      const next = steps.slice()
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...state, saveModal: { ...state.saveModal, steps: next } }
    }

    case 'saveItem': {
      // For a *path* save, mark its source messages `usedInPath` + clear the
      // candidate so the inline save-path nudge shrinks (a second path becomes
      // saveable from fresh questions). A single-*prompt* save leaves messages
      // untouched — that question may still belong to a future path candidate.
      const markUsed = action.item.kind === 'path'
      const usedPromptIds = markUsed
        ? new Set(
            action.item.steps.map((s) => s.promptId).filter(Boolean) as string[],
          )
        : new Set<string>()
      const messages = state.messages.map((m) => {
        let next = m
        // The triggering answer clears its candidate flag and flips to "saved"
        // so its footer shows the filled bookmark + "Saved".
        if (m.id === action.sourceMessageId) {
          if (m.candidate) next = { ...next, candidate: false }
          if (!next.saved) next = { ...next, saved: true }
        }
        if (
          markUsed &&
          m.role === 'scout' &&
          m.promptId &&
          usedPromptIds.has(m.promptId) &&
          !m.usedInPath
        ) {
          next = { ...next, usedInPath: true }
        }
        return next
      })
      // SAV-3 — editing replaces the existing item in place; creating appends.
      // On edit, keep the favorite flag + received-provenance from the prior
      // copy (the modal doesn't surface those), but let an edit re-share.
      const existingIdx = state.library.items.findIndex(
        (it) => it.id === action.item.id,
      )
      const items =
        existingIdx >= 0
          ? state.library.items.map((it, i) =>
              i === existingIdx
                ? {
                    ...action.item,
                    starred: it.starred,
                    ...(it.sharedBy ? { sharedBy: it.sharedBy } : {}),
                    sharedWith: action.item.sharedWith ?? it.sharedWith,
                  }
                : it,
            )
          : [...state.library.items, action.item]
      return {
        ...state,
        messages,
        library: { items },
        saveModal: null,
      }
    }

    case 'shareItem': {
      let touched = false
      const items = state.library.items.map((it) => {
        if (it.id !== action.id) return it
        touched = true
        return { ...it, sharedWith: action.target }
      })
      if (!touched) return state
      return { ...state, library: { items } }
    }

    case 'openShareModal':
      return { ...state, shareModalItemId: action.id }

    case 'closeShareModal':
      if (state.shareModalItemId === null) return state
      return { ...state, shareModalItemId: null }

    case 'setLibraryFilter':
      if (state.libraryFilter === action.filter) return state
      return { ...state, libraryFilter: action.filter }

    case 'setPathRunning':
      if (state.isPathRunning === action.running) return state
      return { ...state, isPathRunning: action.running }

    case 'openCloseConfirm':
      if (state.closeConfirmOpen) return state
      return { ...state, closeConfirmOpen: true }

    case 'closeCloseConfirm':
      if (!state.closeConfirmOpen) return state
      return { ...state, closeConfirmOpen: false }

    case 'discardSession': {
      const hadContent =
        state.messages.length > 0 || state.contexts.length > 0
      return {
        ...state,
        messages: [],
        contexts: [],
        messagesBackup: hadContent ? state.messages : state.messagesBackup,
        contextsBackup: hadContent ? state.contexts : state.contextsBackup,
        lastClearedAt: hadContent ? action.at ?? Date.now() : state.lastClearedAt,
        open: false,
        closeConfirmOpen: false,
        // Discard is a *full* close — no mini-bubble lingers afterward.
        isMinimized: false,
        // Discard also resets the dragged position + resized height so next
        // session starts fresh. Minimize preserves both (handled elsewhere).
        position: null,
        panelHeight: null,
        savePathOffered: false,
      }
    }

    case 'clearBackups': {
      if (state.messagesBackup === null && state.contextsBackup === null) {
        return state
      }
      return {
        ...state,
        messagesBackup: null,
        contextsBackup: null,
        lastClearedAt: null,
      }
    }

    case 'minimize':
      if (!state.open && state.isMinimized) return state
      return { ...state, open: false, isMinimized: true }

    case 'setPosition':
      if (
        state.position &&
        state.position.x === action.position.x &&
        state.position.y === action.position.y
      ) {
        return state
      }
      return { ...state, position: action.position }

    case 'resetPosition':
      if (state.position === null) return state
      return { ...state, position: null }

    case 'setPanelHeight':
      if (state.panelHeight === action.height) return state
      return { ...state, panelHeight: action.height }

    case 'setPanelMode':
      if (state.panelMode === action.mode) return state
      return { ...state, panelMode: action.mode }

    case 'setPanelWidth':
      if (state.panelWidth === action.px) return state
      return { ...state, panelWidth: action.px }

    case 'reopenActivity': {
      const entry = state.activity.find((e) => e.id === action.id)
      if (!entry) return state
      // Reload the snapshot into a fresh conversation; seeded entries with no
      // snapshot reopen to a minimal one-line stub from the title.
      const messages: ScoutMessage[] = entry.messages ?? [
        {
          id: nextId('scout'),
          role: 'scout',
          body: entry.description || entry.title,
          thinkingComplete: true,
        },
      ]
      return {
        ...state,
        view: 'chat',
        open: true,
        isMinimized: false,
        messages,
        contexts: [],
      }
    }

    case 'markSavePathOffered':
      if (state.savePathOffered) return state
      return { ...state, savePathOffered: true }

    case 'startBatchRun':
      return { ...state, batchRun: action.run }

    case 'completeBatchRun': {
      if (!state.batchRun) return state
      return {
        ...state,
        batchRun: {
          ...state.batchRun,
          status: 'done',
          answers: action.answers,
        },
      }
    }

    // The multi-threading actions (createThread / setActiveThread /
    // markThreadSeen / startThreadThinking / tickTimer) are handled in the
    // OUTER scoutReducer and never reach here. They're listed so the switch
    // stays exhaustive without a `never` guard tripping on them.
    case 'createThread':
    case 'setActiveThread':
    case 'markThreadSeen':
    case 'startThreadThinking':
    case 'tickTimer':
      return state

    default: {
      // Exhaustiveness guard — keeps TS honest when new actions are added.
      const _exhaustive: never = action
      void _exhaustive
      return state
    }
  }
}

// --- Bound action creators ----------------------------------------------------

export interface ScoutActions {
  setOpen: (open: boolean) => void
  toggleOpen: () => void
  setView: (view: ScoutView) => void
  dismissBubble: () => void
  pushMessage: (message: ScoutMessage) => void
  updateMessage: (id: string, partial: Partial<ScoutMessage>) => void
  appendThinking: (id: string, step: ThinkingStep) => void
  clearConversation: (at?: number) => void
  restoreLast: () => void
  undoLastTurn: () => void
  clearComposerPrefill: () => void
  addContext: (context: ContextChip) => void
  replaceContexts: (contexts: ContextChip[]) => void
  clearContexts: () => void
  removeContext: (id: string) => void
  setAddContextMode: (on: boolean) => void
  toggleAddContextMode: () => void
  dismissTour: () => void
  setSearch: (view: 'library' | 'activity', query: string) => void
  setStarredOnly: (view: 'library' | 'activity', on: boolean) => void
  toggleItemStar: (id: string) => void
  toggleThreadStar: (id: string) => void
  deleteThread: (id: string) => void
  addToast: (toast: Toast) => void
  dismissToast: (id: string) => void
  setFilterMode: (mode: FilterMode) => void
  replaceState: (partial: Partial<ScoutState>) => void
  dismissCandidate: (messageId: string) => void
  openSaveModal: (modal: SaveModalState) => void
  closeSaveModal: () => void
  updateSaveModal: (partial: Partial<SaveModalState>) => void
  updateSaveStep: (
    index: number,
    partial: Partial<SaveModalState['steps'][number]>,
  ) => void
  reorderSaveStep: (index: number, direction: -1 | 1) => void
  saveItem: (item: SavedItem, sourceMessageId: string | null) => void
  shareItem: (id: string, target: ShareTarget) => void
  openShareModal: (id: string) => void
  closeShareModal: () => void
  setLibraryFilter: (filter: LibraryFilter) => void
  setPathRunning: (running: boolean) => void
  openCloseConfirm: () => void
  closeCloseConfirm: () => void
  discardSession: (at?: number) => void
  clearBackups: () => void
  minimize: () => void
  setPosition: (position: { x: number; y: number }) => void
  resetPosition: () => void
  setPanelHeight: (height: number | null) => void
  setPanelMode: (mode: PanelMode) => void
  setPanelWidth: (px: number) => void
  reopenActivity: (id: string) => void
  markSavePathOffered: () => void
  // Aggregate-over-selection ask: opens the panel if closed, pushes a user
  // question + a Scout answer (promptId 'agg-selection', mode 'multi-row'),
  // stamping `contextLabel = label` on both. Reuses askScout plumbing.
  askAboutSelection: (rowIds: string[], label: string) => Promise<void>
  // Begin a batch run across the given rows. Generates a deterministic id and
  // sets batchRun status 'running'. Returns the new run id.
  startBatchRun: (args: {
    pathId: string
    pathLabel: string
    rowIds: string[]
  }) => string
  // Fill batch answers (rowId -> AnswerBody) and flip status to 'done'.
  completeBatchRun: (answers: Record<string, AnswerBody>) => void
  // Push the precomputed batch answer for one row as a row-scoped Scout
  // message (mode 'row', batchRunId set). No-op unless the run is done and an
  // answer exists for that row.
  showBatchAnswerForRow: (rowId: string) => void

  // --- Multi-threading (THR-*) ---
  // Create a new thread (stacks on top) and return its id. Pass rowId null +
  // isStream true only for a stream thread (the seed already provides one).
  createThread: (rowId: string | null, contextLabel: string) => string
  // Focus a thread: snapshots the current active thread, loads the target's
  // slices into the mirror, marks the target 'viewed'.
  setActiveThread: (threadId: string) => void
  // Mark a thread 'viewed' (clears its unseen/ready indicator) without focusing.
  markThreadSeen: (threadId: string) => void
  // Flip a thread to 'in-progress' with the given readyAt (epoch ms). The
  // global timer flips it to 'ready' once simNow >= readyAt.
  startThreadThinking: (threadId: string, readyAt: number) => void
  // Single shell timer tick — advances simNow + flips ready threads.
  tickTimer: (nowMs: number) => void
  // Resolve the thread for a row (existing or new), focus it, and return its
  // id. Pass rowId null to resolve the stream thread. `contextLabel` is used
  // only when a new thread must be created.
  ensureThreadForRow: (
    rowId: string | null,
    contextLabel: string,
  ) => string
}

const buildActions = (
  dispatch: Dispatch<ScoutAction>,
  getState: () => ScoutState,
): ScoutActions => ({
  setOpen: (open) => dispatch({ type: 'setOpen', open }),
  toggleOpen: () => dispatch({ type: 'toggleOpen' }),
  setView: (view) => dispatch({ type: 'setView', view }),
  dismissBubble: () => dispatch({ type: 'dismissBubble' }),
  pushMessage: (message) => dispatch({ type: 'pushMessage', message }),
  updateMessage: (id, partial) =>
    dispatch({ type: 'updateMessage', id, partial }),
  appendThinking: (id, step) =>
    dispatch({ type: 'appendThinking', id, step }),
  clearConversation: (at) => dispatch({ type: 'clearConversation', at }),
  restoreLast: () => dispatch({ type: 'restoreLast' }),
  undoLastTurn: () => dispatch({ type: 'undoLastTurn' }),
  clearComposerPrefill: () => dispatch({ type: 'clearComposerPrefill' }),
  addContext: (context) => dispatch({ type: 'addContext', context }),
  replaceContexts: (contexts) =>
    dispatch({ type: 'replaceContexts', contexts }),
  clearContexts: () => dispatch({ type: 'clearContexts' }),
  removeContext: (id) => dispatch({ type: 'removeContext', id }),
  setAddContextMode: (on) => dispatch({ type: 'setAddContextMode', on }),
  toggleAddContextMode: () => dispatch({ type: 'toggleAddContextMode' }),
  dismissTour: () => dispatch({ type: 'dismissTour' }),
  setSearch: (view, query) =>
    dispatch({ type: 'setSearch', view, query }),
  setStarredOnly: (view, on) => dispatch({ type: 'setStarredOnly', view, on }),
  toggleItemStar: (id) => dispatch({ type: 'toggleItemStar', id }),
  toggleThreadStar: (id) => dispatch({ type: 'toggleThreadStar', id }),
  deleteThread: (id) => dispatch({ type: 'deleteThread', id }),
  addToast: (toast) => dispatch({ type: 'addToast', toast }),
  dismissToast: (id) => dispatch({ type: 'dismissToast', id }),
  setFilterMode: (mode) => dispatch({ type: 'setFilterMode', mode }),
  replaceState: (partial) => dispatch({ type: 'replaceState', partial }),
  dismissCandidate: (messageId) =>
    dispatch({ type: 'dismissCandidate', messageId }),
  openSaveModal: (modal) => dispatch({ type: 'openSaveModal', modal }),
  closeSaveModal: () => dispatch({ type: 'closeSaveModal' }),
  updateSaveModal: (partial) =>
    dispatch({ type: 'updateSaveModal', partial }),
  updateSaveStep: (index, partial) =>
    dispatch({ type: 'updateSaveStep', index, partial }),
  reorderSaveStep: (index, direction) =>
    dispatch({ type: 'reorderSaveStep', index, direction }),
  saveItem: (item, sourceMessageId) =>
    dispatch({ type: 'saveItem', item, sourceMessageId }),
  shareItem: (id, target) => dispatch({ type: 'shareItem', id, target }),
  openShareModal: (id) => dispatch({ type: 'openShareModal', id }),
  closeShareModal: () => dispatch({ type: 'closeShareModal' }),
  setLibraryFilter: (filter) => dispatch({ type: 'setLibraryFilter', filter }),
  setPathRunning: (running) =>
    dispatch({ type: 'setPathRunning', running }),
  openCloseConfirm: () => dispatch({ type: 'openCloseConfirm' }),
  closeCloseConfirm: () => dispatch({ type: 'closeCloseConfirm' }),
  discardSession: (at) => dispatch({ type: 'discardSession', at }),
  clearBackups: () => dispatch({ type: 'clearBackups' }),
  minimize: () => dispatch({ type: 'minimize' }),
  setPosition: (position) => dispatch({ type: 'setPosition', position }),
  resetPosition: () => dispatch({ type: 'resetPosition' }),
  setPanelHeight: (height) => dispatch({ type: 'setPanelHeight', height }),
  setPanelMode: (mode) => dispatch({ type: 'setPanelMode', mode }),
  setPanelWidth: (px) => dispatch({ type: 'setPanelWidth', px }),
  reopenActivity: (id) => dispatch({ type: 'reopenActivity', id }),
  markSavePathOffered: () => dispatch({ type: 'markSavePathOffered' }),

  askAboutSelection: async (rowIds, label) => {
    // Open the panel if it's closed so the answer is visible.
    if (!getState().open) dispatch({ type: 'setOpen', open: true })

    const question = `Summarize the ${rowIds.length} selected rows`
    const userMessage: ScoutMessage = {
      id: nextId('user'),
      role: 'user',
      body: question,
      mode: 'multi-row',
      contextLabel: label,
    }
    dispatch({ type: 'pushMessage', message: userMessage })

    const scoutId = nextId('scout')
    const placeholder: ScoutMessage = {
      id: scoutId,
      role: 'scout',
      body: '',
      thinking: [],
      thinkingComplete: false,
      mode: 'multi-row',
      contextLabel: label,
    }
    dispatch({ type: 'pushMessage', message: placeholder })

    try {
      const answer = await askScout(
        { promptId: 'agg-selection', contexts: getState().contexts },
        (step) =>
          dispatch({ type: 'appendThinking', id: scoutId, step }),
      )
      dispatch({
        type: 'updateMessage',
        id: scoutId,
        partial: {
          body: answer.body,
          sources: answer.sources,
          confidence: answer.confidence,
          thinkingComplete: true,
          promptId: 'agg-selection',
          question,
          mode: 'multi-row',
          contextLabel: label,
          ...(answer.followUps ? { followUps: answer.followUps } : {}),
          ...(answer.actions ? { actions: answer.actions } : {}),
          ...(answer.confidenceNote
            ? { confidenceNote: answer.confidenceNote }
            : {}),
        },
      })
    } catch {
      dispatch({
        type: 'updateMessage',
        id: scoutId,
        partial: {
          body: "Scout couldn't summarize that selection. Your data is unchanged — try again.",
          confidence: 'Low',
          thinkingComplete: true,
        },
      })
    }
  },

  startBatchRun: ({ pathId, pathLabel, rowIds }) => {
    const id = nextId('batch')
    const run: BatchRun = {
      id,
      pathId,
      pathLabel,
      rowIds,
      status: 'running',
    }
    dispatch({ type: 'startBatchRun', run })
    return id
  },

  completeBatchRun: (answers) =>
    dispatch({ type: 'completeBatchRun', answers }),

  createThread: (rowId, contextLabel) => {
    const id = nextId('thread')
    dispatch({
      type: 'createThread',
      id,
      rowId,
      contextLabel,
      at: getState().simNow || Date.now(),
    })
    return id
  },

  setActiveThread: (threadId) =>
    dispatch({ type: 'setActiveThread', id: threadId }),

  markThreadSeen: (threadId) =>
    dispatch({ type: 'markThreadSeen', id: threadId }),

  startThreadThinking: (threadId, readyAt) =>
    dispatch({ type: 'startThreadThinking', id: threadId, readyAt }),

  tickTimer: (nowMs) => dispatch({ type: 'tickTimer', now: nowMs }),

  ensureThreadForRow: (rowId, contextLabel) => {
    const { threads, activeThreadId } = getState()
    // Non-row ask (composer free-text, welcome prompt): continue the chat the
    // user is currently in; if none is active, start a fresh general chat.
    if (rowId == null) {
      if (activeThreadId && threads.some((t) => t.id === activeThreadId)) {
        dispatch({ type: 'setActiveThread', id: activeThreadId })
        return activeThreadId
      }
      const id = nextId('thread')
      const at = getState().simNow || Date.now()
      dispatch({ type: 'createThread', id, rowId: null, contextLabel, at })
      dispatch({ type: 'setActiveThread', id })
      return id
    }
    // Row chat: reuse this row's chat if it exists, else create one.
    const existing = threads.find((t) => t.rowId === rowId)
    if (existing) {
      dispatch({ type: 'setActiveThread', id: existing.id })
      return existing.id
    }
    const id = nextId('thread')
    const at = getState().simNow || Date.now()
    dispatch({ type: 'createThread', id, rowId, contextLabel, at })
    dispatch({ type: 'setActiveThread', id })
    return id
  },

  showBatchAnswerForRow: (rowId) => {
    const { batchRun, contexts } = getState()
    if (!batchRun || batchRun.status !== 'done') return
    const body = batchRun.answers?.[rowId]
    if (body === undefined) return
    // Best-effort context label: a matching active chip, else the row id.
    const chip = contexts.find(
      (c) => (c.kind === 'row' || c.kind === 'cell') && c.rowId === rowId,
    )
    const message: ScoutMessage = {
      id: nextId('scout'),
      role: 'scout',
      body,
      thinkingComplete: true,
      rowId,
      mode: 'row',
      batchRunId: batchRun.id,
      ...(chip?.label ? { contextLabel: chip.label } : {}),
    }
    dispatch({ type: 'pushMessage', message })
  },
})

// --- Context + provider + hook -----------------------------------------------

export interface ScoutContextValue {
  state: ScoutState
  dispatch: Dispatch<ScoutAction>
  actions: ScoutActions
  // --- Derived multi-threading selectors (recomputed each render) ---
  // All threads (row threads + the stream thread), newest-created first by
  // convention (createThread prepends). Convenience mirror of state.threads.
  threads: Thread[]
  // The currently-focused thread id (mirror of state.threads' active member).
  activeThreadId: string | null
  // The active thread object, or null (only transiently) if it can't resolve.
  activeThread: Thread | null
  // THR-6 / ALR-3 — number of Ready/unseen threads (drives the unseen badge).
  unseenCount: number
  // ALR-4 — 'thinking' | 'ready' | 'idle' for the cross-page name tag.
  scoutActivityState: ScoutActivityState
  // Simulated now in epoch ms (advanced by the shell timer). Drives countdowns.
  simNow: number
}

const ScoutContext = createContext<ScoutContextValue | null>(null)

export interface ScoutProviderProps {
  children: ReactNode
}

export const ScoutProvider = ({ children }: ScoutProviderProps) => {
  const [state, dispatch] = useReducer(scoutReducer, initialScoutState)

  // Keep a ref to the latest state so `getState()` is always current without
  // forcing the actions object to change identity each render. Used by the dev
  // hook and by composed actions (askAboutSelection / showBatchAnswerForRow)
  // that must read live state at call time.
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // `actions` is stable across renders because dispatch + getState are stable —
  // bind once. `getState` reads the live `stateRef`.
  const actions = useMemo(
    () => buildActions(dispatch, () => stateRef.current),
    [dispatch],
  )

  // Dev-only window hook for inspection + scripted drives.
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const w = window as unknown as { __scout__?: unknown }
    w.__scout__ = {
      getState: () => stateRef.current,
      dispatch,
      actions,
    }
    return () => {
      // Only clear if we still own the slot — avoids stomping a re-mount.
      if (
        (w.__scout__ as { dispatch?: unknown } | undefined)?.dispatch ===
        dispatch
      ) {
        delete w.__scout__
      }
    }
  }, [dispatch, actions])

  const value = useMemo<ScoutContextValue>(() => {
    const activeThread =
      state.threads.find((t) => t.id === state.activeThreadId) ?? null
    return {
      state,
      dispatch,
      actions,
      threads: state.threads,
      activeThreadId: state.activeThreadId,
      activeThread,
      unseenCount: selectUnseenCount(state),
      scoutActivityState: selectScoutActivityState(state),
      simNow: state.simNow,
    }
  }, [state, dispatch, actions])

  return (
    <ScoutContext.Provider value={value}>
      <ScoutTimerRunner />
      {children}
    </ScoutContext.Provider>
  )
}

// Internal: runs the single shell timer engine. Rendered once, inside the
// provider, so the interval lives for the provider's lifetime and survives
// route changes (TMR-3). Imported lazily-by-reference to avoid a circular
// module load at evaluation time (useScoutTimer imports useScout from here).
const ScoutTimerRunner = (): null => {
  useScoutTimer()
  return null
}

export const useScout = (): ScoutContextValue => {
  const ctx = useContext(ScoutContext)
  if (!ctx) throw new Error('useScout must be used inside <ScoutProvider>')
  return ctx
}
