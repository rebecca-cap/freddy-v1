import { LinkUnlinkAssociationActionButtons } from '@components/shared/Grid/sharedActionButtons/LinkUnlinkActionButtons'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { AllocationAssociationsReferencesResponseData } from '@modules/Admin/ManageAllocationAssociations/api/types.schema'
import {
  GetAllocationAssociationsResponse,
  GetAllocationsResponse,
} from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/api/types.schema'
import { useAllocationManagement } from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/api/useAllocationManagement'
import { getAssociatedRows } from '@modules/Admin/PriceEngineQuoteBookAllocationManagement/components/AssociationsGrid/components/gridEvents'
import { GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useMemo, useRef, useState } from 'react'

import { getColumnDefs } from './components/columnDefs'

interface AssociationsGridProps {
  isFilteringToRelatedData: boolean | null
  referenceData?: AllocationAssociationsReferencesResponseData
  selectedAllocationRow?: GetAllocationsResponse
  associationsData?: GetAllocationAssociationsResponse[]
  isAssociationsDataLoading: boolean
  canWrite: boolean
}
export function AssociationsGrid({
  isFilteringToRelatedData,
  selectedAllocationRow,
  referenceData,
  associationsData,
  isAssociationsDataLoading,
  canWrite,
}: AssociationsGridProps) {
  const [selectedAssociationRows, setSelectedAssociationRows] = useState<
    GetAllocationAssociationsResponse[] | undefined
  >()
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const [deleteList, setDeleteList] = useState<number[]>([])
  const [isUnLinkAll, setIsUnLinkAll] = useState<'ALL' | 'SELECTED' | undefined>('ALL')
  const { upsertLinks, deleteLinks } = useAllocationManagement()
  const addToOrRemoveFromDeleteList = (id: number) => {
    let newDeleteList = deleteList
    if (deleteList.includes(id)) {
      newDeleteList = deleteList.filter((val) => val !== id)
    } else {
      newDeleteList = [...deleteList, id]
    }
    setDeleteList(newDeleteList)
  }
  const gridRef = useRef() as MutableRefObject<GridApi>
  const columnDefs = useMemo(
    () => getColumnDefs({ isDeleteMode, deleteList, addToOrRemoveFromDeleteList }),
    [deleteList, isDeleteMode]
  )
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data.QuoteConfigurationMappingId,
      rowGroupPanelShow: 'never' as const,
      rowSelection: 'multiple' as const,
      onRowSelected: (event) => setSelectedAssociationRows(event.api.getSelectedRows()),
      suppressRowClickSelection: isDeleteMode,
    }),
    [isDeleteMode]
  )
  const rowData = useMemo(() => {
    if (!isFilteringToRelatedData || !selectedAllocationRow) {
      gridRef.current?.deselectAll()
      return associationsData || []
    }

    return getAssociatedRows({
      selectedForeignRow: selectedAllocationRow,
      associationsData,
      referenceData,
    })
  }, [associationsData, selectedAllocationRow?.AllocationId, isFilteringToRelatedData, referenceData])

  const constructPayloadAndUpsertNewLinks = () => {
    if (!selectedAllocationRow || !selectedAssociationRows) return
    const newLinks = selectedAssociationRows.map((row) => ({
      AllocationId: selectedAllocationRow.AllocationId,
      QuoteRowId: row.QuoteConfigurationMappingId,
    }))
    upsertLinks.mutateAsync({ Links: newLinks }).then()
  }

  const canLink = useMemo(
    () => !!selectedAssociationRows?.length && !!selectedAllocationRow && canWrite,
    [selectedAssociationRows, selectedAllocationRow, canWrite]
  )

  const canUnlink = useMemo(() => deleteList.length > 0, [deleteList])

  const unLinkAndResetState = () => {
    deleteLinks.mutate({ AllocationAssociationIds: deleteList })
    setDeleteList([])
    setIsDeleteMode(false)
  }

  const canUnlinkAll = useMemo(
    () => !!selectedAssociationRows?.length && !!selectedAllocationRow,
    [selectedAssociationRows, selectedAllocationRow]
  )
  const handleUnLinkAll = () => {
    if (!selectedAllocationRow || !rowData || !selectedAssociationRows) return
    const list = isUnLinkAll === 'ALL' ? [...rowData] : [...selectedAssociationRows]
    const newDeleteList =
      list
        ?.map((row) => {
          const item = row.LinkedAllocationIds.find((val) => val.AllocationId === selectedAllocationRow?.AllocationId)
          return item?.AssociationId
        })
        .filter((val) => val !== undefined) || []
    deleteLinks.mutate({ AllocationAssociationIds: newDeleteList })
  }

  const controlBarProps = useMemo(
    () => ({
      title: 'Gravitate Data',
      showSelectedCount: true,
      hideActiveFilters: true,
      actionButtons: (
        <LinkUnlinkAssociationActionButtons
          selectedForeignRow={selectedAllocationRow}
          selectedGravitateRowsToAssociate={selectedAssociationRows}
          handleLink={constructPayloadAndUpsertNewLinks}
          canLink={canLink}
          canUnlink={canUnlink}
          handleUnlink={unLinkAndResetState}
          canAutoMap={false}
          isDeleteMode={isDeleteMode}
          setIsDeleteMode={setIsDeleteMode}
          deleteList={deleteList}
          cancelUnlink={() => {
            setIsDeleteMode(false)
            setDeleteList([])
          }}
          showUnLinkAllButton
          isUnLinkAll={isUnLinkAll}
          setIsUnLinkAll={setIsUnLinkAll}
          handleUnLinkAll={handleUnLinkAll}
          canUnLinkAll={canUnlinkAll}
          canWrite={canWrite}
        />
      ),
    }),

    [canUnlink, selectedAllocationRow, selectedAssociationRows, isDeleteMode, deleteList, canUnlinkAll, isUnLinkAll]
  )

  return (
    <GraviGrid
      externalRef={gridRef}
      rowData={rowData}
      loading={isAssociationsDataLoading}
      columnDefs={columnDefs}
      agPropOverrides={agPropOverrides}
      controlBarProps={controlBarProps}
      storageKey='gridConfig::QuoteRowAllocationAnalyticsAdmin-AssociationsGrid::'
    />
  )
}
