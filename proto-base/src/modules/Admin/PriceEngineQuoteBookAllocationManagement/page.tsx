import { ExperimentOutlined, GlobalOutlined, GoldOutlined } from '@ant-design/icons'
import { useAllocationAssociations } from '@modules/Admin/ManageAllocationAssociations/api/useAllocationAssociations'
import {
  AllocationAssociationsReferencesMetadata,
  AllocationAssociationsReferencesResponseData,
  ReferencesProduct,
  ReferencesTerminal,
} from '@modules/Admin/ManageAllocationAssociations/api/types.schema'
import { ReferenceDataMappings } from '@components/shared/ReferenceDataMappings/ReferenceDataMappings'
import { Horizontal, useLocalStorage } from '@gravitate-js/excalibrr'
import { useAllocationManagement } from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/api/useAllocationManagement'
import { AllocationManagementMainTab } from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/components/AllocationManagementMainTab'
import { Tabs } from 'antd'
import React, { useMemo } from 'react'

export interface AllocationReferencesPageProps {
  data: ReferencesProduct[] | ReferencesTerminal[] | object
  metadata: AllocationAssociationsReferencesMetadata | AllocationAssociationsReferencesResponseData
  updateWrapper?: (row: any, key: string) => void
  isLoading: boolean
  dataKey: string
  metaKey: string
  userTab: string
  canWrite: boolean
}

interface Tab {
  key: string
  title: string
  icon: React.ReactNode
  Element: React.FC<AllocationReferencesPageProps>
  updateWrapper?: (row: any, key: string) => void
  dataKey: string
  metaKey: string
  selectedTab: string
  data: object | []
  metadata: []
  isLoading: boolean
}

export function AllocationManagement() {
  const { getAllocationsQuery } = useAllocationManagement()
  const {
    useAllocationAssociationsReferences,
    useAllocationAssociationsReferencesMetadata,
    useAllocationAssociationReferencesMutation,
  } = useAllocationAssociations()
  const { data: allocationsData, isLoading: isAllocationDataLoading } = getAllocationsQuery()
  const { data: referenceData, isLoading: isReferenceDataLoading } = useAllocationAssociationsReferences()
  const { data: referenceMetadata, isLoading: isMetadataLoading } = useAllocationAssociationsReferencesMetadata()
  const referencesUpdate = useAllocationAssociationReferencesMutation()
  const { value: selectedTab, setValue: setSelectedTab } = useLocalStorage(
    'QuoteBook-PriceEngineQuoteBookAllocationManagement-SelectedTab',
    '1'
  )

  // TODO use the correct permission for PE and set canWrite from the permission. hardcoded to true for now

  const updateReferenceData = async (row, key: string) => {
    const filteredDataByKey = referenceData?.Data[key].filter(
      (item) => item.AllocationConsigneeId !== row.AllocationConsigneeId
    )
    const payload = {
      ...referenceData.Data,
      [key]: [row, ...filteredDataByKey],
    }

    await referencesUpdate.mutateAsync(payload)
  }

  const tabs: Tab[] = useMemo(() => {
    return [
      {
        key: '1',
        title: 'Allocation Management',
        icon: <GoldOutlined style={{ fontSize: 14 }} />,
        Element: AllocationManagementMainTab,
        dataKey: '',
        metaKey: '',
      },

      {
        key: '2',
        title: 'Terminals',
        icon: <GlobalOutlined />,
        Element: ReferenceDataMappings,
        dataKey: 'Terminals',
        metaKey: 'Locations',
        updateWrapper: updateReferenceData,
      },
      {
        key: '3',
        title: 'Products',
        icon: <ExperimentOutlined />,
        Element: ReferenceDataMappings,
        dataKey: 'Products',
        metaKey: 'Products',
        updateWrapper: updateReferenceData,
      },
    ]
  }, [referenceData])

  return (
    <Tabs defaultActiveKey={selectedTab} onChange={setSelectedTab}>
      {tabs.map((tab) => (
        <Tabs.TabPane
          tab={
            <Horizontal className='mx-2' verticalCenter>
              {tab.icon} {tab.title}
            </Horizontal>
          }
          key={tab.key}
          style={{ minHeight: '88vh' }}
        >
          <tab.Element
            data={referenceData && tab.dataKey ? referenceData?.Data[tab.dataKey] : allocationsData}
            metadata={
              tab.key === '1'
                ? referenceData
                : referenceMetadata && tab.metaKey
                ? referenceMetadata?.Data[tab.metaKey]
                : []
            }
            updateWrapper={tab.updateWrapper}
            isLoading={tab.key === '1' ? isAllocationDataLoading : isMetadataLoading || isReferenceDataLoading}
            dataKey={tab.dataKey}
            metaKey={tab.metaKey}
            userTab={selectedTab}
            canWrite
          />
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
