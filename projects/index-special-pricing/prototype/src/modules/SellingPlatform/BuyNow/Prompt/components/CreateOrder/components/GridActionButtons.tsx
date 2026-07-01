import { useCredentialTyped } from '@api/useCredential/useCredentialTyped'
import { usePromptContext } from '@contexts/PromptContext'
import { Horizontal } from '@gravitate-js/excalibrr'
import { AssignedSwitch } from '@modules/SellingPlatform/BuyNow/sharedComponents/AssignedSwitch'
import React from 'react'

export function GridActionButtons() {
  const { useUserInfoQuery } = useCredentialTyped()
  const { data: user } = useUserInfoQuery()

  const { onlyAssigned, toggleOnlyAssigned } = usePromptContext()
  const IsInternalUser = user?.Data?.AllowedImpersonationModes?.includes('All')

  return (
    <Horizontal className='justify-sb' gap={50}>
      {IsInternalUser && <AssignedSwitch onlyAssigned={onlyAssigned} toggleOnlyAssigned={toggleOnlyAssigned} />}
      {/* {IsInternalUser && hasTasInstruments && <TASSwitch tasMode={tasMode} toggleTasMode={toggleTasMode} />} */}
    </Horizontal>
  )
}
