import type { SelectedItemMetadata } from '@contexts/PromptContext/types.schema'
import type { components } from '@hooks/useTypedApi'
import type { AllSpecialOffersDisplayModel, CreditData } from '@modules/SellingPlatform/BuyNow/Offers/Api/types.schema'
import type { Dayjs } from '@utils/dayjs'
import type React from 'react'

// Field added via intersection so it is sourced from the auto-generated OpenAPI
// schema rather than hand-typed in this deprecated module.
type SpecialOfferOrderEntryDataFields = Pick<
  components['schemas']['BeginOrder.Models.SpecialOfferOrderEntryData'],
  'EffectiveMaxPerOrder'
>

export type OffersEntryData = {
  OrderTimeLimitInSeconds: number | null
  State: string | null
  IsInternalUser: boolean
  ShowDateOverrideFields: boolean
  DateOverrideMaxDate: string | null
  DateOverrideMinDate: string | null
  PromptDefaultDates: {
    DefaultStartDate: Date
    DefaultEndDate: Date
    RuleDescription: string
    ReferenceStart: Date
    NumberOfDays: number
    TimeOffset: string
  }
  SelectedItem?: unknown | null
  CreditData?: CreditData | null
}

export type OffersSelectedItemMetadata = SelectedItemMetadata & {
  SpecialOfferData?: {
    SpecialOfferId: number
    Name: string
    Description?: string
    EvaluationType?: string
    PricingMechanism?: string
    FixedPrice?: number
    MarketOffset?: number
    ReservePrice?: number
    EnforceReservePrice?: boolean
    MinimumVolumePerOrder?: number
    MaxVolumePerOrder?: number
    VolumeIncrement?: number
    OrderEffectiveStartDateTime?: string
    OrderEffectiveEndDateTime?: string
    TimeRemaining?: string
    HasPendingOrder?: boolean
    ExistingOrderId?: number
    TimeZoneId?: number
    TimeZoneDescription?: string
    TimeZoneAlias?: string
  } & SpecialOfferOrderEntryDataFields
  Type: 'market' | 'bid' | 'offer'
}

export type OffersContextValue = {
  // CreateEditDrawer & selection
  selectedOffer: AllSpecialOffersDisplayModel | null
  setSelectedOffer: React.Dispatch<React.SetStateAction<AllSpecialOffersDisplayModel | null>>

  // Data & metadata
  entryData: OffersEntryData | null
  selectedItemMeta: OffersSelectedItemMetadata | null
  setSelectedItemMeta: (m: OffersSelectedItemMetadata | null) => void

  // Price adj logic
  allowedPriceAdjustments: PriceAdjustment[]
  setAllowedPriceAdjustments: React.Dispatch<React.SetStateAction<PriceAdjustment[]>>
  adjustPriceAdjustments: (form: any, quantity: number) => string | null

  // Form/pending trade
  pendingTrade: PendingTradePayload | null
  setPendingTrade: (p: PendingTradePayload | null) => void
  hasPendingChanges: boolean
  setHasPendingChanges: (b: boolean) => void

  // UX & timers
  tradeTimer: number | null
  setTradeTimer: (n: number | null) => void
  isPriceExpired: boolean
  setIsPriceExpired: (b: boolean) => void
  disableSubmit: boolean
  setDisableSubmit: (b: boolean) => void
  pricesRefreshing: boolean
  orderStep: 'create' | 'confirm'
  setOrderStep: (s: 'create' | 'confirm') => void

  // Dates (override – reuse same pattern)
  currentFromDate: DateItem
  setCurrentFromDate: (v: DateItem) => void
  currentToDate: DateItem
  setCurrentToDate: (v: DateItem) => void
  isDateOverrideActive: boolean
  setIsDateOverrideActive: React.Dispatch<React.SetStateAction<boolean>>

  // Credit
  creditData: CreditData | null
  setCreditData: React.Dispatch<React.SetStateAction<CreditData | null>>

  // Actions
  openOffer: (offer: AllSpecialOffersDisplayModel) => void
  clearOffer: () => void
  refreshEntryData: () => void
  handleSubmitOrder: (opts: { clearOrderState: () => void }) => void

  tasMode: boolean
  toggleTasMode: (next?: boolean) => void
  onlyAssigned: boolean
  toggleOnlyAssigned: (next?: boolean) => void
  allowBid: boolean
  setAllowBid: (b: boolean) => void

  currentCounterParty: string | null
}

export type DateItem = Dayjs | Date | string | null

export interface PendingTradePayload {
  Items: Item[]
  IsBid: boolean
  ExternalColleagueOverride?: number
  InternalCounterPartyOverride?: number
  OverridePrice: number
  OverrideIndexPrice: number
  ShouldSendExternalNotification: boolean
  State: string
  OverrideStartDate: null | DateItem
  OverrideEndDate: null | DateItem
  SelectedItems?: Item[]
  PriceAdjustmentId?: string
  PriceAdjustmentName?: string
  LoadingNumbersIds?: any[]
  LiftingLocationIds?: any[]
  LoadingNumbers?: any[]
  DestinationStatesIds?: any[]
  DestinationStates: any[]
  Notes?: string
  BidExpiry?: string
  Type?: string
  Quantity?: number
  Price?: number
  ItemKey?: ItemKey
  IndexPrice?: number
  BidExpiration?: Dayjs
  ExternalColleagueId?: number
  InternalCounterPartyId?: number
  ExternalNotification?: boolean
  IsInternalUser?: boolean
  LiftingLocations: any[]
  ExternalColleagueName?: string
  InternalCounterPartyName?: string
  ExternalCounterPartyName?: string
}

export interface Item {
  Volume: number
  LoadingNumberIds: any[]
  LiftingLocationIds: any[]
  ItemKey: ItemKey
  SelectedAdditionalItems: SelectedAdditionalItem[]
  OverridePrice: number
  OverrideIndexPrice: number
  key: any
  ItemType?: string
  IsPlaceholder?: boolean
  ProductName?: string
  LocationName?: string
  Price: number
}

// BE-sourced shape via intersection; `key` is a FE-only indexer populated
// from MarketPlatformPriceAdjustmentDetailId when these are built.
export type PriceAdjustment = components['schemas']['BeginOrder.Models.MarketPlatformPriceAdjustmentDataItem'] & {
  key: number
}

export interface SelectedAdditionalItem {
  ItemKey: ItemKey
}

export type ItemKey = components['schemas']['Abstraction.Models.MarketPlatformItemKey']
