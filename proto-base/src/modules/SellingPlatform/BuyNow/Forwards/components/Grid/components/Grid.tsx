import { DownloadOutlined, WarningOutlined } from '@ant-design/icons'
import { useCredential } from '@api/useCredential'
import { useUser } from '@contexts/UserContext'
import { GraviButton, GraviGrid, Horizontal } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { AssignedSwitch } from '@modules/SellingPlatform/BuyNow/sharedComponents/AssignedSwitch'
import { GridApi } from 'ag-grid-community'
import { Tooltip } from 'antd'
import React, { useMemo, useRef } from 'react'

import { getColumnDefs, getSelectedCells } from '../utils'

interface ForwardsGridProps {
  areItemsLoading: boolean
  availableItems: any
  selectedPeriodIds: any[]
  hasBadSelection: boolean
  setSelectedGridCells: (selectedGridCells: any[]) => void
  setIsModalVisible: (isModalVisible: boolean) => void
  onlyAssigned: boolean
  toggleOnlyAssigned: any
  hasCreditHold: boolean
  loadingNumberSelectionIsRequiredButNoneWereFound: boolean
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
  const gridRef = useRef<GridApi<any | null>>()
  const csvResultsRef = useRef<HTMLDivElement>()
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.OnlineOrder?.Write
  const storageKey = 'buyNowForwardsGrid'
  const gridViewManager = useGridViewManager(storageKey)
  const { useUserInfoQuery } = useCredential()
  const { data: user } = useUserInfoQuery()
  const IsInternalUser = user?.Data?.AllowedImpersonationModes?.includes('All')

  const columnDefinitions = useMemo(
    () => availableItems && getColumnDefs(availableItems?.Data?.ItemGroups),
    [availableItems?.Data?.ItemGroups]
  )

  const marketClosed = useMemo(() => {
    return !!availableItems?.Validations[0]
  }, [availableItems])

  const handleClearSelection = () => {
    if (!gridRef.current) return
    gridRef.current.clearRangeSelection()
    setSelectedGridCells([])
  }

  const handleCSVExport = () => {
    const data = gridRef?.current?.getDataAsCsv()
    if (data && csvResultsRef.current) {
      csvResultsRef.current.innerHTML = data
      gridRef?.current?.exportDataAsCsv()
    }
  }

  const controlBarProps = useMemo(() => {
    const tooltipText = 'A valid loading number is required to order'
    const tooltipTitle = loadingNumberSelectionIsRequiredButNoneWereFound ? tooltipText : ''

    return {
      actionButtons: (
        <>
          <div data-testid='csvResults' style={{ display: 'none' }} ref={csvResultsRef} />
          <Horizontal style={{ gap: '0.5rem' }} alignItems='center'>
            {IsInternalUser && (
              <div data-testid='tasToggleWrapper'>
                <AssignedSwitch onlyAssigned={onlyAssigned} toggleOnlyAssigned={toggleOnlyAssigned} />
              </div>
            )}
            <GraviButton
              data-testid='clearSelectionButton'
              buttonText='Clear Selection'
              onClick={handleClearSelection}
            />
            <GraviButton
              data-testid='exportToCsvButton'
              buttonText='Export to CSV'
              onClick={handleCSVExport}
              icon={<DownloadOutlined />}
            />
            {hasBadSelection ? (
              <Tooltip
                title={
                  <p style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <WarningOutlined />
                    Invalid period range selected
                  </p>
                }
                placement='bottomRight'
                content='Periods can only be selected for one location / product and cannot have any gaps'
              >
                <div data-testid='createOrderButton'>
                  <GraviButton buttonText='Create Order' theme2 disabled />
                </div>
              </Tooltip>
            ) : (
              <Tooltip title={tooltipTitle} placement='top'>
                <div data-testid='createOrderButton'>
                  <GraviButton
                    buttonText='Create Order'
                    onClick={() => setIsModalVisible(true)}
                    theme2
                    disabled={
                      !selectedPeriodIds?.length ||
                      !canWrite ||
                      hasCreditHold ||
                      loadingNumberSelectionIsRequiredButNoneWereFound
                    }
                  />
                </div>
              </Tooltip>
            )}
          </Horizontal>
        </>
      ),
      title: 'Buy Forwards',
    }
  }, [selectedPeriodIds, canWrite, hasCreditHold, onlyAssigned])
  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (row) => row?.data.TradeEntrySetupId,
      rowSelection: 'single' as const,
      suppressRowClickSelection: true,
      suppressMultiSort: true,
      onRangeSelectionChanged: (e) => {
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
