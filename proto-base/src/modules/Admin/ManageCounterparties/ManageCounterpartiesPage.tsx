import { useCounterparties } from '@api/useCounterparties'
import { CounterPartyOverviewData } from '@api/useCounterparties/types'
import { SourceEditWarningModal } from '@components/shared/Modals/SourceEditWarningModal'
import { useUser } from '@contexts/UserContext'
import { GraviButton, Horizontal, NotificationMessage, Vertical } from '@gravitate-js/excalibrr'
import { ManageCounterpartiesGrid } from '@modules/Admin/ManageCounterparties/components/Grid/ManageCounterpartiesGrid'
import { SourceEditorModal } from '@modules/Admin/ManageCounterparties/components/Grid/Modals/SourceEditorModal'
import { ManageCounterpartiesTabs } from '@modules/Admin/ManageCounterparties/components/ManagementPane/ManageCounterpartiesTabs'
import { LocalStorageWithExpiration } from '@utils/localStorageWithExpiration'
import { createIsEditableSource, requiresSourceEditWarning } from '@utils/SourceEditWarningHelpers'
import { Form, Modal } from 'antd'
import React, { useMemo, useState } from 'react'

export function ManageCounterpartiesPage() {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.CounterParty?.Write

  const [form] = Form.useForm()

  const [editingRow, setEditingRow] = useState<CounterPartyOverviewData | null>(null)
  const [selectedRow, setSelectedRow] = useState<CounterPartyOverviewData | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleModalCancel = () => setIsModalOpen(false)

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const [pendingUpdateData, setPendingUpdateData] = useState<any>(null)
  const [sourceSystemName, setSourceSystemName] = useState<string>('')
  const STORAGE_KEY = 'Admin_Counterparties_SuppressEditWarning'

  const {
    useCounterpartiesMetadataQuery,
    useCounterpartiesQuery,
    useCounterpartiesMutation,
    useCounterpartiesDistributionListQuery,
    useCounterpartyDistributionMutation,
  } = useCounterparties()

  const { data: metadata, isLoading: isMetadataLoading } = useCounterpartiesMetadataQuery()
  const { data: distributionData, isFetching: isDistributionDataLoading } = useCounterpartiesDistributionListQuery(
    selectedRow?.CounterPartyId
  )
  const { data: counterparties, isFetching: isCounterpartiesLoading } = useCounterpartiesQuery()

  const showTabs = (metadata?.Data?.ProductList?.length ?? 0) > 0 && (metadata?.Data?.LocationList?.length ?? 0) > 0

  const createOrUpdateMutation = useCounterpartiesMutation()
  const updateDistributionListMutation = useCounterpartyDistributionMutation()

  // Fields that are allowed to be edited without warning
  const allowedFields = new Set([
    'HasCustomerPortal',
    'PrimaryInternalCounterpartyId',
    'CreditStatusOverrideCvId',
    'MappedProductIds',
    'MappedLocationIds',
    'DistributionLists',
  ])

  // Check if a counterparty is from an editable source
  const isEditableSource = useMemo(
    () => createIsEditableSource(metadata?.Data?.EditableSources),
    [metadata?.Data?.EditableSources]
  )

  const handleSourceModalSave = async (formValues) => {
    const rowToSave = { ...editingRow }
    rowToSave.SourceInfo = { ...formValues }
    if (formValues.SourceSystemId === 'None') {
      rowToSave.SourceInfo = null
    }
    const payload = [{ ...rowToSave }]
    await createOrUpdateMutation.mutateAsync(payload)
    handleModalCancel()
  }

  const handleCreate = (counterParty) => {
    counterParty.IsActive = counterParty.IsActive == 'Yes'
    counterParty.CounterPartyCategoryCvId = parseInt(
      metadata?.Data?.CounterPartyCategoryList?.find((v) => v.Text === counterParty.CounterPartyCategoryCvId)?.Value ||
        ''
    )
    counterParty.CreditStatusOverrideCvId = parseInt(
      metadata?.Data?.CreditStatusList?.find((v) => v.Text === counterParty.CreditStatusOverrideCvId)?.Value || ''
    )
    if (counterParty.PrimaryInternalCounterpartyId !== undefined) {
      counterParty.PrimaryInternalCounterpartyId = parseInt(
        metadata?.Data?.InternalCounterPartyList?.find((v) => v.Text === counterParty.PrimaryInternalCounterpartyId)
          ?.Value || ''
      )
    }

    const sourceSystem = metadata?.Data?.EditableSources?.find((item) => item.Text === counterParty.SourceSystemId)
    if (sourceSystem !== undefined) {
      counterParty.SourceInfo = { SourceSystemId: parseInt(sourceSystem.Value) }
      if (sourceSystem.HasSourceId) {
        counterParty.SourceInfo.SourceId = parseInt(counterParty.SourceIdentifier)
      } else {
        counterParty.SourceInfo.SourceIdString = counterParty.SourceIdentifier
      }
    }
    const payload = [{ ...counterParty }]
    return createOrUpdateMutation.mutateAsync(payload)
  }

  const handleUpdate = (updatedGridData) => {
    const warningDismissed = LocalStorageWithExpiration.exists(STORAGE_KEY)
    const needsWarning = requiresSourceEditWarning({
      updatedData: updatedGridData,
      allowedFields,
      isEditableSource,
      setSourceSystemName,
    })

    if (needsWarning && !warningDismissed) {
      // Show warning modal and store the pending data
      setPendingUpdateData(updatedGridData)
      setIsWarningModalOpen(true)
      return Promise.resolve()
    }

    return executeUpdate(updatedGridData)
  }

  const executeUpdate = (updatedGridData) => {
    const rows = Array.isArray(updatedGridData) ? updatedGridData : [updatedGridData]

    const payload = rows?.map((row) => {
      const counterparty = row
      if (counterparty.SourceInfo?.SourceSystemId == null) {
        counterparty.SourceInfo = null
      }

      counterparty.CreditStatusOverrideCvId = parseInt(counterparty.CreditStatusOverrideCvId || '')
      counterparty.CounterPartyCategoryCvId = parseInt(counterparty.CounterPartyCategoryCvId || '')
      counterparty.PrimaryInternalCounterpartyId = parseInt(counterparty.PrimaryInternalCounterpartyId || '')

      return counterparty
    })

    return createOrUpdateMutation.mutateAsync(payload)
  }

  const handleWarningConfirm = () => {
    LocalStorageWithExpiration.set(STORAGE_KEY, true, 8)
    setIsWarningModalOpen(false)

    if (pendingUpdateData) {
      executeUpdate(pendingUpdateData)
      setPendingUpdateData(null)
    }
  }

  const handleWarningCancel = () => {
    setIsWarningModalOpen(false)
    setPendingUpdateData(null)
    NotificationMessage('Cancelled', 'Save cancelled', true)
  }

  return (
    <Horizontal fullHeight style={{ gap: 20 }}>
      <Modal
        visible={isModalOpen}
        title='Edit Source Id'
        footer={[
          <GraviButton key={'cancel'} buttonText='Cancel' onClick={handleModalCancel} />,
          <GraviButton key={'save'} buttonText='Save' onClick={form.submit} theme2 />,
        ]}
        onCancel={handleModalCancel}
      >
        <SourceEditorModal form={form} onFinish={handleSourceModalSave} editingRow={editingRow} metadata={metadata} />
      </Modal>

      <SourceEditWarningModal
        visible={isWarningModalOpen}
        onConfirm={handleWarningConfirm}
        onCancel={handleWarningCancel}
        sourceSystemName={sourceSystemName}
      />
      <Vertical flex={3}>
        <ManageCounterpartiesGrid
          canWrite={canWrite}
          rowData={counterparties?.Data}
          metadata={metadata}
          createEP={handleCreate}
          updateEP={handleUpdate}
          setSelectedRow={setSelectedRow}
          loading={false}
          setIsDownloading={setIsDownloading}
          setIsModalOpen={setIsModalOpen}
          setEditingRow={setEditingRow}
        />
      </Vertical>
      {showTabs && (
        <ManageCounterpartiesTabs
          metadata={metadata}
          distributionData={distributionData}
          isDistributionDataLoading={isDistributionDataLoading}
          selectedRow={selectedRow}
          createOrUpdateMutation={createOrUpdateMutation}
          updateDistributionListMutation={updateDistributionListMutation}
          canWrite={canWrite}
        />
      )}
    </Horizontal>
  )
}
