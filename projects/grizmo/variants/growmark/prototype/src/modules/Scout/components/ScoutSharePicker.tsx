// ScoutSharePicker — the shared audience control used by both the Save/Edit
// modal and the Share modal. Radio-style scope cards (icon + title + subtitle)
// plus, for "Specific people", an inline scrollable avatar list of the (fake)
// team roster. Purely presentational: scope + picked userIds live in the
// parent; this just renders and reports clicks. `includePrivate` adds an
// "Only me" card up front (the Save modal keeps things private by default;
// the Share modal always targets someone, so it omits it).

import {
  CheckOutlined,
  LockOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'

import { TEAM_USERS } from '../services/team'

import './ScoutSharePicker.css'

export type ShareScope = 'none' | 'team' | 'people'

type ScopeOption = {
  value: ShareScope
  icon: ReactNode
  title: string
  sub: string
}

const PRIVATE_OPTION: ScopeOption = {
  value: 'none',
  icon: <LockOutlined className='scout-share-picker__scope-icon' />,
  title: 'Only me',
  sub: 'Only you can see this in your Library.',
}

const SHARE_OPTIONS: ScopeOption[] = [
  {
    value: 'team',
    icon: <TeamOutlined className='scout-share-picker__scope-icon' />,
    title: 'Everyone on the team',
    sub: 'All internal users get it in their library.',
  },
  {
    value: 'people',
    icon: <UsergroupAddOutlined className='scout-share-picker__scope-icon' />,
    title: 'Specific people',
    sub: 'Pick one or more teammates.',
  },
]

type Props = {
  scope: ShareScope
  onScopeChange: (scope: ShareScope) => void
  userIds: string[]
  onToggleUser: (id: string) => void
  includePrivate?: boolean
}

export const ScoutSharePicker = ({
  scope,
  onScopeChange,
  userIds,
  onToggleUser,
  includePrivate = false,
}: Props) => {
  const options = includePrivate
    ? [PRIVATE_OPTION, ...SHARE_OPTIONS]
    : SHARE_OPTIONS

  return (
    <>
      <div className='scout-share-picker__scopes' role='radiogroup'>
        {options.map((opt) => (
          <button
            type='button'
            key={opt.value}
            role='radio'
            aria-checked={scope === opt.value}
            className={`scout-share-picker__scope${
              scope === opt.value ? ' is-active' : ''
            }`}
            onClick={() => onScopeChange(opt.value)}
          >
            {opt.icon}
            <span className='scout-share-picker__scope-text'>
              <span className='scout-share-picker__scope-title'>
                {opt.title}
              </span>
              <span className='scout-share-picker__scope-sub'>{opt.sub}</span>
            </span>
          </button>
        ))}
      </div>

      {scope === 'people' ? (
        <div
          className='scout-share-picker__people'
          role='group'
          aria-label='Teammates'
        >
          {TEAM_USERS.map((u) => {
            const selected = userIds.includes(u.id)
            return (
              <button
                type='button'
                key={u.id}
                className={`scout-share-picker__user${
                  selected ? ' is-selected' : ''
                }`}
                aria-pressed={selected}
                onClick={() => onToggleUser(u.id)}
              >
                <span className='scout-share-picker__avatar' aria-hidden='true'>
                  {u.initials}
                </span>
                <span className='scout-share-picker__user-name'>{u.name}</span>
                {selected ? (
                  <CheckOutlined className='scout-share-picker__user-check' />
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </>
  )
}
