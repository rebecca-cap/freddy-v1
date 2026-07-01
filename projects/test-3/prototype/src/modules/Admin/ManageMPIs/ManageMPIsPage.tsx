import { BranchesOutlined, TableOutlined } from '@ant-design/icons'
import { useUser } from '@contexts/UserContext'
import { NotificationMessage, useLocalStorage } from '@gravitate-js/excalibrr'
import {
  MarketPlatformInstrument,
  MarketPlatformInstrumentSubtypeWithParent,
} from '@modules/Admin/ManageMPIs/Api/types.schema'
import { getAllSubtypes, useManageMPIs } from '@modules/Admin/ManageMPIs/Api/useManageMPIs'
import { ManageMPIsGrid } from '@modules/Admin/ManageMPIs/Components/Grid/ManageMPIsGrid'
import { ManageSubtypesGrid } from '@modules/Admin/ManageMPIs/Components/Grid/ManageSubtypesGrid'
import { Tabs } from 'antd'
import { useMemo } from 'react'

export function ManageMPIsPage() {
  const { getMPIs, getMetadata, updateMPIs, updateSubtypes } = useManageMPIs()
  const { mutateAsync: updateMPIsMutation, isLoading: isSaving } = updateMPIs()
  const { mutateAsync: updateSubtypesMutation, isLoading: isSavingSubtypes } = updateSubtypes()

  const { data, isFetching, isLoading } = getMPIs()
  const { data: metadataResponse } = getMetadata()
  const { userPermissions } = useUser()
  const { value: activeTab, setValue: setActiveTab } = useLocalStorage('ManageMPIs-Tab', 'mpis')

  const canWrite = !!userPermissions?.MarketPlatform?.SuperUser
  // Flatten all subtypes from MPIs for the subtypes grid
  const allSubtypes = useMemo(() => {
    if (!data?.Data) return []
    return getAllSubtypes(data.Data)
  }, [data?.Data])

  const handleUpdate = async (rows: MarketPlatformInstrument | MarketPlatformInstrument[]): Promise<boolean> => {
    try {
      const payload = Array.isArray(rows) ? rows : [rows]

      const response = await updateMPIsMutation(payload)

      const hasErrors = (response?.Validations ?? []).some((v) => v.Severity === 'Error')

      if (!hasErrors) {
        NotificationMessage('Save Successful', `${response?.TotalRecords} record(s) updated successfully.`, false)
      } else {
        const firstErr = response?.Validations.find((v) => v.Severity === 'Error')
        NotificationMessage('Save Failed', firstErr?.Message, true)
      }

      return !hasErrors
    } catch (error) {
      NotificationMessage('Error Saving', 'An error occurred while saving changes. Please try again.', true)
      return new Promise((resolve) => resolve(false))
    }
  }

  const handleUpdateSubtypes = async (
    rows: MarketPlatformInstrumentSubtypeWithParent | MarketPlatformInstrumentSubtypeWithParent[]
  ): Promise<boolean> => {
    try {
      if (!data?.Data) return false

      const subtypes = Array.isArray(rows) ? rows : [rows]

      const response = await updateSubtypesMutation({
        subtypes,
        originalMPIs: data.Data,
      })

      const hasErrors = (response?.Validations ?? []).some((v) => v.Severity === 'Error')

      if (!hasErrors) {
        NotificationMessage('Save Successful', `${subtypes.length} subtype(s) updated successfully.`, false)
      } else {
        const firstErr = response?.Validations.find((v) => v.Severity === 'Error')
        NotificationMessage('Save Failed', firstErr?.Message, true)
      }

      return !hasErrors
    } catch (error) {
      NotificationMessage('Error Saving', 'An error occurred while saving subtype changes. Please try again.', true)
      return new Promise((resolve) => resolve(false))
    }
  }

  return (
    <Tabs defaultActiveKey={activeTab || 'mpis'} onChange={setActiveTab}>
      <Tabs.TabPane
        tab={
          <span>
            <TableOutlined /> Manage Instruments
          </span>
        }
        key='mpis'
        style={{ minHeight: '89vh' }}
      >
        <ManageMPIsGrid
          isLoading={isFetching || isLoading || isSaving}
          rowData={data?.Data}
          metadata={metadataResponse?.Data}
          canWrite={canWrite}
          updateEP={handleUpdate}
        />
      </Tabs.TabPane>

      <Tabs.TabPane
        tab={
          <span>
            <BranchesOutlined /> Manage Instrument Subtypes
          </span>
        }
        key='subtypes'
        style={{ minHeight: '89vh' }}
      >
        <ManageSubtypesGrid
          isLoading={isFetching || isLoading || isSavingSubtypes}
          rowData={allSubtypes}
          metadata={metadataResponse?.Data}
          canWrite={canWrite}
          updateEP={handleUpdateSubtypes}
        />
      </Tabs.TabPane>
    </Tabs>
  )
}
