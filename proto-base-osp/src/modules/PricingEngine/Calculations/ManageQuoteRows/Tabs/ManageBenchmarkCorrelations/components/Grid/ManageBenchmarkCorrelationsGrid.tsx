import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import {
  BenchmarkCorrelation,
  benchmarkKeys,
  BenchmarkMetadataResponse,
  CreateCorrelatedAssociationRequest,
  CreateCorrelatedAssociationRequestPayload,
  CreateCorrelatedAssociationsResponse,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/api/schema.types'
import { getManageBenchmarkCorrelationsColumnDefs } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/Grid/columns/columnDefs'
import { ManageBenchmarkCorrelationsGridActions } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/Grid/GridActions'
import { UseMutationResult } from '@tanstack/react-query'
import { GridApi } from 'ag-grid-community'
import { isArray } from 'lodash'
import React, { useEffect, useMemo } from 'react'

type ManageBenchmarksGridProps = {
  canWrite: boolean
  benchmarkCorrelations: BenchmarkCorrelation[] | undefined
  setIsShowingCreateForm: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedRows: React.Dispatch<React.SetStateAction<BenchmarkCorrelation[]>>
  isLoading: boolean
  benchmarkCorrelationsMetadataResponse: BenchmarkMetadataResponse | undefined
  createBenchmarkCorrelation: UseMutationResult<
    CreateCorrelatedAssociationsResponse,
    unknown,
    CreateCorrelatedAssociationRequest[],
    unknown
  >
}

export function ManageBenchmarkCorrelationsGrid({
  canWrite,
  benchmarkCorrelations,
  setIsShowingCreateForm,
  setSelectedRows,
  isLoading,
  benchmarkCorrelationsMetadataResponse,
  createBenchmarkCorrelation,
}: ManageBenchmarksGridProps) {
  const storageKey = 'PricingEngine::Calculations::QuoteRows::ManageBenchmarks'

  const gridRef = React.useRef<GridApi>() as React.MutableRefObject<GridApi>
  const gridViewManager = useGridViewManager(storageKey)

  const [isBulkChangeVisible, setIsBulkChangeVisible] = React.useState(false)

  const columnDefs = useMemo(
    () => getManageBenchmarkCorrelationsColumnDefs({ canWrite, benchmarkCorrelationsMetadataResponse }),
    [canWrite, benchmarkCorrelationsMetadataResponse?.Data]
  )

  const controlBarProps = useMemo(
    () => ({
      title: 'Manage Benchmarks',
      hideActiveFilters: false,
      showSelectedCount: true,
      actionButtons: (
        <ManageBenchmarkCorrelationsGridActions canWrite={canWrite} setIsShowingCreateForm={setIsShowingCreateForm} />
      ),
    }),
    [canWrite]
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row: { data: BenchmarkCorrelation }) => row.data.QuoteConfigurationMappingId?.toString(),
      frameworkComponents: { SearchableSelect },
      rowSelection: 'multiple' as const,
      groupDefaultExpanded: -1,
    }),
    []
  )

  const onSelectionChanged = ({ api }) => {
    const selectedRows = api.getSelectedRows()
    setSelectedRows(selectedRows)
  }

  // if benchmark correlation data changes, get the latest and update selected rows
  useEffect(() => {
    if (gridRef?.current) onSelectionChanged({ api: gridRef?.current })
  }, [benchmarkCorrelations])

  const updateBenchmarkCorrelation = async (rows: BenchmarkCorrelation | BenchmarkCorrelation[]) => {
    const changedRows = isArray(rows) ? rows : [rows]
    const payload = changedRows.map((row) => {
      const benchmarkIds: number[] = []

      benchmarkKeys.forEach((benchmarkKey) => {
        const rowBenchmarkId = row[benchmarkKey]?.CorrelatedCalculationId ?? row[benchmarkKey]
        if (rowBenchmarkId) {
          benchmarkIds.push(rowBenchmarkId)
        }
      })
      return {
        QuoteConfigurationMappingId: row.QuoteConfigurationMappingId,
        CorrelatedCalculationIds: benchmarkIds,
      }
    }) as CreateCorrelatedAssociationRequestPayload

    return createBenchmarkCorrelation.mutateAsync(payload)
  }

  return (
    <GraviGrid
      enableFilterContextMenu
      externalRef={gridRef}
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      storageKey={storageKey}
      rowData={benchmarkCorrelations}
      columnDefs={columnDefs}
      gridViewManager={gridViewManager}
      onSelectionChanged={onSelectionChanged}
      loading={isLoading}
      isBulkChangeVisible={isBulkChangeVisible}
      setIsBulkChangeVisible={setIsBulkChangeVisible}
      updateEP={updateBenchmarkCorrelation}
    />
  )
}
