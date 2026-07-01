import { Permission, useUser } from '@contexts/UserContext'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { getForwardColumnDefs } from '@modules/Dashboard/AdminDashboard/Tabs/PendingOrders/Components/forwardColumnDefs'
import { OrderAction } from '@modules/Dashboard/Shared/ColumnDefs/columnUtil'
import { useMemo } from 'react'

import { getPromptColumnDefs } from './Components/promptColumnDefs'

interface AdminDashboardData {
  pendingPromptOrders?: { Data: unknown[] }
  pendingForwardOrders?: { Data: unknown[] }
  recentlyProcessedForwards?: { Data: unknown[] }
  recentlyProcessedPrompts?: { Data: unknown[] }
}

interface Props {
  data: AdminDashboardData | undefined
  setSelectedOrderId: (id: number | null) => void
  setIsInfoModalOpen: (open: boolean) => void
  isFetching: boolean
  acceptOrRejectOrder: (data: unknown, action: OrderAction) => void
}

export function PendingOrdersTab({
  data,
  setSelectedOrderId,
  setIsInfoModalOpen,
  isFetching,
  acceptOrRejectOrder,
}: Props) {
  const promptData = data?.pendingPromptOrders?.Data
  const forwardData = data?.pendingForwardOrders?.Data
  const { hasPermission } = useUser()
  const canWrite = hasPermission(Permission.OnlineOrderAdmin_Write)
  const forwardColumnDefs = useMemo(
    () => getForwardColumnDefs(setSelectedOrderId, setIsInfoModalOpen, acceptOrRejectOrder, canWrite),
    [canWrite, isFetching]
  )
  const promptColumnDefs = useMemo(
    () => getPromptColumnDefs(setSelectedOrderId, setIsInfoModalOpen, acceptOrRejectOrder, canWrite),
    [canWrite, isFetching]
  )
  const agPropOverrides = useMemo(
    () => ({
      rowGroupPanelShow: 'never' as const,
      getRowId: (row) => row?.data?.TradeEntryId,
    }),
    []
  )
  const pendingPromptsStorageKey = 'pendingPromptsGrid'
  const pendingForwardsStorageKey = 'pendingForwardsGrid'

  const pendingPromptsGridViewManager = useGridViewManager(pendingPromptsStorageKey)
  const pendingForwardsGridViewManager = useGridViewManager(pendingForwardsStorageKey)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          height: 'calc(50vh - 80px)',
          position: 'relative',
        }}
      >
        <GraviGrid
          enableFilterContextMenu
          agPropOverrides={agPropOverrides}
          columnDefs={promptColumnDefs}
          storageKey={pendingPromptsStorageKey}
          rowData={promptData}
          loading={isFetching}
          controlBarProps={{ title: 'Pending Prompts', hideActiveFilters: false }}
          gridViewManager={pendingPromptsGridViewManager}
        />
      </div>
      <div style={{ width: '100%', height: 'calc(50vh - 80px)', position: 'relative' }}>
        <GraviGrid
          enableFilterContextMenu
          agPropOverrides={agPropOverrides}
          columnDefs={forwardColumnDefs}
          storageKey={pendingForwardsStorageKey}
          gridViewManager={pendingForwardsGridViewManager}
          rowData={forwardData}
          loading={isFetching}
          controlBarProps={{ title: 'Pending Forwards', hideActiveFilters: false }}
        />
      </div>
    </div>
  )
}
