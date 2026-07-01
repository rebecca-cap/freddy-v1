import { useContractManagementContext } from '@contexts/ContractManagement'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import React from 'react'

import { pageStyles } from '../../page'
import { DetailManager } from '../DetailManager'
import { AllDetails } from '../DetailsSection'
import { HeaderDisplay } from '../HeaderDisplay'
import { TabsControl } from './TabsControl'

export function DetailsView() {
  const { activeTabId } = useContractManagementContext()

  return (
    <Horizontal className='p-3' style={{ gap: pageStyles.gridSpacing }} fullHeight>
      <Vertical flex={1}>
        <HeaderDisplay />
      </Vertical>
      <Vertical flex={3}>
        <Horizontal>
          <TabsControl />
        </Horizontal>
        <Horizontal fullHeight>{activeTabId === '0' ? <AllDetails /> : <DetailManager />}</Horizontal>
      </Vertical>
    </Horizontal>
  )
}
