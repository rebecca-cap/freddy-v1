// Phase 4.3 — "How cell colors work" tour trigger + popover.
//
// Small toolbar control that opens an antd Popover with a one-screen
// explanation of identity vs scope. Visible only while state.open is true
// (the popover is meaningless when the cells aren't colored).
//
// State:
//   • Local `open` for the popover itself (default true on first appearance,
//     UNLESS state.tourDismissed is already set).
//   • Dispatching dismissTour persists the user's choice; the trigger stays
//     available, but the popover does not auto-reopen.

import { InfoCircleOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import { useState } from 'react'

import { useScout } from '../state/ScoutContext'

import scoutHead from '../assets/Scout-head 2.png'

import './ScoutTourTrigger.css'

export function ScoutTourTrigger() {
  const { state, actions } = useScout()
  // Popover is closed by default — it only opens when the user clicks the
  // "How cell colors work" link. (No auto-open on panel open.)
  const [open, setOpen] = useState(false)

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next && !state.tourDismissed) actions.dismissTour()
  }

  // Reserve the trigger's slot even while Scout is closed (render it
  // visibility:hidden) so the control row never reflows when the panel
  // opens/closes — keeps the Bulk Change button perfectly still. The toolbar
  // is a fluid flex-1 layout, so `order` alone can't pin Bulk Change; an
  // always-present (but invisible) box is the only reliable way.
  if (!state.open) {
    return (
      <button
        type='button'
        className='scout-scope scout-tour-trigger is-reserved'
        aria-hidden
        tabIndex={-1}
      >
        <InfoCircleOutlined className='scout-tour-trigger__icon' />
        <span className='scout-tour-trigger__label'>How cell colors work</span>
      </button>
    )
  }

  const content = (
    <div className='scout-scope scout-tour-popover-content'>
      <div className='scout-tour-popover__head'>
        <img
          src={scoutHead}
          alt=''
          aria-hidden
          className='scout-tour-popover__avatar'
        />
        <div>
          <div className='scout-tour-popover__title'>Cell colors focus Scout</div>
          <div className='scout-tour-popover__sub'>
            Click a cell to focus Scout on that piece of the row. The color
            tells you what kind of question Scout is ready to answer.
          </div>
        </div>
      </div>
      <div className='scout-tour-popover__rows'>
        <div className='scout-tour-popover__row'>
          <span className='scout-tour-popover__sw scout-tour-popover__sw--identity' />
          <div>
            <div className='scout-tour-popover__row-name'>Identity · Whole row</div>
            <div className='scout-tour-popover__row-desc'>
              Customer, Location, Product — these describe the row; clicking them won't refocus Scout.
            </div>
          </div>
        </div>
        <div className='scout-tour-popover__row'>
          <span className='scout-tour-popover__sw scout-tour-popover__sw--scope' />
          <div>
            <div className='scout-tour-popover__row-name'>Scope · This cell</div>
            <div className='scout-tour-popover__row-desc'>
              Cost, Proposed, Margin, Δ, Flags — Scout answers about this
              specific value.
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Popover
      visible={open}
      onVisibleChange={handleOpenChange}
      content={content}
      placement='bottomLeft'
      trigger='click'
      overlayClassName='scout-tour-popover'
    >
      <button
        type='button'
        className='scout-scope scout-tour-trigger'
        aria-label='How cell colors work'
      >
        <InfoCircleOutlined className='scout-tour-trigger__icon' />
        <span className='scout-tour-trigger__label'>How cell colors work</span>
      </button>
    </Popover>
  )
}
