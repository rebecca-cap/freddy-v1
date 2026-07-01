import { APIResponse } from '@api/globalTypes'
import { PromptDefaultDates } from '@api/usePrompt/types.schema'
import { UseOnlineOrderUpdateData } from '@hooks/useOnlineOrderViewTypes'

export interface GetItemsAvailableForOrderRequest {
  MarketPlatformInstrumentId: number | null
  IgnoreProductLocationPermissions?: boolean
  IncludeHistoricalPricingInformation?: boolean
  FilterToSpecialOffersOnly?: boolean
}

export interface ItemKey {
  TradeEntrySetupId: number
  DeliveryPeriodConfigurationId: number
  DeliveryPeriodGroupId: number | null
  SpecialOfferId: number | null
  IndexOfferId?: number | null
}

export interface MarketPlatformItem {
  SparkChartPoints: number[]
  DailyHigh: number
  DailyLow: number
  IsPriceUp: boolean
  DisplayName: string
  DeliveryPeriodFromDate: string
  DeliveryPeriodToDate: string
  ItemKey: ItemKey
  Price: number
  IndexPrice: number
  Margin: number
  FuturesMonth: string
  IsPlaceholder: boolean
  DeliveryPeriodName: string
}

export interface SpecialOfferDetails {
  TradeEntrySetupId: number
  SpecialOfferId: number
  SpecialOfferName: string
  EvaluationTypeCvId: number
  SpecialOfferType: string
  PricingMechanismCvId: number
  PricingMechanism: string
  TotalVolumeAvailable: number
  OfferExpirationDateTime: string
  TimeRemaining: string
  MinimumVolumePerOrder: number
  MaxVolumePerOrder: number
  VolumeIncrement: number
  OrderEffectiveStartDateTime: string
  OrderEffectiveEndDateTime: string
  FixedPrice: number
  MarketOffset: number
  HasPendingSubmission: boolean
  SubmissionStatus: string
  SubmittedPrice: number
  SubmittedVolume: number
  CanSubmitOrder: boolean
  IsBid: boolean
}

export interface ItemGroup {
  MarketPlatformInstrumentId: number
  MarketInstrumentName: string
  TradeEntrySetupId: number
  IsTradeAtSettle: boolean
  TradeTypeMeaning: string
  ProductId: number
  ProductSortOrder: number
  LocationId: number
  ProductName: string
  LocationName: string
  MarketPlatformItems: MarketPlatformItem[]
  LoadingNumberSelectionIsRequiredButNoneWereFound: boolean
  SpecialOffer?: SpecialOfferDetails | null
}

export interface ItemsAvailableForOrderData {
  ItemGroups: ItemGroup[]
  CreditStatus: string
  EstimatedRemainingCreditBalance: number
}

export type GetItemsAvailableForOrderResponse = APIResponse<ItemsAvailableForOrderData>

// ---------- GetOrderEntryData (REQUEST) ----------
export type GetOrderEntryDataRequest = {
  SelectedItemKeys: SelectedItemKey[]
  OnlyAssignedAdditionalProducts: boolean
}

export type SelectedItemKey = {
  TradeEntrySetupId: number
  DeliveryPeriodConfigurationId: number
  DeliveryPeriodGroupId: number | null
  SpecialOfferId: number | null
  IndexOfferId?: number | null
}

export interface CreditData {
  creditHold?: boolean
  creditStatus?: string
  totalCreditBalance?: number | null
  remainingCreditBalance?: number | null
  EstimatedRemainingCreditBalance?: number | null
}

export type GetOrderEntryDataResponse = APIResponse<OrderEntryData>

export type OrderEntryData = {
  SelectedItems: OrderEntrySelectedItem[]
  IsInternalUser: boolean
  ExternalColleagueOverrideList?: Record<string, string> | null
  InternalCounterPartyOverrideList?: Record<string, string> | null
  DateOverrideMaxDate?: string | null
  DateOverrideMinDate?: string | null
  ShowDateOverrideFields: boolean
  ValidSubtypes?: ValidSubtype[]
  CreditData?: CreditData
  OrderTimeLimitInSeconds: number | null
  State: string | null
  PromptDefaultDates: PromptDefaultDates
  IsBid: boolean
}

export type OrderEntrySelectedItem = {
  Constraints: {
    VolumeIncrement: number
    MinVolume: number
    MaxVolume: number
    MinMonthlyVolume: number
    MaxMonthlyVolume: number
    WarningVolume: number
    AllowMultipleLoadingNumbers: boolean
    AllowNoteEntry: boolean
    MaximumBidExpiration: Date
    OriginLocationMinimumReqSelection: number
  }
  Defaults: {
    DefaultBidExpiryDateTime: string
    DefaultCounterPartyId: number
  }
  AdditionalItems?: AdditionalItem[]
  QuantityDistributionWeightPercentage?: number
  QuantityDistributionWeight?: number
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
  }
  ProductId?: number
  LocationId?: number
  ProductName?: string
  LocationName?: string
  Price?: number
  IndexPrice?: number
  Margin?: number
  FuturesMonth?: string
  IsPlaceholder?: boolean
  DeliveryPeriodName?: string
  PriceAdjustmentDetails?: PriceAdjustmentDetail[]
  LoadingNumbersList?: LoadingNumber[]
  LiftingLocations?: SimpleLocation[]
  DestinationLocations?: SimpleLocation[]
  ItemKey: SelectedItemKey
}

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
  ItemKey: ItemKey
  Price: number
  IndexPrice: number
  Margin: number
  FuturesMonth: string
  IsPlaceholder: boolean
  DeliveryPeriodName: string
  selected: boolean
  key: string
}

export type PriceAdjustmentDetail = {
  MarketPlatformPriceAdjustmentDetailId: number
  Duration: number
  QuantityFrom: number
  QuantityTo: number
  AdjustmentPrice: number
  UnitOfMeasureId: number
  key: number
}

export type LoadingNumber = {
  LoadingNumberId: number
  Name?: string
  Display?: string
  OriginLocationId?: number
  CustomerCounterPartyId?: number
  ProductId?: number
  DestinationLocationId?: number
  DestinationLocationName?: string
}

export type SimpleLocation = {
  LocationId: number
  LocationName: string
}

export type ValidSubtype = {
  MarketPlatformInstrumentSubtypeId: number
  Name: string
  Description?: string
  IsActive: boolean
  AllowMarket: boolean
  AllowBid: boolean
  AllowVolumeEdits: boolean
  VolumeDistributionTypeMeaning?: string
  ContractPricingMethodMeaning?: string
}

// ---------- SubmitOrder (REQUEST) ----------
export type SubmitOrderRequest = {
  MarketPlatformInstrumentSubtypeId?: number | null
  Items: SubmitOrderItem[]
  IsBid: boolean
  BidPrice?: number
  Notes?: string
  BidExpiry?: string // ISO string
  State?: string
  ExternalCounterPartyOverride?: number
  ExternalColleagueOverride?: number
  OverrideStartDate?: string | null // ISO
  OverrideEndDate?: string | null // ISO
  InternalCounterPartyOverride?: number
  OverridePrice?: number
  OverrideIndexPrice?: number
  ShouldSendExternalNotification?: boolean
  IncludeAdditionalProductsForAdditionalLocations?: boolean
}

export type SubmitOrderItem = {
  Volume: number | undefined
  LoadingNumberIds?: number[]
  PreferredCarrierCounterPartyIds?: number[]
  LiftingLocationIds?: number[]
  DestinationLocationIds?: number[]
  MarketPlatformPriceAdjustmentDetailId?: string | null
  OverridePrice?: number
  OverrideIndexPrice?: number
  SelectedAdditionalItems?: SelectedAdditionalItem[]
  ItemKey?: ItemKey
}

export type SelectedAdditionalItem = {
  ItemKey: ItemKey
}

// ---------- SubmitOrder (RESPONSE) ----------
export type SubmitOrderResponse = APIResponse<{
  TradeEntryId: number
}>

// ---------- GetAllSpecialOffers ----------
export interface AllSpecialOffersDisplayModel {
  ItemKey: ItemKey
  OfferCategory: 'Special' | 'Index'

  // Product/Location
  ProductId: number
  ProductName: string
  LocationId: number
  LocationName: string

  SpecialOffer: SpecialOfferDetails | null

  IndexOfferId: number | null
  FormulaDisplayName: string | null
  ContractDifferential: number | null
  IndexOfferType: string | null
  PricingEffectiveTimes: string | null

  IsBid: boolean

  HasPendingSubmission: boolean
  SubmissionStatus: string | null
  CanSubmitOrder: boolean
  PendingSubmissionOrderId: number | null

  MarketPlatformInstrumentId: number | null
  MarketInstrumentName: string | null
  LoadingNumberSelectionIsRequiredButNoneWereFound: boolean
}

export interface AllSpecialOffersResult {
  Offers: AllSpecialOffersDisplayModel[]
  CreditStatus: string | null
  EstimatedRemainingCreditBalance: number | null
}

export type GetAllSpecialOffersResponse = APIResponse<AllSpecialOffersResult>

// ---------- IndexOffer BeginOrder (REQUEST) ----------
export type IndexOfferBeginOrderRequest = {
  ItemKey: ItemKey
}

// ---------- IndexOffer BeginOrder (RESPONSE) ----------
export type IndexOfferBeginOrderResponse = APIResponse<IndexOfferOrderEntryDataResult>

export type IndexOfferOrderEntryDataResult = {
  SelectedIndexOffer: IndexOfferOrderEntryItem
  SpecialOfferData: IndexOfferSpecialOfferData
  IsInternalUser: boolean
  ExternalColleagueOverrideList: Record<string, string>
  InternalCounterPartyOverrideList: Record<string, string>
  LiftingStartDateTime: string
  LiftingEndDateTime: string
  IsBid: boolean
}

export type IndexOfferOrderEntryItem = {
  ItemKey: ItemKey
  ProductId: number
  ProductName: string
  LocationId: number
  LocationName: string
  FormulaDisplayName: string
  OfferType: string
  LoadingNumbers: IndexOfferLoadingNumberInfo[]
  Origins: IndexOfferLocationInfo[]
  Destinations: IndexOfferLocationInfo[]
  Constraints: IndexOfferConstraints
  Defaults: IndexOfferDefaults
  FormulaVariables: FormulaVariableData[]
  PricingWeekendBehavior: string
  PricingHolidayBehavior: string
  PricingEffectiveTimes: string
  AdditionalFreetextTerms: string
  ContractDifferential: number | null
  PricingFormulaDefaultText: string
}

export type FormulaVariableData = {
  FixedValue: number | null
  Differential: number | null
  DisplayName: string
  VariableName: string
}

export type IndexOfferLoadingNumberInfo = {
  LoadingNumberId: number
  Name: string
  Display: string
  OriginLocationId: number
  CustomerCounterPartyId: number
  ProductId: number
  DestinationLocationId: number
  DestinationLocationName: string
}

export type IndexOfferLocationInfo = {
  LocationId: number
  LocationName: string
}

export type IndexOfferConstraints = {
  VolumeIncrement: number
  MinVolume: number
  MaxVolume: number
  MinMonthlyVolume: number
  MaxMonthlyVolume: number
  WarningVolume: number
  AllowMultipleLoadingNumbers: boolean
  AllowNoteEntry: boolean
  MaximumBidExpiration: string | null
  OriginLocationMinimumReqSelection: number
}

export type IndexOfferDefaults = {
  DefaultBidExpiryDateTime: string
  DefaultCounterPartyId: number | null
}

export type IndexOfferSpecialOfferData = {
  SpecialOfferId: number
  Name: string
  Description: string
  EvaluationType: string
  PricingMechanism: string
  IsBid: boolean
  FixedPrice: number | null
  MarketOffset: number | null
  ReservePrice: number | null
  EnforceReservePrice: boolean
  MinimumVolumePerOrder: number | null
  MaxVolumePerOrder: number | null
  VolumeIncrement: number | null
  OrderEffectiveStartDateTime: string
  OrderEffectiveEndDateTime: string
  TimeRemaining: string
  HasPendingOrder: boolean
  ExistingOrderId: number | null
}

// ---------- Index Offer SubmitOrder (REQUEST) ----------
export type IndexOfferSubmitOrderRequest = {
  ItemKey: ItemKey
  Volume: number
  LoadingNumberIds?: number[]
  LiftingLocationIds?: number[]
  DestinationLocationIds?: number[]
  BidPrice?: number // Only for bids - the user-entered formula differential
  Notes?: string
  BidExpiry?: string
  ExternalCounterPartyOverride?: number
  ExternalColleagueOverride?: number
  InternalCounterPartyOverride?: number
  ShouldSendExternalNotification?: boolean
}

// ---------- Index Offer SubmitOrder (RESPONSE) ----------
export type IndexOfferSubmitOrderResponse = APIResponse<{
  TradeEntryId: number
  OrderStatus: string
  SourceIndexOfferId: number
  SpecialOfferId: number
}>

// ---------- Index Offer UpdateOrder (REQUEST) ----------
export type IndexOfferUpdateOrderRequest = {
  TradeEntryId: number
  Accept?: boolean
  Withdraw?: boolean
  BidExpiration?: string // ISO string
  BidPrice?: number // Contract differential for auction-based offers
  LoadingNumberIds?: number[]
  DetailUpdates?: Array<{ TradeEntryDetailId: number; Quantity: number }>
  SendExternalNotification?: boolean
  UpdateStatusWithoutModifications?: boolean
  // Note: OverrideStartDate/EndDate not applicable for index offers
}

// ---------- Index Offer UpdateOrder (RESPONSE) ----------
export type IndexOfferUpdateOrderResponse = APIResponse<UseOnlineOrderUpdateData>
