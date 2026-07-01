import './styles.css'

import { BarChartOutlined } from '@ant-design/icons'
import { useCredentialTyped } from '@api/useCredential/useCredentialTyped'
import { useOrderDashboardTyped } from '@api/useOrderDashboard/useOrderDashboardTyped'
import { ViewOnlineOrderDetails } from '@components/shared/EntityReport/components/EntityAction/components/ViewOnlineOrderDetails'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal, Tabs } from 'antd'
import { useState } from 'react'

import { Header } from './Header'
import { ProductListings } from './ProductListings'
import { PendingOrdersTab } from './Tabs/PendingOrders'
import { ProcessedOrdersTab } from './Tabs/ProcessedOrders'

interface Tab {
  key: string
  title: string
  icon: React.ReactNode
  Element: React.ReactNode
}

export function OrderDashboard() {
  const { useOrderDashboardQuery } = useOrderDashboardTyped()
  const { useUserInfoQuery } = useCredentialTyped()

  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  const { data: userInfo } = useUserInfoQuery()
  const { data: dashboardData, refetch: refetchData, isFetching, isLoading } = useOrderDashboardQuery()

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
        />
      ),
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
    },
  ]

  return (
    <>
      <Modal
        open={!!selectedOrderId && isInfoModalOpen}
        title={
          <Texto className={'ml-2'} category='heading-small'>
            View Details
          </Texto>
        }
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
          isAdmin={false}
        />
      </Modal>
      <Horizontal className='bg-4' fullHeight>
        <Vertical>
          <Header user={userInfo?.Data} creditData={dashboardData?.creditWidget} isLoading={isLoading} />
          <Horizontal className='mt-4' fullHeight gap={20}>
            <Vertical flex={1}>
              <Horizontal fullHeight>
                <ProductListings productListings={dashboardData?.productListings} isFetching={isFetching} />
              </Horizontal>
            </Vertical>
            <Vertical flex={3}>
              <Tabs
                defaultActiveKey='1'
                tabBarStyle={{ backgroundColor: 'white', paddingLeft: '10px' }}
                items={tabs.map((tab) => ({
                  key: tab.key,
                  label: (
                    <span>
                      {tab.icon} {tab.title}
                    </span>
                  ),
                  children: <div style={{ height: '73vh' }}>{tab.Element}</div>,
                }))}
              />
            </Vertical>
          </Horizontal>
        </Vertical>
      </Horizontal>
    </>
  )
}
