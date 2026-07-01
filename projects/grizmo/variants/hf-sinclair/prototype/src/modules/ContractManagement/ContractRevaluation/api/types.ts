// --------------------------------------
// Shared Types
// --------------------------------------

import { Moment } from 'moment'

export interface ValidationMessage {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: 'Info' | 'Warning' | 'Error'
}

export interface MetadataItem {
  Text: string
  Value: string
  GroupingValue: string
}

// --------------------------------------
// GetMetaData
// --------------------------------------

export interface ValidationRule {
  MaxDateRangeDays: number
  MinRevaluationDate: string // ISO timestamp
  MaxRevaluationDate: string
}

export interface GetMetaDataResponse {
  Data: {
    CounterParties: MetadataItem[]
    Locations: MetadataItem[]
    Products: MetadataItem[]
    TradeInstruments: MetadataItem[]
    ContractTypes: MetadataItem[]
    PricePublishers: MetadataItem[]
    PriceInstruments: MetadataItem[]
    ValidationRules: ValidationRule
    PricingCalendars: MetadataItem[]
  }
  Query: string
  Validations: ValidationMessage[]
}

// --------------------------------------
// GetContractValuations
// --------------------------------------

export interface GetContractValuationsRequest {
  FromDate: string | Moment
  ToDate: string | Moment
  TradeEntryIds: number[]
  TradeEntryDetailIds: number[]
  PriceInstrumentIds: number[]
}

export interface ContractRevaluationPrice {
  EffectiveFromDateTime: string
  Value: number
  EffectiveToDateTime: string
  CurvePointPriceId: number
  CurvePointId: number
  FormulaResultId: number
  ValuationStatus: string
}

export interface ContractValuation {
  CounterPartyName: string
  CurvePointId: number
  CurvePointPriceId: number
  DestinationLocationId: number
  DestinationLocationName: string
  EffectiveFromDateTime: string
  EffectiveToDateTime: string
  FormulaResultId: number
  OriginLocationId: number
  OriginLocationName: string
  ProductId: number
  ProductName: string
  TradeEntryDetailId: number
  TradeEntryId: number
  TradeEntryTypeCodeValueMeaning: string
  TradeInstrumentName: string
  UpdatedDateTime: string
  ValuationStatus: string
  Value: number
  Prices: ContractRevaluationPrice[]
  ValuationCalendarId: number
}

export interface GetContractValuationsResponse {
  TotalRecords: number
  Data: ContractValuation[]
  Query: string
  Validations: ValidationMessage[]
}

// --------------------------------------
// GetValuationBuildUp
// --------------------------------------

export interface GetValuationBuildUpRequest {
  FormulaResultId: number
}

export interface ValuationVariable {
  VariableName: string
  VariableValue: string
  VariableSource: string
}

export interface ValuationBuildUp {
  FormulaResultId: number
  Formula: string
  CalculatedValue: number
  CalculationDate: string
  Variables: ValuationVariable[]
}

export interface GetValuationBuildUpResponse {
  Data: ValuationBuildUp
  Query: string
  Validations: ValidationMessage[]
}

// --------------------------------------
// ExecuteRevaluation
// --------------------------------------

export interface ExecuteRevaluationRequest {
  TradeEntryDetailIds: number[]
  TradeEntryIds?: number[]
  StartDate: string | Moment
  EndDate: string | Moment
}

export interface RevaluationPriceChange {
  CurvePointPriceId: number
  PeriodStart: string
  PeriodEnd: string
  OldPrice: number
  NewPrice: number
}

export interface ExecuteRevaluationData {
  ProcessedDetailCount: number
  ProcessedContractCount: number
  UpdatedPrices: RevaluationPriceChange[]
  Validations: ValidationMessage[]
}

export interface ExecuteRevaluationResponse {
  Data: ExecuteRevaluationData
  Query: string
  Validations: ValidationMessage[]
}
