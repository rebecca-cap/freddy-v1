// ScoutViewNav — two-tab strip in the panel header (Chats / Library).
//
// Mirrors `state.view`; clicking a tab dispatches `setView`. Everything is a
// "chat": the Chats tab is the list of all chats (state.view === 'activity'),
// and a conversation (state.view === 'chat') lives UNDER that same tab — so the
// Chats tab stays highlighted while you're inside a chat, and clicking it takes
// you back to the list. There is no separate "Chat" tab anymore.
//
// The Chats tab carries an UNSEEN INDICATOR (a dot + count) whenever one or more
// chats are Ready/unseen, so the user knows answers are waiting without opening.
//
// Visual treatment follows the round-4 wireframe `.tab-strip` pattern: a thin
// underline strip with active tab marked by a bottom-border + ink text.
//
// Keyboard: tabs are real <button>s (Tab to focus, Enter / Space to activate).

import { InboxOutlined, BookOutlined, LeftOutlined } from '@ant-design/icons'
import { useEffect, useRef } from 'react'

import { useScout } from '../state/ScoutContext'
import type { ScoutView } from '../types'

import './ScoutViewNav.css'

interface ViewSpec {
  id: ScoutView
  label: string
  Icon: typeof InboxOutlined
  // Other view values that should also light this tab (the conversation lives
  // under the Chats tab).
  alsoActiveFor?: ScoutView[]
}

const VIEWS: ViewSpec[] = [
  { id: 'activity', label: 'Chats', Icon: InboxOutlined, alsoActiveFor: ['chat'] },
  { id: 'library', label: 'Library', Icon: BookOutlined },
]

export const ScoutViewNav = () => {
  const { state, actions, unseenCount } = useScout()

  // Direction-aware drift for the tab group, mirroring the panel-body slide.
  // push = entered a thread (tabs drift right to make room for the back
  // control); pop = back to the inbox (tabs drift left into place).
  const prevViewRef = useRef(state.view)
  useEffect(() => {
    prevViewRef.current = state.view
  }, [state.view])
  const navDir: 'push' | 'pop' | 'none' =
    state.view === 'chat' && prevViewRef.current === 'activity'
      ? 'push'
      : state.view === 'activity' && prevViewRef.current === 'chat'
        ? 'pop'
        : 'none'

  return (
    <nav className='scout-view-nav' role='tablist' aria-label='Scout views'>
      {/* A top-left "All Chats" control gives an obvious up/back path to the
          inbox whenever you've navigated AWAY from it — into a thread OR the
          Library. Keeping it in both (not just chat) means moving chat → Library
          doesn't snap the tabs back left. Its presence (margin-right: auto)
          pushes the tabs right; only the inbox itself omits it. It's a plain nav
          button, NOT a role='tab', so the tablist still has exactly two tabs. */}
      {state.view !== 'activity' ? (
        <button
          type='button'
          className='scout-view-nav__back'
          onClick={() => actions.setView('activity')}
          aria-label='Back to All Chats'
        >
          <LeftOutlined className='scout-view-nav__back-icon' />
          <span className='scout-view-nav__back-label'>All Chats</span>
        </button>
      ) : null}
      {/* Tab group, re-keyed on view so the drift animation replays on each
          inbox↔thread switch. */}
      <div
        key={state.view}
        className={`scout-view-nav__tabs${
          navDir === 'none' ? '' : ` scout-view-nav__tabs--${navDir}`
        }`}
      >
      {VIEWS.map(({ id, label, Icon, alsoActiveFor }) => {
        const active =
          state.view === id || (alsoActiveFor?.includes(state.view) ?? false)
        // The Chats tab (the chat list entry point) carries the unseen
        // indicator when Ready chats are waiting.
        const showUnseen = id === 'activity' && unseenCount > 0
        return (
          <button
            key={id}
            type='button'
            role='tab'
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            className={`scout-view-nav__tab${active ? ' is-active' : ''}`}
            onClick={() => actions.setView(id)}
            aria-label={
              showUnseen
                ? `${label} — ${unseenCount} ready`
                : undefined
            }
          >
            <span className='scout-view-nav__icon-wrap'>
              <Icon className='scout-view-nav__icon' />
              {showUnseen ? (
                <span
                  className='scout-view-nav__unseen'
                  aria-hidden='true'
                >
                  {unseenCount > 9 ? '9+' : unseenCount}
                </span>
              ) : null}
            </span>
            <span className='scout-view-nav__label'>{label}</span>
          </button>
        )
      })}
      </div>
    </nav>
  )
}
