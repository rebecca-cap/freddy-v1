import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { getColumnDefs } from '@modules/Dashboard/Shared/ColumnDefs/processedColumnDefs'
import { useMemo } from 'react'

interface DashboardData {
  recentlyProcessedForwards?: { Data: any[] }
  recentlyProcessedPrompts?: { Data: any[] }
}

interface ProcessedOrdersTabProps {
  data: DashboardData | undefined
  setSelectedOrderId: (id: number | null) => void
  setIsInfoModalOpen: (isOpen: boolean) => void
  isFetching: boolean
}

export function ProcessedOrdersTab({
  data,
  setSelectedOrderId,
  setIsInfoModalOpen,
  isFetching,
}: ProcessedOrdersTabProps) {
  const orderData = data?.recentlyProcessedForwards?.Data.concat(data?.recentlyProcessedPrompts?.Data)
  orderData?.sort(function (a, b) {
    return b.TradeEntryId - a.TradeEntryId
  })
  const processedOrdersStorageKey = 'processedOrdersGrid'
  const processedOrdersGridViewManager = useGridViewManager(processedOrdersStorageKey)
  const agPropOverrides = useMemo(
    () => ({
      rowGroupPanelShow: 'never' as const,
      getRowId: (row) => row.data.TradeEntryId,
    }),
    []
  )
  const columnDefs = useMemo(() => getColumnDefs(setSelectedOrderId, setIsInfoModalOpen), [])
  return (
    <div
      style={{
        width: '100%',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        minHeight: 700,
      }}
    >
      <GraviGrid
        enableFilterContextMenu
        agPropOverrides={agPropOverrides}
        rowData={orderData}
        loading={isFetching}
        controlBarProps={{ title: 'Recently Processed Orders', hideActiveFilters: false }}
        storageKey={processedOrdersStorageKey}
        gridViewManager={processedOrdersGridViewManager}
        columnDefs={columnDefs}
      />
    </div>
  )
}
