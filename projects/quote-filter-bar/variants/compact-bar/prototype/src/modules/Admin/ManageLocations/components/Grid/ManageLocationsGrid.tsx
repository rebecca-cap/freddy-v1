import { CounterPartyOverviewData } from '@api/useCounterparties/types'
import { useLocationManagement } from '@api/useLocationManagement'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { DownloadButton } from '@components/shared/Grid/sharedActionButtons/DownloadButton'
import { SourceEditWarningModal } from '@components/shared/Modals/SourceEditWarningModal'
import { GraviGrid, Horizontal, NotificationMessage } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { newLocationCreateConfig } from '@modules/Admin/ManageLocations/components/createConfig'
import { getColumnDefs } from '@modules/Admin/ManageLocations/components/Grid/columnDefs'
import { loadColumnState, onColumnVisible } from '@utils/grid'
import { LocalStorageWithExpiration } from '@utils/localStorageWithExpiration'
import { createIsEditableSource, requiresSourceEditWarning } from '@utils/SourceEditWarningHelpers'
import { ColumnApi, ColumnVisibleEvent, GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'

export function Grid({
  setSelectedRows,
  setEditingRow,
  canWrite,
  isBulkChangeVisible,
  setIsBulkChangeVisible,
  handleModalOpen,
}) {
  const columnApiRef = useRef() as MutableRefObject<ColumnApi>
  const gridApiRef = useRef() as MutableRefObject<GridApi>
  const storageKey = 'ReferenceData/ManageLocations'

  const gridViewManager = useGridViewManager(storageKey)

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const [pendingUpdateData, setPendingUpdateData] = useState<any>(null)
  const [sourceSystemName, setSourceSystemName] = useState<string>('')
  const STORAGE_KEY = 'Admin_Locations_SuppressEditWarning'

  const { useMetadataQuery, useLocationManagementQuery, createUpdateLocationManagementMutation } =
    useLocationManagement()
  const { data: metadata } = useMetadataQuery()
  const { data: locations } = useLocationManagementQuery()

  const allowedFields = new Set(['HasPreferredCarriers', 'NetOrGross', 'AvailableProducts'])

  const isEditableSource = useMemo(
    () => createIsEditableSource(metadata?.Data?.EditableSources),
    [metadata?.Data?.EditableSources]
  )

  const initializeSourceModal = (row: CounterPartyOverviewData) => {
    setEditingRow(row)
    handleModalOpen()
  }

  const columnDefs = useMemo(
    () => getColumnDefs(locations?.Data, metadata, initializeSourceModal, canWrite),
    [metadata, initializeSourceModal, canWrite, locations?.Data]
  )

  useEffect(() => {
    if (columnApiRef?.current && gridApiRef?.current) {
      loadColumnState(columnApiRef, 'ManageLocationsColumnState')
    }
  }, [columnApiRef?.current, gridApiRef?.current, columnDefs])

  const handleSaveChanges = async (updatedGridData) => {
    const warningDismissed = LocalStorageWithExpiration.exists(STORAGE_KEY)
    const needsWarning = requiresSourceEditWarning({
      updatedData: updatedGridData,
      allowedFields,
      isEditableSource,
      setSourceSystemName,
    })
    if (needsWarning && !warningDismissed) {
      setPendingUpdateData(updatedGridData)
      setIsWarningModalOpen(true)
      return Promise.resolve()
    }

    return executeSave(updatedGridData)
  }

  const executeSave = async (data) => {
    const payload = Array.isArray(data) ? data : [data]
    return createUpdateLocationManagementMutation.mutateAsync(payload)
  }

  const handleWarningConfirm = () => {
    LocalStorageWithExpiration.set(STORAGE_KEY, true, 8)
    setIsWarningModalOpen(false)

    if (pendingUpdateData) {
      executeSave(pendingUpdateData)
      setPendingUpdateData(null)
    }
  }

  const handleWarningCancel = () => {
    setIsWarningModalOpen(false)
    setPendingUpdateData(null)
    NotificationMessage('Cancelled', 'Save cancelled', true)
  }

  const handleCreate = (newLocationValues) => {
    const LocationGroupId = metadata?.Data?.LocationGroups?.find(
      (type) => type.Text === newLocationValues?.LocationGroup
    )?.Value

    const newLocation = {
      Name: newLocationValues.Name,
      Abbreviation: newLocationValues.Abbreviation,
      LocationGroupId,
      MarketPlatformAssociatedProducts: [],
      SourceInfo: null,
      IsActive: newLocationValues.IsActive === 'Active',
      Latitude: newLocationValues.Latitude,
      Longitude: newLocationValues.Longitude,
    }
    return createUpdateLocationManagementMutation.mutateAsync([newLocation])
  }
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data?.LocationId,
      frameworkComponents: { SearchableSelect },
      rowSelection: 'multiple' as const,
      rowHeight: 70,
      suppressRowClickSelection: isBulkChangeVisible,
      onColumnVisible(event: ColumnVisibleEvent) {
        onColumnVisible(event, 'ManageLocationsColumnState')
      },
    }),
    [isBulkChangeVisible]
  )

  const controlBarProps = useMemo(
    () => ({
      title: 'Locations',
      hideActiveFilters: false,
      actionButtons: (
        <Horizontal style={{ gap: '1rem' }}>
          <DownloadButton gridAPIRef={gridApiRef} pageTitle={'Locations'} />
        </Horizontal>
      ),
    }),
    []
  )

  return (
    <>
      <SourceEditWarningModal
        visible={isWarningModalOpen}
        onConfirm={handleWarningConfirm}
        onCancel={handleWarningCancel}
        sourceSystemName={sourceSystemName}
      />
      <GraviGrid
        externalRef={gridApiRef}
        columnApiRef={columnApiRef}
        onSelectionChanged={(props) => {
          const userSelectedRows = props.api.getSelectedRows()
          setSelectedRows(userSelectedRows)
        }}
        controlBarProps={controlBarProps}
        agPropOverrides={agPropOverrides}
        gridViewManager={gridViewManager}
        columnDefs={columnDefs}
        storageKey={storageKey}
        rowData={locations?.Data}
        updateEP={canWrite && handleSaveChanges}
        createConfig={canWrite ? newLocationCreateConfig : undefined}
        createSelectOptions={metadata?.Data}
        createEP={canWrite ? handleCreate : undefined}
        isBulkChangeVisible={isBulkChangeVisible}
        setIsBulkChangeVisible={canWrite ? setIsBulkChangeVisible : undefined}
        bulkDrawerTitle='LOCATIONS'
        hideSaveDisplay
      />
    </>
  )
}
