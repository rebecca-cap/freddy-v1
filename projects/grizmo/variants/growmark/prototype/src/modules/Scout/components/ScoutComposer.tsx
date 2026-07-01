// ScoutComposer — textarea + send button mounted in the panel footer.
//
// Wireframe source: `.gizmo-footer` lines 1167–1212 (gizmo-demo.html).
// The wireframe uses a single-line `<input>` but the Phase 3.4 plan
// explicitly upgrades to a textarea so multi-line prompts work (Enter
// submits, Shift+Enter inserts a newline).
//
// Per the design-system policy: textarea comes from antd `Input.TextArea`
// (auto-grow via `autoSize`), send button from Excalibrr `GraviButton`.
//
// Submit behavior is wired here (Phase 3.8). The composer pulls `useScoutAsk`
// directly so the panel doesn't have to thread a callback through props.

import { Input, Tooltip } from 'antd'
import type { TextAreaRef } from 'antd/es/input/TextArea'
import { GraviButton } from '@gravitate-js/excalibrr'
import { UndoOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useScout } from '../state/ScoutContext'
import { useScoutAsk } from '../state/useScoutAsk'
import type { Toast } from '../types'

import './ScoutComposer.css'

const PLACEHOLDER = 'Ask Scout about your quote book…'

const makeToastId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `toast-${crypto.randomUUID()}`
  }
  return `toast-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
}

export const ScoutComposer = () => {
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const textareaRef = useRef<TextAreaRef>(null)
  const ask = useScoutAsk()
  const { state, actions } = useScout()

  const canSend = value.trim().length > 0 && !busy

  // Undo steps back one turn (the removed question lands back in this composer
  // to edit). Available whenever there's a turn to remove and we're not mid
  // path-run. The button stays hoverable when unavailable so its "Nothing to
  // undo" tooltip still reads on rollover; the guard below makes it a no-op.
  const canUndo = state.messages.length > 0 && !state.isPathRunning

  const handleUndo = () => {
    if (!canUndo) {
      actions.addToast({
        id: makeToastId(),
        kind: 'warn',
        text: 'Nothing to undo',
      })
      return
    }
    actions.undoLastTurn()
    actions.addToast({
      id: makeToastId(),
      kind: 'info',
      text: 'Removed last question',
    })
  }

  const focusTextarea = useCallback(() => {
    // antd's TextArea forwards a ref with a `.focus()` method — call it on
    // the next animation frame so the focus survives a parallel re-render
    // (which can happen mid-submit when state.messages updates).
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
    })
  }, [])

  // Focus the textarea on mount — the panel is open + the user typed-or-
  // chip-clicked their way here; the next move is almost always typing.
  useEffect(() => {
    focusTextarea()
  }, [focusTextarea])

  // Header Undo stashes the stepped-back question here — drop it into the input,
  // focus, then clear the hand-off so it doesn't re-apply on later renders.
  useEffect(() => {
    if (state.composerPrefill !== null) {
      setValue(state.composerPrefill)
      actions.clearComposerPrefill()
      focusTextarea()
    }
  }, [state.composerPrefill, actions, focusTextarea])

  const handleSubmit = useCallback(async () => {
    const text = value.trim()
    if (!text || busy) return

    setBusy(true)
    setValue('')

    try {
      await ask({ freeText: text, label: text })
    } catch {
      const toast: Toast = {
        id: makeToastId(),
        kind: 'error',
        text: "Couldn't reach Scout. Try again.",
      }
      actions.addToast(toast)
    } finally {
      setBusy(false)
      focusTextarea()
    }
  }, [value, busy, ask, actions, focusTextarea])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Plan: Enter submits, Shift+Enter inserts newline. We DO NOT also
    // submit on Ctrl/Cmd+Enter — the plan's Cmd-G is a separate shortcut,
    // and Mac users expect Cmd+Enter only for forms with a different model.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSubmit()
    }
  }

  const handleSendClick = () => {
    void handleSubmit()
  }

  return (
    <div className='scout-composer'>
      <Tooltip
        title={canUndo ? 'Undo last question' : 'Nothing to undo'}
        mouseEnterDelay={0.3}
      >
        <button
          type='button'
          className={`scout-composer__undo${canUndo ? '' : ' is-disabled'}`}
          onClick={handleUndo}
          aria-label='Undo last question'
          aria-disabled={!canUndo}
        >
          <UndoOutlined />
        </button>
      </Tooltip>
      <Input.TextArea
        ref={textareaRef}
        className='scout-composer__textarea'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={PLACEHOLDER}
        autoSize={{ minRows: 1, maxRows: 5 }}
        disabled={busy}
        // Spell-check is on by default — we want it for free-text quote-book
        // questions where typos undermine the demo's polish.
      />
      <GraviButton
        size='small'
        className='scout-composer__send'
        buttonText='Send'
        disabled={!canSend}
        onClick={handleSendClick}
      />
    </div>
  )
}
