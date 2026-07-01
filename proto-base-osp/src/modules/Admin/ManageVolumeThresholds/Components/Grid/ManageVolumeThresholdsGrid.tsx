import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { TradeEntrySetupVolumeThreshold } from '@modules/Admin/ManageVolumeThresholds/Api/types.schema'
import { getManageVolumeThresholdColumns } from '@modules/Admin/ManageVolumeThresholds/Components/Grid/Columns/ColumnDefs'
import { GridApi } from 'ag-grid-community'
import { useMemo, useRef, useState } from 'react'

interface ManageVolumeThresholdsGridProps {
  isLoading: boolean
  rowData: TradeEntrySetupVolumeThreshold[] | undefined
  canWrite: boolean
  updateEP: (rows: TradeEntrySetupVolumeThreshold | TradeEntrySetupVolumeThreshold[]) => Promise<boolean>
}

export const ManageVolumeThresholdsGrid: React.FC<ManageVolumeThresholdsGridProps> = ({
  isLoading,
  rowData,
  canWrite,
  updateEP,
}) => {
  const gridRef = useRef<GridApi>() as React.MutableRefObject<GridApi>

  const storageKey = 'ManageVolumeThresholdsGrid'
  const gridViewManager = useGridViewManager(storageKey)
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState<boolean>(false)

  const columnDefs = useMemo(() => getManageVolumeThresholdColumns({ canWrite }), [rowData, isLoading, canWrite])

  const controlBarProps = useMemo(() => {
    return {
      title: 'Volume Thresholds',
      hideActiveFilters: false,
    }
  }, [])

  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (row) => row?.data?.TradeEntrySetupId.toString(),
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
    }
  }, [])

  return (
    <GraviGrid
      storageKey={storageKey}
      externalRef={gridRef}
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      columnDefs={columnDefs}
      rowData={rowData}
      loading={isLoading}
      gridViewManager={gridViewManager}
      updateEP={canWrite ? updateEP : undefined}
      isBulkChangeVisible={isBulkChangeVisible}
      setIsBulkChangeVisible={setIsBulkChangeVisible}
      hideSaveDisplay
    />
  )
}
