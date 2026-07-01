import './allGridsStyle.css'

import { useContractManagementContext } from '@contexts/ContractManagement'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { Detail } from '@modules/ContractManagement/api/types.schema'
import { AllDetailsGridActionButtons } from '@modules/ContractManagement/components/DetailsSection/AllDetailsGrid/components/AllDetailsGridActionButtons'
import { AllDetailsGridColumnDefs } from '@modules/ContractManagement/components/DetailsSection/AllDetailsGrid/components/AllDetailsGridColumnDefs'
import { AllDetailsGridMasterDetail } from '@modules/ContractManagement/components/DetailsSection/AllDetailsGrid/components/AllDetailsGridMasterDetail'
import { GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useMemo, useRef, useState } from 'react'

interface AllDetailsGridProps {
  rowData: Detail[]
}

export function AllDetailsGrid({ rowData }: AllDetailsGridProps) {
  const gridAPIRef = useRef() as MutableRefObject<GridApi>
  const storageKey = 'contract::all-details-grid'
  const gridViewManager = useGridViewManager(storageKey)

  const [selectedDetails, setSelectedDetails] = useState<Detail[]>([])

  const {
    canWrite,
    hasDetailEdits,
    hasContractEdits,
    retrieveValuationData,
    isFetchingDetailValuation,
    isFetchingContractValuation,
    deleteDetails,
    duplicateDetails,
    metadata,
    header,
  } = useContractManagementContext()

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) =>
        row?.data?.TradeEntryDetailId && row.data.TradeEntryDetailId !== 0
          ? row.data.TradeEntryDetailId
          : row?.data?.LocalTradeEntryDetailId,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      rowSelection: 'multiple' as const,
    }),
    []
  )

  const columnDefs = useMemo(() => AllDetailsGridColumnDefs({ metadata, header }), [metadata, header])

  const controlBarProps = useMemo(
    () => ({
      title: 'All Contract Details',
      hideActiveFilters: false,
      actionButtons: canWrite && (
        <AllDetailsGridActionButtons
          hasDetailEdits={hasDetailEdits}
          hasContractEdits={hasContractEdits}
          rowData={rowData}
          isFetchingContractValuation={isFetchingContractValuation}
          isFetchingDetailValuation={isFetchingDetailValuation}
          retrieveValuationData={retrieveValuationData}
          selectedDetails={selectedDetails}
          deleteDetails={deleteDetails}
          duplicateDetails={duplicateDetails}
        />
      ),
    }),
    [isFetchingDetailValuation, isFetchingContractValuation, selectedDetails]
  )

  const handleOnSelectionChanged = ({ api }) => {
    const selectedRows = api.getSelectedRows()
    setSelectedDetails(selectedRows)
  }

  return (
    <GraviGrid
      externalRef={gridAPIRef}
      agPropOverrides={agPropOverrides}
      columnDefs={columnDefs}
      controlBarProps={controlBarProps}
      rowData={rowData}
      onSelectionChanged={handleOnSelectionChanged}
      masterDetail
      detailRowAutoHeight
      detailCellRenderer={AllDetailsGridMasterDetail}
      storageKey={storageKey}
      gridViewManager={gridViewManager}
    />
  )
}
