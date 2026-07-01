import './styles.css'

import { IndexOffersProvider, useIndexOffersContext } from '@contexts/IndexOffersContext'
import { useOffersContext } from '@contexts/OffersContext'
import { Permission, useUser } from '@contexts/UserContext'
import { Vertical } from '@gravitate-js/excalibrr'
import { useSpecialOffersTyped } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffersTyped'
import { IndexOfferDrawer } from '@modules/SellingPlatform/BuyNow/IndexOffers/IndexOfferDrawer'
import { useOffersTyped } from '@modules/SellingPlatform/BuyNow/Offers/Api/useOffersTyped'
import { OffersGrid } from '@modules/SellingPlatform/BuyNow/Offers/Components/Grid/OffersGrid'
import { OfferDrawer } from '@modules/SellingPlatform/BuyNow/Offers/Components/OfferDrawer/OfferDrawer'
import { CreditStatusBanner } from '@modules/SellingPlatform/BuyNow/sharedComponents/CreditStatusBanner'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function OffersPageContent() {
  const { creditData, setCreditData, setSelectedOffer, onlyAssigned, toggleOnlyAssigned, currentCounterParty } = useOffersContext()
  const { setSelectedIndexOffer } = useIndexOffersContext()
  const { hasPermission, user } = useUser()
  const canWrite = hasPermission(Permission.MarketPlatform_SpecialOffer_OnlineOrder_Write)
  const isInternalUser = !!user?.Data?.AllowedImpersonationModes?.includes('All')

  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isIndexDrawerVisible, setIsIndexDrawerVisible] = useState(false)

  const isImpersonating = !!currentCounterParty
  const effectiveOnlyAssigned = isInternalUser ? onlyAssigned && isImpersonating : true

  const { SpecialOfferId } = useParams()
  const { getAllSpecialOffers } = useOffersTyped()
  const { trackOfferViewed } = useSpecialOffersTyped()
  const { data, isLoading, refetch: refetchItemsAvailableForOrder } = getAllSpecialOffers(effectiveOnlyAssigned)
  const rowData = data?.Data?.Offers ?? []
  const navigate = useNavigate()

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
        if (offer?.SpecialOffer?.PricingMechanism === 'Index') {
          setSelectedIndexOffer({ ...offer })
          setIsIndexDrawerVisible(true)
        } else {
          setSelectedOffer(offer)
          setIsDrawerVisible(true)
        }
        trackOfferViewed.mutate({ SpecialOfferId })
        navigate('/BuyNow/Offers', { replace: true })
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
          onlyAssigned={effectiveOnlyAssigned}
          toggleOnlyAssigned={toggleOnlyAssigned}
          isImpersonating={isImpersonating}
          isInternalUser={isInternalUser}
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
