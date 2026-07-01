// Scout — public entry point.
//
// Anything Scout-related the rest of the app needs (toolbar trigger, modal,
// provider) is re-exported from here. Consumers should import from
// `@modules/Scout` (or a relative path equivalent) and never reach into
// `./components/*` directly.
//
// Nothing here renders by default — components are placeholders until wired up.
// See `./README.md` for layout and the faked-brain disclaimer.

// Side-effect import: pulls in the Scout design tokens (scoped under
// `.scout-scope`). Any consumer of this barrel automatically gets the tokens.
import './styles/scout.css'

export { ScoutTrigger } from './components/ScoutTrigger'
export { ScoutPanel } from './components/ScoutPanel'
export { ScoutIntroBubble } from './components/ScoutIntroBubble'
export { ScoutShortcuts } from './components/ScoutShortcuts'
export { ScoutEmptyState } from './components/ScoutEmptyState'
export { ScoutModal } from './components/ScoutModal'
export { ScoutComposer } from './components/ScoutComposer'
export { ScoutMessageList } from './components/ScoutMessageList'
export { ScoutBubble } from './components/ScoutBubble'
export { ScoutRowDivider } from './components/ScoutRowDivider'
export { ScoutHistoryFilter } from './components/ScoutHistoryFilter'
export { ScoutChips } from './components/ScoutChips'
export { ScoutAnswerBody } from './components/ScoutAnswerBody'
export { ScoutThinkingSteps } from './components/ScoutThinkingSteps'
export { ScoutRowTag } from './components/ScoutRowTag'
export { ScoutConfidence } from './components/ScoutConfidence'
export { ScoutActionChips } from './components/ScoutActionChips'
export { ScoutDetails } from './components/ScoutDetails'
export { ScoutAnswerFooter } from './components/ScoutAnswerFooter'
export { ScoutFeedbackForm } from './components/ScoutFeedbackForm'
export { ScoutFeedbackReceipt } from './components/ScoutFeedbackReceipt'
export { ScoutFollowUps } from './components/ScoutFollowUps'
export { ScoutLibrary } from './components/ScoutLibrary'
export { ScoutActivity } from './components/ScoutActivity'
export { ScoutPathCandidate } from './components/ScoutPathCandidate'
export { ScoutSaveModal } from './components/ScoutSaveModal'
export { ScoutShareModal } from './components/ScoutShareModal'
export { ScoutActiveBodyClass } from './components/ScoutActiveBodyClass'
export { ScoutContextChips } from './components/ScoutContextChips'
export { ScoutColumnLegend } from './components/ScoutColumnLegend'
export { ScoutTourTrigger } from './components/ScoutTourTrigger'
export { ScoutViewNav } from './components/ScoutViewNav'
export { ScoutViewSearch } from './components/ScoutViewSearch'
export { ScoutBookmarkIcon } from './components/ScoutBookmarkIcon'
export { ScoutToastHost } from './components/ScoutToastHost'
export { ScoutCloseConfirm } from './components/ScoutCloseConfirm'
export { ScoutMini } from './components/ScoutMini'

export {
  ScoutProvider,
  useScout,
  activeActivityEntries,
  selectUnseenCount,
  selectScoutActivityState,
  SCOUT_THINK_MS,
  STREAM_THREAD_ID,
} from './state/ScoutContext'
export type {
  ScoutState,
  ScoutContextValue,
  ScoutActions,
} from './state/ScoutContext'
export { SUBJECT_TAG_LABELS } from './types'
export type {
  PanelMode,
  SubjectTag,
  Thread,
  ThreadStatus,
  ScoutActivityState,
} from './types'
export { useScoutAsk } from './state/useScoutAsk'
export { useScoutTimer } from './state/useScoutTimer'
export { useScoutRunPath } from './state/useScoutRunPath'
export { detectPathCandidate } from './state/detectPathCandidate'
export { ScoutGlobalSurfaces } from './components/ScoutGlobalSurfaces'

export { askScout } from './services/fakeLlm'
export type { ScoutMessage } from './services/fakeLlm'
export { toPlainText } from './services/answerToPlainText'
export { buildBatchAnswers } from './services/batchAnswers'
