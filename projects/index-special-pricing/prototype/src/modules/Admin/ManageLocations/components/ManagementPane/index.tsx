import '../../styles.css'

import { ApartmentOutlined, ExperimentFilled } from '@ant-design/icons'
import { useLocationManagement } from '@api/useLocationManagement'
import { Horizontal } from '@gravitate-js/excalibrr'
import { Tabs } from 'antd'
import React from 'react'

import { AvailableProducts } from './AvailableProducts'
import { ManageLocationGroups } from './ManageLocationGroups'

export function ManagementPane({
  metadata,
  locations,
  selectedRows,
  createUpdateLocationManagementMutation,
  canWrite,
}) {
  const { upsertLocationGroupMutation, useLocationGroupDeleteMutation } = useLocationManagement()
  const upsertLocationGroup = upsertLocationGroupMutation()
  const deleteLocationGroup = useLocationGroupDeleteMutation()
  const tabs = [
    {
      key: '0',
      value: 'LocationGroups',
      Text: 'Location Groups',
      icon: (
        <ApartmentOutlined
          style={{
            fontSize: 12,
            color: 'var(--theme-color-2)',
            marginRight: 10,
          }}
        />
      ),
      component: (
        <ManageLocationGroups
          metadata={metadata}
          locations={locations}
          canWrite={canWrite}
          upsertLocationGroup={upsertLocationGroup}
          deleteLocationGroup={deleteLocationGroup}
        />
      ),
    },
    {
      key: '1',
      value: 'AvailableProducts',
      Text: 'Available Products',
      icon: (
        <ExperimentFilled
          style={{
            marginRight: 10,
            fontSize: 12,
            color: 'var(--theme-color-2)',
          }}
        />
      ),
      component: (
        <AvailableProducts
          metadata={metadata}
          selectedRows={selectedRows}
          createUpdateLocationManagementMutation={createUpdateLocationManagementMutation}
          canWrite={canWrite}
        />
      ),
    },
    // {
    //   key: '2',
    //   value: 'CustomerAvailability',
    //   Text: 'Customer Availability',
    //   icon: (
    //     <FundViewOutlined
    //       style={{
    //         marginRight: 10,
    //         fontSize: 12,
    //         color: 'var(--theme-color-2)',
    //       }}
    //     />
    //   ),
    //   component: (
    //     <CustomerAvailability
    //       metadata={metadata}
    //       locations={locations}
    //       selectedRows={selectedRows}
    //       createUpdateLocationManagementMutation={createUpdateLocationManagementMutation}
    //     />
    //   ),
    // },
  ]

  return (
    <Horizontal style={{ overflow: 'scroll', height: '100vh' }}>
      <Tabs style={{ minWidth: '100%', overflowX: 'auto' }}>
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
              <Horizontal>{tab.component}</Horizontal>
            </Tabs.TabPane>
          )
        })}
      </Tabs>
    </Horizontal>
  )
}
