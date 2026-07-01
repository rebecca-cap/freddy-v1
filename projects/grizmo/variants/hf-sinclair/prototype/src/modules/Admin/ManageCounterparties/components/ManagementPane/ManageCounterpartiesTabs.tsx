import { ApartmentOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { CounterPartyDistributionLists, CounterPartyUpsert, CreateOrUpdateResponse } from '@api/useCounterparties/types'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { ManageCounterpartiesCreditTab } from '@modules/Admin/ManageCounterparties/components/ManagementPane/ManageCounterpartiesCreditTab/ManageCounterpartiesCreditTab'
import { ManageCounterpartiesDistributionListTab } from '@modules/Admin/ManageCounterparties/components/ManagementPane/ManageCounterpartiesDistributionListTab'
import { ManageCounterpartiesProductLocationsTab } from '@modules/Admin/ManageCounterparties/components/ManagementPane/ManageCounterpartiesProductLocationsTab'
import { UseMutationResult } from '@tanstack/react-query'
import { Tabs } from 'antd'
import React from 'react'

type TabsProps = {
  metadata: any
  distributionData: any
  isDistributionDataLoading: boolean
  selectedRow: any
  createOrUpdateMutation: UseMutationResult<CreateOrUpdateResponse, unknown, CounterPartyUpsert | CounterPartyUpsert[]>
  updateDistributionListMutation: UseMutationResult<any, unknown, CounterPartyDistributionLists>
  canWrite: boolean
}

export const ManageCounterpartiesTabs: React.FC<TabsProps> = ({
  metadata,
  distributionData,
  isDistributionDataLoading,
  selectedRow,
  createOrUpdateMutation,
  updateDistributionListMutation,
  canWrite,
}) => {
  const tabs = [
    {
      key: '0',
      value: 'ProductLocations',
      Text: 'Product / Locations',
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
        <ManageCounterpartiesProductLocationsTab
          metadata={metadata}
          selectedRow={selectedRow}
          createOrUpdateMutation={createOrUpdateMutation}
          canWrite={canWrite}
        />
      ),
    },
    {
      key: '1',
      value: 'DistributionList',
      Text: 'Distribution List',
      icon: (
        <UnorderedListOutlined
          style={{
            fontSize: 12,
            color: 'var(--theme-color-2)',
            marginRight: 10,
          }}
        />
      ),
      component: (
        <ManageCounterpartiesDistributionListTab
          metadata={distributionData}
          isLoading={isDistributionDataLoading}
          selectedRow={selectedRow}
          createOrUpdateMutation={updateDistributionListMutation}
          canWrite={canWrite}
        />
      ),
    },
    {
      key: '2',
      value: 'CreditInformation',
      Text: 'Credit Information',
      icon: (
        <UnorderedListOutlined
          style={{
            fontSize: 12,
            color: 'var(--theme-color-2)',
            marginRight: 10,
          }}
        />
      ),
      component: <ManageCounterpartiesCreditTab metadata={metadata} selectedRow={selectedRow} />,
    },
  ]

  return (
    <Vertical flex={1}>
      <Tabs style={{ minWidth: '100%' }}>
        {tabs.map((tab) => (
          <Tabs.TabPane
            key={tab.key}
            tab={
              <span>
                {tab.icon} {tab.Text}
              </span>
            }
          >
            <Horizontal style={{ height: '100vh' }}>{tab.component}</Horizontal>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Vertical>
  )
}
