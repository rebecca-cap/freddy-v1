import '../styles.css'

import { useUser } from '@contexts/UserContext'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { ActionButtons } from '@modules/SellingPlatform/BuyNow/Forwards/Components/Grid/Components/ActionButtons'
import { getColumnDefs } from '@modules/SellingPlatform/BuyNow/Forwards/Components/Grid/Components/getColumnDefs'
import { getSelectedCells } from '@modules/SellingPlatform/BuyNow/Forwards/Components/Grid/utils'
import { GridApi } from 'ag-grid-community'
import { useMemo, useRef } from 'react'

interface ForwardsGridProps {
  areItemsLoading: boolean
  availableItems: any
  selectedPeriodIds: any[]
  hasBadSelection: boolean
  setSelectedGridCells: (selectedGridCells: any[]) => void
  setIsModalVisible: (isModalVisible: boolean) => void
  onlyAssigned: boolean | undefined
  toggleOnlyAssigned: any
  hasCreditHold: boolean
  loadingNumberSelectionIsRequiredButNoneWereFound: boolean | undefined
}

export function ForwardsGrid({
  areItemsLoading,
  availableItems,
  selectedPeriodIds,
  hasBadSelection,
  setSelectedGridCells,
  setIsModalVisible,
  onlyAssigned,
  toggleOnlyAssigned,
  hasCreditHold,
  loadingNumberSelectionIsRequiredButNoneWereFound,
}: ForwardsGridProps) {
  const gridRef = useRef() as React.MutableRefObject<GridApi>
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.MarketPlatform?.OnlineOrder?.Write
  const storageKey = 'buyNowForwardsGrid'
  const gridViewManager = useGridViewManager(storageKey)

  const columnDefinitions = useMemo(
    () => availableItems && getColumnDefs(availableItems?.Data?.ItemGroups),
    [availableItems?.Data?.ItemGroups]
  )

  const marketClosed = useMemo(() => {
    return availableItems?.Validations.length > 0
  }, [availableItems])

  const controlBarProps = useMemo(
    () => ({
      title: 'Buy Forwards',
      actionButtons: (
        <ActionButtons
          selectedPeriodIds={selectedPeriodIds}
          loadingNumberSelectionIsRequiredButNoneWereFound={loadingNumberSelectionIsRequiredButNoneWereFound}
          setIsModalVisible={setIsModalVisible}
          onlyAssigned={onlyAssigned}
          toggleOnlyAssigned={toggleOnlyAssigned}
          canWrite={canWrite}
          hasCreditHold={hasCreditHold}
          hasBadSelection={hasBadSelection}
          gridRef={gridRef}
          setSelectedGridCells={setSelectedGridCells}
        />
      ),
    }),
    [selectedPeriodIds, canWrite, hasCreditHold, onlyAssigned]
  )

  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (row) => row?.data.TradeEntrySetupId,
      rowSelection: 'single' as const,
      suppressRowClickSelection: true,
      suppressMultiSort: true,
      onRangeSelectionChanged: (e) => {
        console.log('range selection changed', e)
        if (canWrite) {
          setSelectedGridCells(getSelectedCells(e.api))
        }
      },
      overlayNoRowsTemplate: marketClosed
        ? `<div class="custom-no-rows-message">The market is currently closed</div>`
        : undefined,
    }
  }, [marketClosed, canWrite])

  return (
    <div data-testid='forwardsGridWrapper' style={{ position: 'relative', height: '100%' }}>
      <GraviGrid
        enableFilterContextMenu
        externalRef={gridRef}
        loading={areItemsLoading}
        rowData={availableItems?.Data?.ItemGroups || []}
        controlBarProps={controlBarProps}
        columnDefs={columnDefinitions}
        agPropOverrides={agPropOverrides}
        storageKey={storageKey}
        gridViewManager={gridViewManager}
      />
    </div>
  )
}
