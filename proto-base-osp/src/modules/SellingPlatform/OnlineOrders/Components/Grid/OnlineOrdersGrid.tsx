import { DownloadButton } from '@components/shared/Grid/sharedActionButtons/DownloadButton'
import { GraviGrid, Horizontal, RangePicker } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { OnlineOrderRow } from '@modules/SellingPlatform/OnlineOrders/Api/types.schema'
import { OnlineOrdersColumns } from '@modules/SellingPlatform/OnlineOrders/Components/Grid/Columns/columnDefs'
import { GridApi } from 'ag-grid-community'
import dayjs from '@utils/dayjs'
import type { Dayjs } from '@utils/dayjs'
import React, { useMemo } from 'react'

interface OnlineOrdersGridProps {
  rows: OnlineOrderRow[]
  isLoading: boolean
  dateFilter: [Dayjs, Dayjs] | null
  setDateFilter: (val: [Dayjs, Dayjs]) => void
  showExternalCompany: boolean
  showExportStatus: boolean
  canToggleHedged: boolean
  canResubmit: boolean
  canCancel: boolean
  onViewDetails: (row: OnlineOrderRow) => void
  onToggleHedged: (tradeEntryId: number) => void
  onResubmit: (tradeEntryId: number) => void
  onCancel: (tradeEntryId: number) => void
  setIsDownloading: React.Dispatch<React.SetStateAction<boolean>>
}

export const OnlineOrdersGrid: React.FC<OnlineOrdersGridProps> = ({
  rows,
  isLoading,
  dateFilter,
  setDateFilter,
  showExternalCompany,
  showExportStatus,
  canToggleHedged,
  canResubmit,
  canCancel,
  onViewDetails,
  onToggleHedged,
  onResubmit,
  onCancel,
  setIsDownloading,
}) => {
  const gridRef = React.useRef<GridApi>() as React.MutableRefObject<GridApi>
  const storageKey = 'OnlineOrders'
  const gridViewManager = useGridViewManager(storageKey)

  const columnDefs = useMemo(
    () =>
      OnlineOrdersColumns({
        showExternalCompany,
        showExportStatus,
        canToggleHedged,
        canResubmit,
        canCancel,
        onViewDetails,
        onToggleHedged,
        onResubmit,
        onCancel,
      }),
    [
      showExternalCompany,
      showExportStatus,
      canToggleHedged,
      canResubmit,
      canCancel,
      onViewDetails,
      onToggleHedged,
      onResubmit,
      onCancel,
    ]
  )

  const controlBarProps = useMemo(
    () => ({
      title: 'Online Orders',
      hideActiveFilters: false,
      actionButtons: (
        <Horizontal style={{ marginRight: 15 }}>
          <DownloadButton gridAPIRef={gridRef} pageTitle='OnlineOrders' setter={setIsDownloading} />
          <RangePicker
            dates={dateFilter?.map((d) => dayjs(d).toDate())}
            inputKey='dates'
            placement='bottomRight'
            onChange={(dates) => {
              if (!dates || dates.length !== 2) return

              const [start, end] = dates
              const from = dayjs.isDayjs(start) ? start : dayjs(start)
              const to = dayjs.isDayjs(end) ? end : dayjs(end)

              setDateFilter([from.startOf('day'), to.endOf('day')])
            }}
          />
        </Horizontal>
      ),
    }),
    [dateFilter, gridRef, setIsDownloading]
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (params: { data: OnlineOrderRow }) => params.data.TradeEntryId.toString(),
    }),
    []
  )

  return (
    <GraviGrid
      enableFilterContextMenu
      storageKey={storageKey}
      externalRef={gridRef}
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      columnDefs={columnDefs}
      rowData={rows}
      loading={isLoading}
      gridViewManager={gridViewManager}
    />
  )
}
