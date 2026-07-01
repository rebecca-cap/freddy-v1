import { Validation } from '@api/globalTypes'

export interface OrderEntryDataResponse {
  Data: OrderEntryDataRes
  Query: Query
  Validations: Validation[]
}

export interface OrderEntryDataRes {
  SelectedItems: Item[]
  IsInternalUser: boolean
  ExternalColleagueOverrideList: { [key: string]: string }
  InternalCounterPartyOverrideList: { [key: string]: string }
  DateOverrideMaxDate: Date
  DateOverrideMinDate: Date
  ShowDateOverrideFields: boolean
  ValidSubtypes: any[]
  CreditData: CreditData
  OrderTimeLimitInSeconds: null
  State: string
  PromptDefaultDates: PromptDefaultDates
}

export interface CreditData {
  CreditStatus: string
  EstimatedRemainingCreditBalance: null
}

export interface PromptDefaultDates {
  DefaultStartDate: Date
  DefaultEndDate: Date
  RuleDescription: string
  ReferenceStart: Date
  NumberOfDays: number
  TimeOffset: string
}
export interface PriceAdjustmentDetails {
  MarketPlatformPriceAdjustmentDetailId: number
  Duration: number
  QuantityFrom: number
  QuantityTo: number
  AdjustmentPrice: number
  UnitOfMeasureId: number
}

export interface Item {
  Constraints?: Constraints
  Defaults?: Defaults
  AdditionalItems?: Item[]
  QuantityDistributionWeightPercentage?: number
  QuantityDistributionWeight?: number
  ProductId: number
  LocationId: number
  ProductName: string
  LocationName: string
  PriceAdjustmentDetails: PriceAdjustmentDetails[] | []
  LoadingNumbersList: any[]
  LiftingLocations: any[]
  DestinationLocations: any[]
  Price: number
  IndexPrice: number
  Margin: number
  FuturesMonth: Date
  IsPlaceholder: boolean
  DeliveryPeriodName: string
  ItemType?: string
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
  DefaultBidExpiration?: Date
}

export interface ItemKey {
  TradeEntrySetupId: number
  DeliveryPeriodConfigurationId: number
  DeliveryPeriodGroupId: null | number
  SpecialOfferId: number
}

export interface Query {
  SelectedItemKeys: ItemKey[]
  OnlyAssignedAdditionalProducts: null
}

export interface SelectedPromptItem {
  MarketPlatformInstrumentId: number
  MarketInstrumentName: string
  TradeEntrySetupId: number
  IsTradeAtSettle: boolean
  TradeTypeMeaning: string
  ProductId: number
  ProductSortOrder: null
  LocationId: number
  ProductName: string
  LocationName: string
  MarketPlatformItems: MarketPlatformItem[]
}

export interface MarketPlatformItem {
  SparkChartPoints: any[]
  DailyHigh: number
  DailyLow: number
  IsPriceUp: null
  DisplayName: string
  DeliveryPeriodFromDate: null
  DeliveryPeriodToDate: null
  ItemKey: ItemKey
  Price: number
  IndexPrice: number
  Margin: number
  FuturesMonth: Date
  IsPlaceholder: boolean
  DeliveryPeriodName: string
}

export interface ItemsAvailableForOrderResponse {
  Data: ItemsAvailableForOrderData
  Query: Query
  Validations: Validation[]
}

export interface ItemsAvailableForOrderData {
  ItemGroups: ItemGroup[]
  CreditStatus: string
  EstimatedRemainingCreditBalance: null
}

export interface ItemGroup {
  MarketPlatformInstrumentId: number
  MarketInstrumentName: string
  TradeEntrySetupId: number
  IsTradeAtSettle: boolean
  TradeTypeMeaning: string
  ProductId: number
  ProductSortOrder: null
  LocationId: number
  ProductName: string
  LocationName: string
  MarketPlatformItems: MarketPlatformItem[]
}

export interface GetMarketPlatformInstrumentsResponse {
  TotalRecords: number
  Data: MarketPlatformInstrumentsData[]
  Validations: Validation[]
}

export interface MarketPlatformInstrumentsData {
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
