import { FileExcelOutlined, GoldOutlined, LinkOutlined } from '@ant-design/icons'
import { useUser } from '@contexts/UserContext'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { ManageBenchmarkCorrelations } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations'
import { Tabs } from 'antd'
import React from 'react'

import { ManageQuoteRowsTab } from './Tabs/QuoteRows/ManageQuoteRowsTab'
import { QuoteRowsUpload } from './Tabs/QuoteRowsUpload'
import { ManageSpreadsTab } from './Tabs/QuoteSpreads'

interface Tab {
  key: string
  title: string
  icon: React.ReactNode
  Element: React.FC<any>
}

const tabs: Tab[] = [
  {
    key: '1',
    title: 'Quote Rows',
    icon: <GoldOutlined style={{ fontSize: 14 }} />,
    Element: ManageQuoteRowsTab,
  },
  {
    key: '2',
    title: 'Work in Excel',
    icon: <FileExcelOutlined />,
    Element: QuoteRowsUpload,
  },
  {
    key: '3',
    title: 'Manage Spreads',
    icon: <LinkOutlined />,
    Element: ManageSpreadsTab,
  },
  {
    key: '4',
    title: 'Manage Benchmarks',
    icon: <LinkOutlined />,
    Element: ManageBenchmarkCorrelations,
  },
]

export function ManageQuoteRowsPage() {
  const { value: userTab, setValue: setUserTab } = useLocalStorage('ManageQuoteRowsTab', '1')
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.QuoteRowManagement?.Write

  return (
    <Tabs
      defaultActiveKey={userTab ?? '1'}
      onChange={setUserTab}
      tabBarStyle={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--gray-300)' }}
    >
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
