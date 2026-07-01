// Scout — shared TypeScript contracts.
//
// Lives here so the state store, fake LLM service, and components all agree on
// the same shapes. Add types here when they cross a file boundary; keep
// component-internal types co-located with their component.
//
// Source of truth: the wireframe's global `state` object and LLM scenarios
// in Kit Round 4 - Gizmo Option A/gizmo-demo.html.

// --- Enums / string unions ---

export type ScoutView = 'chat' | 'library' | 'activity'

// Panel docking mode. 'floating' keeps the draggable/resizable floating panel
// (existing position/panelHeight state); 'sidebar' docks it to a fixed-width
// rail (panelWidth state). They use independent geometry state.
export type PanelMode = 'floating' | 'sidebar'

// Subject-matter tag attached to saved items / save modal. Fixed three-value
// vocabulary; render via SUBJECT_TAG_LABELS.
export type SubjectTag = 'terminal-arbs' | 'lower-of-contract' | 'valuation'

export const SUBJECT_TAG_LABELS: Record<SubjectTag, string> = {
  'terminal-arbs': 'Terminal arbs',
  'lower-of-contract': 'Lower of contract',
  valuation: 'Valuation',
}

export type MessageRole = 'user' | 'scout'

// --- Multi-threading (THR-*) ---
//
// A Thread is a conversation anchored to one quote row (OBJ-2). The existing
// single-stream chat becomes ONE default stream thread (rowId null, isStream
// true) that coexists with row threads (THR-7).
//
// Status lifecycle (OBJ-4): 'in-progress' (Scout thinking, live indicator) ->
// 'ready' (answer available, user hasn't looked) -> 'viewed' (nothing left to do).
// Transitions in-progress -> ready are driven ONLY by the global timer engine
// (TMR-4), never by askScout resolving.
export type ThreadStatus = 'in-progress' | 'ready' | 'viewed'

export interface Thread {
  id: string
  // null = the default stream / general thread (OBJ-3).
  rowId: string | null
  // Human label of the row context, e.g. "Casey / Lubricant / LAS VEGAS NV -
  // 910" | "General".
  contextLabel: string
  status: ThreadStatus
  // This thread's own conversation slices. The top-level state.messages /
  // state.contexts MIRROR the ACTIVE thread's arrays so existing components
  // keep reading state.messages untouched.
  messages: ScoutMessage[]
  contexts: ContextChip[]
  createdAt: number
  lastActivityAt: number
  // Epoch ms when an in-progress thread flips to 'ready'. Set on ask
  // (startedAt + ~10s); cleared (null) once the timer flips it to 'ready'.
  readyAt: number | null
  // Inbox + alert-card previews.
  lastQuestion?: string
  answerPreview?: string
  // True for the single default stream thread.
  isStream?: boolean
  // Favorite flag — toggled from the inbox card ⋯ menu; drives the inbox
  // "★ Favorites" filter and is inherited by a SavedItem when the chat is saved.
  starred?: boolean
}

// Derived Scout activity for the cross-page name tag (ALR-4):
//   'thinking' — at least one thread is in-progress
//   'ready'    — no in-progress, but at least one unseen-ready thread
//   'idle'     — nothing worth surfacing
export type ScoutActivityState = 'idle' | 'thinking' | 'ready'

export type ConfidenceLabel = 'High' | 'Medium' | 'Low'

export type FilterMode = 'all' | 'row'

export type ContextKind = 'row' | 'cell' | 'selection'

export type PathScope = 'row' | 'agg'

export type MessageMode = 'aggregate' | 'row' | 'multi-row'

// --- Conversation primitives ---

export interface ThinkingStep {
  id: string
  label: string
  // Delay in ms before this step renders, relative to the previous step.
  delayMs?: number
}

export interface Source {
  id: string
  label: string
  // Optional richer fields — used when the wireframe renders source detail.
  detail?: string
  href?: string
}

// A suggested next question shown as a chip after an answer. `promptId` maps
// 1:1 to a scenario in `services/fakeLlm.ts` so clicking it yields a real
// canned answer.
export interface FollowUp {
  promptId: string
  label: string
}

// Inline action chip at the end of an answer body. `kind` distinguishes an
// "open" action (would switch the quote-book filter / jump scroll) from an
// "apply" action; both fire a toast in the prototype. Destructive actions
// never become chips (spec §action chips).
export interface ActionChip {
  id: string
  label: string
  kind: 'open' | 'apply' | 'export' | 'copy'
}

// Negative-feedback capture. `reason` is one of three fixed choices; `note` is
// the optional free-text the user adds in the inline feedback form.
export type FeedbackReason = 'wrong-data' | 'misread' | 'made-up'

export interface MessageFeedback {
  reason: FeedbackReason
  note?: string
}

// A single label → value line inside a `breakdown` block. `total: true` renders
// the emphasized summary row (top divider, bold) — e.g. the cost/proposed total.
export interface BreakdownRow {
  label: string
  value: string
  total?: boolean
}

// Answer body: a plain string (single paragraph) OR a list of structured
// blocks the renderer in `ScoutAnswerBody` knows how to draw.
//
// `breakdown` is the wireframe's `.reason` card (gizmo-demo.html) — a compact
// two-column label/value decomposition for the quantitative parts of an answer
// that read poorly as prose (cost builds, cluster counts, peer bands). Use it
// instead of `table` whenever the data is just label → value pairs.
export type AnswerBlock =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'table'; columns: string[]; rows: string[][] }
  | { kind: 'breakdown'; title?: string; rows: BreakdownRow[] }
  // RSP-3 — a downloadable CSV stand-in. Rendering (a click-to-download chip /
  // row) is the Response agent's job; this only declares the shape.
  | {
      kind: 'csv-link'
      label: string
      filename: string
      rows: number
      columns: number
    }

export type AnswerBody = string | AnswerBlock[]

export interface ScoutMessage {
  id: string
  role: MessageRole
  body: AnswerBody
  thinking?: ThinkingStep[]
  // When true, every step in `thinking` renders as "done". When false / unset,
  // the last step in `thinking` is "active" and earlier steps are "done".
  thinkingComplete?: boolean
  sources?: Source[]
  confidence?: ConfidenceLabel
  rowId?: string
  // Full human label of the row/cell context captured at ask time, copied
  // from the matched ContextChip.label (e.g. "Casey / Lubricant / LAS VEGAS
  // NV - 910"). Drives the legibility marker / row divider in the message list.
  contextLabel?: string
  // Scope-group / field key of the cell context (matched ContextChip.columnId).
  // Used as the hover-highlight target column when this message is hovered.
  columnId?: string
  // Links a precomputed batch answer back to its originating BatchRun.id.
  batchRunId?: string
  mode?: MessageMode
  // Phase 6 — preserved on every Scout answer + replayed by the runner.
  promptId?: string
  // Human-readable question used as the path step label.
  question?: string
  // Phase 6 — detector flags. `candidate` makes the inline save-prompt visible
  // under the latest answer; `candidateScope` propagates through into the
  // saved path so re-runs know if a row chip is required.
  candidate?: boolean
  candidateScope?: PathScope
  // Phase 6 — once a step has been used in a saved path, the detector skips
  // it so the candidate naturally shrinks after each save (per wireframe).
  usedInPath?: boolean
  // Suggested next questions, rendered as chips at the conversation tail when
  // this is the latest completed answer. Carried over from the scenario.
  followUps?: FollowUp[]
  // Inline action chips at the end of the answer body. Carried from the scenario.
  actions?: ActionChip[]
  // Optional one-line reason riding alongside the confidence badge
  // (e.g. "single sample"). Renders as "· <note>" after the level.
  confidenceNote?: string
  // Answer-footer state. `rating` is the mutually-exclusive thumb selection;
  // `saved` flips true once this answer's question has been promoted to the
  // Library (drives the bookmark Save → Saved control); `feedback` holds a
  // submitted thumbs-down reason + note (its presence swaps the inline form
  // for a receipt).
  rating?: 'up' | 'down'
  saved?: boolean
  feedback?: MessageFeedback
}

// --- Context chips (Phase 4) ---

export interface ContextChip {
  id: string
  kind: ContextKind
  label: string
  rowId?: string
  // For scope chips columnId carries the column-group key ('benchmark',
  // 'proposed', 'margin', 'delta', 'flags'); for cell chips it carries the
  // AG Grid `field` of the specific cell.
  columnId?: string
  // True when the user added this chip via the +Add control (kind 'cell'),
  // a row-click while in add-context mode, or an explicit "stack" gesture.
  // Drives the replace-vs-append rule in Phase 4.6.
  explicit?: boolean
}

// --- Batch runs ---

// A precomputed "run this path across N selected rows" job. `status` flips
// from 'running' to 'done' once `answers` (rowId → AnswerBody) are filled.
// IDs are deterministic (incrementing counter), never clock/random based.
export interface BatchRun {
  id: string
  pathId: string
  pathLabel: string
  rowIds: string[]
  status: 'running' | 'done'
  answers?: Record<string, AnswerBody>
}

// --- Saved paths (Phase 6) ---

export interface PathStep {
  id: string
  label: string
  // Filled in as Phase 6 lands.
  detail?: string
  // Phase 6 — replay metadata so the runner can reproduce the original ask.
  promptId?: string
  mode?: MessageMode
}

// A saved item is the single object behind the Library (save-model
// consolidation). `steps` of length 1 is a reusable *prompt*; length n is an
// ordered *path*. `kind` is derived from step count at save time and stored
// so cards/filters don't recompute it. Replaces the former SavedPath +
// SavedPrompt split.
export type SavedItemKind = 'prompt' | 'path'

// A teammate you can share saved items with (fake roster in `services/team.ts`).
export interface FakeUser {
  id: string
  name: string
  initials: string
}

// Where a saved item has been shared. `team` = everyone internal; `people` =
// a hand-picked set of users. AG was explicit: no subgroups, just these two.
export type ShareTarget =
  | { scope: 'team' }
  | { scope: 'people'; userIds: string[] }

export interface SavedItem {
  id: string
  name: string
  description: string
  steps: PathStep[]
  scope: PathScope
  // Favorite flag (was `bookmarked`) — toggled in the Library, drives the
  // "Starred only" filter.
  starred: boolean
  kind: SavedItemKind
  // Set when *you* share this item out — drives the "Shared · team / N people"
  // badge. Undefined ⇒ not shared by you.
  sharedWith?: ShareTarget
  // Provenance: the name of whoever shared this item *to* you. Present only on
  // received items; absent ⇒ the item is yours. This is the owned-vs-received
  // discriminator the Library filter reads.
  sharedBy?: string
  // OBJ-3 / SAV-1 / LIB-2 — optional subject-matter tag for grouping + filter.
  subject?: SubjectTag
}

// --- Library (Phase 5) ---

export interface LibraryState {
  items: SavedItem[]
}

// Library ownership filter: everything, only items you created, or only items
// shared to you. Sits alongside the "Starred only" + search filters.
export type LibraryFilter = 'all' | 'yours' | 'shared'

// --- Activity (Phase 5) ---

export interface ActivityEntry {
  id: string
  title: string
  // Short summary of the answer that was given (shown under the title).
  description: string
  // Wall-clock timestamp in ms for "3 min ago" rendering.
  when: number
  // ACT-1/2 — unique row ids this conversation touched (gathered from the
  // archived messages' rowId / context). Empty for book-level conversations.
  rowIds: string[]
  // How the entry was created: 'clear' = auto-archived on Clear; 'seed' =
  // fixture seeded at boot.
  source: 'clear' | 'seed'
  // ACT-5 — full conversation snapshot so the entry can be reopened verbatim.
  // Seeded fixtures may omit this (reopen falls back to a minimal stub).
  messages?: ScoutMessage[]
}

// --- Per-view UI state (Phase 5) ---

export interface ViewSearchState {
  library: string
  activity: string
}

// "Starred only" filter — per view. Library favorites a SavedItem; Activity
// favorites a chat thread.
export interface ViewStarredOnlyState {
  library: boolean
  activity: boolean
}

// --- Save modal (generalized from the former path modal) ---

// A step inside the modal carries an extra `dropped` flag so the user can
// toggle it off without losing the original order if they restore it. Editing
// is remove-only (drop / reorder / relabel) — adding steps is authoring and
// belongs to the separate path-builder, not this lightweight save.
export interface SaveModalStep extends PathStep {
  dropped: boolean
}

export interface SaveModalState {
  // Triggering message id — used to clear the candidate flag on save.
  sourceMessageId: string | null
  scope: PathScope
  name: string
  description: string
  steps: SaveModalStep[]
  // When true, the inline step editor is expanded inside the modal.
  editorOpen: boolean
  // SAV-1 — optional subject-matter tag chosen in the modal, carried onto the
  // SavedItem on save.
  subject?: SubjectTag
  // SAV-3 — when set, the modal is EDITING an existing Library item rather than
  // creating a new one. `saveItem` replaces the item with this id in place
  // (preserving its favorite + share provenance). Undefined ⇒ create-new.
  editingItemId?: string | null
  // When saving from a favorited chat, the created SavedItem inherits the star.
  starred?: boolean
}

// --- Toasts (Phase 7) ---

export type ToastKind = 'info' | 'success' | 'warn' | 'error'

export interface Toast {
  id: string
  text: string
  kind?: ToastKind
}

// --- Top-level state shape ---

export interface ScoutState {
  open: boolean
  view: ScoutView
  messages: ScoutMessage[]
  contexts: ContextChip[]
  library: LibraryState
  activity: ActivityEntry[]
  messagesBackup: ScoutMessage[] | null
  contextsBackup: ContextChip[] | null
  lastClearedAt: number | null
  filterMode: FilterMode
  toasts: Toast[]
  bubbleDismissed: boolean
  // Phase 4 — when true, the next grid cell click adds a chip instead of
  // replacing the default row chip.
  addContextMode: boolean
  // Phase 4.3 — "How cell colors work" tour popover dismissal flag.
  tourDismissed: boolean
  // Phase 5 — search queries persist per-view so switching views keeps state.
  search: ViewSearchState
  // "Starred only" filter (Library).
  starredOnly: ViewStarredOnlyState
  // null when the Save modal is closed.
  saveModal: SaveModalState | null
  // Phase 6 — runner busy flag; library Run buttons disable while true.
  isPathRunning: boolean
  // Phase 7.2 — close-confirmation modal flag. Always raised by the header
  // Close button so the user can choose Minimize / Discard / Cancel.
  closeConfirmOpen: boolean
  // Phase 7.1b — distinguishes "minimized" (mini-bubble visible, state kept)
  // from "fully closed" (no mini-bubble, panel + state both gone after
  // discard). Only true while the user has minimized and not yet re-opened or
  // discarded.
  isMinimized: boolean
  // Phase 7.1c — user-dragged panel position. `null` means "use the default
  // top:50px right:16px dock"; set to absolute viewport coords once the user
  // has dragged the panel anywhere. Persists across minimize/restore.
  // Reset to `null` only on `discardSession` (full close).
  position: { x: number; y: number } | null
  // Phase 7.1d — user-resized panel height in px. `null` means "auto-fit to
  // content (capped at 80vh)"; a number pins an explicit height (content then
  // scrolls). Width is never user-adjustable. Persists across minimize;
  // reset to `null` on discard.
  panelHeight: number | null
  // PNL-1..4 — panel docking mode. 'floating' uses position/panelHeight;
  // 'sidebar' docks to a fixed-width rail sized by panelWidth.
  panelMode: PanelMode
  // PNL — sidebar-mode width in px (ignored in floating mode).
  panelWidth: number
  // True once the inline save-path prompt has been auto-offered in this
  // conversation. Gates the prompt to appear only the first time the
  // conversation becomes saveable; reset on clear / discard. The header
  // save-path button is independent of this flag (it reads the live detector).
  savePathOffered: boolean
  // Hand-off slot for the header Undo control: when a turn is stepped back,
  // the removed question's text lands here so ScoutComposer can re-fill its
  // (local-state) input. The composer reads it once, then clears it back to
  // null. null = nothing pending.
  composerPrefill: string | null
  // Id of the saved item whose Share modal is open; null when closed.
  shareModalItemId: string | null
  // Library ownership filter (All / Yours / Shared with you).
  libraryFilter: LibraryFilter
  // Active "run path across selection" batch job; null when none in flight.
  batchRun: BatchRun | null
  // --- Multi-threading (THR-*) ---
  // All threads (row threads + the single stream thread). Seeded with exactly
  // one stream thread (isStream, rowId null, status 'viewed') so empty-state and
  // existing flows are unchanged.
  threads: Thread[]
  // The thread whose messages/contexts currently mirror into state.messages /
  // state.contexts. Never null after init (seeded to the stream thread).
  activeThreadId: string | null
  // Simulated "now" in epoch ms, advanced by the shell timer engine
  // (useScoutTimer dispatching tickTimer). Drives countdowns + status flips.
  simNow: number
}

// --- Fake LLM service ---

export interface AskScoutRequest {
  promptId?: string
  freeText?: string
  contexts: ContextChip[]
}

export interface ScoutAnswer {
  body: AnswerBody
  sources: Source[]
  confidence: ConfidenceLabel
  // Phase 6 — 'agg' for book-level answers, 'row' for row-scoped ones.
  // Drives candidate detection + path-runner gating.
  mode?: PathScope
  // Suggested next questions surfaced as tail chips after this answer.
  followUps?: FollowUp[]
  // Inline action chips at the end of the body.
  actions?: ActionChip[]
  // Optional one-line note shown alongside the confidence badge.
  confidenceNote?: string
}

export interface LlmScenario {
  promptId: string
  // Ordered thinking steps — yielded one by one with delayMs between them.
  steps: ThinkingStep[]
  answer: ScoutAnswer
}
