// ScoutAlertCards — cross-page Scout thread cards in the user-name drawer
// (ALR-1, ALR-2). One card per active/recent thread (in-progress + ready),
// most-recent first, mirroring the existing Activity / .alert-card visual
// pattern: status icon, contextLabel/title, lastQuestion or answerPreview, and
// a relative time. Clicking a card focuses that thread and navigates to the
// QuoteBook so the user lands back where they left off (best-effort).
//
// Renders OUTSIDE .scout-scope; styles live in alerts.css using theme tokens.

import { CheckCircleFilled, LoadingOutlined, MessageOutlined } from '@ant-design/icons'
import { NothingMessage } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useScout } from '@modules/Scout'
import type { Thread, ThreadStatus } from '@modules/Scout'

import './alerts.css'

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

function formatRelative(ms: number, now: number): string {
  const delta = Math.max(0, now - ms)
  if (delta < MIN) return 'just now'
  if (delta < HOUR) return `${Math.floor(delta / MIN)} min ago`
  if (delta < DAY) return `${Math.floor(delta / HOUR)} h ago`
  return `${Math.floor(delta / DAY)}d ago`
}

function statusLabel(status: ThreadStatus): string {
  if (status === 'in-progress') return 'Thinking…'
  if (status === 'ready') return 'Ready'
  return 'Seen'
}

function StatusIcon({ status }: { status: ThreadStatus }) {
  if (status === 'in-progress') {
    return (
      <div className='alert-icon scout-alert-icon scout-alert-icon--thinking'>
        <LoadingOutlined />
      </div>
    )
  }
  if (status === 'ready') {
    return (
      <div className='alert-icon scout-alert-icon scout-alert-icon--ready'>
        <CheckCircleFilled />
      </div>
    )
  }
  return (
    <div className='alert-icon resolved scout-alert-icon'>
      <MessageOutlined />
    </div>
  )
}

export function ScoutAlertCards({ onCardClick }: { onCardClick?: () => void }) {
  const { threads, simNow, actions } = useScout()
  const navigate = useNavigate()

  // ALR-2 — one card per active/recent thread: surface in-progress + ready,
  // most recent first. (Seen threads have nothing left to do, so they drop off
  // the alert list per OBJ-4 / ROW-3 semantics.)
  const cards = useMemo(() => {
    return threads
      .filter((t) => t.status === 'in-progress' || t.status === 'ready')
      .sort((a, b) => b.lastActivityAt - a.lastActivityAt)
  }, [threads])

  if (cards.length === 0) {
    return (
      <NothingMessage
        title='No Scout chats'
        message='Chats you start with Scout show up here while they think and when they are ready.'
      />
    )
  }

  const handleClick = (thread: Thread) => {
    actions.setActiveThread(thread.id)
    actions.setView('chat')
    actions.setOpen(true)
    onCardClick?.()
    navigate('/PricingEngine/QuoteBookEOD')
  }

  return (
    <div className='scout-alert-cards'>
      {cards.map((thread) => {
        const preview =
          thread.lastQuestion ||
          thread.answerPreview ||
          (thread.status === 'in-progress'
            ? 'Working on your question…'
            : 'Answer is ready to view.')
        const remainingMs =
          thread.status === 'in-progress' && thread.readyAt != null
            ? Math.max(0, thread.readyAt - simNow)
            : null
        return (
          <button
            type='button'
            key={thread.id}
            className={`alert-card scout-alert-card${
              thread.status === 'ready' ? ' scout-alert-card--ready' : ''
            }`}
            onClick={() => handleClick(thread)}
            title='Open this Scout chat'
          >
            <StatusIcon status={thread.status} />
            <div className='scout-alert-card__body'>
              <div className='scout-alert-card__head'>
                <span className='scout-alert-card__title' title={thread.contextLabel}>
                  {thread.contextLabel}
                </span>
                <span className='scout-alert-card__time'>
                  {formatRelative(thread.lastActivityAt, simNow)}
                </span>
              </div>
              <div className='scout-alert-card__preview' title={preview}>
                {preview}
              </div>
              <div className='scout-alert-card__meta'>
                <span
                  className={`scout-alert-card__status scout-alert-card__status--${thread.status}`}
                >
                  {statusLabel(thread.status)}
                </span>
                {remainingMs != null ? (
                  <span className='scout-alert-card__eta'>
                    ~{Math.ceil(remainingMs / 1000)}s
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
