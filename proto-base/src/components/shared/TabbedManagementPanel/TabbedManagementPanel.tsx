import { CloseOutlined } from '@ant-design/icons'
import { ResizableSplitPanes } from '@components/shared/ResizableSplitPanes/ResizableSplitPanes'
import { GraviButton, Vertical } from '@gravitate-js/excalibrr'
import { Tabs } from 'antd'
import type { ReactNode } from 'react'

import styles from './styles.module.css'

export interface TabbedManagementPanelTab {
  key: string
  label: string
  icon?: ReactNode
  content: ReactNode
}

export interface TabbedManagementPanelProps {
  leftPane: ReactNode
  tabs: TabbedManagementPanelTab[]
  activeTabKey: string
  onTabChange: (key: string) => void
  isOpen: boolean
  onClose: () => void
  storageKey: string
  defaultLeftPercent?: number
}

export function TabbedManagementPanel({
  leftPane,
  tabs,
  activeTabKey,
  onTabChange,
  isOpen,
  onClose,
  storageKey,
  defaultLeftPercent = 70,
}: TabbedManagementPanelProps) {
  if (!isOpen) {
    return <>{leftPane}</>
  }

  const rightPane = (
    <Vertical className={styles.panel} fullHeight>
      <Tabs
        className={styles.tabs}
        activeKey={activeTabKey}
        onChange={onTabChange}
        tabBarExtraContent={
          <GraviButton icon={<CloseOutlined />} onClick={onClose} aria-label='Close panel' appearance='text' />
        }
        items={tabs.map((tab) => ({
          key: tab.key,
          label: tab.icon ? (
            <span>
              {tab.icon} {tab.label}
            </span>
          ) : (
            tab.label
          ),
          children: tab.content,
        }))}
      />
    </Vertical>
  )

  return (
    <ResizableSplitPanes
      storageKey={`${storageKey}-width`}
      leftPane={leftPane}
      rightPane={rightPane}
      defaultLeftPercent={defaultLeftPercent}
    />
  )
}
