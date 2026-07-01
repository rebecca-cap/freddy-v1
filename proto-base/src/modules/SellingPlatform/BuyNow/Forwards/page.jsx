import { ForwardsProvider, useForwardsCreation } from '@contexts/ForwardsContext'
import { Vertical } from '@gravitate-js/excalibrr'
import { CreditStatusBanner } from '@modules/SellingPlatform/BuyNow/sharedComponents/CreditStatusBanner'
import { message, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

import { ForwardsGridContainer } from './components/Grid'
import { CreateModal } from './components/Modal'

export function BuyForwardsPage() {
  return (
    <ForwardsProvider>
      <PageWrapper />
    </ForwardsProvider>
  )
}

function PageWrapper() {
  const {
    isModalVisible,
    setIsModalVisible,
    forwardInstruments,
    selectedMarketInstrumentId,
    setSelectedMarketInstrumentId,
    creditData,
  } = useForwardsCreation()
  const [showConfetti, setShowConfetti] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    if (forwardInstruments !== undefined && selectedMarketInstrumentId == null) {
      setSelectedMarketInstrumentId(forwardInstruments[0].MarketPlatformInstrumentId)
    }
  }, [forwardInstruments])

  return (
    <>
      {contextHolder}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={500}
          recycle={false}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
      <Tabs
        defaultActiveKey={selectedMarketInstrumentId?.toString()}
        activeKey={selectedMarketInstrumentId?.toString()}
        tabBarStyle={{ backgroundColor: 'white' }}
        onChange={setSelectedMarketInstrumentId}
      >
        {forwardInstruments?.map((tab) => (
          <Tabs.TabPane
            tab={<span>{tab.Name}</span>}
            key={tab?.MarketPlatformInstrumentId?.toString()}
            style={{ height: 'auto' }}
          >
            <Vertical height='87vh'>
              <CreditStatusBanner creditData={creditData} />
              <ForwardsGridContainer setIsModalVisible={setIsModalVisible} creditData={creditData} />
            </Vertical>
          </Tabs.TabPane>
        ))}
      </Tabs>
      <CreateModal
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        setShowConfetti={setShowConfetti}
        messageApi={messageApi}
      />
    </>
  )
}
