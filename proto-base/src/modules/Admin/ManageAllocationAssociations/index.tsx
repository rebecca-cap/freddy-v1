import { EnvironmentOutlined, ExperimentOutlined, GlobalOutlined, GoldOutlined } from '@ant-design/icons'
import { ReferenceDataMappings } from '@components/shared/ReferenceDataMappings/ReferenceDataMappings'
import { useUser } from '@contexts/UserContext'
import { Horizontal, NotificationMessage, useLocalStorage } from '@gravitate-js/excalibrr'
import {
  AllocationAssociationsReferencesMetadata,
  AllocationAssociationsReferencesResponseData,
  AllocationManagementResponse,
  ReferencesConsignee,
  ReferencesProduct,
  ReferencesTerminal,
} from '@modules/Admin/ManageAllocationAssociations/api/types.schema'
import { useAllocationAssociations } from '@modules/Admin/ManageAllocationAssociations/api/useAllocationAssociations'
import { AuthorizationAllocationMappings } from '@modules/Admin/ManageAllocationAssociations/components/AuthorizationAllocationMappings'
import { Tabs } from 'antd'
import { useMemo } from 'react'

type ReferenceDataRow = ReferencesProduct | ReferencesTerminal | ReferencesConsignee
type ReferenceDataKey = 'Products' | 'Terminals' | 'Consignees'
type MetadataKey = 'Products' | 'Locations' | 'CounterParties'
export interface AllocationReferencesPageProps {
  data: ReferencesProduct[] | ReferencesTerminal[] | ReferencesConsignee[] | AllocationManagementResponse | undefined
  metadata: AllocationAssociationsReferencesMetadata | AllocationAssociationsReferencesResponseData | any[] | undefined
  updateWrapper?: (row: ReferenceDataRow, key: ReferenceDataKey) => void
  isLoading: boolean
  dataKey: ReferenceDataKey | ''
  metaKey: MetadataKey | ''
  userTab: string
  canWrite: boolean
}

interface Tab {
  key: string
  title: string
  icon: React.ReactNode
  Element: React.FC<AllocationReferencesPageProps>
  updateWrapper?: (row: ReferenceDataRow, key: ReferenceDataKey) => void
  dataKey: ReferenceDataKey | ''
  metaKey: MetadataKey | ''
  userTab: string
  canWrite?: boolean
}

export function ManageAllocationAssociations() {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.AuthorizationAllocation?.Write

  const {
    useAllocationAssociationsReferences,
    useAllocationAssociationsReferencesMetadata,
    useAllocationAssociationReferencesMutation,
    useAllocationAssociationsMappings,
  } = useAllocationAssociations()

  const { data: allocationMappingsData, isLoading: isAllocationMappingsLoading } = useAllocationAssociationsMappings()
  const { data: referenceData, isLoading: isDataLoading } = useAllocationAssociationsReferences()
  const { data: referenceMetadata, isLoading: isMetadataLoading } = useAllocationAssociationsReferencesMetadata()
  const referencesUpdate = useAllocationAssociationReferencesMutation()
  const { value: userTab, setValue: setUserTab } = useLocalStorage<string>('AllocationAssociationsTab', '1')

  // Type guards for reference data types
  const isReferencesConsignee = (row: ReferenceDataRow): row is ReferencesConsignee => {
    return 'AllocationConsigneeId' in row
  }

  const isReferencesTerminal = (row: ReferenceDataRow): row is ReferencesTerminal => {
    return 'AllocationTerminalId' in row
  }

  const isReferencesProduct = (row: ReferenceDataRow): row is ReferencesProduct => {
    return 'AllocationProductId' in row
  }

  const updateReferenceData = async (row: ReferenceDataRow, key: ReferenceDataKey) => {
    if (!referenceData?.Data) return

    const currentData = referenceData.Data[key]
    let filteredDataByKey: ReferenceDataRow[]

    // Type-safe filtering based on the key type and row type
    if (key === 'Consignees' && isReferencesConsignee(row)) {
      filteredDataByKey = (currentData as ReferencesConsignee[]).filter(
        (item) => item.AllocationConsigneeId !== row.AllocationConsigneeId
      )
    } else if (key === 'Terminals' && isReferencesTerminal(row)) {
      filteredDataByKey = (currentData as ReferencesTerminal[]).filter(
        (item) => item.AllocationTerminalId !== row.AllocationTerminalId
      )
    } else if (key === 'Products' && isReferencesProduct(row)) {
      filteredDataByKey = (currentData as ReferencesProduct[]).filter(
        (item) => item.AllocationProductId !== row.AllocationProductId
      )
    } else {
      // This case should not happen with proper typing, but keeping for safety
      filteredDataByKey = currentData as ReferenceDataRow[]
    }

    const payload = {
      ...referenceData.Data,
      [key]: [row, ...filteredDataByKey],
    }

    try {
      await referencesUpdate.mutateAsync(payload)
      NotificationMessage('Success.', `${key} data updated successfully.`, false)
    } catch (error) {
      console.error('Error updating reference data:', error)
      NotificationMessage('Error.', `Failed to update ${key} data.`, true)
    }
  }

  const tabs: Tab[] = useMemo(() => {
    return [
      {
        key: '1',
        title: 'Authorization Allocations',
        icon: <GoldOutlined style={{ fontSize: 14 }} />,
        Element: AuthorizationAllocationMappings,
        dataKey: '',
        metaKey: '',
        userTab: userTab || '1',
        canWrite,
      },
      {
        key: '2',
        title: 'Consignees',
        icon: <EnvironmentOutlined />,
        Element: ReferenceDataMappings,
        updateWrapper: updateReferenceData,
        dataKey: 'Consignees',
        metaKey: 'CounterParties',
        userTab: userTab || '1',
      },
      {
        key: '3',
        title: 'Terminals',
        icon: <GlobalOutlined />,
        Element: ReferenceDataMappings,
        dataKey: 'Terminals',
        metaKey: 'Locations',
        updateWrapper: updateReferenceData,
        userTab: userTab || '1',
      },
      {
        key: '4',
        title: 'Products',
        icon: <ExperimentOutlined />,
        Element: ReferenceDataMappings,
        dataKey: 'Products',
        metaKey: 'Products',
        updateWrapper: updateReferenceData,
        userTab: userTab || '1',
      },
    ]
  }, [referenceData, userTab, canWrite, updateReferenceData])

  return (
    <Tabs defaultActiveKey={userTab || '1'} onChange={setUserTab}>
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
            data={
              referenceData && tab.dataKey
                ? referenceData?.Data[tab.dataKey as keyof typeof referenceData.Data]
                : allocationMappingsData
            }
            metadata={
              tab.key === '1'
                ? referenceData
                : referenceMetadata && tab.metaKey && referenceMetadata.Data
                ? referenceMetadata.Data[tab.metaKey as keyof typeof referenceMetadata.Data]
                : []
            }
            updateWrapper={tab.updateWrapper}
            isLoading={isMetadataLoading || isDataLoading || isAllocationMappingsLoading}
            dataKey={tab.dataKey}
            metaKey={tab.metaKey}
            userTab={userTab || '1'}
            canWrite={canWrite}
          />
        </Tabs.TabPane>
      ))}
    </Tabs>
  )
}
