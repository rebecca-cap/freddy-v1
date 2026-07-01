export interface FormulaBreakdownAndValuationDataResponse {
  Data: FormulaBreakdownAndValuationDetail
}
export interface FormulaBreakdownAndValuationDetail {
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
  ResultComponents: FormulaBreakdownAndValuationDetailResultComponent[]
  ResultStatus: string
  ResultSystemDataType: string
  TargetUnitOfMeasureId: number
  TargetUnitOfMeasureName: string
  TargetUnitOfMeasureSymbol: string
}
export interface FormulaBreakdownAndValuationDetailResultComponent {
  IsMissing: boolean
  ComponentDisplayName: string
  ComponentName: string
  ComponentResult: number
  ComponentResultSystemDataType: string
  ComponentStatus: string
  Differential: number
  EffectiveAsOfDate: string
  FormulaResultComponentId: number
  IsRequired: boolean
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
