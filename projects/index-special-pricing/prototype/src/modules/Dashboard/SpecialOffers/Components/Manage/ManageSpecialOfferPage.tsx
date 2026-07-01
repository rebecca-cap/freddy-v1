import '../../styles.css'

import { ArrowLeftOutlined } from '@ant-design/icons'
import { Permission, useUser } from '@contexts/UserContext'
import { GraviButton, Horizontal, NothingMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useSpecialOffersTyped } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffersTyped'
import { EngagementView } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/EngagementView'
import { OfferInfo } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/OfferInfo/OfferInfo'
import { SendReminderModal } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/SendReminder/SendReminderModal'
import { Tabs } from 'antd'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

type ViewTab = 'Engagement' | 'Timeline'

export function ManageSpecialOfferPage() {
  const { SpecialOfferId } = useParams<{ SpecialOfferId: string }>()
  const navigate = useNavigate()

  const { getSpecialOfferBreakdown } = useSpecialOffersTyped()
  const offerId = SpecialOfferId ? parseInt(SpecialOfferId, 10) : 0
  const { data: specialOfferDetails, isLoading, isFetching } = getSpecialOfferBreakdown(offerId)

  const { hasPermission } = useUser()
  const canWrite = hasPermission(Permission.MarketPlatform_SpecialOffer_OnlineOrder_Write)

  const [activeView, setActiveView] = useState<ViewTab>('Engagement')
  const [sendReminderModalOpen, setSendReminderModalOpen] = useState(false)

  const handleBack = () => {
    navigate('/ManageOffers/list')
  }

  if (!specialOfferDetails && !isLoading && !isFetching) {
    return (
      <div className='manage-special-offer-page'>
        <Vertical className={'m-5'}>
          <Vertical flex={1} style={{ maxHeight: '300px' }}>
            <NothingMessage title='No Data' message='No data available for the selected offer' />
          </Vertical>
          <Horizontal flex={1} horizontalCenter style={{ marginTop: '20px' }}>
            <GraviButton appearance='link' onClick={handleBack}>
              <Texto category={'h5'} style={{ color: 'inherit' }}>
                <ArrowLeftOutlined className={'mr-2'} />
                Back to Offers
              </Texto>
            </GraviButton>
          </Horizontal>
        </Vertical>
      </div>
    )
  }

  return (
    <div className='manage-special-offer-page'>
      <Vertical
        gap={20}
        style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px', overflow: 'visible', height: '100%' }}
      >
        <GraviButton
          className={'ghost-gravi-button p-0 back-button'}
          buttonText={
            <Horizontal verticalCenter className='p-0' gap={10}>
              <ArrowLeftOutlined />
              <Texto>Back to Offers</Texto>
            </Horizontal>
          }
          onClick={handleBack}
        />
        <OfferInfo
          data={specialOfferDetails?.Data}
          isLoading={isLoading || isFetching}
          canWrite={canWrite}
          onSendReminder={() => {
            setSendReminderModalOpen(true)
          }}
        />
        <SendReminderModal
          data={specialOfferDetails?.Data}
          sendReminderModalOpen={sendReminderModalOpen}
          setSendReminderModalOpen={setSendReminderModalOpen}
        />
        <Tabs
          className='offer-view-tabs'
          activeKey={activeView}
          onChange={(k) => setActiveView(k as ViewTab)}
          tabBarGutter={8}
          size='large'
          items={[
            {
              key: 'Engagement',
              label: 'Engagement',
              children: <EngagementView specialOfferDetails={specialOfferDetails} loading={isLoading || isFetching} />,
            },
          ]}
        />
      </Vertical>
    </div>
  )
}
