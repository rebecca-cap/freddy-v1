import { Constraints, ItemKey, PromptDefaultDates, SelectedPromptItem } from '@api/usePrompt/types.schema'
import { Moment } from 'moment/moment'
import React from 'react'

export type DateItem = Moment | Date | string | null
export interface AdditionalItem {
  ItemType: string
  ProductId: number
  LocationId: number
  ProductName: string
  LocationName: string
  PriceAdjustmentDetails: any[]
  LoadingNumbersList: any[]
  LiftingLocations: any[]
  DestinationLocations: any[]
  ItemKey: {
    TradeEntrySetupId: number
    DeliveryPeriodConfigurationId: number
    DeliveryPeriodGroupId: number | null
    SpecialOfferId: number
  }
  Price: number
  IndexPrice: number
  Margin: number
  FuturesMonth: string
  IsPlaceholder: boolean
  DeliveryPeriodName: string
  selected: boolean
  key: string
}

export interface ExternalColleagueOverride {
  key: string
  value: string
  selected: boolean
}

export interface InternalCounterPartyOverride {
  key: string
  value: string
  selected: boolean
}

export interface PriceAdjustment {
  MarketPlatformPriceAdjustmentDetailId: number
  Duration: number
  QuantityFrom: number
  QuantityTo: number
  AdjustmentPrice: number
  UnitOfMeasureId: number
  key: number
}

export interface CreditData {
  creditHold?: boolean
  creditStatus?: string
  totalCreditBalance?: number
  remainingCreditBalance?: number
}

export interface Defaults {
  DefaultBidExpiryDateTime: string
  DefaultCounterPartyId: number
}

export interface SelectedItemMetadata {
  PromptDefaultDates: PromptDefaultDates
  ShowDateOverrideFields: boolean
  DateOverrideMaxDate?: DateItem
  DateOverrideMinDate?: DateItem
  IsInternalUser: boolean
  ProductName?: string
  LocationName?: string
  Price?: number
  Margin?: number
  OverridePrice?: number
  AdditionalItems: AdditionalItem[]
  ExternalColleagueOverride: ExternalColleagueOverride[]
  InternalCounterPartyOverride: InternalCounterPartyOverride[]
  IndexPrice?: number
  Defaults?: Defaults
  Constraints?: Constraints
  ItemKey?: ItemKey
  FuturesMonth: string | Moment
  BidExpiration: string | Moment
  MaxBidExpiration: Date | string | undefined
  LoadingNumbersList: any[]
  DestinationStates: any[]
  PriceAdjustments: PriceAdjustment[]
  LiftingLocationsList: any[]
  Type: string
  CreditData: CreditData
  TradeNote: string
  ExternalNotification: boolean
}

export interface PendingTradePayload {
  Items: Item[]
  IsBid: boolean
  ExternalColleagueOverride?: string
  InternalCounterPartyOverride?: string
  OverridePrice: number
  OverrideIndexPrice: number
  ShouldSendExternalNotification: boolean
  State: string
  OverrideStartDate: null | DateItem
  OverrideEndDate: null | DateItem
  SelectedItems?: Item[]
  PriceAdjustmentId?: string
  LoadingNumbersIds?: any[]
  LoadingNumbers?: any[]
  DestinationStatesIds?: any[]
  Notes?: string
  BidExpiry?: string
  Type?: string
  Quantity?: number
  Price?: number
  ItemKey?: ItemKey
  IndexPrice?: number
  BidExpiration?: string
  ExternalColleagueId?: string
  InternalCounterPartyId?: string
  ExternalNotification?: boolean
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
}

export interface SelectedAdditionalItem {
  ItemKey: ItemKey
}
export interface MarketPlatformInstrument {
  MarketPlatformInstrumentId: number
  Name: string
  IsTas: boolean
  AllowBid: boolean
  AllowMarketOrder: boolean
  HasDeliveryPeriodGroups: boolean
  TradeTypeMeaning: string
  AutoRefreshIntervalInSeconds: number
  Subtypes: null
}

export interface Prompt {
  selectedItem: SelectedPromptItem | null
  setSelectedItem: React.Dispatch<React.SetStateAction<SelectedPromptItem | null>>
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  orderItems: any
  selectedItemMeta: SelectedItemMetadata | null
  setSelectedItemMeta: React.Dispatch<React.SetStateAction<SelectedItemMetadata | null>>
  adjustPriceAdjustments: () => void
  allowedPriceAdjustments: [] | PriceAdjustment[]
  setAllowedPriceAdjustments: React.Dispatch<React.SetStateAction<[] | PriceAdjustment[]>>
  orderStep: any
  setOrderStep: React.Dispatch<React.SetStateAction<any>>
  pendingTrade: any
  setPendingTrade: React.Dispatch<React.SetStateAction<any>>
  handleSubmitOrder: ({ clearOrderState }: { clearOrderState: () => void }) => void
  tasMode: boolean
  toggleTasMode: React.Dispatch<React.SetStateAction<boolean>>
  onlyAssigned: boolean
  toggleOnlyAssigned: React.Dispatch<React.SetStateAction<boolean>>
  disableSubmit: boolean
  setDisableSubmit: React.Dispatch<React.SetStateAction<boolean>>
  showConfetti: boolean
  setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>
  pendingChanges: boolean
  setPendingChanges: React.Dispatch<React.SetStateAction<boolean>>
  tradeTimer: number | null
  setTradeTimer: React.Dispatch<React.SetStateAction<number | null>>
  isPriceExpired: boolean
  setIsPriceExpired: React.Dispatch<React.SetStateAction<boolean>>
  hasTasInstruments?: boolean
  currentCounterParty: string | null
  allowBid: boolean
  isFetchingCreateData: boolean
  currentFromDate: DateItem
  currentToDate: DateItem
  setCurrentFromDate: (date: DateItem) => void
  setCurrentToDate: (date: DateItem) => void
  isDateOverrideActive: boolean
  setIsDateOverrideActive: React.Dispatch<React.SetStateAction<boolean>>
}
export interface Override {
  key: string
  value: string
  selected: boolean
}
