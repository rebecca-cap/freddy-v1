import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { AllSpecialOffersDisplayModel, CreditData } from '@modules/SellingPlatform/BuyNow/Offers/Api/types.schema'
import { getOffersGridColumns } from '@modules/SellingPlatform/BuyNow/Offers/Components/Grid/Columns/ColumnDefs'
import { AssignedSwitch } from '@modules/SellingPlatform/BuyNow/sharedComponents/AssignedSwitch'
import { GridApi } from 'ag-grid-community'
import { Dispatch, SetStateAction, useMemo, useRef } from 'react'

interface OffersGridProps {
  isLoading: boolean
  rowData: AllSpecialOffersDisplayModel[] | undefined
  canWrite: boolean
  setIsDrawerVisible: Dispatch<SetStateAction<boolean>>
  setSelectedOffer: Dispatch<SetStateAction<AllSpecialOffersDisplayModel | null>>
  setIsIndexDrawerVisible: Dispatch<SetStateAction<boolean>>
  setSelectedIndexOffer: Dispatch<SetStateAction<AllSpecialOffersDisplayModel | null>>
  creditData: CreditData | null
  onlyAssigned: boolean
  toggleOnlyAssigned: (checked: boolean) => void
  isImpersonating: boolean
  isInternalUser: boolean
}

export const OffersGrid: React.FC<OffersGridProps> = ({
  isLoading,
  rowData,
  canWrite,
  setIsDrawerVisible,
  setIsIndexDrawerVisible,
  setSelectedOffer,
  setSelectedIndexOffer,
  creditData,
  onlyAssigned,
  toggleOnlyAssigned,
  isImpersonating,
  isInternalUser,
}) => {
  const gridRef = useRef<GridApi>() as React.MutableRefObject<GridApi>

  const storageKey = 'BuyNowOffersGrid'
  const gridViewManager = useGridViewManager(storageKey)

  const columnDefs = useMemo(
    () =>
      getOffersGridColumns({
        setIsDrawerVisible,
        setIsIndexDrawerVisible,
        setSelectedOffer,
        setSelectedIndexOffer,
        creditData,
        canWrite,
      }),
    [rowData, creditData, canWrite]
  )

  const controlBarProps = useMemo(() => {
    return {
      title: 'Offers',
      hideActiveFilters: false,
      actionButtons: isInternalUser ? (
        <AssignedSwitch
          onlyAssigned={onlyAssigned}
          toggleOnlyAssigned={toggleOnlyAssigned}
          disabled={!isImpersonating}
        />
      ) : undefined,
    }
  }, [onlyAssigned, toggleOnlyAssigned, isImpersonating, isInternalUser])

  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (row) => row?.data?.SpecialOffer?.SpecialOfferId.toString(),
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      rowHeight: 56,
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
      loading={isLoading}
      gridViewManager={gridViewManager}
      hideSaveDisplay
    />
  )
}
