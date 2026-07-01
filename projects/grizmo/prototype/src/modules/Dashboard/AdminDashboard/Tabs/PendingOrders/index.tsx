import { useUser } from '@contexts/UserContext'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import React, { useMemo } from 'react'

import { getForwardColumnDefs, getPromptColumnDefs } from './columnDefs'

export function PendingOrdersTab({ data, setSelectedOrderId, setIsInfoModalOpen, isFetching, acceptOrRejectOrder }) {
  const promptData = data?.pendingPromptOrders?.Data
  const forwardData = data?.pendingForwardOrders?.Data
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.OnlineOrderAdmin?.Write
  const forwardColumnDefs = useMemo(
    () => getForwardColumnDefs(setSelectedOrderId, setIsInfoModalOpen, acceptOrRejectOrder, canWrite),
    [canWrite, isFetching]
  )
  const promptColumnDefs = useMemo(
    () => getPromptColumnDefs(setSelectedOrderId, setIsInfoModalOpen, acceptOrRejectOrder, canWrite),
    [canWrite, isFetching]
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
          height: '40vh',
          position: 'relative',
          minHeight: 400,
        }}
      >
        <GraviGrid
          agPropOverrides={{
            rowGroupPanelShow: 'never',
            getRowId: (row) => row?.data?.TradeEntryId,
            suppressCellSelection: true,
          }}
          columnDefs={promptColumnDefs}
          rowSelection='none'
          storageKey={pendingPromptsStorageKey}
          enableRangeSelection={false}
          rowData={promptData}
          loading={isFetching}
          controlBarProps={{ title: 'Pending Prompts', hideActiveFilters: false }}
          style={{ flex: 1 }}
          gridViewManager={pendingPromptsGridViewManager}
        />
      </div>
      <div style={{ width: '100%', height: '40vh', position: 'relative', minHeight: 400 }}>
        <GraviGrid
          agPropOverrides={{
            rowGroupPanelShow: 'never',
            getRowId: (row) => row?.data?.TradeEntryId,
          }}
          columnDefs={forwardColumnDefs}
          storageKey={pendingForwardsStorageKey}
          gridViewManager={pendingForwardsGridViewManager}
          rowData={forwardData}
          loading={isFetching}
          controlBarProps={{ title: 'Pending Forwards', hideActiveFilters: false }}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  )
}
