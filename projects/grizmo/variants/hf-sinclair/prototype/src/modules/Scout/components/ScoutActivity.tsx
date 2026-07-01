// ScoutActivity — THREAD INBOX (THR-3..6).
//
// The Activity tab has been REPURPOSED (THR-5): the old "recently closed
// conversations" recovery-net log is retired. This view now renders the live
// THREAD INBOX — a vertical stack of every Scout thread (the single stream
// thread + every row thread), each card showing its context label, a one-line
// question/answer preview, and a truthful status badge (OBJ-4):
//
//   in-progress  → live "thinking" treatment (animated dots)
//   ready        → unseen indicator (a dot) — an answer is waiting
//   viewed         → muted, nothing left to do
//
// Tapping a card focuses that thread (setActiveThread) and slides into the
// conversation (THR-3) by switching the panel to the chat view. The inbox is a
// FULL-WIDTH view that slides away to reveal the conversation — there is NO
// persistent side-by-side list (explicitly rejected; it breaks docked width).
//
// "+ New thread" (THR-4) creates a fresh general/stream-style thread and slides
// into it; new threads stack on top.
//
// The "show chats" affordance + unseen badge that brings the user BACK here
// lives in ScoutViewNav (the Chats tab).

import { useMemo } from 'react'

import {
  DeleteOutlined,
  EllipsisOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons'
import { Dropdown, Menu, type MenuProps } from 'antd'
import { GraviButton, Texto } from '@gravitate-js/excalibrr'

import { useScout } from '../state/ScoutContext'
import { buildSaveModalStateForThread } from '../state/detectPathCandidate'
import type { AnswerBody, Thread, ThreadStatus } from '../types'

import { ScoutBookmarkIcon } from './ScoutBookmarkIcon'
import { ScoutViewSearch } from './ScoutViewSearch'

import './ScoutActivity.css'

// --- Helpers ----------------------------------------------------------------

const STATUS_LABEL: Record<ThreadStatus, string> = {
  'in-progress': 'In progress',
  ready: 'Ready',
  viewed: 'Viewed',
}

/** Flatten an AnswerBody to a short plain-text preview. */
function answerToText(body: AnswerBody): string {
  if (typeof body === 'string') return body
  for (const block of body) {
    if (block.kind === 'p') return block.text
    if (block.kind === 'ul' && block.items.length) return block.items[0]
    if (block.kind === 'breakdown' && block.rows.length) {
      return `${block.rows[0].label}: ${block.rows[0].value}`
    }
    if (block.kind === 'csv-link') return block.label
  }
  return ''
}

/**
 * Resolve the preview line for a thread card. Prefers the synced
 * lastQuestion/answerPreview (kept fresh by syncActiveThread), then falls back
 * to the thread's own messages so newly-created or never-synced threads still
 * read sensibly.
 */
function threadPreview(thread: Thread): { question: string; answer: string } {
  let question = thread.lastQuestion ?? ''
  let answer = thread.answerPreview ?? ''

  if (!question) {
    const firstUser = thread.messages.find((m) => m.role === 'user')
    if (firstUser) {
      question =
        firstUser.question ??
        (typeof firstUser.body === 'string' ? firstUser.body : '')
    }
  }
  if (!answer) {
    const lastScout = [...thread.messages]
      .reverse()
      .find((m) => m.role === 'scout' && m.body)
    if (lastScout) answer = answerToText(lastScout.body).slice(0, 140)
  }
  return { question, answer }
}

/** Absolute date + time stamp for a chat card, e.g. "Jun 1 · 2:34 PM". */
function formatStamp(ms: number): string {
  const d = new Date(ms)
  const date = d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
  const time = d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${date} · ${time}`
}

/** Sort: in-progress first, then ready, then viewed; newest activity within each. */
const STATUS_ORDER: Record<ThreadStatus, number> = {
  'in-progress': 0,
  ready: 1,
  viewed: 2,
}

// --- Status badge -----------------------------------------------------------

const ThreadStatusBadge = ({ status }: { status: ThreadStatus }) => {
  if (status === 'in-progress') {
    return (
      <span
        className='scout-inbox__badge scout-inbox__badge--thinking'
        role='status'
      >
        <span className='scout-inbox__thinking-dots' aria-hidden='true'>
          <span />
          <span />
          <span />
        </span>
        {STATUS_LABEL[status]}
      </span>
    )
  }
  if (status === 'ready') {
    return (
      <span className='scout-inbox__badge scout-inbox__badge--ready'>
        <span className='scout-inbox__ready-dot' aria-hidden='true' />
        {STATUS_LABEL[status]}
      </span>
    )
  }
  return (
    <span className='scout-inbox__badge scout-inbox__badge--viewed'>
      {STATUS_LABEL[status]}
    </span>
  )
}

// --- Card -------------------------------------------------------------------

interface ThreadCardProps {
  thread: Thread
  isActive: boolean
  onOpen: (id: string) => void
}

const ThreadCard = ({ thread, isActive, onOpen }: ThreadCardProps) => {
  const { actions } = useScout()
  const { question, answer } = threadPreview(thread)
  // Question-led card (Concept A): a chat has no "sender", so the QUESTION is
  // the headline. The left chip carries a REAL scope only — the row a chat is
  // about, or "General" for the stream. Ad-hoc chats (rowId null) have no real
  // scope, so they show no chip (their default "New chat" label isn't a scope).
  const scope = thread.isStream
    ? 'General'
    : thread.rowId
      ? thread.contextLabel
      : null
  const hasQuestion = Boolean(question)

  // ⋯ menu — Save the whole chat, Favorite, or Remove. Every item stops the
  // click from bubbling to the card (which would open the chat).
  const menuItems: MenuProps['items'] = [
    {
      key: 'save',
      icon: <ScoutBookmarkIcon filled={false} />,
      label: 'Save',
      disabled: !hasQuestion,
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation()
        actions.openSaveModal(buildSaveModalStateForThread(thread))
      },
    },
    {
      key: 'favorite',
      icon: thread.starred ? <StarFilled /> : <StarOutlined />,
      label: thread.starred ? 'Unfavorite' : 'Favorite',
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation()
        actions.toggleThreadStar(thread.id)
      },
    },
    { type: 'divider' },
    {
      key: 'remove',
      icon: <DeleteOutlined />,
      label: 'Remove',
      danger: true,
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation()
        actions.deleteThread(thread.id)
      },
    },
  ]

  return (
    <div className='scout-inbox__card-wrap' role='listitem'>
    <button
      type='button'
      className={`scout-inbox__card${
        thread.status === 'ready' ? ' is-unseen' : ''
      }${!hasQuestion ? ' is-empty' : ''}${isActive ? ' is-active' : ''}`}
      onClick={() => onOpen(thread.id)}
      aria-label={`Open chat: ${
        hasQuestion ? question : 'new chat, nothing asked yet'
      } (${STATUS_LABEL[thread.status]})`}
    >
      {hasQuestion ? (
        <div className='scout-inbox__card-question' title={question}>
          {question}
        </div>
      ) : (
        <div className='scout-inbox__card-question scout-inbox__card-question--empty'>
          {thread.isStream
            ? 'Your meandering session — ask anything.'
            : "Nothing's been asked yet — ask Scout anything."}
        </div>
      )}
      {answer ? (
        <div className='scout-inbox__card-answer' title={answer}>
          {answer}
        </div>
      ) : null}
      <div className='scout-inbox__card-meta'>
        {scope ? (
          <span className='scout-inbox__card-scope' title={scope}>
            {scope}
          </span>
        ) : null}
        <span className='scout-inbox__card-meta-end'>
          <span className='scout-inbox__card-time'>
            {formatStamp(thread.lastActivityAt)}
          </span>
          {/* Right-side badge is consistent across every state: the live status
              for chats with a question, or "New chat" for an empty session. */}
          {hasQuestion ? (
            <ThreadStatusBadge status={thread.status} />
          ) : (
            <span className='scout-inbox__badge scout-inbox__badge--new'>
              New chat
            </span>
          )}
        </span>
      </div>
    </button>
    <Dropdown
      overlay={<Menu items={menuItems} />}
      trigger={['click']}
      placement='bottomRight'
      overlayClassName='scout-scope'
    >
      <button
        type='button'
        className='scout-inbox__card-menu'
        aria-label='Chat actions'
        onClick={(e) => e.stopPropagation()}
      >
        <EllipsisOutlined />
      </button>
    </Dropdown>
    </div>
  )
}

// --- Component --------------------------------------------------------------

export const ScoutActivity = () => {
  const { state, threads, activeThreadId, actions } = useScout()

  const query = state.search.activity.trim().toLowerCase()
  const starredOnly = state.starredOnly.activity

  const ordered = useMemo(() => {
    const matches = (t: Thread): boolean => {
      if (starredOnly && !t.starred) return false
      if (!query) return true
      const hay =
        `${t.lastQuestion ?? ''} ${t.answerPreview ?? ''} ${t.contextLabel}`.toLowerCase()
      return hay.includes(query)
    }
    return [...threads].filter(matches).sort((a, b) => {
      const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      if (byStatus !== 0) return byStatus
      return b.lastActivityAt - a.lastActivityAt
    })
  }, [threads, query, starredOnly])

  // Focus the chat + slide into the conversation (chat view).
  const openThread = (id: string) => {
    actions.setActiveThread(id)
    actions.setView('chat')
    actions.setOpen(true)
  }

  // Start a fresh general chat; it stacks on top, then we slide into it.
  const handleNewThread = () => {
    const id = actions.createThread(null, 'New chat')
    openThread(id)
  }

  return (
    <div className='scout-inbox'>
      <div className='scout-inbox__toolbar'>
        <Texto category='label' className='scout-inbox__heading'>
          All Chats
        </Texto>
        <GraviButton
          size='small'
          type='primary'
          className='scout-inbox__new'
          icon={<PlusOutlined />}
          buttonText='New chat'
          onClick={handleNewThread}
        />
      </div>

      {threads.length > 0 ? (
        <div className='scout-inbox__filter'>
          <ScoutViewSearch view='activity' placeholder='Search chats…' />
          <button
            type='button'
            className={`scout-library-chip scout-library-chip--favorites${
              starredOnly ? ' is-active' : ''
            }`}
            aria-pressed={starredOnly}
            onClick={() => actions.setStarredOnly('activity', !starredOnly)}
          >
            <span aria-hidden='true'>★</span> Favorites
          </button>
        </div>
      ) : null}

      <div className='scout-inbox__list' role='list'>
        {ordered.length === 0 ? (
          <div className='scout-inbox__empty'>
            <div className='scout-inbox__empty-emoji' aria-hidden='true'>
              {threads.length > 0 ? '🔍' : '💬'}
            </div>
            <Texto category='label' className='scout-inbox__empty-title'>
              {threads.length > 0 ? 'No matching chats' : 'No chats yet'}
            </Texto>
            <div className='scout-inbox__empty-sub'>
              {threads.length > 0
                ? starredOnly
                  ? 'No favorited chats match. Clear the filter or star a chat from its ⋯ menu.'
                  : 'Nothing matches your search. Try a different term.'
                : 'Ask Scout about a quote row to start a chat, or hit “New chat” to begin a general conversation.'}
            </div>
          </div>
        ) : (
          ordered.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              isActive={thread.id === activeThreadId}
              onOpen={openThread}
            />
          ))
        )}
      </div>
    </div>
  )
}
