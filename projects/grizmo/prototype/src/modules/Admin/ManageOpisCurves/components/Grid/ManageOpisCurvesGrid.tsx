import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import {
  ActivateOpisCurveRequest,
  OpisCurveItem,
  OpisCurveResponse,
  OpisMetadataResponse,
  UpdateInstrumentSymbolRequest,
} from '@modules/Admin/ManageOpisCurves/api/types.schema'
import { ManageOpisCurvesGridActionButtons } from '@modules/Admin/ManageOpisCurves/components/Grid/ActionButtons'
import { getManageOpisCurvesColumnDefs } from '@modules/Admin/ManageOpisCurves/components/Grid/Columns/columnDefs'
import { UseMutationResult } from '@tanstack/react-query'
import { GridApi } from 'ag-grid-community'
import { isArray } from 'lodash'
import React, { useMemo, useState } from 'react'

type ManageOpisCurvesGridProps = {
  OpisCurves: OpisCurveResponse | undefined
  isOpisCurvesLoading: boolean
  opisMetadata: OpisMetadataResponse | undefined
  isOpisMetadataLoading: boolean
  activateOpisCurvesMutation: UseMutationResult<
    void, // response
    unknown, // error
    ActivateOpisCurveRequest // input
  >
  updateInstrumentSymbolMutation: UseMutationResult<
    void, // response
    unknown, // error
    UpdateInstrumentSymbolRequest // input
  >
}

export function ManageOpisCurvesGrid({
  OpisCurves,
  isOpisCurvesLoading,
  opisMetadata,
  isOpisMetadataLoading,
  activateOpisCurvesMutation,
  updateInstrumentSymbolMutation,
}: ManageOpisCurvesGridProps) {
  const storageKey = 'Admin::PriceSetup::OpisCurves'

  const gridRef = React.useRef<GridApi>() as React.MutableRefObject<GridApi>
  const gridViewManager = useGridViewManager(storageKey)

  const isLoading =
    isOpisMetadataLoading ||
    isOpisCurvesLoading ||
    activateOpisCurvesMutation?.isLoading ||
    updateInstrumentSymbolMutation?.isLoading
  const [selectedRows, setSelectedRows] = useState<OpisCurveItem[]>([])

  const columnDefs = useMemo(() => {
    const selectedExchangeSymbols = new Set(OpisCurves?.Data?.map((curve) => curve.ExchangeSymbol))
    const filteredExchangeSymbolList = opisMetadata?.ExchangeSymbolList.filter((x) => !selectedExchangeSymbols.has(x))
    return getManageOpisCurvesColumnDefs({ filteredExchangeSymbolList })
  }, [opisMetadata, OpisCurves?.Data, updateInstrumentSymbolMutation.isSuccess])

  const handleActivateOpisCurves = () => {
    const payload: ActivateOpisCurveRequest = {
      OpisCurveIds: selectedRows?.map((row) => row.OPISCurveId),
    }
    activateOpisCurvesMutation.mutate(payload)
  }

  const controlBarProps = useMemo(
    () => ({
      title: 'Manage OPIS Curves',
      hideActiveFilters: false,
      showSelectedCount: true,
      actionButtons: (
        <ManageOpisCurvesGridActionButtons
          selectedRows={selectedRows}
          handleActivateOpisCurves={handleActivateOpisCurves}
          isLoading={isLoading}
        />
      ),
    }),
    [selectedRows]
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row: { data: OpisCurveItem }) => row.data.OPISCurveId?.toString(),
      frameworkComponents: { SearchableSelect },
      rowSelection: 'multiple' as const,
    }),
    []
  )

  const handleOpisCurveGridSelection = ({ api }) => {
    setSelectedRows(api?.getSelectedRows())
  }

  const handleGridUpdate = async (gridData: OpisCurveItem | OpisCurveItem[]) => {
    // only updating one row at a time
    const row = isArray(gridData) ? gridData[0] : gridData

    const payload = {
      OPISCurveId: row.OPISCurveId,
      ExchangeSymbol: row.ExchangeSymbol,
    }

    updateInstrumentSymbolMutation.mutate(payload)
  }

  return (
    <GraviGrid
      externalRef={gridRef}
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      storageKey={storageKey}
      rowData={OpisCurves?.Data ?? []}
      columnDefs={columnDefs}
      gridViewManager={gridViewManager}
      loading={isLoading}
      onSelectionChanged={handleOpisCurveGridSelection}
      updateEP={handleGridUpdate}
    />
  )
}
