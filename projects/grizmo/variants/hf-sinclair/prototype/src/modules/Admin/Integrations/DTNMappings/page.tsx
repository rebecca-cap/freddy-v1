import { EnvironmentOutlined, ExperimentOutlined, UserOutlined } from '@ant-design/icons'
import { useDTNMappings } from '@api/useDTNMappings'
import {
  CreateOrUpdateMappingsPayload,
  DTNMappingsResponse,
  DTNMetadataResponse,
  LocationRule,
  ProductRule,
  SupplierRule,
} from '@api/useDTNMappings/types'
import { useUser } from '@contexts/UserContext'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { UseMutationResult } from '@tanstack/react-query'
import { Tabs } from 'antd'
import React from 'react'

import { DTNLocationsTab } from './Tabs/Locations'
import { DTNProductsTab } from './Tabs/Products'
import { DTNSupplierPublishersTab } from './Tabs/SuppliersAndPublishers'

type PartialRule = Partial<ProductRule>[] | Partial<LocationRule>[] | Partial<SupplierRule>[]
export interface DTNMappingsPageProps {
  mappings: DTNMappingsResponse
  metadata: DTNMetadataResponse
  updateMutation: UseMutationResult<unknown, unknown, CreateOrUpdateMappingsPayload, unknown>
  isLoading: boolean
  canWrite: boolean
  fixPayload: (data: undefined | PartialRule) => undefined | PartialRule
}

interface Tab {
  key: string
  title: string
  icon: React.ReactNode
  Element: React.FC<DTNMappingsPageProps>
}

const tabs: Tab[] = [
  {
    key: '1',
    title: 'Products',
    icon: <ExperimentOutlined />,
    Element: DTNProductsTab,
  },
  {
    key: '2',
    title: 'Locations',
    icon: <EnvironmentOutlined />,
    Element: DTNLocationsTab,
  },
  {
    key: '3',
    title: 'Suppliers/Publishers',
    icon: <UserOutlined />,
    Element: DTNSupplierPublishersTab,
  },
]

export const DTNMappingsPage: React.FC = () => {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.PriceImportMappings?.Write

  const { useDTNMappingsQuery, useDTNMetadataQuery, useDTNMappingsUpdateMutation: updateMutation } = useDTNMappings()
  const { data: mappings, isLoading: isMappingsLoading } = useDTNMappingsQuery()
  const { data: metadata, isLoading: isMetadataLoading } = useDTNMetadataQuery()
  const { value: currentTab, setValue: setCurrentTab } = useLocalStorage(
    'integrations-priceImportMappings-currentTab',
    '1'
  )
  const fixPayload = (data: any) => {
    let newList = data?.dirtyChanges || data

    if (data?.dirtyChanges?.[0]?.['0']) {
      newList = []
      data.dirtyChanges.forEach((x) => {
        if (x[0]) {
          Object.keys(x).forEach((key) => {
            if (typeof x[key] === 'object') {
              newList.push(x[key])
            }
          })
        }
      })
    }
    return Array.isArray(newList) ? newList : [newList]
  }
  return (
    <Tabs defaultActiveKey='1' activeKey={currentTab || '1'} onChange={(key) => setCurrentTab(key)}>
      {tabs.map((tab) => (
        <Tabs.TabPane
          tab={
            <span>
              {tab.icon} {tab.title}
            </span>
          }
          key={tab.key}
          style={{ minHeight: '89vh' }}
        >
          <tab.Element
            mappings={mappings}
            metadata={metadata}
            isLoading={isMappingsLoading || isMetadataLoading}
            updateMutation={updateMutation}
            canWrite={canWrite}
            fixPayload={fixPayload}
          />
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
