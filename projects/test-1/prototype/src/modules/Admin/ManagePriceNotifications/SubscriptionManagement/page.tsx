import './style.css'

import { useUser } from '@contexts/UserContext'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import { NotificationDestinations } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/NotificationDestinations/page'
import { PreviewNotifications } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/PreviewNotifications/page'
import { SubscriptionManagementPage } from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/SubscriptionManagement/page'
import { Tabs } from 'antd'
import React from 'react'

import { usePriceNotifications } from './api'

const { TabPane } = Tabs

export function ManagePriceNotifications() {
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.PriceNotificationSubscriptionManagement.Write
  const { value: activeTab, setValue: setActiveTab } = useLocalStorage(
    'price-notifications-current-tab',
    'manage-subscriptions'
  )
  const { useGetSubscriptionsQuery, useProductsQuery, useLocationsQuery, useGetRecipientDataQuery, useMetadataQuery } =
    usePriceNotifications()

  const { data: subscriptionsData, isFetching } = useGetSubscriptionsQuery()
  const { data: recipientData, isFetching: isRecipientDataLoading } = useGetRecipientDataQuery()
  const { data: productsData } = useProductsQuery()
  const { data: locationsData } = useLocationsQuery()
  const { data: metadata } = useMetadataQuery()

  return (
    <Tabs activeKey={activeTab || 'manage-subscriptions'} onChange={setActiveTab}>
      <TabPane tab='Subscription Management' key='manage-subscriptions'>
        <SubscriptionManagementPage
          subscriptions={subscriptionsData?.Data || []}
          products={productsData?.Data || []}
          locations={locationsData?.Data || []}
          isFetching={isFetching}
          metadata={metadata?.Data}
          canWrite={canWrite}
        />
      </TabPane>
      <TabPane tab='Notification Destinations' key='notification-destinations'>
        <NotificationDestinations
          counterparties={recipientData?.Data || []}
          isLoading={isRecipientDataLoading}
          canWrite={canWrite}
        />
      </TabPane>
      <TabPane tab='Preview Notifications' key='preview-notifications'>
        <PreviewNotifications />
      </TabPane>
    </Tabs>
  )
}
