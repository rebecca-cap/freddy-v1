import { NotificationMessage } from '@gravitate-js/excalibrr'
import { useSpecialOffers } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffers'
import type {
  AllSpecialOffersDisplayModel,
  IndexOfferOrderEntryDataResult,
  IndexOfferSubmitOrderRequest,
} from '@modules/SellingPlatform/BuyNow/Offers/Api/types.schema'
import { useOffers } from '@modules/SellingPlatform/BuyNow/Offers/Api/useOffers'
import { isDefinedAndNotNull } from '@utils/index'
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'

import type { IndexOfferPendingTrade, IndexOffersContextValue } from './types.schema'

const IndexOffersContext = createContext<IndexOffersContextValue | null>(null)

export const IndexOffersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedIndexOffer, setSelectedIndexOffer] = useState<AllSpecialOffersDisplayModel | null>(null)
  const [entryData, setEntryData] = useState<IndexOfferOrderEntryDataResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingTrade, setPendingTrade] = useState<IndexOfferPendingTrade | null>(null)

  const { beginIndexOfferOrder, submitIndexOfferOrder } = useOffers()
  const submitIndexOfferMutation = submitIndexOfferOrder()
  const { trackOfferViewed } = useSpecialOffers()

  useEffect(() => {
    if (!selectedIndexOffer?.ItemKey) return

    // Track that the offer was viewed
    const specialOfferId = selectedIndexOffer.ItemKey.SpecialOfferId
    if (specialOfferId) {
      trackOfferViewed.mutate({ SpecialOfferId: specialOfferId })
    }

    refreshEntryData()
  }, [selectedIndexOffer?.ItemKey?.SpecialOfferId])

  const refreshEntryData = () => {
    if (!selectedIndexOffer?.ItemKey) return

    setIsLoading(true)
    const itemKey = selectedIndexOffer.ItemKey

    beginIndexOfferOrder(itemKey)
      .then((response) => {
        if (response?.Data) {
          setEntryData(response.Data)
        }
      })
      .catch((err) => {
        NotificationMessage('Error loading index offer data', err?.message ?? 'Unknown error')
      })
      .finally(() => setIsLoading(false))
  }

  const openIndexOffer = (offer: AllSpecialOffersDisplayModel) => {
    setSelectedIndexOffer(offer)
  }

  const clearIndexOffer = () => {
    setSelectedIndexOffer(null)
    setEntryData(null)
    setPendingTrade(null)
  }

  const handleSubmitOrder = (payload: IndexOfferSubmitOrderRequest, callbacks?: { onSuccess?: () => void }) => {
    setIsSubmitting(true)
    submitIndexOfferMutation.mutateAsync(payload)
      .then((response) => {
        if (!response?.Validations?.length) {
          const tradeEntryId = response?.Data?.TradeEntryId
          NotificationMessage('Success', `Order submitted successfully. Order ID: ${tradeEntryId}`, false)
          callbacks?.onSuccess?.()
          clearIndexOffer()
        } else {
          NotificationMessage('Error creating order', response?.Validations?.[0]?.Message)
        }
      })
      .catch((error) => {
        NotificationMessage('Error creating order', error?.message || 'An error occurred while creating the order')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const value: IndexOffersContextValue = useMemo(
    () => ({
      selectedIndexOffer,
      setSelectedIndexOffer,
      entryData,
      isLoading,
      isSubmitting,
      pendingTrade,
      setPendingTrade,
      openIndexOffer,
      clearIndexOffer,
      refreshEntryData,
      handleSubmitOrder,
    }),
    [selectedIndexOffer, entryData, isLoading, isSubmitting, pendingTrade]
  )

  return <IndexOffersContext.Provider value={value}>{children}</IndexOffersContext.Provider>
}

export const useIndexOffersContext = () => {
  const ctx = useContext(IndexOffersContext)
  if (!isDefinedAndNotNull(ctx)) throw new Error('IndexOffersContext must be used within IndexOffersProvider')
  return ctx
}
