import { DownloadOutlined, WarningOutlined } from '@ant-design/icons'
import { useCredentialTyped } from '@api/useCredential/useCredentialTyped'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { AssignedSwitch } from '@modules/SellingPlatform/BuyNow/sharedComponents/AssignedSwitch'
import { GridApi } from 'ag-grid-community'
import { Tooltip } from 'antd'
import { useRef } from 'react'

interface ActionButtonsProps {
  loadingNumberSelectionIsRequiredButNoneWereFound: boolean | undefined
  setIsModalVisible: (isModalVisible: boolean) => void
  onlyAssigned: boolean | undefined
  toggleOnlyAssigned: (checked: boolean) => void
  gridRef: React.MutableRefObject<GridApi>
  selectedPeriodIds: unknown[]
  canWrite: boolean
  hasCreditHold: boolean
  hasBadSelection: boolean
  setSelectedGridCells: (cells: unknown[]) => void
}

export function ActionButtons({
  loadingNumberSelectionIsRequiredButNoneWereFound,
  setIsModalVisible,
  onlyAssigned,
  toggleOnlyAssigned,
  gridRef,
  selectedPeriodIds,
  canWrite,
  hasCreditHold,
  hasBadSelection,
  setSelectedGridCells,
}: ActionButtonsProps) {
  const csvResultsRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const { useUserInfoQuery } = useCredentialTyped()
  const { data: user } = useUserInfoQuery()
  const isInternalUser = user?.Data?.AllowedImpersonationModes?.includes('All')

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
  const tooltipText = 'A valid loading number is required to order'
  const tooltipTitle = loadingNumberSelectionIsRequiredButNoneWereFound ? tooltipText : ''
  return (
    <>
      <div data-testid='csvResults' style={{ display: 'none' }} ref={csvResultsRef} />
      <Horizontal gap='0.5rem' alignItems='center'>
        {isInternalUser && (
          <div data-testid='tasToggleWrapper'>
            <AssignedSwitch onlyAssigned={onlyAssigned} toggleOnlyAssigned={toggleOnlyAssigned} />
          </div>
        )}
        <GraviButton data-testid='clearSelectionButton' buttonText='Clear Selection' onClick={handleClearSelection} />
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
                Invalid period range selected: Periods can only be selected for one location / product and cannot have
                any gaps
              </p>
            }
            placement='bottomRight'
          >
            <div data-testid='createOrderButton'>
              <GraviButton buttonText='Create Order' color='primary' disabled />
            </div>
          </Tooltip>
        ) : (
          <Tooltip title={tooltipTitle} placement='top'>
            <div data-testid='createOrderButton'>
              <GraviButton
                buttonText='Create Order'
                onClick={() => setIsModalVisible(true)}
                color='primary'
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
  )
}
