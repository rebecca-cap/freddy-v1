// ScoutShortcuts — renderless component that mounts the global Cmd+G / Ctrl+G
// keyboard shortcut.
//
// Behavior (mirrors the wireframe handler at gizmo-demo.html ~line 2750):
//   - When the panel is closed: open it AND dismiss the intro bubble.
//   - When the panel is open: focus the composer (id="scout-composer", added
//     in step 3.4). The optional chain makes this a safe no-op until then.
//   - The shortcut is OPEN-ONLY by design: a second press does not toggle it
//     closed (Esc handles minimize per a later step).
//
// We always call event.preventDefault() to suppress the browser's native
// Cmd+G "find next" behavior.
//
// Implementation notes:
//   - Listener attaches to `window` (not `document`) because (a) keydowns
//     bubble all the way to window naturally, (b) `window` is the conventional
//     mount point for global app-level shortcuts in React code, and (c) tests
//     / dev hooks often dispatch synthetic KeyboardEvents on `window`.
//   - We bind the listener ONCE (empty dep array) and read the latest
//     `state.open` through a ref. This avoids tearing down + re-binding the
//     listener every time the panel toggles, which would be wasteful and
//     would also briefly leave the window without a listener between renders.
//   - Typing inside `<input>` / `<textarea>` / contenteditable OUTSIDE the
//     Scout panel is ignored so the shortcut doesn't hijack normal text
//     editing in the host app. Inputs INSIDE the Scout panel
//     (`.scout-scope`, `[data-scout-root]`, `#scout-trigger`) still fire
//     the shortcut.

import { useEffect, useRef } from 'react'

import { useScout } from '../state/ScoutContext'

export const ScoutShortcuts = () => {
  const { state, actions } = useScout()

  // Mirror state.open into a ref so the keydown handler — bound once — can
  // read the freshest value without us re-attaching the listener on every
  // open/close.
  const openRef = useRef(state.open)
  useEffect(() => {
    openRef.current = state.open
  }, [state.open])

  const addModeRef = useRef(state.addContextMode)
  useEffect(() => {
    addModeRef.current = state.addContextMode
  }, [state.addContextMode])

  // Same trick for actions. They're stable today (memoized in the provider),
  // but pinning them through a ref insulates this effect from any future
  // change to that contract.
  const actionsRef = useRef(actions)
  useEffect(() => {
    actionsRef.current = actions
  }, [actions])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Escape — exit +Add context mode if it is active. Don't preventDefault
      // unconditionally; only swallow Esc when we actually consume it so other
      // listeners (modals, dropdowns) keep working when add mode is off.
      if (event.key === 'Escape' && addModeRef.current) {
        event.preventDefault()
        actionsRef.current.setAddContextMode(false)
        return
      }

      // Accept either Cmd (macOS) or Ctrl (Windows / Linux) — robust across
      // platforms without sniffing `navigator.platform`.
      const isShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'g'
      if (!isShortcut) return

      // Don't hijack typing in editable elements that live OUTSIDE the Scout
      // panel. Editable elements INSIDE Scout (composer, etc.) still fire it.
      const target = event.target as HTMLElement | null
      const isTextInput =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      const isInsideScout =
        !!target &&
        target.closest('.scout-scope, [data-scout-root], #scout-trigger') !=
          null
      if (isTextInput && !isInsideScout) return

      // Always swallow the browser's default Cmd+G (find-next).
      event.preventDefault()

      if (!openRef.current) {
        // Open + dismiss the intro bubble. Open-only — no toggle on repeat.
        actionsRef.current.setOpen(true)
        actionsRef.current.dismissBubble()
      } else {
        // Already open — pull focus to the composer (added in step 3.4).
        document.getElementById('scout-composer')?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return null
}
