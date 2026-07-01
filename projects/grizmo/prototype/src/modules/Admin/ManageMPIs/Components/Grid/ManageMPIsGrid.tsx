import { DownloadButton } from '@components/shared/Grid/sharedActionButtons/DownloadButton'
import { GraviGrid, Horizontal } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { MarketPlatformInstrument, MPIMetadata } from '@modules/Admin/ManageMPIs/Api/types.schema'
import { getMPIColumns } from '@modules/Admin/ManageMPIs/Components/Grid/Columns/ColumnDefs'
import { GridApi } from 'ag-grid-community'
import { MutableRefObject, useMemo, useRef } from 'react'

interface ManageMPIsGridProps {
  isLoading: boolean
  rowData: MarketPlatformInstrument[] | undefined
  metadata?: MPIMetadata
  canWrite: boolean
  updateEP: (rows: MarketPlatformInstrument | MarketPlatformInstrument[]) => Promise<boolean>
}

export function ManageMPIsGrid({ isLoading, rowData, metadata, canWrite, updateEP }: ManageMPIsGridProps) {
  const gridRef = useRef<GridApi>() as MutableRefObject<GridApi>

  const storageKey = 'ManageMPIsGrid'
  const gridViewManager = useGridViewManager(storageKey)

  const columnDefs = useMemo(() => getMPIColumns({ canWrite, metadata }), [rowData, isLoading, canWrite, metadata])

  const controlBarProps = useMemo(() => {
    return {
      title: 'Manage Instruments',
      hideActiveFilters: false,
      actionButtons: (
        <Horizontal style={{ gap: '1rem' }}>
          <DownloadButton gridAPIRef={gridRef} pageTitle='MarketPlatformInstruments' />
        </Horizontal>
      ),
    }
  }, [])

  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (row) => row?.data?.MarketPlatformInstrumentId.toString(),
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
      hideSaveDisplay
    />
  )
}
