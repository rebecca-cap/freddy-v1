import type { InferResponse, components } from '@hooks/useTypedApi'

// Response shape for /api/PriceEngine/Formula/ValueContract and /ValueContractDetails
// (both endpoints return the same response type).
export type ValuationDataResponse = InferResponse<'/api/PriceEngine/Formula/ValueContract'>

export type ValuationData = components['schemas']['Base.Models.ContractValuationResponse']

export type ValuationResult = components['schemas']['Base.Models.PriceValuationResult']

export type FormulaResult = components['schemas']['PriceEngine.Result.FormulaValueResult']

// A single variable returned inside a formula valuation result.
export type Variable = components['schemas']['PriceEngine.Result.FormulaValueResultVariable']

// FE-side display shape for formula variables pulled from a contract detail's price.
// Represents the formula definition enriched with metadata names
// (PricePublisherName, PriceInstrumentName, PriceValuationRuleName,
// PriceTypeDisplayName) that the FE joins from metadata.
// TODO: consolidate with `FormulaVariable` in ../../../api/types.schema — they
// represent the same concept with slightly different field subsets.
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
