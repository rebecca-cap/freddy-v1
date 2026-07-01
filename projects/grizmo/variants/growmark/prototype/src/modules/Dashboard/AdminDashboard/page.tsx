import './styles.css'

import { BarChartOutlined } from '@ant-design/icons'
import { useAdminDashboard } from '@api/useAdminDashboard'
import { ViewOnlineOrderDetails } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails'
import { NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useOnlineOrderView } from '@hooks/useOnlineOrderView'
import { Modal, Tabs } from 'antd'
import React, { useState } from 'react'

import { AdminCharts } from './AdminCharts'
import { PendingOrdersTab } from './Tabs/PendingOrders'
import { ProcessedOrdersTab } from './Tabs/ProcessedOrders'

export function AdminDashboard() {
  const { useAdminDashboardQuery } = useAdminDashboard()
  const { updateOrder } = useOnlineOrderView()

  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  const { data: dashboardData, refetch: refetchData, isFetching } = useAdminDashboardQuery()

  interface Tab {
    key: string
    title: string
    icon: React.ReactNode
    Element: any
    Data: any
  }

  const handleUpdateOrder = async (payload) => {
    const response = await updateOrder({ ...payload })

    if (response?.Validations.length || response.message) {
      handleResponse(response)
    } else {
      NotificationMessage('Order updated', 'The order has been successfully updated', false)
      await refetchData()
    }
  }

  const acceptOrRejectOrder = (data, Action) => {
    const LoadingNumberIds = data?.LoadingNumbers?.map((item) => item?.LoadingNumberId)
    const payload = {
      TradeEntryId: data?.TradeEntryId,
      [Action]: true,
      LoadingNumberIds,
    }
    handleUpdateOrder(payload)
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
    <div className='bg-3 mt-2' style={{ gap: 20, display: 'flex', flexDirection: 'row' }}>
      <Modal
        visible={!!selectedOrderId && isInfoModalOpen}
        title={<Texto category='heading-small'>View Details</Texto>}
        onCancel={() => setSelectedOrderId(null)}
        destroyOnClose
        style={{ minWidth: '50vw' }}
        bodyStyle={{ padding: 0 }}
        footer={null}
      >
        <ViewOnlineOrderDetails
          setIsInfoModalOpen={setIsInfoModalOpen}
          primaryKey='TradeEntryId'
          currentItemId={selectedOrderId}
          dataQuery={useAdminDashboardQuery}
          refetchData={refetchData}
          isAdmin
        />
      </Modal>
      <Vertical flex={1} className='bg-3'>
        <AdminCharts />
      </Vertical>
      <Vertical flex={4} scroll>
        <Tabs
          defaultActiveKey='1'
          tabBarStyle={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--gray-300)' }}
        >
          {tabs.map((tab) => (
            <Tabs.TabPane
              tab={
                <span>
                  {tab.icon} {tab.title}
                </span>
              }
              key={tab.key}
            >
              {tab.Element}
            </Tabs.TabPane>
          ))}
        </Tabs>
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
