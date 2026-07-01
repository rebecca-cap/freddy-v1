import { CounterPartyOverviewData } from '@api/useCounterparties/types'
import { useProductManagement } from '@api/useProductManagement'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { DownloadButton } from '@components/shared/Grid/sharedActionButtons/DownloadButton'
import { SourceEditWarningModal } from '@components/shared/Modals/SourceEditWarningModal'
import { GraviGrid, Horizontal, NotificationMessage } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { loadColumnState, onColumnVisible } from '@utils/grid'
import { LocalStorageWithExpiration } from '@utils/localStorageWithExpiration'
import { createIsEditableSource, requiresSourceEditWarning } from '@utils/SourceEditWarningHelpers'
import { ColumnApi, ColumnVisibleEvent, GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'

import { newProductCreateConfig } from '../createConfig'
import { getColumnDefs } from './columnDefs'

export function Grid({ setSelectedRows, setEditingRow, openSourceModal, isBulkChanging, setIsBulkChanging, canWrite }) {
  const columnApiRef = useRef() as MutableRefObject<ColumnApi>
  const gridApiRef = useRef() as MutableRefObject<GridApi>
  const storageKey = 'ReferenceData/ManageProducts'

  const gridViewManager = useGridViewManager(storageKey)

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const [pendingUpdateData, setPendingUpdateData] = useState<any>(null)
  const [sourceSystemName, setSourceSystemName] = useState<string>('')
  const STORAGE_KEY = 'Admin_Products_SuppressEditWarning'

  const { useMetadataQuery, useProductManagementQuery, createUpdateProductManagementMutation } = useProductManagement()
  const { data: metadata } = useMetadataQuery()
  const { data: products } = useProductManagementQuery()

  const allowedFields = new Set(['ProductGroupId', 'IsHeating', 'OnlyAdditional', 'RelatedProducts', 'ProductGroups'])

  const isEditableSource = useMemo(
    () => createIsEditableSource(metadata?.Data?.EditableSources),
    [metadata?.Data?.EditableSources]
  )

  const initializeSourceModal = (row: CounterPartyOverviewData) => {
    setEditingRow(row)
    openSourceModal()
  }
  const columnDefs = useMemo(
    () => getColumnDefs(metadata, initializeSourceModal, products?.Data, canWrite),
    [metadata, products?.Data, canWrite]
  )

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
    return createUpdateProductManagementMutation.mutateAsync(payload)
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

  const handleCreate = ({ Name, Abbreviation, IsActive, ProductTypeCvId, ProductGroupId }: any) => {
    return createUpdateProductManagementMutation.mutateAsync([
      {
        Name,
        Abbreviation,
        ProductTypeCvId,
        ProductGroupId,
        AllowWeightedDistribution: false,
        NotSoldSeparately: false,
        IsTradingProduct: false,
        MarketPlatformAdditionalProducts: [],
        SourceInfo: null,
        IsActive: IsActive === 'Active',
      },
    ])
  }

  useEffect(() => {
    if (columnApiRef?.current && gridApiRef?.current) {
      loadColumnState(columnApiRef, 'ManageProductsColumnState')
    }
  }, [columnApiRef?.current, gridApiRef?.current, columnDefs])

  const controlBarProps = useMemo(
    () => ({
      title: 'Products',
      hideActiveFilters: false,
      actionButtons: (
        <Horizontal style={{ gap: '1rem' }}>
          <DownloadButton gridAPIRef={gridApiRef} pageTitle={'Products'} />
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
        controlBarProps={controlBarProps}
        onSelectionChanged={({ api }) => setSelectedRows(api.getSelectedRows())}
        agPropOverrides={{
          getRowId: (row) => row.data?.ProductId?.toString(),
          frameworkComponents: { SearchableSelect },
          rowSelection: 'multiple',
          rowHeight: 70,
          suppressRowClickSelection: isBulkChanging,
          onColumnVisible(event: ColumnVisibleEvent) {
            onColumnVisible(event, 'ManageProductsColumnState')
          },
        }}
        storageKey={storageKey}
        columnDefs={columnDefs}
        gridViewManager={gridViewManager}
        rowData={products?.Data}
        updateEP={canWrite ? handleSaveChanges : undefined}
        createConfig={newProductCreateConfig}
        createSelectOptions={metadata?.Data}
        createEP={canWrite ? handleCreate : undefined}
        isBulkChangeVisible={isBulkChanging}
        setIsBulkChangeVisible={canWrite ? setIsBulkChanging : null}
        bulkDrawerTitle='PRODUCTS'
        hideSaveDisplay
      />
    </>
  )
}
