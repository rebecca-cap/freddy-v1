import { FileExcelOutlined, GoldOutlined, LinkOutlined, SwapOutlined, WarningOutlined } from '@ant-design/icons'
import { Permission, useUser } from '@contexts/UserContext'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { ManageBenchmarkCorrelations } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations'
import { Tabs } from 'antd'
import type React from 'react'

import { CompetitorMappingsTab } from './Tabs/CompetitorMappings/CompetitorMappingsTab'
import { PriceExceptionsTab } from './Tabs/PriceExceptions/PriceExceptionsTab'
import { ManageQuoteRowsTab } from './Tabs/QuoteRows/ManageQuoteRowsTab'
import { QuoteRowsUpload } from './Tabs/QuoteRowsUpload/QuoteRowsUploadTab'
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
  {
    key: '5',
    title: 'Price Exceptions',
    icon: <WarningOutlined />,
    Element: PriceExceptionsTab,
  },
  {
    key: '6',
    title: 'Competitor Mappings',
    icon: <SwapOutlined />,
    Element: CompetitorMappingsTab,
  },
]

export function ManageQuoteRowsPage() {
  const { value: userTab, setValue: setUserTab } = useLocalStorage('ManageQuoteRowsTab', '1')
  const { hasPermission } = useUser()
  const canWrite = hasPermission(Permission.QuoteRowManagement_Write)

  return (
    <Tabs
      className='px-2'
      defaultActiveKey={userTab ?? '1'}
      onChange={setUserTab}
      tabBarStyle={{ backgroundColor: 'var(--bg-1)', borderBottom: '1px solid var(--gray-300)', paddingLeft: '10px' }}
      items={tabs.map((tab) => ({
        key: tab.key,
        label: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {tab.icon}
            {tab.title}
          </span>
        ),
        style: { height: '89vh' },
        children: <tab.Element canWrite={canWrite} />,
      }))}
    />
  )
}
