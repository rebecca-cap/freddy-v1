// ScoutPanel — docked side-panel host for the Scout conversation surface.
//
// The outer container is a portaled <aside> (no design-system primitive in
// antd or Excalibrr exactly matches a "fixed-height docked side panel" — antd
// Drawer is full-height by design). But everything inside the panel is built
// from design-system primitives: title is a `Texto` (Excalibrr typography),
// close is a `GraviButton` (Excalibrr button) with an antd `CloseOutlined`.
//
// Reads `state.open` from ScoutContext. When open, slides in with
// `scout-slidein 200ms ease-out` (verbatim from the wireframe). Unmounts on
// close — the wireframe has no exit animation, so this is faithful.
//
// Phase 5.1 — header hosts a three-tab nav (chat / library / activity).
// Body content swaps by `state.view`. Composer footer renders only in chat.
//
// Phase 7.1 — header gains four icon controls: Undo (steps back one turn —
// removes the last question + answer and drops the question into the composer),
// Clear (wipes the thread; disabled when nothing to clear), Minimize, Close.
//
// `aria-modal="false"` because the panel is docked, not blocking — the
// QuoteBook behind it stays interactive.

import {
  CloseOutlined,
  DeleteOutlined,
  ExpandAltOutlined,
  MinusOutlined,
  PlayCircleFilled,
  PushpinOutlined,
} from '@ant-design/icons'
import { GraviButton } from '@gravitate-js/excalibrr'
import { Tooltip } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useScout } from '../state/ScoutContext'
import {
  buildSaveModalState,
  detectPathCandidate,
} from '../state/detectPathCandidate'
import type { Toast } from '../types'

import scoutMark from '../assets/Scout-8bit.png'

import { ScoutActivity } from './ScoutActivity'
import { ScoutChips } from './ScoutChips'
import { ScoutCloseConfirm } from './ScoutCloseConfirm'
import { ScoutComposer } from './ScoutComposer'
import { ScoutContextChips } from './ScoutContextChips'
import { ScoutEmptyState } from './ScoutEmptyState'
import { ScoutLibrary } from './ScoutLibrary'
import { ScoutMessageList } from './ScoutMessageList'
import { ScoutSaveModal } from './ScoutSaveModal'
import { ScoutShareModal } from './ScoutShareModal'
import { ScoutViewNav } from './ScoutViewNav'

import './ScoutPanel.css'

const makeToastId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `toast-${crypto.randomUUID()}`
  }
  return `toast-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
}

// Drag bookkeeping. We track delta from pointerdown to current pointer; the
// drag target is fed into `setDragPos` (component state) so React drives the
// position during drag and there's no DOM-vs-state contention from external
// re-renders mid-drag. Committed to `state.position` on pointerup.
interface DragStart {
  pointerId: number
  startX: number
  startY: number
  startLeft: number
  startTop: number
}

// Keep at least this much of the panel visible after a drag so the user can
// always grab the title row to drag back / minimize / close.
const DRAG_MIN_VISIBLE = 80

// Resize bookkeeping — height only (width is locked).
interface ResizeStart {
  pointerId: number
  startY: number
  startHeight: number
}

const RESIZE_MIN_HEIGHT = 220
const resizeMaxHeight = () => Math.round(window.innerHeight * 0.8)

// Sidebar mode resizes WIDTH (drag handle on the left edge). Keep a sane floor
// so inner components never get crushed, and a generous cap so wide screens can
// give Scout real estate without ever swallowing the whole viewport.
interface WidthResizeStart {
  pointerId: number
  startX: number
  startWidth: number
}

const SIDEBAR_MIN_WIDTH = 320
const sidebarMaxWidth = () => Math.round(window.innerWidth * 0.6)

export const ScoutPanel = () => {
  const { state, actions } = useScout()

  const frameRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLElement | null>(null)
  const dragStartRef = useRef<DragStart | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const resizeStartRef = useRef<ResizeStart | null>(null)
  const [resizeHeight, setResizeHeight] = useState<number | null>(null)
  const widthStartRef = useRef<WidthResizeStart | null>(null)
  const [resizeWidth, setResizeWidth] = useState<number | null>(null)

  // Track the previous view so the body can play a direction-aware slide when
  // moving between the chat inbox and a single thread (iOS-style push/pop).
  // `prevViewRef` holds the last committed view; it's read during render to
  // pick the direction, then updated in the effect after commit.
  const prevViewRef = useRef(state.view)
  useEffect(() => {
    prevViewRef.current = state.view
  }, [state.view])

  // Move focus to the close button on every open so keyboard users have a
  // sensible starting point. DOM query rather than ref because `GraviButton`
  // is a wrapped antd Button and its ref-forwarding contract is not relied on
  // elsewhere in this repo.
  useEffect(() => {
    if (!state.open) return undefined
    const id = requestAnimationFrame(() => {
      const closeBtn = document.querySelector<HTMLButtonElement>(
        '.scout-panel .scout-panel__close',
      )
      closeBtn?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [state.open])

  if (!state.open) return null

  const isChat = state.view === 'chat'
  const isLibrary = state.view === 'library'
  const isActivity = state.view === 'activity'

  const hasMessages = state.messages.length > 0
  const hasChats = state.threads.length > 0
  // Welcome screen (portrait + greeting + suggestion prompts) shows ONLY when
  // there are zero chats — the genuine first-run / empty state of the Chats
  // area. The Library is its own surface and stays reachable even with no chats.
  const showWelcome = !hasChats && !isLibrary
  // A new / empty chat (chats already exist) shows the suggestion prompts as
  // lightweight guidance — no portrait, no greeting.
  const showGuidance = isChat && hasChats && !hasMessages

  // Direction-aware nav transition between the inbox (activity) and a thread
  // (chat). `push` = entering a thread (content slides in from the right);
  // `pop` = returning to the inbox (slides in from the left). Any other view
  // change (e.g. Library) is instant.
  const navDir: 'push' | 'pop' | 'none' =
    state.view === 'chat' && prevViewRef.current === 'activity'
      ? 'push'
      : state.view === 'activity' && prevViewRef.current === 'chat'
        ? 'pop'
        : 'none'

  const hasContent = state.messages.length > 0 || state.contexts.length > 0

  // Save-path availability mirrors the inline prompt's detector, so the header
  // button is purple + pulsing exactly when clicking it would produce a path.
  const saveCandidate = detectPathCandidate(state.messages)
  const canSavePath = saveCandidate !== null

  const handleSavePath = () => {
    if (!saveCandidate) return
    actions.openSaveModal(
      buildSaveModalState(saveCandidate, saveCandidate.latestId),
    )
  }

  const handleClear = () => {
    if (!hasContent) return
    actions.clearConversation()
    const toast: Toast = {
      id: makeToastId(),
      kind: 'info',
      text: 'Conversation cleared',
    }
    actions.addToast(toast)
  }

  const handleMinimize = () => {
    actions.minimize()
  }

  const handleClose = () => {
    actions.openCloseConfirm()
  }

  const isDragging = dragPos !== null

  // Title-row pointerdown begins a drag UNLESS the user is grabbing a button
  // (the four-control cluster, or any future button inside the title row).
  // We use `closest('button')` rather than checking the click target's tag
  // because GraviButton renders an icon inside the `<button>` and the pointer
  // event target is often the inner `<span>`.
  const handleTitlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return // left-click only
    const target = e.target as HTMLElement | null
    if (
      target?.closest('button') ||
      target?.closest('.scout-panel__controls')
    ) {
      return
    }
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    dragStartRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: rect.left,
      startTop: rect.top,
    }
    setDragPos({ x: rect.left, y: rect.top })
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  const handleTitlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const ds = dragStartRef.current
    if (!ds || ds.pointerId !== e.pointerId) return
    const frame = frameRef.current
    if (!frame) return
    const dx = e.clientX - ds.startX
    const dy = e.clientY - ds.startY
    const fw = frame.offsetWidth
    const fh = frame.offsetHeight
    const maxLeft = window.innerWidth - DRAG_MIN_VISIBLE
    const maxTop = window.innerHeight - DRAG_MIN_VISIBLE
    const minLeft = -(fw - DRAG_MIN_VISIBLE)
    const minTop = 0 // never let the title row go above the viewport
    const x = Math.max(minLeft, Math.min(maxLeft, ds.startLeft + dx))
    const y = Math.max(minTop, Math.min(maxTop, ds.startTop + dy))
    setDragPos({ x, y })
  }

  const handleTitlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const ds = dragStartRef.current
    if (!ds || ds.pointerId !== e.pointerId) return
    if (dragPos) actions.setPosition(dragPos)
    dragStartRef.current = null
    setDragPos(null)
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // Capture might have been auto-released on cancel; ignore.
    }
  }

  // Effective position the renderer should use (FLOATING only): in-flight drag
  // wins, then the committed `state.position`, then `null` (CSS default
  // top:50 right:16). Sidebar mode ignores position entirely (CSS docks it).
  const effectivePos =
    state.panelMode === 'floating' ? dragPos ?? state.position : null
  const positionStyle = effectivePos
    ? {
        left: `${effectivePos.x}px`,
        top: `${effectivePos.y}px`,
        right: 'auto',
      }
    : undefined

  // --- Height resize (grip at bottom-right; height only, width locked) ------
  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const panel = panelRef.current
    if (!panel) return
    resizeStartRef.current = {
      pointerId: e.pointerId,
      startY: e.clientY,
      startHeight: panel.offsetHeight,
    }
    setResizeHeight(panel.offsetHeight)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    e.preventDefault()
    e.stopPropagation()
  }

  const handleResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rs = resizeStartRef.current
    if (!rs || rs.pointerId !== e.pointerId) return
    const dy = e.clientY - rs.startY
    const h = Math.max(
      RESIZE_MIN_HEIGHT,
      Math.min(resizeMaxHeight(), rs.startHeight + dy),
    )
    setResizeHeight(h)
  }

  const handleResizePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const rs = resizeStartRef.current
    if (!rs || rs.pointerId !== e.pointerId) return
    if (resizeHeight != null) actions.setPanelHeight(resizeHeight)
    resizeStartRef.current = null
    setResizeHeight(null)
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // Capture might have been auto-released on cancel; ignore.
    }
  }

  const isResizing = resizeHeight !== null

  // --- Width resize (sidebar mode only; handle on the panel's LEFT edge) -----
  const handleWidthPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const frame = frameRef.current
    if (!frame) return
    widthStartRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startWidth: frame.offsetWidth,
    }
    setResizeWidth(frame.offsetWidth)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    e.preventDefault()
    e.stopPropagation()
  }

  const handleWidthPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const ws = widthStartRef.current
    if (!ws || ws.pointerId !== e.pointerId) return
    // Handle is on the left edge → dragging left (negative dx) grows the panel.
    const dx = e.clientX - ws.startX
    const w = Math.max(
      SIDEBAR_MIN_WIDTH,
      Math.min(sidebarMaxWidth(), ws.startWidth - dx),
    )
    setResizeWidth(w)
    document.body.style.setProperty('--scout-sidebar-width', `${w}px`)
  }

  const handleWidthPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const ws = widthStartRef.current
    if (!ws || ws.pointerId !== e.pointerId) return
    if (resizeWidth != null) actions.setPanelWidth(resizeWidth)
    widthStartRef.current = null
    setResizeWidth(null)
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // Capture might have been auto-released on cancel; ignore.
    }
  }

  const isResizingWidth = resizeWidth !== null

  // Presentation mode. Floating overlays the workspace (drag + height resize);
  // sidebar docks full-height to the right edge, width-resizable, and pushes
  // the QuoteBook over via the body class set in ScoutActiveBodyClass.
  const isSidebar = state.panelMode === 'sidebar'

  // In-flight resize wins, then the committed `state.panelHeight`, else null
  // (auto-fit to content, capped at 80vh via CSS max-height). Sidebar mode is
  // always full viewport height, so the pinned height is ignored there.
  const effectiveHeight = resizeHeight ?? state.panelHeight
  const effectiveWidth = resizeWidth ?? state.panelWidth
  const panelStyle = isSidebar
    ? undefined
    : effectiveHeight
      ? { height: `${effectiveHeight}px` }
      : undefined

  return createPortal(
    <div
      className={`scout-scope scout-panel-frame is-open scout-panel-frame--${
        state.panelMode
      }${isDragging ? ' is-dragging' : ''}${
        isResizing ? ' is-resizing' : ''
      }${isResizingWidth ? ' is-resizing-width' : ''}`}
      ref={frameRef}
      style={
        isSidebar
          ? ({ width: `${effectiveWidth}px` } as React.CSSProperties)
          : positionStyle
      }
    >
      <div className='scout-panel-frame__shimmer' aria-hidden='true' />
      <aside
        ref={panelRef}
        className={`scout-panel scout-panel--view-${state.view}`}
        role='dialog'
        aria-label='Scout'
        aria-modal='false'
        style={panelStyle}
      >
      <header className='scout-panel__header'>
        <div
          className='scout-panel__title-row'
          onPointerDown={handleTitlePointerDown}
          onPointerMove={handleTitlePointerMove}
          onPointerUp={handleTitlePointerUp}
          onPointerCancel={handleTitlePointerUp}
        >
          <img
            className='scout-panel__g'
            src={scoutMark}
            alt=''
            aria-hidden='true'
            draggable={false}
          />
          <span className='scout-panel__title'>Scout</span>
          <div className='scout-panel__controls'>
            <Tooltip
              title={canSavePath ? 'Save as path' : 'Nothing to save yet'}
              mouseEnterDelay={0.4}
            >
              <GraviButton
                size='small'
                className={`scout-panel__ctl scout-panel__savepath${
                  canSavePath ? ' is-available' : ' is-disabled'
                }`}
                icon={<PlayCircleFilled />}
                aria-label='Save as path'
                disabled={!canSavePath}
                onClick={handleSavePath}
              />
            </Tooltip>
            <Tooltip
              title={hasContent ? 'Clear conversation' : 'Nothing to clear'}
              mouseEnterDelay={0.4}
            >
              <GraviButton
                size='small'
                className={`scout-panel__ctl scout-panel__clear${
                  hasContent ? '' : ' is-disabled'
                }`}
                icon={<DeleteOutlined />}
                aria-label='Clear conversation'
                disabled={!hasContent}
                onClick={handleClear}
              />
            </Tooltip>
            <Tooltip
              title={isSidebar ? 'Float panel' : 'Dock to side'}
              mouseEnterDelay={0.4}
            >
              <GraviButton
                size='small'
                className='scout-panel__ctl scout-panel__mode'
                icon={isSidebar ? <ExpandAltOutlined /> : <PushpinOutlined />}
                aria-label={
                  isSidebar
                    ? 'Float Scout over the workspace'
                    : 'Dock Scout to the side'
                }
                onClick={() =>
                  actions.setPanelMode(isSidebar ? 'floating' : 'sidebar')
                }
              />
            </Tooltip>
          <Tooltip title='Minimize' mouseEnterDelay={0.4}>
            <GraviButton
              size='small'
              className='scout-panel__ctl scout-panel__minimize'
              icon={<MinusOutlined />}
              aria-label='Minimize Scout'
              onClick={handleMinimize}
            />
          </Tooltip>
          <Tooltip title='Close' mouseEnterDelay={0.4}>
            <GraviButton
              size='small'
              className='scout-panel__ctl scout-panel__close'
              icon={<CloseOutlined />}
              aria-label='Close Scout'
              onClick={handleClose}
            />
          </Tooltip>
          </div>
        </div>
        <ScoutViewNav />
      </header>
      {isChat ? <ScoutContextChips /> : null}
      <div
        // Re-key on the view so the enter animation below replays on each
        // inbox↔thread switch. Within a view (e.g. messages streaming in) the
        // key is stable, so the body never remounts mid-conversation.
        key={state.view}
        className={`scout-panel__body scout-panel__body--${
          showWelcome ? 'welcome' : state.view
        }${isChat && hasMessages ? ' has-messages' : ''}${
          navDir === 'none' ? '' : ` scout-panel__body--anim-${navDir}`
        }`}
      >
        {showWelcome ? (
          <ScoutEmptyState />
        ) : isActivity ? (
          <ScoutActivity />
        ) : isChat && hasMessages ? (
          <ScoutMessageList />
        ) : showGuidance ? (
          <ScoutChips standalone />
        ) : isLibrary ? (
          <ScoutLibrary />
        ) : null}
      </div>
      {isChat || showWelcome ? (
        <footer className='scout-panel__footer'>
          <ScoutComposer />
        </footer>
      ) : null}
        {isSidebar ? (
          <div
            className='scout-panel__resize-width'
            role='separator'
            aria-orientation='vertical'
            aria-label='Drag to resize panel width'
            onPointerDown={handleWidthPointerDown}
            onPointerMove={handleWidthPointerMove}
            onPointerUp={handleWidthPointerUp}
            onPointerCancel={handleWidthPointerUp}
          />
        ) : (
          <div
            className='scout-panel__resize'
            role='separator'
            aria-orientation='horizontal'
            aria-label='Drag to resize panel height'
            onPointerDown={handleResizePointerDown}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            onPointerCancel={handleResizePointerUp}
          />
        )}
        <ScoutSaveModal />
        <ScoutShareModal />
        <ScoutCloseConfirm />
      </aside>
    </div>,
    document.body,
  )
}
