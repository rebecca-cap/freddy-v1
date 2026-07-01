import './styles.css'

import { BarChartOutlined } from '@ant-design/icons'
import { useCredential } from '@api/useCredential'
import { useOrderDashboard } from '@api/useOrderDashboard'
import { ViewOnlineOrderDetails } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal, Tabs } from 'antd'
import React, { useState } from 'react'

import { Header } from './Header'
import { ProductListings } from './ProductListings'
import { PendingOrdersTab } from './Tabs/PendingOrders'
import { ProcessedOrdersTab } from './Tabs/ProcessedOrders'

export function OrderDashboard() {
  const { useOrderDashboardQuery } = useOrderDashboard()
  const { useUserInfoQuery } = useCredential()

  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  const { data: userInfo } = useUserInfoQuery()
  const { data: dashboardData, refetch: refetchData, isFetching, isLoading } = useOrderDashboardQuery()

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
      Element: PendingOrdersTab,
      Data: dashboardData,
    },
    {
      key: '2',
      title: 'Processed',
      icon: <BarChartOutlined />,
      Element: ProcessedOrdersTab,
      Data: dashboardData,
    },
  ]

  return (
    <>
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
          dataQuery={useOrderDashboardQuery}
          refetchData={refetchData}
          isAdmin={false}
        />
      </Modal>
      <Horizontal className='bg-4' fullHeight>
        <Vertical>
          <Header user={userInfo?.Data} creditData={dashboardData?.creditWidget} isLoading={isLoading} />
          <Horizontal className='mt-4' fullHeight style={{ gap: 20 }}>
            <Vertical flex={1}>
              <Horizontal fullHeight>
                <ProductListings productListings={dashboardData?.productListings} isFetching={isFetching} />
              </Horizontal>
            </Vertical>
            <Vertical flex={3}>
              <Tabs defaultActiveKey='1' tabBarStyle={{ backgroundColor: 'white' }}>
                {tabs.map((tab) => (
                  <Tabs.TabPane
                    tab={
                      <span>
                        {tab.icon} {tab.title}
                      </span>
                    }
                    key={tab.key}
                    style={{ height: '73vh' }}
                  >
                    <tab.Element
                      data={tab.Data}
                      setSelectedOrderId={setSelectedOrderId}
                      setIsInfoModalOpen={setIsInfoModalOpen}
                      isFetching={isFetching}
                    />
                  </Tabs.TabPane>
                ))}
              </Tabs>
            </Vertical>
          </Horizontal>
        </Vertical>
      </Horizontal>
    </>
  )
}
