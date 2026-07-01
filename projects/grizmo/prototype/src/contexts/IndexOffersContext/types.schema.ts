import type {
  AllSpecialOffersDisplayModel,
  IndexOfferOrderEntryDataResult,
  IndexOfferSubmitOrderRequest,
} from '@modules/SellingPlatform/BuyNow/Offers/Api/types.schema'
import type { Dispatch, SetStateAction } from 'react'

export interface IndexOfferPendingTrade {
  Type: 'market' | 'bid'
  Quantity?: number
  LoadingNumberIds?: number[]
  LiftingLocationIds?: number[]
  DestinationLocationIds?: number[]
  Notes?: string
}

export interface IndexOffersContextValue {
  // Selected offer from grid
  selectedIndexOffer: AllSpecialOffersDisplayModel | null
  setSelectedIndexOffer: Dispatch<SetStateAction<AllSpecialOffersDisplayModel | null>>

  // API response data
  entryData: IndexOfferOrderEntryDataResult | null
  isLoading: boolean
  isSubmitting: boolean

  // Form state
  pendingTrade: IndexOfferPendingTrade | null
  setPendingTrade: Dispatch<SetStateAction<IndexOfferPendingTrade | null>>

  // Actions
  openIndexOffer: (offer: AllSpecialOffersDisplayModel) => void
  clearIndexOffer: () => void
  refreshEntryData: () => void
  handleSubmitOrder: (payload: IndexOfferSubmitOrderRequest, callbacks?: { onSuccess?: () => void }) => void
}
