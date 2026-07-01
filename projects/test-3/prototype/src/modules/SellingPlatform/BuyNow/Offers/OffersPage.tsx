import './styles.css'

import { IndexOffersProvider, useIndexOffersContext } from '@contexts/IndexOffersContext'
import { useOffersContext } from '@contexts/OffersContext'
import { Permission, useUser } from '@contexts/UserContext'
import { Vertical } from '@gravitate-js/excalibrr'
import { useSpecialOffers } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffers'
import { IndexOfferDrawer } from '@modules/SellingPlatform/BuyNow/IndexOffers/IndexOfferDrawer'
import { useOffers } from '@modules/SellingPlatform/BuyNow/Offers/Api/useOffers'
import { OffersGrid } from '@modules/SellingPlatform/BuyNow/Offers/Components/Grid/OffersGrid'
import { OfferDrawer } from '@modules/SellingPlatform/BuyNow/Offers/Components/OfferDrawer/OfferDrawer'
import { clearUrlSearchParams } from '@modules/SellingPlatform/BuyNow/Offers/Utils/redirectHelpers'
import { CreditStatusBanner } from '@modules/SellingPlatform/BuyNow/sharedComponents/CreditStatusBanner'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function OffersPageContent() {
  const { creditData, setCreditData, setSelectedOffer } = useOffersContext()
  const { setSelectedIndexOffer } = useIndexOffersContext()
  const { hasPermission } = useUser()
  const canWrite = hasPermission(Permission.MarketPlatform_SpecialOffer_OnlineOrder_Write)

  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isIndexDrawerVisible, setIsIndexDrawerVisible] = useState(false)

  const { SpecialOfferId } = useParams()
  const { getAllSpecialOffers } = useOffers()
  const { trackOfferViewed } = useSpecialOffers()
  const { data, isLoading, refetch: refetchItemsAvailableForOrder } = getAllSpecialOffers()
  const rowData = data?.Data?.Offers ?? []

  useEffect(() => {
    if (data) {
      const creditDataObj = {
        creditHold: data?.Data?.CreditStatus !== 'Normal',
        creditStatus: data?.Data?.CreditStatus ?? undefined,
        totalCreditBalance: data?.Data?.EstimatedRemainingCreditBalance ?? undefined,
        remainingCreditBalance: data?.Data?.EstimatedRemainingCreditBalance ?? undefined,
      }
      setCreditData(creditDataObj)
    }

    if (SpecialOfferId && rowData && rowData.length > 0) {
      const offer = rowData.find((item) => item?.ItemKey?.SpecialOfferId?.toString() === SpecialOfferId)
      if (offer) {
        trackOfferViewed.mutate({ SpecialOfferId })
        setSelectedOffer(offer)
        setIsDrawerVisible(true)
        clearUrlSearchParams()
      }
    }
  }, [rowData, SpecialOfferId])

  return (
    <Vertical style={{ height: '94vh' }}>
      <OfferDrawer
        isDrawerVisible={isDrawerVisible}
        setIsDrawerVisible={setIsDrawerVisible}
        refetchItemsAvailableForOrder={refetchItemsAvailableForOrder}
      />
      <IndexOfferDrawer isDrawerVisible={isIndexDrawerVisible} setIsDrawerVisible={setIsIndexDrawerVisible} />
      <>
        <CreditStatusBanner creditData={creditData} />
        <OffersGrid
          isLoading={isLoading}
          rowData={rowData}
          canWrite={canWrite}
          setIsDrawerVisible={setIsDrawerVisible}
          setIsIndexDrawerVisible={setIsIndexDrawerVisible}
          setSelectedOffer={setSelectedOffer}
          setSelectedIndexOffer={setSelectedIndexOffer}
          creditData={creditData}
        />
      </>
    </Vertical>
  )
}

export function OffersPage() {
  return (
    <IndexOffersProvider>
      <OffersPageContent />
    </IndexOffersProvider>
  )
}
