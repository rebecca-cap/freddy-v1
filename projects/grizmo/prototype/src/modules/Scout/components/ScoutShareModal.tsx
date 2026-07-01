// ScoutShareModal — push a saved item to teammates (R2 sharing).
//
// A saved prompt/path has value beyond its creator: a pricer promotes a proven
// question to the team, or a manager standardizes how everyone works. This is
// the Figma-style share surface — default "Everyone on the team", or pick
// "Specific people" to reveal a multi-select of the (fake) roster. Sharing
// lands the item in the recipient's own Library (simulated via a toast +
// seeded received items).
//
// Reads the target item from `state.shareModalItemId`; the scope toggle +
// picked users are local UI state (the reducer only tracks which modal is
// open). Mirrors ScoutSaveModal's antd Modal structure.

import { CloseOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { GraviButton } from '@gravitate-js/excalibrr'
import { Modal } from 'antd'
import { useEffect, useState } from 'react'

import { summarizeShareToast } from '../services/team'
import { useScout } from '../state/ScoutContext'
import type { ShareTarget } from '../types'

import { ScoutSharePicker } from './ScoutSharePicker'

import './ScoutShareModal.css'

const makeToastId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `toast-${crypto.randomUUID()}`
  }
  return `toast-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
}

export const ScoutShareModal = () => {
  const { state, actions } = useScout()
  const item = state.library.items.find(
    (i) => i.id === state.shareModalItemId,
  )

  const [scope, setScope] = useState<'team' | 'people'>('team')
  const [userIds, setUserIds] = useState<string[]>([])

  // Re-sync the local UI from the item's current share state each time the
  // modal opens on a (different) item, so re-sharing reflects what's set.
  useEffect(() => {
    if (!item) return
    if (item.sharedWith?.scope === 'people') {
      setScope('people')
      setUserIds(item.sharedWith.userIds)
    } else {
      setScope('team')
      setUserIds([])
    }
    // Keyed on the open target id — intentional single-dep re-sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.shareModalItemId])

  if (!item) return null

  const canShare = scope === 'team' || userIds.length > 0

  const handleClose = () => actions.closeShareModal()

  const toggleUser = (id: string) =>
    setUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const handleShare = () => {
    if (!canShare) return
    const target: ShareTarget =
      scope === 'team' ? { scope: 'team' } : { scope: 'people', userIds }
    actions.shareItem(item.id, target)
    actions.addToast({
      id: makeToastId(),
      kind: 'success',
      text: summarizeShareToast(target),
    })
    actions.closeShareModal()
  }

  const kindLabel =
    item.kind === 'path' ? `${item.steps.length}-step path` : 'Prompt'

  return (
    <Modal
      visible={!!item}
      onCancel={handleClose}
      footer={null}
      closable={false}
      destroyOnClose
      width={460}
      wrapClassName='scout-scope scout-share-modal-wrap'
      className='scout-share-modal'
      title={null}
      maskClosable
    >
      <div className='scout-share-modal__head'>
        <div className='scout-share-modal__head-icon' aria-hidden='true'>
          <UsergroupAddOutlined />
        </div>
        <div className='scout-share-modal__head-titles'>
          <div className='scout-share-modal__head-title'>Share</div>
          <div className='scout-share-modal__head-subtitle'>
            Anyone you share with gets this in their own library.
          </div>
        </div>
        <button
          type='button'
          className='scout-share-modal__close'
          aria-label='Close'
          onClick={handleClose}
        >
          <CloseOutlined />
        </button>
      </div>

      <div className='scout-share-modal__body'>
        <div className='scout-share-modal__item'>
          <span className='scout-share-modal__item-name'>{item.name}</span>
          <span className='scout-share-modal__item-kind'>{kindLabel}</span>
        </div>

        <ScoutSharePicker
          scope={scope}
          onScopeChange={(s) => setScope(s as 'team' | 'people')}
          userIds={userIds}
          onToggleUser={toggleUser}
        />
      </div>

      <div className='scout-share-modal__footer'>
        <GraviButton
          size='small'
          className='scout-share-modal__cancel'
          buttonText='Cancel'
          onClick={handleClose}
        />
        <GraviButton
          size='small'
          className='scout-share-modal__share'
          buttonText='Share'
          disabled={!canShare}
          onClick={handleShare}
        />
      </div>
    </Modal>
  )
}
