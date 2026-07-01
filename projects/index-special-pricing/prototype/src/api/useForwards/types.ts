export type InstrumentID = string

export interface MarketPlatformInstrument {
  MarketPlatformInstrumentId: number
  Name: string
  IsTas: boolean
  AllowBid: boolean
  TradeTypeMeaning: string
  Subtypes?: Subtype[]
}

export interface Subtype {
  MarketPlatformInstrumentSubtypeId: number
  Name: string
  Description: string
  IsActive: boolean
  AllowMarket: boolean
  AllowBid: boolean
  VolumeDistributionTypeMeaning: string
  ContractPricingMethodMeaning: string
}

export interface OrderEntryResponse {
  Data: OrderEntryData
  Query: Query
  Validations: any[]
  OrderTimeLimitInSeconds?: number
}

export interface OrderEntryData {
  SelectedItems: SelectedItem[]
  IsInternalUser: boolean
  ExternalColleagueOverrideList: ExternalColleagueOverrideList
  InternalCounterPartyOverrideList: { [key: string]: string }
  ValidSubtypes: ValidSubtype[]
  CreditData: CreditData
  OrderTimeLimitInSeconds: null
  State: string
}

export interface CreditData {
  creditHold: boolean
  creditStatus: string
  totalCreditBalance: number | null
  remainingCreditBalance: number | null
  EstimatedRemainingCreditBalance: number | null
}

export type ExternalColleagueOverrideList = Record<string, string>

export interface SelectedItem {
  Constraints: Constraints
  Defaults: Defaults
  AdditionalItems: any[] // couldn't resolve from response
  QuantityDistributionWeightPercentage: number
  QuantityDistributionWeight: number
  ProductId: number
  LocationId: number
  ProductName: string
  LocationName: string
  PriceAdjustmentDetails: any[] // couldn't resolve from response
  LoadingNumbersList: any[] // couldn't resolve from response
  LiftingLocations: any[] // couldn't resolve from response
  ItemKey: ItemKey
  Price: number
  Differential: number
  IndexPrice: number
  Margin: number
  FuturesMonth: Date
  DisplayName?: string
  DeliveryPeriodName?: string
}

export interface Constraints {
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

export interface Defaults {
  DefaultBidExpiryDateTime: Date
  DefaultCounterPartyId: number
}

export interface ItemKey {
  TradeEntrySetupId: number
  DeliveryPeriodConfigurationId: number
  DeliveryPeriodGroupId: null
}

export interface ValidSubtype {
  MarketPlatformInstrumentSubtypeId: number
  Name: string
  Description: string
  IsActive: boolean
  AllowMarket: boolean
  AllowBid: boolean
  VolumeDistributionTypeMeaning: string
  ContractPricingMethodMeaning: string
}

export interface Query {
  SelectedItemKeys: ItemKey[]
}

export interface ForwardPriceResponse {
  Data: ForwardPriceData
  Query: ForwardPriceQuery
  Validations: Validation[]
}

export interface ForwardPriceData {
  ItemGroups: ItemGroup[]
  CreditStatus: string
  EstimatedRemainingCreditBalance: null
}

export interface ItemGroup {
  MarketPlatformInstrumentId: number
  MarketInstrumentName: MarketInstrumentName
  TradeEntrySetupId: number
  IsTradeAtSettle: boolean
  TradeTypeMeaning: MarketInstrumentName
  ProductId: number
  ProductSortOrder: null
  LocationId: number
  ProductName: ProductName
  LocationName: string
  MarketPlatformItems: MarketPlatformItem[]
}

export type MarketInstrumentName = string
export type DisplayName = string
export type ProductName = string

export interface MarketPlatformItem {
  SparkChartPoints: null
  DailyHigh: null
  DailyLow: null
  IsPriceUp: boolean
  DisplayName: DisplayName
  ItemKey: ForwardPriceItemKey
  Price: number
  Differential: number
  IndexPrice: number
  Margin: number
  FuturesMonth: Date
}

export interface ForwardPriceItemKey {
  TradeEntrySetupId: number
  DeliveryPeriodConfigurationId: number
  DeliveryPeriodGroupId: null
}

export interface ForwardPriceQuery {
  MarketPlatformInstrumentId: number
  IgnoreProductLocationPermissions: boolean
  IncludeHistoricalPricingInformation: boolean
}

export interface Validation {
  PropertyName: null
  Message: string
  Category: string
  Identifier: null
  Severity: string
}
