import { GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { useMemo } from 'react'

import { getForwardColumnDefs } from './Components/forwardColumnDefs'
import { getPromptColumnDefs } from './Components/promptColumnDefs'

interface OrderDashboardData {
  pendingPromptOrders?: { Data: unknown[] }
  pendingForwardOrders?: { Data: unknown[] }
  recentlyProcessedForwards?: { Data: unknown[] }
  recentlyProcessedPrompts?: { Data: unknown[] }
}

interface Props {
  data: OrderDashboardData | undefined
  setSelectedOrderId: (id: number | null) => void
  setIsInfoModalOpen: (open: boolean) => void
  isFetching: boolean
}

export function PendingOrdersTab({ data, setSelectedOrderId, setIsInfoModalOpen, isFetching }: Props) {
  const customerPendingPromptsStorageKey = 'customerPendingPromptsGrid'
  const customerPendingPromptsGridViewManager = useGridViewManager(customerPendingPromptsStorageKey)

  const customerPendingForwardsStorageKey = 'customerPendingForwardsGrid'
  const customerPendingForwardsGridViewManager = useGridViewManager(customerPendingForwardsStorageKey)

  const promptData = data?.pendingPromptOrders?.Data
  const forwardData = data?.pendingForwardOrders?.Data

  const promptColumnDefs = useMemo(
    () => getPromptColumnDefs(setSelectedOrderId, setIsInfoModalOpen),
    [setSelectedOrderId, setIsInfoModalOpen]
  )

  const forwardColumnDefs = useMemo(
    () => getForwardColumnDefs(setSelectedOrderId, setIsInfoModalOpen),
    [setSelectedOrderId, setIsInfoModalOpen]
  )

  const agPropOverrides = useMemo(
    () => ({
      rowGroupPanelShow: 'never' as const,
      getRowId: (row) => row?.data?.TradeEntryId,
    }),
    []
  )

  return (
    <Vertical className='mt-4 justify-sb'>
      <Horizontal className='bg-1' height='50%'>
        <div style={{ width: '100%' }}>
          <GraviGrid
            enableFilterContextMenu
            agPropOverrides={agPropOverrides}
            columnDefs={promptColumnDefs}
            rowData={promptData}
            loading={isFetching}
            storageKey={customerPendingPromptsStorageKey}
            gridViewManager={customerPendingPromptsGridViewManager}
            controlBarProps={{ title: 'Pending Prompts', hideActiveFilters: false }}
          />
        </div>
      </Horizontal>
      <Horizontal height='50%' className='bg-1 mt-4'>
        <div style={{ width: '100%' }}>
          <GraviGrid
            enableFilterContextMenu
            agPropOverrides={agPropOverrides}
            columnDefs={forwardColumnDefs}
            rowData={forwardData}
            loading={isFetching}
            controlBarProps={{ title: 'Pending Forwards', hideActiveFilters: false }}
            storageKey={customerPendingForwardsStorageKey}
            gridViewManager={customerPendingForwardsGridViewManager}
          />
        </div>
      </Horizontal>
    </Vertical>
  )
}
