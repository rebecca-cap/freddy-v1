import { GraviGrid, Horizontal } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { getColumnDefs } from '@modules/Dashboard/Shared/ColumnDefs/processedColumnDefs'
import { useMemo } from 'react'

interface OrderData {
  TradeEntryId: number
}

interface OrderDashboardData {
  pendingPromptOrders?: { Data: OrderData[] }
  pendingForwardOrders?: { Data: OrderData[] }
  recentlyProcessedForwards?: { Data: OrderData[] }
  recentlyProcessedPrompts?: { Data: OrderData[] }
}

interface Props {
  data: OrderDashboardData | undefined
  setSelectedOrderId: (id: number | null) => void
  setIsInfoModalOpen: (open: boolean) => void
  isFetching: boolean
}

export function ProcessedOrdersTab({ data, setSelectedOrderId, setIsInfoModalOpen, isFetching }: Props) {
  const forwardData = data?.recentlyProcessedForwards?.Data ?? []
  const promptData = data?.recentlyProcessedPrompts?.Data ?? []
  const orderData = [...forwardData, ...promptData].sort((a, b) => b.TradeEntryId - a.TradeEntryId)

  const customerProcessedForwardsStorageKey = 'customerProcessedForwardsGrid'
  const customerProcessedForwardsGridViewManager = useGridViewManager(customerProcessedForwardsStorageKey)

  const columnDefs = useMemo(
    () => getColumnDefs(setSelectedOrderId, setIsInfoModalOpen),
    [setSelectedOrderId, setIsInfoModalOpen]
  )

  const agPropOverrides = useMemo(
    () => ({
      rowGroupPanelShow: 'never' as const,
      getRowId: (row) => row.data.TradeEntryId,
    }),
    []
  )

  return (
    <Horizontal className='bg-1 mt-4' height='100%'>
      <div style={{ width: '100%' }}>
        <GraviGrid
          enableFilterContextMenu
          agPropOverrides={agPropOverrides}
          columnDefs={columnDefs}
          storageKey={customerProcessedForwardsStorageKey}
          gridViewManager={customerProcessedForwardsGridViewManager}
          rowData={orderData}
          loading={isFetching}
          controlBarProps={{ title: 'Recently Processed Orders', hideActiveFilters: false }}
        />
      </div>
    </Horizontal>
  )
}
