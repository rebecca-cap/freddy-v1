import { LoadingOutlined } from '@ant-design/icons'
import { useNetOrGross } from '@api/useNetGross'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { Tabs } from 'antd'
import React, { useEffect, useState } from 'react'

import { NetGrossDefaultsGrid } from './components/NetGrossDefaultsGrid'

interface Tab {
  key: string
  value: string
  title: string
}

export const NetGrossDefaults: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([])

  const { value: netOrGrossDefaultTypeCvId, setValue: SetNetOrGrossDefaultTypeCvId } = useLocalStorage(
    'NetGrossDefaultsTab',
    '10101' as string
  )

  const {
    useMetadataQuery,
    useNetGrossRulesRead,
    createUpdateNetGrossRulesMutation,
    useNetGrossRulesDeleteMutation,
    useNetGrossRulesMoveMutation,
  } = useNetOrGross()
  const { data: metadata, isLoading: isMetadataLoading } = useMetadataQuery()
  const { data: netGrossRules, isLoading: isNetGrossRulesLoading } = useNetGrossRulesRead(netOrGrossDefaultTypeCvId)
  const moveRuleMutation = useNetGrossRulesMoveMutation()
  const deleteRuleMutation = useNetGrossRulesDeleteMutation()

  useEffect(() => {
    if (metadata?.NetOrGrossDefaultTypeList) {
      const metaTabs = metadata?.NetOrGrossDefaultTypeList?.map((item, index) => {
        return {
          key: item.Value,
          value: item.Text,
          title: item.Text,
        }
      })
      setTabs(metaTabs)
    }
  }, [metadata])

  if (isMetadataLoading) {
    return (
      <Horizontal fullHeight verticalCenter horizontalCenter>
        <Texto category='h1'>
          <LoadingOutlined />
        </Texto>
      </Horizontal>
    )
  }

  return (
    <div>
      <Tabs
        activeKey={netOrGrossDefaultTypeCvId}
        tabBarStyle={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--gray-300)' }}
        onChange={(tabId) => SetNetOrGrossDefaultTypeCvId(tabId)}
      >
        {tabs.map((tab) => (
          <Tabs.TabPane tab={<span>{tab.title}</span>} key={tab.key}>
            <NetGrossDefaultsGrid
              tabTitle={tab?.title}
              rowData={netGrossRules?.Data}
              metadata={metadata}
              netOrGrossDefaultTypeCvId={netOrGrossDefaultTypeCvId}
              createUpdateNetGrossRulesMutation={createUpdateNetGrossRulesMutation}
              deleteRuleMutation={deleteRuleMutation}
              moveRuleMutation={moveRuleMutation}
              isNetGrossRulesLoading={isNetGrossRulesLoading}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  )
}
