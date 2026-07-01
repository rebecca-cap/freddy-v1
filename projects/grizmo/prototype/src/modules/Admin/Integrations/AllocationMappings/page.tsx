import { EnvironmentOutlined, ExperimentOutlined, GoldOutlined } from '@ant-design/icons'
import { useUser } from '@contexts/UserContext'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { Tabs } from 'antd'
import React from 'react'

import { AllocationMappingsProductsTab } from './Tabs/Products'
import { AllocationMappingsSuppliersTab } from './Tabs/Suppliers'
import { AllocationMappingsTerminalsTab } from './Tabs/Terminals'

export interface AllocationMappingsPageProps {
  canWrite: boolean
}

interface Tab {
  key: string
  title: string
  icon: React.ReactNode
  Element: React.FC<AllocationMappingsPageProps>
}

const tabs: Tab[] = [
  {
    key: '1',
    title: 'Suppliers',
    icon: <GoldOutlined style={{ fontSize: 14 }} />,
    Element: AllocationMappingsSuppliersTab,
  },
  {
    key: '2',
    title: 'Terminals',
    icon: <EnvironmentOutlined />,
    Element: AllocationMappingsTerminalsTab,
  },
  {
    key: '3',
    title: 'Product Groups',
    icon: <ExperimentOutlined />,
    Element: AllocationMappingsProductsTab,
  },
]

export function AllocationMappingsPage() {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.AllocationMapping?.Write

  const { value: userTab, setValue: setUserTab } = useLocalStorage('AllocationMappingsTab', '1')

  return (
    <Tabs defaultActiveKey={userTab} onChange={setUserTab}>
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
          <tab.Element canWrite={canWrite} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
