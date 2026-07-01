import { MetadataItem } from '@api/usePriceEngineFormulas/types'

export interface FormulaTemplateApplicableLocation {
  LocationId: number
}

export interface FormulaTemplateApplicableProduct {
  ProductId: number
}

export interface FormulaTemplateDetails {
  CreatedByCredentialId: number
  CreatedDateTime: string | null
  Formula: string | null
  FormulaTemplateApplicableLocations: FormulaTemplateApplicableLocation[]
  FormulaTemplateApplicableProducts: FormulaTemplateApplicableProduct[]
  FormulaTemplateCategoryDisplay: string | null
  FormulaTemplateCategoryId: number | null
  FormulaTemplateId: number
  FormulaTemplateVariables: FormulaTemplateVariable[]
  IsActive: boolean | null
  IsSystemCalculation: boolean | null
  IsVisible: boolean | null
  MarkerId: number | null
  Name: string
  ParserType: string | null
}

export interface FormulaTemplateVariable {
  AllowMultiOrigin?: boolean | null
  CounterPartyMatchTypeCvId?: number | null
  CreatedByCredentialId?: number | null
  CreatedDateTime?: string
  DependentFormulaId?: number
  Differential?: number | null
  DisplayName?: string | null
  FixedValue?: number
  FormulaTemplateId?: number
  FormulaTemplateVariableId?: number
  IsCost?: boolean
  IsPlaceholder?: boolean
  IsRequired?: boolean
  IsSystemVariable?: boolean
  IsTemplateVariable?: boolean
  IsVisible?: boolean
  MissingOptionalPriceBehaviorCvId?: number
  Percentage?: number | null
  PriceInstrumentId?: number | null
  PricePublisherId?: number | null
  PriceTypeCvId?: number | null
  PriceValuationRuleId?: number | null
  SpecificCounterPartyId?: number | null
  SpecificLocationId?: number | null
  SpecificProductId?: number | null
  SystemDataType?: string
  TradeDateRuleCvId?: number | null
  UOMConversionOverride?: number
  ValueEffectiveDateRuleCvId?: number | null
  ValueSourceCvId?: number | null
  VariableName?: string
}

export interface FormulaTemplateMarkerOption extends MetadataItem {
  ProductHierarchy: string
  ProductHierarchyTypeCvId: number
  LocationHierarchy: string
  LocationHierarchyTypeCvId: number
  CounterPartyHierarchyDefinitionId: number
  CounterPartyHierarchy: string
}

export interface FormulaTemplateMetadata {
  FormulaTemplateCategories: MetadataItem[]
  Products: MetadataItem[]
  Locations: MetadataItem[]
  Publishers: MetadataItem[]
  Instruments: MetadataItem[]
  LiveInstruments: MetadataItem[]
  DateRules: MetadataItem[]
  TradePeriodRules: MetadataItem[]
  CounterpartyMatchRules: MetadataItem[]
  PriceTypes: MetadataItem[]
  Sources: MetadataItem[]
  CounterParties: MetadataItem[]
  Markers: FormulaTemplateMarkerOption[]
  ProductHierarchies: MetadataItem[]
  LocationHierarchies: MetadataItem[]
  PublisherPriceTypes: Record<string, MetadataItem[]>
  CounterPartyHierarchies: MetadataItem[]
}

export interface RawMarkerObject {
  MarkerId: number
  MarkerName: string
  ProductHierarchy: string
  ProductHierarchyTypeCvId: number
  LocationHierarchy: string
  LocationHierarchyTypeCvId: number
  CounterPartyHierarchyDefinitionId: number
  CounterPartyHierarchy: string
}

export interface FormulaTemplateRawMetadata {
  FormulaTemplateCategories: Record<string, string>
  Products: Record<string, string>
  Locations: Record<string, string>
  Publishers: Record<string, string>
  Instruments: Record<string, string>
  LiveInstruments: Record<string, string>
  DateRules: Record<string, string>
  TradePeriodRules: Record<string, string>
  CounterpartyMatchRules: Record<string, string>
  PriceTypes: Record<string, string>
  Sources: Record<string, string>
  CounterParties: Record<string, string>
  Markers: Record<string, RawMarkerObject>
  ProductHierarchies: Record<string, string>
  LocationHierarchies: Record<string, string>
  CounterPartyHierarchies: Record<string, string>
}
