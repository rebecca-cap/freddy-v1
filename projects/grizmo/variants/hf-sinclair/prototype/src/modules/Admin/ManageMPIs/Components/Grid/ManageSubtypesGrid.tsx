import { DownloadButton } from '@components/shared/Grid/sharedActionButtons/DownloadButton'
import { GraviGrid, Horizontal } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { MarketPlatformInstrumentSubtypeWithParent, MPIMetadata } from '@modules/Admin/ManageMPIs/Api/types.schema'
import { getSubtypeColumnDefs } from '@modules/Admin/ManageMPIs/Components/Grid/Columns/SubtypeColumnDefs'
import { GridApi } from 'ag-grid-community'
import { MutableRefObject, useMemo, useRef } from 'react'

interface ManageSubtypesGridProps {
  isLoading: boolean
  rowData: MarketPlatformInstrumentSubtypeWithParent[] | undefined
  metadata?: MPIMetadata
  canWrite: boolean
  updateEP: (
    rows: MarketPlatformInstrumentSubtypeWithParent | MarketPlatformInstrumentSubtypeWithParent[]
  ) => Promise<boolean>
}

export function ManageSubtypesGrid({ isLoading, rowData, metadata, canWrite, updateEP }: ManageSubtypesGridProps) {
  const gridRef = useRef<GridApi>() as MutableRefObject<GridApi>

  const storageKey = 'ManageSubtypesGrid'
  const gridViewManager = useGridViewManager(storageKey)

  const columnDefs = useMemo(() => getSubtypeColumnDefs(metadata, canWrite), [rowData, isLoading, canWrite, metadata])

  const controlBarProps = useMemo(() => {
    return {
      title: 'Manage Instrument Subtypes',
      hideActiveFilters: false,
      actionButtons: (
        <Horizontal style={{ gap: '1rem' }}>
          <DownloadButton gridAPIRef={gridRef} pageTitle='ManageInstrumentSubtypes' />
        </Horizontal>
      ),
    }
  }, [])

  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (row: any) => row?.data?.MarketPlatformInstrumentSubtypeId.toString(),
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
