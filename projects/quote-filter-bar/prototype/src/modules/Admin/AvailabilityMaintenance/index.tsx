import { EnvironmentOutlined, ExperimentOutlined, GlobalOutlined, GoldOutlined } from '@ant-design/icons'
import { ReferenceDataMappings } from '@components/shared/ReferenceDataMappings/ReferenceDataMappings'
import { useUser } from '@contexts/UserContext'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { useAllocationAssociations } from '@modules/Admin/ManageAllocationAssociations/api/useAllocationAssociations'
import { Tabs } from 'antd'
import React, { useMemo } from 'react'

import { VolumeManagement } from './components/VolumeManagement'
import { VolumeSetup } from './components/VolumeSetup'

export function AvailabilityMaintenance() {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.Availability?.Write
  const {
    useAllocationAssociationReferencesMutation,
    useAllocationAssociationsReferences,
    useAllocationAssociationsMappings,
    useAllocationAssociationsReferencesMetadata,
  } = useAllocationAssociations()
  const { data: allocationMappingsData, isLoading: isAllocationMappingsLoading } = useAllocationAssociationsMappings()
  const { data: referenceMetadata, isLoading: isMetadataLoading } = useAllocationAssociationsReferencesMetadata()
  const { data: referenceData, isLoading: isDataLoading } = useAllocationAssociationsReferences()
  const referencesUpdate = useAllocationAssociationReferencesMutation()

  const { value: userTab, setValue: setUserTab } = useLocalStorage('VolumeManagement', '1')

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
  const tabs = useMemo(() => {
    const baseTabs = [
      {
        key: '1',
        title: 'Volume Management',
        icon: <GoldOutlined style={{ fontSize: 14 }} />,
        Element: VolumeManagement,
      },
      {
        key: '2',
        title: 'Volume Setup',
        icon: <EnvironmentOutlined />,
        Element: VolumeSetup,
      },
    ]
    const allocationTabs = [
      {
        key: '3',
        title: 'Terminals',
        icon: <GlobalOutlined />,
        Element: ReferenceDataMappings,
        dataKey: 'Terminals',
        metaKey: 'Locations',
        updateWrapper: updateReferenceData,
        userTab,
      },
      {
        key: '4',
        title: 'Products',
        icon: <ExperimentOutlined />,
        Element: ReferenceDataMappings,
        dataKey: 'Products',
        metaKey: 'Products',
        updateWrapper: updateReferenceData,
        userTab,
      },
    ]
    // if (referenceData?.Data) {
    //   return [...baseTabs, ...allocationTabs]
    // }
    return baseTabs
  }, [referenceData])

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
          style={{ minHeight: '88vh' }}
        >
          <tab.Element
            data={referenceData && tab.dataKey ? referenceData?.Data[tab.dataKey] : allocationMappingsData}
            metadata={
              tab.key === '1'
                ? referenceData
                : referenceMetadata && tab.metaKey
                ? referenceMetadata?.Data[tab.metaKey]
                : []
            }
            updateWrapper={tab.updateWrapper}
            isLoading={isMetadataLoading || isDataLoading || isAllocationMappingsLoading}
            dataKey={tab.dataKey}
            metaKey={tab.metaKey}
            userTab={userTab}
            canWrite={canWrite}
          />
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
