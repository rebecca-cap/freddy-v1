import { LoadingOutlined, UserOutlined } from '@ant-design/icons'
import { useCredential } from '@api/useCredential'
import { useUser } from '@contexts/UserContext'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Avatar } from 'antd'
import React, { useMemo } from 'react'

import { ScoutNameIndicator, ScoutNameTag } from './ScoutNameTag'

export function UserSummary() {
  const { useUserInfoQuery } = useCredential()
  const { data: user } = useUserInfoQuery()

  const { impersonationCounterparties } = useUser()

  const name = useMemo(() => {
    if (user?.Data) {
      return `${user?.Data?.First} ${user?.Data?.Last}`
    }
    return undefined
  }, [user])
  // const counterPartyDisplay = user?.Data?.CounterPartyDisplay
  const counterPartyDisplay = impersonationCounterparties?.find(
    (cp) => cp.Value === localStorage.getItem('Gravitate-Current-CounterParty')
  )?.Text
  if (!user?.Data)
    return (
      <Horizontal>
        <Texto category='h6'>
          <LoadingOutlined />
        </Texto>
      </Horizontal>
    )
  return (
    <div className='flex ml-4' style={{ alignItems: 'center' }}>
      {/* ALR-4 — activity tag to the LEFT of the user's name. */}
      <ScoutNameTag />
      <div className='vertical-flex pr-2'>
        <Texto align='right' category='p2' weight='bold'>
          {name}
          {/* ALR-3 — unseen-ready indicator next to the name. */}
          <ScoutNameIndicator />
        </Texto>
        {counterPartyDisplay ? (
          <Horizontal className='mr-0 mt-1' alignItems='center' style={{ justifyContent: 'space-evenly' }}>
            <UserOutlined className='pr-2' />
            {counterPartyDisplay.length > 14 ? `${counterPartyDisplay.substring(0, 14)}...` : counterPartyDisplay}
          </Horizontal>
        ) : (
          <Texto align='right' category='label'>
            {counterPartyDisplay}
          </Texto>
        )}
      </div>
      <div className='vertical-flex-center pl-3'>
        <Avatar
          shape='square'
          style={{ borderRadius: 5, background: 'var(--primary-gradient)', textTransform: 'uppercase' }}
          size={36}
        >
          {user?.Data?.First?.[0]}
          {user?.Data?.Last?.[0]}
        </Avatar>
      </div>
    </div>
  )
}
