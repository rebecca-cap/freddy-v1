import { dateFormat } from '@components/TheArmory/helpers'
import { GraviGrid, NotificationMessage } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import {
  ContractValuation,
  ExecuteRevaluationRequest,
  ExecuteRevaluationResponse,
  GetMetaDataResponse,
} from '@modules/ContractManagement/ContractRevaluation/api/types'
import { ActionButtons } from '@modules/ContractManagement/ContractRevaluation/components/Grid/ActionButtons'
import { ContractRevaluationColumns } from '@modules/ContractManagement/ContractRevaluation/components/Grid/Columns/columnDefs'
import { ContractRevaluationGridMasterDetail } from '@modules/ContractManagement/ContractRevaluation/components/Grid/ContractRevaluationGridMasterDetail'
import { UseMutationResult } from '@tanstack/react-query'
import { GridApi } from 'ag-grid-community'
import moment from 'moment/moment'
import React, { useMemo, useState } from 'react'

interface ContractRevaluationGridProps {
  metadata?: GetMetaDataResponse['Data']
  valuations: ContractValuation[]
  isLoading: boolean
  contractsDateFilter: [moment.Moment, moment.Moment] | null
  setContractsDateFilter: (val: [moment.Moment, moment.Moment]) => void
  isValuationDrawerOpen: boolean
  setIsValuationDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedRowToViewBuildup: React.Dispatch<React.SetStateAction<number | null>>
  revaluationMutation: UseMutationResult<ExecuteRevaluationResponse, unknown, ExecuteRevaluationRequest>
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isModalOpen: boolean
}

export const ContractRevaluationGrid: React.FC<ContractRevaluationGridProps> = ({
  valuations,
  isLoading,
  contractsDateFilter,
  setContractsDateFilter,
  revaluationMutation,
  setIsModalOpen,
  isModalOpen,
  metadata,
}) => {
  const gridRef = React.useRef<GridApi>() as React.MutableRefObject<GridApi>

  const storageKey = 'ContractRevaluation'
  const gridViewManager = useGridViewManager(storageKey)

  const [selectedIdsToRevaluate, setSelectedIdsToRevaluate] = useState<number[]>([])
  const [hasSelectedRowsWithoutCalenders, setHasSelectedRowsWithoutCalendars] = useState<boolean>(false)

  const columnDefs = useMemo(
    () =>
      ContractRevaluationColumns({
        contractsDateFilter,
        revaluationMutation,
        metadata,
        hasSelectedRowsWithoutCalenders,
      }),
    [contractsDateFilter, revaluationMutation, metadata, hasSelectedRowsWithoutCalenders]
  )

  const handleContractRevaluation = () => {
    if (!contractsDateFilter) return
    const startDate = moment(contractsDateFilter[0]).format(dateFormat.ISO)
    const endDate = moment(contractsDateFilter[1]).format(dateFormat.ISO)
    revaluationMutation.mutate(
      {
        TradeEntryDetailIds: selectedIdsToRevaluate,
        StartDate: startDate,
        EndDate: endDate,
      },
      {
        onError: () => {
          NotificationMessage('Error', 'Something went wrong while reevaluating. Please try again later.')
        },
        onSuccess: () => {
          setSelectedIdsToRevaluate([])
        },
      }
    )
  }

  const controlBarProps = useMemo(() => {
    return {
      title: 'Contract Revaluation',
      hideActiveFilters: false,
      actionButtons: (
        <ActionButtons
          contractsDateFilter={contractsDateFilter}
          setContractsDateFilter={setContractsDateFilter}
          selectedIdsToRevaluate={selectedIdsToRevaluate}
          handleContractRevaluation={handleContractRevaluation}
          isLoading={revaluationMutation.isLoading}
          setIsModalOpen={setIsModalOpen}
          hasSelectedRowsWithoutCalenders={hasSelectedRowsWithoutCalenders}
        />
      ),
    }
  }, [
    contractsDateFilter,
    selectedIdsToRevaluate,
    isLoading,
    revaluationMutation?.isLoading,
    hasSelectedRowsWithoutCalenders,
  ])

  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (params: { data: ContractValuation }) =>
        `${params.data.TradeEntryDetailId}-${params.data.TradeEntryId}`,
      rowSelection: 'multiple' as const,
    }
  }, [])

  const handleContractRevaluationGridSelection = ({ api }) => {
    const selectedRows = api?.getSelectedRows() as ContractValuation[]
    const selectionHasRowsWithoutCalender = selectedRows?.some((row) => !row.ValuationCalendarId)
    const tradeEntryDetailIds = selectedRows?.map((row) => row.TradeEntryDetailId)
    setSelectedIdsToRevaluate(tradeEntryDetailIds)
    setHasSelectedRowsWithoutCalendars(selectionHasRowsWithoutCalender)
  }

  return (
    <GraviGrid
      storageKey={storageKey}
      externalRef={gridRef}
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      columnDefs={columnDefs}
      rowData={valuations}
      loading={isLoading || revaluationMutation?.isLoading}
      gridViewManager={gridViewManager}
      onSelectionChanged={handleContractRevaluationGridSelection}
      masterDetail
      detailRowAutoHeight
      detailCellRenderer={ContractRevaluationGridMasterDetail}
    />
  )
}
