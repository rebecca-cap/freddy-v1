import {
  CounterPartyMetadataResponse,
  CounterPartyOverviewData,
  CounterPartyUpsert,
} from '@api/useCounterparties/types'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { DownloadButton } from '@components/shared/Grid/sharedActionButtons/DownloadButton'
import { GraviGrid, Horizontal } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { getCounterpartyColumnDefs } from '@modules/Admin/ManageCounterparties/components/Grid/Columns/columnDefs'
import { createCounterpartyConfig } from '@modules/Admin/ManageCounterparties/components/Grid/createConfig'
import { GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useMemo, useRef, useState } from 'react'

type AnyRecord = Record<string, any>

export interface ManageCounterpartiesGridProps {
  canWrite: boolean
  rowData: AnyRecord[] | undefined
  loading: boolean
  setSelectedRow: (row: CounterPartyOverviewData | null) => void
  setIsDownloading: React.Dispatch<React.SetStateAction<boolean>>
  metadata: CounterPartyMetadataResponse | undefined
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setEditingRow: (row: CounterPartyOverviewData | null) => void
  createEP?: (row: CounterPartyUpsert | CounterPartyUpsert[], meta?: any) => Promise<any>
  updateEP?: (row: CounterPartyUpsert | CounterPartyUpsert[], meta?: any) => Promise<any>
}

export function ManageCounterpartiesGrid({
  canWrite,
  rowData,
  loading,
  createEP,
  updateEP,
  setSelectedRow,
  setIsDownloading,
  metadata,
  setIsModalOpen,
  setEditingRow,
}: ManageCounterpartiesGridProps) {
  const storageKey = 'ManageCounterparties'
  const gridViewManager = useGridViewManager(storageKey)
  const gridRef = useRef() as MutableRefObject<GridApi>
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)

  const handleModalCancel = () => setIsModalOpen(false)
  const handleModalOpen = () => setIsModalOpen(true)

  const initializeSourceModal = (row: CounterPartyOverviewData) => {
    setEditingRow(row)
    handleModalOpen()
  }

  const columnDefs = useMemo(
    () => getCounterpartyColumnDefs({ initializeSourceModal, metadata: metadata?.Data, canWrite }),
    [metadata?.Data, canWrite, rowData]
  )

  const controlBarProps = useMemo(
    () => ({
      actionButtons: canWrite && (
        <Horizontal style={{ marginRight: 15 }}>
          <DownloadButton gridAPIRef={gridRef} pageTitle='CounterParties' setter={setIsDownloading} />
        </Horizontal>
      ),
      title: 'Manage Counterparties',
      hideActiveFilters: false,
    }),
    [gridRef, canWrite]
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row?.data?.CounterPartyId?.toString(),
      rowSelection: 'multiple' as const,
      frameworkComponents: { SearchableSelect },
    }),
    []
  )

  const handleSelectionChanged = (props: any) => {
    const userSelectedRows = props.api.getSelectedRows()[0]
    setSelectedRow(userSelectedRows)
  }

  return (
    <GraviGrid
      externalRef={gridRef}
      onSelectionChanged={handleSelectionChanged}
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      storageKey={storageKey}
      loading={loading}
      rowData={rowData}
      columnDefs={columnDefs}
      gridViewManager={gridViewManager}
      createEP={canWrite ? createEP : undefined}
      updateEP={canWrite ? updateEP : undefined}
      createConfig={createCounterpartyConfig}
      createSelectOptions={metadata?.Data}
      isBulkChangeVisible={isBulkChangeVisible}
      setIsBulkChangeVisible={canWrite ? setIsBulkChangeVisible : undefined}
      hideSaveDisplay
      tooltipShowDelay={500}
    />
  )
}
