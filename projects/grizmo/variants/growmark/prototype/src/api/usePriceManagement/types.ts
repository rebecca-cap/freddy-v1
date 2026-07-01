export type PlaceholderUpdateResponse = {
  TotalRecords: number
  Data: Placeholder[]
  Query: any
  Validations: Validation[]
}

export interface Validation {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: string
}

export type Placeholder = {
  TradeEntryId: number
  TradeEntryDetailId: number
  TradeEntryPriceId: number
  FormulaResultComponentId: number
  ComponentName: string
  FormulaResult: FormulaResult
  FormulaResultId: number
  TradeEntryFromDateTime: string
  TradeEntryToDateTime: string
  TradeEntryDetailFromDateTime: string
  TradeEntryDetailToDateTime: string
  Location: string
  Product: string
  TradeEntryUpdatedDateTime: string
  Price: number
  OrderStatus: string
}

export type FormulaResult = {
  FilledFormula: string
  IsMissingPrices: boolean
  CalculationDate: string
  CalculationName: string
  ForCounterPartyId: number
  ForCounterPartyName: string
  ForLocationId: number
  ForLocationName: string
  Formula: string
  FormulaId: number
  FormulaResultId: number
  ForProductId: number
  ForProductName: string
  Result: number
  ResultComponents: ResultComponent[]
  ResultStatus: string
  ResultSystemDataType: string
  TargetUnitOfMeasureId: number
  TargetUnitOfMeasureName: string
  TargetUnitOfMeasureSymbol: string
}

export type ResultComponent = {
  IsMissing: boolean
  ComponentDisplayName: string
  ComponentName: string
  ComponentResult: number
  ComponentResultSystemDataType: string
  ComponentStatus: string
  Differential: number
  EffectiveAsOfDate: string
  FormulaResultComponentId: number
  IsCost: boolean
  IsPlaceholder: boolean
  IsRequired: boolean
  MissingOptionalPriceBehaviorCvId: number
  Percentage: number
  PriceInstrumentId: number
  PriceInstrumentLocationId: number
  PriceInstrumentName: string
  PriceInstrumentOriginLocationId: number
  PriceInstrumentProductId: number
  PriceTypeCodeValueDisplay: string
  PriceTypeCvId: number
  TradePeriodFromDateTime: string
  TradePeriodToDateTime: string
  UnitOfMeasureId: number
  UnitOfMeasureName: string
  UnitOfMeasureSymbol: string
  ValueSourceCodeValueDisplay: string
  ValueSourceCvId: number
}

export type PlaceholderUpdate = {
  FormulaResultComponentId: number
  Price: number
}
