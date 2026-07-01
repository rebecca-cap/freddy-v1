import { Validation } from '@api/globalTypes'

export interface ValuationDataResponse {
  Data: ValuationData[]
  TotalRecords: number
  Validations: Validation[]
}
export interface ValuationData {
  TradeEntryPriceId: number
  ValuationResult: ValuationResult
}

export interface ValuationResult {
  Request: Definition
  Definition: Definition
  FormulaResult: FormulaResult
  Status: string
  Validations: Validation[]
}

export interface Definition {
  SourceRequest?: Definition
  ValuationPeriodData?: ValuationPeriodData
  ActualEffectiveFromDateTime?: Date
  ActualEffectiveToDateTime?: Date
  IsMidDayValuation?: boolean
  ProductId: number
  LocationId: number
  CounterPartyId: number
  OriginLocationId: null
  TargetUnitOfMeasure: number
  TargetCurrencyId: number
  ReferenceIdentifier: string
  ExplicitPriceInstrumentId: number
  DeliveryPeriodFuturesMonth: null
  TradePeriodReferenceDateIsSet: boolean
  TradePeriodReferenceDate: Date
  TradePeriodReferenceEndDate: null
  MinValuationResultEffectiveDate: null
  MaxValuationResultEffectiveDate: null
  PricePeriodOffset: PricePeriodOffset
  FormulaValueRequest: FormulaValueRequest
  FormulaId?: number
  TradeEntryPriceId?: number
  ValuationSourceData?: ValuationSourceData
}

export interface FormulaValueRequest {
  FormulaVariables: Variable[]
  FormulaId: number
  Name: string
  Formula: Formula
  ParserType: string
  CreatedByCredentialId: null
  CreatedDateTime: Date
  IsVisible: boolean
  IsSystemCalculation: boolean
  MarkerId: null
  LocationHierarchyTypeCvId: null
  ProductHierarchyTypeCvId: null
}

export type Formula = string

export interface Variable {
  ExplicitExchangeSymbol?: null
  DependentRequest?: null
  IsCost: boolean
  SpecificProductId: null
  SpecificLocationId: null
  SpecificCounterPartyId: null
  FormulaVariableId: number
  FormulaId: number
  DisplayName: null
  VariableName: VariableName
  ValueSourceCvId: null
  DependentFormulaId: null
  PricePublisherId: null
  PriceInstrumentId: number
  PriceTypeCvId: number
  TradeDateRuleCvId: null
  ValueEffectiveDateRuleCvId: null
  CounterPartyMatchTypeCvId: null
  AllowMultiOrigin: null
  SystemDataType: SystemDataType
  IsRequired: boolean
  MissingOptionalPriceBehaviorCvId: null
  FixedValue: null
  Percentage: number
  Differential: number
  IsVisible: boolean
  IsSystemCalculation: null
  TemplateVariable: null
  TemplateName: null
  TemplateId: null
  BasedOnTemplate: boolean
  CreatedDateTime: Date
  CreatedByCredentialId: null
  PriceValuationRuleId: number
  UOMConversionOverride: null
  ResultComponentId?: null
  IsMissingPrices?: boolean
  Status?: string
  Value?: {
    PriceId: number
    PriceInstrumentId: number
    PricePublisherId: number
    PriceTypeCvId: number
    EffectiveFromDate: string | Date
    EffectiveToDate: string | Date
    TradeFromDate: null
    TradeToDate: null
    PriceStatus: string
    UnitOfMeasureId: null
    CurrencyId: null
    Price: number
    FormulaResultId: null
    PointId: number
    PointTypeCvId: null
    UpdatedDateTime: null
    IsActive: boolean
  } | null
  DependentValueResult?: null
  RequestedPriceType?: null
}

export type SystemDataType = string

export type VariableName = string

export type PricePeriodOffset = string

export interface ValuationPeriodData {
  TargetDate: Date
  ValuationDate: Date
  ReferencePeriods: ReferencePeriods
  IsMidDayValuation: boolean
  TargetPricePeriod: PricePeriod
  CurrentPricePeriod: PricePeriod
  PriorPricePeriod: PricePeriod
}

export interface PricePeriod {
  IsMidnightPeriod: boolean
  IsWeekendPeriod: boolean
  BaseOffset: PricePeriodOffset
  Start: Date
  End: Date
  Length: PricePeriodOffset
}

export interface ReferencePeriods {
  TargetPricePeriod: PricePeriod
  CurrentPricePeriod: PricePeriod
  PriorPricePeriod: PricePeriod
}

export interface ValuationSourceData {
  CurrencyId: number
  Description: null
  Differential: null
  FormulaId: number
  FrequencyCvId: null
  FromDate: Date
  IndexPrice: null
  IndexPriceTypeCvId: null
  NetOrGrossCvId: number
  PayOrReceiveCvId: number
  PeriodStartOffset: PricePeriodOffset
  PerPriceTypeCvId: null
  Price: null
  PriceCategoryCvId: null
  PriceInstrumentId: null
  PropertyListId: null
  ToDate: Date
  TradeEntryDetail: TradeEntryDetail
  TradeEntryDetailId: number
  TradeEntryPriceId: number
  TradePriceTypeId: null
  TradePriceValuationRuleId: null
  UnitOfMeasureId: number
}

export interface TradeEntryDetail {
  BookId: null
  FrequencyCvId: number
  FromDateTime: Date
  FromLocationId: number
  IncoTermId: null
  NetOrGrossCvId: number
  ObligationTypeCvId: null
  ParentTradeEntryDetailId: null
  PaymentTermId: null
  ProductId: number
  PropertyListId: null
  Quantity: number
  QuantityTypeCvId: null
  ToDateTime: Date
  ToLocationId: null
  TradeEntry: TradeEntry
  TradeEntryDetailId: number
  TradeEntryId: number
  TradeEntryQuantityLimitId: null
  UnitOfMeasureId: number
  ValuationPriceInstrumentId: number
}

export interface TradeEntry {
  Comments: string
  CounterPartyProfileId: null
  CreatedDateTime: Date
  CredentialId: null
  Description: string
  ExportDateTime: null
  ExportError: null
  ExportProcessStatusCvId: null
  ExternalColleagueId: null
  ExternalContractNumber: string
  ExternalCounterPartyId: number
  FromDateTime: Date
  InternalColleagueId: number
  InternalContractNumber: string
  InternalCounterPartyId: number
  IsBidOrOffer: null
  IsLegalContractOurs: boolean
  IsTemplate: boolean
  MovementTypeCvId: number
  NetOrGrossCvId: null
  OrderAcceptedDateTime: null
  OrderStatusChangedCredentialId: null
  OrderStatusChangedDateTime: null
  OrderStatusChangedMessage: null
  OrderStatusCvId: number
  PropertyListId: null
  ToDateTime: Date
  TradeEntryDateTime: Date
  TradeEntryExpiry: null
  TradeEntryId: number
  TradeEntryQuantityLimitId: null
  TradeEntrySetupId: null
  TradeInstrumentId: number
  TradeTermCvId: null
  WebClientTypeCvId: null
}

export interface FormulaResult {
  Name: string
  Formula: string
  Value: number
  ResultDateTime: Date
  FormulaId: number
  FormulaResultId: null
  Context: Context
  Variables: Variable[]
  IsMissingPrices: boolean
  IsActual: boolean
  ForCounterPartyId: number
  ForCounterPartyName: null
  ForProductId: number
  ForProductName: null
  ForLocationId: number
  ForLocationName: null
  TargetUnitOfMeasureId: number
}

export interface Context {
  ProductHierarchyTypeCvId: null
  LocationHierarchyTypeCvId: null
  VariablePercentagesApplyToDifferentials: boolean
  ProductId: number
  LocationId: number
  CounterPartyId: null
  FuturesTargetDate: Date
  FuturesTargetEndDate: null
  TargetDate: null
  TargetUnitOfMeasureId: number
}

export interface VariableData {
  AllowMultiOrigin: null
  CounterPartyMatchTypeCvId: null
  CreatedByCredentialId: null
  CreatedDateTime: Date
  DependentFormulaId: null
  Differential: number
  DisplayName: null
  FixedValue: null
  FormulaId: number
  FormulaVariableId: number
  FormulaVariableTemplateId: null
  IsCost: boolean
  IsRequired: boolean
  IsSystemVariable: boolean
  IsTemplateVariable: null
  IsVisible: boolean
  MissingOptionalPriceBehaviorCvId: number | null
  Percentage: number
  PriceInstrumentId: string
  PriceInstrumentName: string
  PricePublisherId: string
  PricePublisherName: string
  PriceTypeCvId: number
  PriceValuationRuleId: number
  PriceValuationRuleImplementation: string
  PriceValuationRuleName: string
  PriceValuationRuleSourceId: null
  SpecificCounterPartyId: null
  SpecificCounterPartyName: null
  SpecificLocationId: null
  SpecificProductId: null
  SystemDataType: string
  TradeDateRuleCvId: null
  UOMConversionOverride: null
  ValueEffectiveDateRuleCvId: null
  ValueSourceCvId: null
  VariableName: string
  PriceTypeDisplayName: string
}
