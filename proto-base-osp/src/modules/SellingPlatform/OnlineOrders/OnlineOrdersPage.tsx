import { ViewOnlineOrderDetails } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails'
import { dateFormat } from '@components/TheArmory/helpers'
import { Permission, useUser } from '@contexts/UserContext'
import { NotificationMessage, Texto, useLocalStorage, Vertical } from '@gravitate-js/excalibrr'
import { OnlineOrderRow } from '@modules/SellingPlatform/OnlineOrders/Api/types.schema'
import { useOnlineOrdersTyped } from '@modules/SellingPlatform/OnlineOrders/Api/useOnlineOrdersTyped'
import { OnlineOrdersGrid } from '@modules/SellingPlatform/OnlineOrders/Components/Grid/OnlineOrdersGrid'
import { Modal } from 'antd'
import dayjs from '@utils/dayjs'
import type { Dayjs } from '@utils/dayjs'
import React, { useCallback, useState } from 'react'

export const OnlineOrdersPage: React.FC = () => {
  const defaultDateFilter: [Dayjs, Dayjs] = [dayjs().subtract(6, 'days'), dayjs()]

  const { value: dateFilter, setValue: setDateFilter } = useLocalStorage<[Dayjs, Dayjs] | null>(
    'OnlineOrdersDateFilter',
    defaultDateFilter
  )

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OnlineOrderRow | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const { hasPermission } = useUser()
  const { getOnlineOrders, toggleIsHedged, resubmitOrder, cancelOrder } = useOnlineOrdersTyped()

  const { user } = useUser()
  const isInternalUser = user?.Data?.IsInternalUser ?? false
  const showExternalCompany = isInternalUser
  const showExportStatus = isInternalUser
  const canToggleHedged = hasPermission(Permission.OnlineOrder_UpdateIsHedged)
  const canResubmit = hasPermission(Permission.OnlineOrder_Resubmit)
  const canCancel = hasPermission(Permission.OnlineOrder_Cancel)

  const FromDate = dateFilter?.[0] ?? dayjs().startOf('day')
  const ToDate = dateFilter?.[1] ?? dayjs().endOf('day')

  const ordersQuery = getOnlineOrders({
    DateRangeStart: dayjs(FromDate).format(dateFormat.ISO),
    DateRangeEnd: dayjs(ToDate).format(dateFormat.ISO),
  })

  const { data, isLoading } = ordersQuery

  const handleViewDetails = useCallback((row: OnlineOrderRow) => {
    setSelectedOrder(row)
    setIsDetailModalOpen(true)
  }, [])

  const handleToggleHedged = useCallback(
    async (tradeEntryId: number) => {
      try {
        const response: any = await toggleIsHedged.mutateAsync(tradeEntryId)
        if (response?.ActionStatus === 'Success') {
          NotificationMessage('Toggle Hedged', 'Hedged status updated successfully', false)
        } else if (response?.Validations?.length) {
          NotificationMessage('Toggle Hedged', response.Validations[0].Message, true)
        }
      } catch {
        NotificationMessage('Toggle Hedged', 'An error occurred while updating hedged status', true)
      }
    },
    [toggleIsHedged]
  )

  const handleResubmit = useCallback(
    async (tradeEntryId: number) => {
      try {
        const response: any = await resubmitOrder.mutateAsync(tradeEntryId)
        if (response?.Validations?.length) {
          NotificationMessage('Resubmit Order', response.Validations[0].Message, true)
        } else {
          NotificationMessage('Resubmit Order', 'Order resubmitted successfully', false)
        }
      } catch {
        NotificationMessage('Resubmit Order', 'An error occurred while resubmitting the order', true)
      }
    },
    [resubmitOrder]
  )

  const handleCancel = useCallback(
    async (tradeEntryId: number) => {
      try {
        const response: any = await cancelOrder.mutateAsync(tradeEntryId)
        if (response?.Validations?.length) {
          NotificationMessage('Cancel Order', response.Validations[0].Message, true)
        } else {
          NotificationMessage('Cancel Order', 'Order cancelled successfully', false)
        }
      } catch {
        NotificationMessage('Cancel Order', 'An error occurred while cancelling the order', true)
      }
    },
    [cancelOrder]
  )

  return (
    <Vertical flex={1}>
      <OnlineOrdersGrid
        rows={data?.Data ?? []}
        isLoading={isLoading || isDownloading}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        showExternalCompany={showExternalCompany}
        showExportStatus={showExportStatus}
        canToggleHedged={canToggleHedged}
        canResubmit={canResubmit}
        canCancel={canCancel}
        onViewDetails={handleViewDetails}
        onToggleHedged={handleToggleHedged}
        onResubmit={handleResubmit}
        onCancel={handleCancel}
        setIsDownloading={setIsDownloading}
      />
      <Modal
        title={<Texto>View Details</Texto>}
        open={isDetailModalOpen}
        destroyOnHidden
        className='no-ant-modal-body-padding'
        style={{ minWidth: '50vw' }}
        footer={null}
        onCancel={() => setIsDetailModalOpen(false)}
      >
        {selectedOrder && (
          <ViewOnlineOrderDetails
            setIsInfoModalOpen={setIsDetailModalOpen}
            primaryKey='TradeEntryId'
            currentItemId={selectedOrder.TradeEntryId}
            refetchData={() => ordersQuery.refetch()}
            isAdmin={false}
          />
        )}
      </Modal>
    </Vertical>
  )
}
