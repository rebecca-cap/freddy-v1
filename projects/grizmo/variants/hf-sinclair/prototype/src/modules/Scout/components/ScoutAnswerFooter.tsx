// ScoutAnswerFooter — the quiet 👍 / 👎 row + a ⋯ overflow menu at the bottom
// of every answer.
//
// Left: thumbs-up (toggle) and thumbs-down (toggle; tap-on reveals the inline
// feedback form, derived state owned by the bubble). The thumbs are mutually
// exclusive. Right: a meatballs (⋯) menu consolidating the three universal
// answer actions — Copy, Export, and Save. Save is an explicit promote action;
// answers are export-oriented, not stored, so Save keeps the *question* (seeds
// ScoutSaveModal with this answer as a one-step prompt), not the frozen answer.

import {
  CopyOutlined,
  DislikeFilled,
  DislikeOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  LikeFilled,
  LikeOutlined,
} from '@ant-design/icons'
import { Dropdown, Menu, Tooltip } from 'antd'

import { copyAnswer, exportAnswer } from '../services/answerActions'
import { useScout } from '../state/ScoutContext'
import { buildSaveModalStateForMessage } from '../state/detectPathCandidate'
import type { ScoutMessage, Toast } from '../types'

import { ScoutBookmarkIcon } from './ScoutBookmarkIcon'

import './ScoutAnswerFooter.css'

interface FooterProps {
  message: ScoutMessage
}

// Deterministic toast ids — incrementing module counter, never clock/random.
let toastCounter = 0
const makeToastId = (): string => {
  toastCounter += 1
  return `toast-footer-${toastCounter}`
}

export const ScoutAnswerFooter = ({ message }: FooterProps) => {
  const { actions } = useScout()

  const up = message.rating === 'up'
  const down = message.rating === 'down'
  const saved = Boolean(message.saved)

  const toast = (kind: Toast['kind'], text: string): Toast => ({
    id: makeToastId(),
    kind,
    text,
  })

  const handleUp = () => {
    if (up) {
      actions.updateMessage(message.id, { rating: undefined })
      return
    }
    // Selecting up clears down and any captured feedback (mutual exclusivity).
    actions.updateMessage(message.id, { rating: 'up', feedback: undefined })
    actions.addToast(toast('success', 'Marked helpful'))
  }

  const handleDown = () => {
    if (down) {
      actions.updateMessage(message.id, { rating: undefined, feedback: undefined })
      return
    }
    // Turning down on reveals the feedback form (derived in ScoutBubble) — no
    // toast; the form itself is the acknowledgement.
    actions.updateMessage(message.id, { rating: 'down' })
  }

  const handleCopy = () => {
    void copyAnswer(message.body).then((ok) =>
      actions.addToast(
        ok
          ? toast('success', 'Answer copied to clipboard')
          : toast('info', 'Copy unavailable in this context'),
      ),
    )
  }

  const handleExport = () => {
    const ok = exportAnswer(message.body)
    if (ok) {
      actions.addToast(toast('success', 'Exported scout-answer.txt'))
    } else {
      void copyAnswer(message.body)
      actions.addToast(
        toast('info', 'Export unavailable — copied to clipboard instead'),
      )
    }
  }

  const handleSave = () => {
    actions.openSaveModal(buildSaveModalStateForMessage(message))
  }

  const menu = (
    <Menu
      className='scout-answer-menu'
      items={[
        {
          key: 'copy',
          icon: <CopyOutlined />,
          label: 'Copy',
          onClick: handleCopy,
        },
        {
          key: 'export',
          icon: <DownloadOutlined />,
          label: 'Export',
          onClick: handleExport,
        },
        {
          key: 'save',
          icon: <ScoutBookmarkIcon filled={saved} size={13} />,
          label: saved ? 'Saved to Library' : 'Save to Library',
          onClick: handleSave,
        },
      ]}
    />
  )

  return (
    <div className='scout-answer-footer'>
      <Tooltip title='Helpful' mouseEnterDelay={0.4}>
        <button
          type='button'
          className={`scout-answer-footer__btn${up ? ' is-on' : ''}`}
          aria-label='Mark answer helpful'
          aria-pressed={up}
          onClick={handleUp}
        >
          {up ? <LikeFilled /> : <LikeOutlined />}
        </button>
      </Tooltip>
      <Tooltip title='Not helpful' mouseEnterDelay={0.4}>
        <button
          type='button'
          className={`scout-answer-footer__btn${down ? ' is-on' : ''}`}
          aria-label='Mark answer not helpful'
          aria-pressed={down}
          onClick={handleDown}
        >
          {down ? <DislikeFilled /> : <DislikeOutlined />}
        </button>
      </Tooltip>
      <Dropdown
        overlay={menu}
        trigger={['click']}
        placement='bottomRight'
        overlayClassName='scout-scope scout-answer-menu-overlay'
      >
        <button
          type='button'
          className={`scout-answer-footer__btn scout-answer-footer__more${
            saved ? ' is-saved' : ''
          }`}
          aria-label='More actions — copy, export, save'
        >
          <EllipsisOutlined />
        </button>
      </Dropdown>
    </div>
  )
}
