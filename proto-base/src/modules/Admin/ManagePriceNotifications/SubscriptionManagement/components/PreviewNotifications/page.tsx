import './style.css'

import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { usePriceNotificationsPreview } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/PreviewNotifications/api'
import { ConfirmModal } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/PreviewNotifications/components/ConfirmModal'
import { GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useMemo, useRef, useState } from 'react'

import { PreviewMode, PriceNotification } from './api/schema.types'
import { getColumnDefs } from './components/columnDefs'
import { PreviewActionButtons } from './components/PreviewActionButtons'

export function PreviewNotifications() {
  const { getPriceNotificationPreviewData, sendNotificationsMutation } = usePriceNotificationsPreview()
  const gridAPIRef = useRef() as MutableRefObject<GridApi>
  const [selectedRows, setSelectedRows] = useState<PriceNotification[]>([])
  const [isShowingConfirmModal, setIsShowingConfirmModal] = useState(false)
  const [mode, setMode] = useState<PreviewMode>('EndOfDay')
  const [isSending, setIsSending] = useState(false)
  const storageKey = `PriceNotifications/PreviewNotificationsPage`
  const gridViewManager = useGridViewManager(storageKey)
  const { data: priceNotificationPreviewData, isFetching } = getPriceNotificationPreviewData(mode)

  const onSelectionChanged = (e) => {
    const currentSelection = e.api.getSelectedRows()
    setSelectedRows(currentSelection)
  }

  const handleSendNotifications = async () => {
    setIsSending(true)
    try {
      await sendNotificationsMutation.mutateAsync(selectedRows)

      // Deselect all rows after successful notification
      gridAPIRef.current?.deselectAll()
      setSelectedRows([])
    } catch (error) {
      console.error('Error sending notifications:', error)
    } finally {
      // Close the confirmation modal after sending notifications
      setIsShowingConfirmModal(false)
      setIsSending(false)
    }
  }

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row?.data?.QuoteConfigurationMappingId,
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      suppressDragLeaveHidesColumns: true,
      isRowSelectable: (row) => row.data?.QuotedValueId !== null,
    }),
    []
  )

  const columnDefs = useMemo(() => getColumnDefs(), [])

  const controlBarProps = useMemo(
    () => ({
      title: 'Price Notifications Preview',
      showSelectedCount: true,
      hideActiveFilters: false,
      actionButtons: (
        <PreviewActionButtons
          selectedRows={selectedRows}
          setIsShowingConfirmModal={setIsShowingConfirmModal}
          setMode={setMode}
          mode={mode}
        />
      ),
    }),
    [selectedRows, mode, setMode, setIsShowingConfirmModal]
  )

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <GraviGrid
        rowData={priceNotificationPreviewData?.Data || []}
        externalRef={gridAPIRef}
        columnDefs={columnDefs}
        agPropOverrides={agPropOverrides}
        controlBarProps={controlBarProps}
        storageKey={storageKey}
        loading={isFetching}
        onSelectionChanged={onSelectionChanged}
        gridViewManager={gridViewManager}
      />
      <ConfirmModal
        isShowingConfirmModal={isShowingConfirmModal}
        setIsShowingConfirmModal={setIsShowingConfirmModal}
        sendNotifications={handleSendNotifications}
        selectedQuoteConfigs={selectedRows}
        mode={mode}
        isSending={isSending}
      />
    </div>
  )
}
