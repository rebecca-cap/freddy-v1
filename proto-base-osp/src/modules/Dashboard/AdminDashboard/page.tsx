import './styles.css'

import { useAdminDashboard } from '@api/useAdminDashboard'
import { ViewOnlineOrderDetails } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails'
import { NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useOnlineOrderViewTyped } from '@hooks/useOnlineOrderViewTyped'
import type { UseOnlineOrderUpdatePayload } from '@hooks/useOnlineOrderViewTypes'
import type { IndexOfferUpdateOrderRequest } from '@modules/SellingPlatform/BuyNow/Offers/Api/types.schema'
import { useOffersTyped } from '@modules/SellingPlatform/BuyNow/Offers/Api/useOffersTyped'
import { isDefinedAndNotNull } from '@utils/index'
import { BarChartOutlined } from '@ant-design/icons'
import { Modal, Tabs } from 'antd'
import type React from 'react'
import { useState } from 'react'

import { AdminCharts } from './AdminCharts'
import { PendingOrdersTab } from './Tabs/PendingOrders'
import { ProcessedOrdersTab } from './Tabs/ProcessedOrders'

export function AdminDashboard() {
  const { useAdminDashboardQuery } = useAdminDashboard()
  const { updateOrder } = useOnlineOrderViewTyped()
  const { updateIndexOfferOrder } = useOffersTyped()
  const updateIndexOfferMutation = updateIndexOfferOrder()

  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const { data: dashboardData, refetch: refetchData, isFetching } = useAdminDashboardQuery()

  const handleUpdateOrder = async (
    payload: UseOnlineOrderUpdatePayload | IndexOfferUpdateOrderRequest,
    isIndexOffer: boolean
  ) => {
    try {
      const response = isIndexOffer
        ? await updateIndexOfferMutation.mutateAsync(payload as IndexOfferUpdateOrderRequest)
        : await updateOrder({ ...(payload as UseOnlineOrderUpdatePayload) })

      if (response?.Validations?.length || response?.message) {
        handleResponse(response)
      } else {
        NotificationMessage('Order updated', 'The order has been successfully updated', false)
        await refetchData()
      }
    } catch {
      NotificationMessage('Error', 'Failed to update order', true)
    }
  }

  const acceptOrRejectOrder = (data, Action) => {
    const isIndexOffer = isDefinedAndNotNull(data?.SourceIndexOfferId)
    const LoadingNumberIds = data?.LoadingNumbers?.map((item) => item?.LoadingNumberId) ?? []
    const isBid = data?.IsBidOrOffer === true
    const isPrompt = data?.TradeTypeCodeValueMeaning === 'Prompt'

    const promptDetails = [
      {
        TradeEntryDetailId: data?.PrimaryTradeEntryDetailId,
        Quantity: data?.Quantity,
      },
    ]
    const forwardDetails =
      data?.OrderDetails?.map((detail) => ({
        TradeEntryDetailId: detail.TradeEntryDetailId,
        Quantity: detail.Quantity,
      })) ?? []
    const DetailUpdates = isPrompt ? promptDetails : forwardDetails

    const payload = {
      TradeEntryId: data?.TradeEntryId,
      VersionIdentifier: data?.VersionIdentifier,
      [Action]: true,
      LoadingNumberIds,
      DetailUpdates,
      BidPrice: isBid ? data?.Price : undefined,
    }
    handleUpdateOrder(payload, isIndexOffer)
  }

  interface Tab {
    key: string
    title: string
    icon: React.ReactNode
    Element: any
    Data: any
  }

  const tabs: Tab[] = [
    {
      key: '1',
      title: 'Pending',
      icon: <BarChartOutlined />,
      Element: (
        <PendingOrdersTab
          data={dashboardData}
          setSelectedOrderId={setSelectedOrderId}
          setIsInfoModalOpen={setIsInfoModalOpen}
          isFetching={isFetching}
          acceptOrRejectOrder={acceptOrRejectOrder}
        />
      ),
      Data: dashboardData,
    },
    {
      key: '2',
      title: 'Processed',
      icon: <BarChartOutlined />,
      Element: (
        <ProcessedOrdersTab
          data={dashboardData}
          setSelectedOrderId={setSelectedOrderId}
          setIsInfoModalOpen={setIsInfoModalOpen}
          isFetching={isFetching}
        />
      ),
      Data: dashboardData,
    },
  ]

  return (
    <div className='mt-2' style={{ gap: 20, display: 'flex', flexDirection: 'row', height: 'calc(100vh - 74px)', overflow: 'hidden' }}>
      <Modal
        open={!!selectedOrderId && isInfoModalOpen}
        title={<Texto category='heading-small'>View Details</Texto>}
        onCancel={() => setSelectedOrderId(null)}
        destroyOnHidden
        style={{ minWidth: '50vw' }}
        styles={{ body: { padding: 0 } }}
        footer={null}
      >
        <ViewOnlineOrderDetails
          setIsInfoModalOpen={setIsInfoModalOpen}
          primaryKey='TradeEntryId'
          currentItemId={selectedOrderId}
          refetchData={refetchData}
          isAdmin
        />
      </Modal>
      <Vertical flex={1}>
        <AdminCharts />
      </Vertical>
      <Vertical flex={4}>
        <Tabs
          defaultActiveKey='1'
          tabBarStyle={{ backgroundColor: 'var(--bg-1)', borderBottom: '1px solid var(--gray-300)', paddingLeft: '10px' }}
          items={tabs.map((tab) => ({
            key: tab.key,
            label: (
              <span>
                {tab.icon} {tab.title}
              </span>
            ),
            children: tab.Element,
          }))}
        />
      </Vertical>
    </div>
  )
}

function handleResponse(response) {
  const message = response?.Validations[0]?.Message || response?.message
  const showError =
    (response.Validations[0]?.Severity === 'Error' && response?.ActionStatus !== 'Success') || response?.message
  NotificationMessage(response?.Validations[0]?.Category, message, showError)
}
