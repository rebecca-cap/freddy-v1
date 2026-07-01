import { SettingOutlined, SyncOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Switch } from 'antd'
import moment from 'moment/moment'

interface HeaderControlBarProps {
  currentlySelectedPageView: string | null
  setIsPageViewSettingsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsPageSettingsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  alertsOnly: boolean
  setAlertsOnly: React.Dispatch<React.SetStateAction<boolean>>
  refreshData: () => void
  lastUpdated: number
}

export function HeaderControlBar({
  currentlySelectedPageView,
  setIsPageViewSettingsDrawerOpen,
  setIsPageSettingsModalOpen,
  alertsOnly,
  setAlertsOnly,
  refreshData,
  lastUpdated,
}: HeaderControlBarProps) {
  return (
    <Horizontal justifyContent='space-between' verticalCenter className='w-full p-2'>
      <Horizontal verticalCenter>
        <Horizontal verticalCenter className='mr-4'>
          <Texto className='mr-2 text-truncate' style={{ maxWidth: '25vw' }}>
            View: {currentlySelectedPageView || 'Default'}
          </Texto>
          <GraviButton buttonText={'Page Views'} onClick={() => setIsPageViewSettingsDrawerOpen((prev) => !prev)} />
        </Horizontal>
        <Horizontal verticalCenter>
          <Texto className='mr-2'>Alerts Only </Texto>
          <Switch checked={alertsOnly} onChange={(checked) => setAlertsOnly(checked)} />
        </Horizontal>
      </Horizontal>

      <Horizontal verticalCenter>
        <Texto>{lastUpdated ? moment(lastUpdated).format(dateFormat.MONTH_DATE_YEAR_TIME) : ''}</Texto>
        <GraviButton className='ml-2 ghost-gravi-button' icon={<SyncOutlined />} onClick={refreshData} />
        <GraviButton
          className='ml-2 ghost-gravi-button'
          icon={<SettingOutlined />}
          onClick={() => setIsPageSettingsModalOpen(true)}
        />
      </Horizontal>
    </Horizontal>
  )
}
