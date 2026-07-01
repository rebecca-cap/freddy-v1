// useScoutAsk — the one place that ties composer / chip / programmatic
// triggers to the fake LLM. Returns a single `ask({ promptId?, freeText? })`
// function that:
//   1. pushes a user message into state.messages with the prompt label,
//   2. pushes a placeholder Scout message (empty body, empty thinking[]),
//   3. streams thinking steps into the placeholder as they yield (via the
//      `appendThinking` reducer action — pure, no stale-closure problems),
//   4. fills in body / sources / confidence when the scenario resolves,
//   5. stamps promptId + question + mode on the answer so the Phase 6
//      detector can decide if the conversation is now a path candidate.
//
// Phase 3.8 wireframe reference: `ask()` inside gizmo-demo.html (~line 3020).
// Phase 6.5 additions: `mode` carries through from the scenario; rowId comes
// from the first row chip in `state.contexts` (if any); the detector runs
// once per answer and flips `candidate` on the latest scout message.

import { useCallback } from 'react'

import { askScout } from '../services/fakeLlm'
import type { ScoutMessage, MessageMode, PathScope } from '../types'

import { detectPathCandidate } from './detectPathCandidate'
import { SCOUT_THINK_MS, useScout } from './ScoutContext'

export interface AskOptions {
  promptId?: string
  freeText?: string
  // Display label for the user bubble. Defaults to `freeText` for free-text
  // submits, or `promptId` if neither label nor freeText is given (rare).
  label?: string
}

const makeId = (prefix: string): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
}

// Map the fake-LLM's `mode` ('agg' | 'row' | undefined) onto our `MessageMode`
// union — keeps ScoutMessage compatible with Phase 4's column-scoped
// semantics while still letting Phase 6 read the same field.
const toMessageMode = (
  mode: PathScope | undefined,
): MessageMode | undefined => {
  if (mode === 'agg') return 'aggregate'
  if (mode === 'row') return 'row'
  return undefined
}

export const useScoutAsk = () => {
  const { state, actions } = useScout()

  const ask = useCallback(
    async ({ promptId, freeText, label }: AskOptions) => {
      const text = label ?? freeText ?? promptId ?? ''
      if (!text) return

      // Phase 7.5 — starting a new conversational turn after a clear/discard
      // nullifies the undo backup. The user has chosen to move on; the buried
      // backup is no longer recoverable through the header Undo control.
      if (state.messagesBackup !== null || state.contextsBackup !== null) {
        actions.clearBackups()
      }

      // Pluck the first row/cell chip — used to stamp `rowId` on the answer so
      // the detector knows whether we're row-scoped.
      const rowChip = state.contexts.find(
        (c) => c.kind === 'row' || c.kind === 'cell',
      )

      // THR-1/2 — resolve (or create) the thread for the active row context,
      // and focus it. With no row chip we fall back to the stream thread
      // (THR-7). This snapshots the prior active thread and loads the target's
      // slices into the mirror BEFORE we push the new question, so the question
      // lands in the right conversation. Then the global timer (NOT askScout
      // resolving) owns the in-progress -> ready transition (TMR-4): we set
      // status 'in-progress' + readyAt = now + ~10s.
      const threadRowId = rowChip?.rowId ?? null
      const threadLabel = rowChip?.label ?? 'New chat'
      const threadId = actions.ensureThreadForRow(threadRowId, threadLabel)
      actions.startThreadThinking(
        threadId,
        (state.simNow || Date.now()) + SCOUT_THINK_MS,
      )
      // Asking always drops the user into the conversation (e.g. clicking a
      // welcome prompt while on the chat list / welcome screen).
      actions.setView('chat')

      const userMessage: ScoutMessage = {
        id: makeId('user'),
        role: 'user',
        body: text,
        ...(rowChip?.rowId ? { rowId: rowChip.rowId } : {}),
        ...(rowChip?.label ? { contextLabel: rowChip.label } : {}),
        ...(rowChip?.columnId ? { columnId: rowChip.columnId } : {}),
      }
      actions.pushMessage(userMessage)

      const scoutId = makeId('scout')
      const placeholder: ScoutMessage = {
        id: scoutId,
        role: 'scout',
        body: '',
        thinking: [],
        thinkingComplete: false,
      }
      actions.pushMessage(placeholder)

      try {
        const answer = await askScout(
          { promptId, freeText, contexts: state.contexts },
          (step) => actions.appendThinking(scoutId, step),
        )

        // Resolve the effective promptId — composer free-text uses the
        // sentinel '_fallback' so saved paths can still replay it.
        const effectivePromptId = promptId ?? '_fallback'
        const messageMode = toMessageMode(answer.mode)
        const isAggMode = answer.mode === 'agg' || !rowChip
        const effectiveRowId =
          answer.mode === 'agg' ? undefined : rowChip?.rowId

        actions.updateMessage(scoutId, {
          body: answer.body,
          sources: answer.sources,
          confidence: answer.confidence,
          thinkingComplete: true,
          promptId: effectivePromptId,
          question: text,
          ...(messageMode ? { mode: messageMode } : {}),
          ...(effectiveRowId ? { rowId: effectiveRowId } : {}),
          ...(effectiveRowId && rowChip?.label
            ? { contextLabel: rowChip.label }
            : {}),
          ...(effectiveRowId && rowChip?.columnId
            ? { columnId: rowChip.columnId }
            : {}),
          ...(answer.followUps ? { followUps: answer.followUps } : {}),
          ...(answer.actions ? { actions: answer.actions } : {}),
          ...(answer.confidenceNote
            ? { confidenceNote: answer.confidenceNote }
            : {}),
        })

        // Phase 6.5 — re-detect candidacy after the answer lands. We can't
        // read state synchronously after dispatch, so we synthesize the
        // post-update message list. This is safe because we know the partial
        // we just applied.
        const messagesAfter = state.messages.map((m) => m)
        // The two messages we just pushed aren't in state yet at the time the
        // ref closes over `state.messages`. Append them locally for detection.
        messagesAfter.push(userMessage, {
          ...placeholder,
          body: answer.body,
          sources: answer.sources,
          confidence: answer.confidence,
          thinkingComplete: true,
          promptId: effectivePromptId,
          question: text,
          ...(messageMode ? { mode: messageMode } : {}),
          ...(effectiveRowId ? { rowId: effectiveRowId } : {}),
        })

        const candidate = detectPathCandidate(messagesAfter)
        // Offer the inline save-path prompt only the FIRST time the conversation
        // becomes saveable. After that, the header save-path button is the
        // persistent way to save. `savePathOffered` resets on clear / discard.
        if (
          candidate &&
          candidate.latestId === scoutId &&
          !state.savePathOffered
        ) {
          actions.updateMessage(scoutId, {
            candidate: true,
            candidateScope: isAggMode ? 'agg' : 'row',
          })
          actions.markSavePathOffered()
        }
      } catch (err) {
        // The fake LLM never throws today, but be defensive.
        // eslint-disable-next-line no-console
        console.error('scout ask failed', err)
        actions.updateMessage(scoutId, {
          body:
            "Scout couldn't complete that request. Your data is unchanged — ask again, or rephrase the question.",
          confidence: 'Low',
          thinkingComplete: true,
          // Seed a couple of generic recovery prompts so the error isn't a
          // dead end — same FollowUp shape successful answers carry.
          followUps: [
            { promptId: 'agg-flagged', label: 'Why are 23 rows flagged?' },
            { promptId: 'agg-top', label: 'Where am I leaving margin?' },
          ],
        })
      }
    },
    // `state.contexts` + `state.messages` are read inside the closure; rebinding
    // when they change keeps subsequent calls in sync with the current
    // conversation. Backup flags are also read so Phase 7.5's "wipe-on-new-ask"
    // tracks the latest backup state. `actions` is stable.
    [
      state.contexts,
      state.messages,
      state.messagesBackup,
      state.contextsBackup,
      state.savePathOffered,
      actions,
    ],
  )

  return ask
}
