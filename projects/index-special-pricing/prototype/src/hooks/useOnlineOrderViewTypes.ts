import { Validation } from '@api/globalTypes'

export interface UseOnlineOrderViewResponse {
  Data: OnlineOrderViewData
  Validations: Validation[]
}
export interface OnlineOrderViewData {
  MinDateOverrideDate: Date | null
  MaxDateOverrideDate: Date | null
  Model: Model
  ValidLoadingNumbers: number[]
  AllowMultipleLoadingNumbers: boolean
  ShowDateOverrideFields: boolean
}

export interface IndexOfferFormulaVariableModel {
  VariableDisplayName: string
  VariableName: string
  Value: number | null
  ValueSourceType: string | null
}

export interface IndexOfferDisplayModel {
  FormulaDisplayName: string | null
  FormulaString: string | null
  ContractDifferential: number | null
  PricingEffectiveTimes: string | null
  PricingWeekendBehavior: string | null
  PricingHolidayBehavior: string | null
  AdditionalFreetextTerms: string | null
  FormulaVariables: IndexOfferFormulaVariableModel[]
  InternalFormulaDisplayNameOverride: string | null
  ExternalFormulaDisplayNameOverride: string | null
  CurrencyId: number | null
  CurrencyName: string | null
  CurrencySymbol: string | null
  UnitOfMeasureId: number | null
  UnitOfMeasureName: string | null
  UnitOfMeasureSymbol: string | null
}

export interface Model {
  Comments: null | string
  ContractPricingMethodCodeValueMeaning: null | string
  CreatedDateTime: Date
  ExportDateTime: null | Date
  ExportError: null | string
  ExportProcessStatusCodeValueDisplay: string
  ExternalColleagueFirstName: string
  ExternalColleagueLastName: string
  ExternalCounterPartyId: number
  ExternalCounterPartyName: string
  ExternalProcessStatusCodeValueDisplay: null | string
  ExternalProcessStatusMessage: null | string
  FromDateTime: Date
  InternalContractNumber: null | number
  InternalCounterPartyName: string
  IsBidOrOffer: boolean
  IsPendingPricing: boolean
  IsTradeAtSettle: boolean
  MarketPlatformInstrumentId: number
  MarketPlatformInstrumentName: string
  MarketPlatformInstrumentSubtypeName: null | string
  OrderAcceptedDateTime: null | Date
  OrderStatusChangedMessage: string
  OrderStatusCodeValueDisplay: string
  OrderStatusCodeValueMeaning: string
  ToDateTime: Date
  TradeEntryExpiry: null | Date
  TradeEntryId: number
  TradeTypeCodeValueDisplay: string
  TradeTypeCodeValueMeaning: string
  VolumeConstraintMaximumVolume: number
  VolumeConstraintMinimumVolume: number
  VolumeConstraintMinimumVolumeIncrement: number
  VolumeConstraintMonthlyMaximumVolume: number
  VolumeConstraintMonthlyMinimumVolume: number
  VolumeConstraintWarningVolumeThreshold: number
  VolumeDistributionTypeCodeValueMeaning: null | string
  CurrentMarketPrice: null | number
  Margin: null | number
  OrderMarginVsCurrentMarketMargin: null | number
  IsInternalUser: boolean
  AreSetupsStillValid: boolean
  PrimaryTradeEntryDetailId: number
  FromLocationName: string
  ToLocationName: string
  ProductName: string
  Quantity: number
  Price: number
  OriginLocations: string[]
  DestinationLocations: string[]
  LoadingNumbers: any[]
  FuturesMonth: Date
  MaximumBidExpiration: Date
  OrderDetails: OrderDetail[]
  FullTypeName: string
  SourceIndexOfferId: number | null
  IndexOfferDisplay: IndexOfferDisplayModel | null
}

export interface OrderDetail {
  TradeEntryDetailId: number
  ParentTradeEntryDetailId: number | null
  FromDateTime: Date
  ToDateTime: Date
  Quantity: number
  ProductName: string
  FromLocationName: string
  DetailType: string
  Price: number
}

export interface UseOnlineOrderUpdateResponse {
  message: string | undefined
  Data: UseOnlineOrderUpdateData
  Query: Query
  Validations: Validation[]
}

export interface UseOnlineOrderUpdateData {
  LiftingDays: number
  TotalVolume: number
  UnitOfMeasure: string
  IncoTerm: null
  VolumeTypeMeaning: string
  AcceptedDateTime: Date
  Comments: null
  ContractPricingMethodMeaning: null
  CreatedByCredentialId: number
  CreatedByUsername: string
  CreatedDateTime: Date
  Details: Detail[]
  EffectiveFromDateTime: Date
  EffectiveToDateTime: Date
  ExpirationDateTime: null
  ExportProcessStatusMeaning: string
  ExternalColleagueFirstName: string
  ExternalColleagueId: number
  ExternalColleagueLastName: string
  ExternalColleagueSourceId: null
  ExternalColleagueSourceIdString: null
  ExternalCounterParty: string
  ExternalCounterPartyId: number
  ExternalCounterPartySourceId: null
  ExternalCounterPartySourceIdString: null
  ExternalProcessStatusMeaning: null
  ExternalProcessStatusMessage: null
  InternalContractNumber: null
  InternalCounterParty: string
  InternalCounterPartyId: number
  InternalCounterPartySourceId: null
  InternalCounterPartySourceIdString: null
  IsBidOrOffer: boolean
  IsPendingPricing: boolean
  MarketPlatformInstrument: string
  MarketPlatformInstrumentSubtype: null
  MarketPlatformInstrumentSubtypeId: null
  OrderId: number
  OrderStatusMeaning: string
  PricedDateTime: null
  TradeDateTime: Date
  TradeTypeMeaning: string
  UpdatedDateTime: Date
  VolumeDistributionTypeMeaning: null
}

export interface Detail {
  Currency: string
  PriceUnitOfMeasure: string
  DifferentialPrice: number
  IndexPrice: number
  TotalPrice: number
  FuturesMonth: Date
  ImpliedDifferentialPrice: number
  ProductGroupName: string
  AuthorizationAllocation: null
  AuthorizationAllocationAppliedDateTime: null
  AuthorizationAllocationAppliedStatusMeaning: string
  AuthorizationAllocationAppliedStatusMessage: null
  AuthorizationAllocationId: null
  AvailabilityAllocation: null | string
  AvailabilityAllocationAppliedDateTime: null
  AvailabilityAllocationAppliedStatusMeaning: string
  AvailabilityAllocationAppliedStatusMessage: null
  AvailabilityAllocationId: number | null
  CounterPartyAssociations: any[]
  DetailId: number
  EffectiveFromDateTime: Date
  EffectiveToDateTime: Date
  FromLocation: string
  FromLocationId: number
  FromLocationSourceId: null
  FromLocationSourceIdString: string
  LoadingNumberAssociations: any[]
  LocationAssociations: any[]
  MarketPlatformDetailTypeMeaning: string
  NetOrGrossMeaning: string
  ParentDetailId: number | null
  Prices: Price[]
  Product: string
  ProductId: number
  ProductSourceId: null
  ProductSourceIdString: string
  ToLocation: string
  ToLocationId: number
  ToLocationSourceId: null
  ToLocationSourceIdString: string
  Volume: number
  Volumes: Volume[]
  VolumeTypeMeaning: string
  ValuationCalendarId: number
}

export interface Price {
  Currency: string
  DifferentialPrice: number
  FuturesMonth: Date
  IndexPrice: number
  PriceComponents: PriceComponent[]
  TotalPrice: number
  UnitOfMeasure: string
}

export interface PriceComponent {
  Price: number
  PriceInstrument: string
  PriceInstrumentId: number
  PricePercent: number
  PriceTypeMeaning: string
}

export interface Volume {
  Volume: number
  VolumeDateTime: Date
}

export interface Query {
  TradeEntryId: number
  BidExpiration: null
  BidPrice: null
  Withdraw: boolean
  Accept: boolean
  SendExternalNotification: boolean
  LoadingNumberIds: any[]
  OverrideStartDate: null
  OverrideEndDate: null
  DetailUpdates: DetailUpdate[]
}

export interface DetailUpdate {
  TradeEntryDetailId: number
  Quantity?: number
}

export interface UseOnlineOrderUpdatePayload {
  TradeEntryId: number
  DetailUpdates: DetailUpdate[]
  Accept: boolean
  SendExternalNotification: boolean
}
