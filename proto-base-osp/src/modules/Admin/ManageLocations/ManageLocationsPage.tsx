import { useLocationManagement } from '@api/useLocationManagement'
import { useUser } from '@contexts/UserContext'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Grid } from '@modules/Admin/ManageLocations/components/Grid/ManageLocationsGrid'
import { SourceModal } from '@modules/Admin/ManageLocations/components/sourceModal'
import { Form } from 'antd'
import React, { useState } from 'react'

import { ManagementPane } from './components/ManagementPane'

export function ManageLocations() {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.Location?.Write

  const { useMetadataQuery, useLocationManagementQuery, createUpdateLocationManagementMutation } =
    useLocationManagement()
  const { data: metadata } = useMetadataQuery()
  const { data: locations } = useLocationManagementQuery()

  const [selectedRows, setSelectedRows] = useState([])
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalCancel = () => setIsModalOpen(false)
  const handleModalOpen = () => setIsModalOpen(true)

  const [editingRow, setEditingRow] = useState(null)
  const [form] = Form.useForm()

  const handleSourceModalSave = async (formValues) => {
    const rowToSave = { ...editingRow }
    rowToSave.SourceInfo = { ...formValues }
    if (formValues.SourceSystemId === 'None') {
      rowToSave.SourceInfo = null
    }
    const payload = [{ ...rowToSave }]
    await createUpdateLocationManagementMutation.mutateAsync(payload)
    handleModalCancel()
  }

  return (
    <Horizontal fullHeight>
      <Vertical>
        <SourceModal
          metadata={metadata}
          isModalOpen={isModalOpen}
          form={form}
          handleModalCancel={handleModalCancel}
          handleSourceModalSave={handleSourceModalSave}
          editingRow={editingRow}
        />
        <Grid
          setSelectedRows={setSelectedRows}
          canWrite={canWrite}
          setEditingRow={setEditingRow}
          isBulkChangeVisible={isBulkChangeVisible}
          setIsBulkChangeVisible={setIsBulkChangeVisible}
          handleModalOpen={() => handleModalOpen()}
        />
      </Vertical>
      <Vertical flex={!isBulkChangeVisible ? 'auto' : 'none'} style={{ maxWidth: 400 }}>
        {!isBulkChangeVisible && (
          <ManagementPane
            metadata={metadata}
            locations={locations}
            selectedRows={selectedRows}
            createUpdateLocationManagementMutation={createUpdateLocationManagementMutation}
            canWrite={canWrite}
          />
        )}
      </Vertical>
    </Horizontal>
  )
}
