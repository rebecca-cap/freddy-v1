// Renderless helper that toggles body classes the AG-Grid overlay CSS and the
// panel push-layout rely on:
//   - `scout-active`              → panel is open (column tints + cell states).
//   - `scout-add-context-mode`    → next cell click adds a chip.
//   - `scout-sidebar`             → panel is docked sidebar (pushes the page);
//                                    pairs with the `--scout-sidebar-width` var
//                                    so the content shell reserves that gutter.
//
// Lives outside `.scout-scope` so the classes are reachable by global
// selectors. Mount once inside `<ScoutProvider>`; mounting twice is harmless.

import { useEffect } from 'react'

import { useScout } from '../state/ScoutContext'

const ACTIVE_CLASS = 'scout-active'
const ADD_MODE_CLASS = 'scout-add-context-mode'
const SIDEBAR_CLASS = 'scout-sidebar'
const SIDEBAR_WIDTH_VAR = '--scout-sidebar-width'

export function ScoutActiveBodyClass() {
  const { state } = useScout()

  useEffect(() => {
    if (state.open) {
      document.body.classList.add(ACTIVE_CLASS)
    } else {
      document.body.classList.remove(ACTIVE_CLASS)
    }
    return () => {
      document.body.classList.remove(ACTIVE_CLASS)
    }
  }, [state.open])

  useEffect(() => {
    if (state.addContextMode) {
      document.body.classList.add(ADD_MODE_CLASS)
    } else {
      document.body.classList.remove(ADD_MODE_CLASS)
    }
    return () => {
      document.body.classList.remove(ADD_MODE_CLASS)
    }
  }, [state.addContextMode])

  // Push-layout: only when the panel is open AND docked as a sidebar. The CSS
  // var feeds the content shell's reserved gutter (see ScoutPanel.css). On
  // floating mode (or closed) the class drops and the page reclaims the space.
  useEffect(() => {
    const isSidebar = state.open && state.panelMode === 'sidebar'
    if (isSidebar) {
      document.body.classList.add(SIDEBAR_CLASS)
      document.body.style.setProperty(SIDEBAR_WIDTH_VAR, `${state.panelWidth}px`)
    } else {
      document.body.classList.remove(SIDEBAR_CLASS)
      document.body.style.removeProperty(SIDEBAR_WIDTH_VAR)
    }
    return () => {
      document.body.classList.remove(SIDEBAR_CLASS)
      document.body.style.removeProperty(SIDEBAR_WIDTH_VAR)
    }
  }, [state.open, state.panelMode, state.panelWidth])

  return null
}
