import { ApartmentOutlined } from '@ant-design/icons'
import { Horizontal } from '@gravitate-js/excalibrr'
import { Tabs } from 'antd'
import React from 'react'

import { ManageVolumeSetup } from './ManageVolumeSetup'

export default function VolumeSetupManagementPane({ volumeSetups, volumeGroups, volumeGroupMutation, canWrite }) {
  const tabs = [
    {
      key: '0',
      value: 'VolumeGroups',
      Text: 'Volume Groups',
      icon: (
        <ApartmentOutlined
          style={{
            fontSize: 12,
            color: 'var(--theme-color-2)',
          }}
        />
      ),
      component: (
        <ManageVolumeSetup
          volumeGroups={volumeGroups}
          volumeGroupMutation={volumeGroupMutation}
          volumeSetups={volumeSetups}
          canWrite={canWrite}
        />
      ),
    },
  ]

  return (
    <Horizontal>
      <Tabs style={{ minWidth: '100%' }}>
        {tabs?.map((tab) => {
          return (
            <Tabs.TabPane
              tab={
                <span>
                  {tab.icon} {tab.Text}
                </span>
              }
              key={tab.key}
            >
              <Horizontal style={{ height: '100vh' }}>{tab.component}</Horizontal>
            </Tabs.TabPane>
          )
        })}
      </Tabs>
    </Horizontal>
  )
}
