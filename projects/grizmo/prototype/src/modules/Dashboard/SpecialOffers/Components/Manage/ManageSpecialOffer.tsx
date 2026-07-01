import '../../styles.css'

import { ArrowLeftOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, NothingMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import { SpecialOffer } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffers } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffers'
import { EngagementView } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/EngagementView/EngagementView'
import { OfferInfo } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/OfferInfo/OfferInfo'
import { SendReminderModal } from '@modules/Dashboard/SpecialOffers/Components/Manage/Components/SendReminder/SendReminderModal'
import { Button, Drawer, Tabs } from 'antd'
import React, { Dispatch, SetStateAction, useState } from 'react'
import TabPane = Tabs.TabPane

type ViewTab = 'Engagement' | 'Timeline'

interface ManageSpecialOfferProps {
  isShowingManage: boolean
  setIsShowingManage: Dispatch<SetStateAction<boolean>>
  selectedSpecialOffer: SpecialOffer | null
  canWrite: boolean
}
export function ManageSpecialOffer({
  isShowingManage,
  setIsShowingManage,
  selectedSpecialOffer,
  canWrite,
}: ManageSpecialOfferProps) {
  const { getSpecialOfferBreakdown } = useSpecialOffers()
  const queryId = isShowingManage && selectedSpecialOffer?.SpecialOfferId ? selectedSpecialOffer?.SpecialOfferId : 0
  const { data: specialOfferDetails, isLoading, isFetching, error } = getSpecialOfferBreakdown(queryId)

  const [activeView, setActiveView] = useState<ViewTab>('Engagement')
  const [sendReminderModalOpen, setSendReminderModalOpen] = useState(false)
  const handleClose = () => {
    setIsShowingManage(false)
  }
  if (!selectedSpecialOffer || (!specialOfferDetails && !isLoading && !isFetching)) {
    return (
      <Drawer
        width={'100%'}
        visible={isShowingManage}
        onClose={handleClose}
        title='Manage Offer'
        bodyStyle={{ backgroundColor: 'var(--bg-2)' }}
      >
        <Vertical className={'m-5'}>
          <Vertical flex={1} style={{ maxHeight: '300px' }}>
            <NothingMessage title='No Data' message='No data available for the selected offer' />
          </Vertical>
          <Horizontal flex={1} horizontalCenter style={{ marginTop: '20px' }}>
            <Button onClick={handleClose} type={'link'}>
              <Texto category={'h6'} style={{ color: 'inherit' }}>
                <ArrowLeftOutlined className={'mr-2'} />
                Back to Offers
              </Texto>
            </Button>
          </Horizontal>
        </Vertical>
      </Drawer>
    )
  }
  return (
    <Drawer
      width={'100%'}
      visible={isShowingManage}
      onClose={handleClose}
      title='Manage Offer'
      bodyStyle={{ backgroundColor: 'var(--bg-2)' }}
    >
      <div>
        <Vertical className={'gap-20'} style={{ maxWidth: '1200px', margin: '0 auto', height: '100%' }}>
          <GraviButton
            className={'ghost-gravi-button p-0'}
            buttonText={
              <Horizontal verticalCenter className='gap-10 p-0'>
                <ArrowLeftOutlined />
                <Texto>Back to Offers</Texto>
              </Horizontal>
            }
            onClick={handleClose}
          />
          <OfferInfo
            selectedSpecialOffer={selectedSpecialOffer}
            data={specialOfferDetails?.Data}
            isLoading={isLoading || isFetching}
            canWrite={canWrite}
            onSendReminder={() => {
              setSendReminderModalOpen(true)
            }}
            onCloseDeal={() => {
              /* TODO: call your close endpoint */
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
          >
            <TabPane tab='Engagement' key='Engagement'>
              <EngagementView specialOfferDetails={specialOfferDetails} loading={isLoading || isFetching} />
            </TabPane>
            {/*<TabPane tab='Timeline' key='Timeline' />*/}
          </Tabs>
        </Vertical>
      </div>
    </Drawer>
  )
}
