import { PlusOutlined } from '@ant-design/icons'
import { GraviButton, GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { SpecialOffer, SpecialOfferMetadataResponseData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { SpecialOffersColumns } from '@modules/Dashboard/SpecialOffers/Components/Grid/Columns/ColumnDefs'
import { GridApi } from 'ag-grid-community'
import { Dispatch, SetStateAction, useMemo, useRef } from 'react'

interface SpecialOffersGridProps {
  isFetching: boolean
  rowData?: SpecialOffer[]
  setIsShowingCreateNew: Dispatch<SetStateAction<boolean>>
  onOpenOffer: (offer: SpecialOffer) => void
  onCreateFromPrior: (offer: SpecialOffer) => void
  canWrite: boolean
  metadata?: SpecialOfferMetadataResponseData
}

export const SpecialOffersGrid: React.FC<SpecialOffersGridProps> = ({
  isFetching,
  rowData,
  setIsShowingCreateNew,
  onOpenOffer,
  onCreateFromPrior,
  canWrite,
  metadata,
}) => {
  const gridRef = useRef<GridApi>() as React.MutableRefObject<GridApi>

  const storageKey = 'SpecialOffersGrid'
  const gridViewManager = useGridViewManager(storageKey)

  const columnDefs = useMemo(
    () => SpecialOffersColumns({ onOpenOffer, onCreateFromPrior, canWrite }),
    [onOpenOffer, onCreateFromPrior, canWrite]
  )

  const controlBarProps = useMemo(() => {
    return {
      title: 'Offers',
      hideActiveFilters: false,
      actionButtons: canWrite && (
        <GraviButton
          className='gravi-button-success'
          icon={<PlusOutlined />}
          buttonText={'Create New'}
          onClick={() => setIsShowingCreateNew(true)}
          disabled={!metadata}
        />
      ),
    }
  }, [canWrite, metadata])

  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (row) => row?.data?.SpecialOfferId.toString(),
    }
  }, [])

  return (
    <GraviGrid
      enableFilterContextMenu
      storageKey={storageKey}
      externalRef={gridRef}
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      columnDefs={columnDefs}
      rowData={rowData}
      loading={isFetching}
      gridViewManager={gridViewManager}
    />
  )
}
