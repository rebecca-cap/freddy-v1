import { ForwardsProvider, useForwardsCreation } from '@contexts/ForwardsContext'
import { Vertical } from '@gravitate-js/excalibrr'
import { CreditStatusBanner } from '@modules/SellingPlatform/BuyNow/sharedComponents/CreditStatusBanner'
import { message, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

import { ForwardsGridContainer } from './Components/Grid/ForwardsPage'
import { CreateModal } from './Components/Modal'

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
    if (forwardInstruments?.length > 0 && selectedMarketInstrumentId == null) {
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
        tabBarStyle={{ backgroundColor: 'white', paddingLeft: '10px' }}
        onChange={setSelectedMarketInstrumentId}
        items={forwardInstruments?.map((tab) => ({
          key: tab?.MarketPlatformInstrumentId?.toString(),
          label: <span>{tab.Name}</span>,
          style: { height: 'auto' },
          children: (
            <Vertical height='87vh'>
              <CreditStatusBanner creditData={creditData} />
              <ForwardsGridContainer setIsModalVisible={setIsModalVisible} creditData={creditData} />
            </Vertical>
          ),
        }))}
      />
      <CreateModal
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        setShowConfetti={setShowConfetti}
        messageApi={messageApi}
      />
    </>
  )
}
