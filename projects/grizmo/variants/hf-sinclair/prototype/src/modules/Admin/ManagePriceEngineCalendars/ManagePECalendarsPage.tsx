import { useLocalStorage } from '@gravitate-js/excalibrr'
import { ManageCalendarsPage } from '@modules/Admin/ManagePriceEngineCalendars/ManageCalendars/ManageCalendarsPage'
import { ManageHolidaysPage } from '@modules/Admin/ManagePriceEngineCalendars/ManageHolidays/ManageHolidaysPage'
import { Tabs } from 'antd'

import { usePriceEngineCalendars } from './api'

export function ManagePECalendarsPage() {
  const { value: selectedTab, setValue: setSelectedTab } = useLocalStorage(
    'manage-pe-calendars-selected-tab',
    'manage-holidays'
  )
  const { getMetadata } = usePriceEngineCalendars()
  const { data: metadata, isLoading: isMetadataLoading } = getMetadata()
  return (
    <Tabs activeKey={selectedTab || 'manage-holidays'} onChange={(key) => setSelectedTab(key)}>
      <Tabs.TabPane tab='Manage Holidays' key='manage-holidays' style={{ minHeight: '90vh' }}>
        <ManageHolidaysPage metadata={metadata} />
      </Tabs.TabPane>
      <Tabs.TabPane tab='Manage Calendars' key='manage-calendars' style={{ minHeight: '90vh' }}>
        <ManageCalendarsPage metadata={metadata} />
      </Tabs.TabPane>
    </Tabs>
  )
}
