export interface IFormulaOverviewResponse {
  Data: IFormula[]
}

interface IFormula {
  $isNew?: boolean
  $blueprintId?: IFormula['FormulaId']
  AppliesTo: Partial<FormulaAppliesTo>[]
  FormulaId: number
  Variables: IFormulaVariable[]
  CreatedByCredentialId: number
  CreatedDateTime: string
  Formula: string
  IsSystemCalculation: boolean
  IsVisible: boolean
  Name: string
  ParserType: string
  MarkerId: number
  MarkerName: string
}

export interface IFormulaVariable {
  $isNew?: boolean
  AllowMultiOrigin?: boolean
  AllowTradePeriods?: boolean
  FormulaVariableId?: number
  FormulaVariableTemplateId?: number
  CounterPartyMatchTypeCvId?: number
  CreatedByCredentialId?: number
  CreatedDateTime?: string
  DependentFormulaId?: number
  Differential?: number
  DisplayName?: string
  FixedValue?: number
  IsRequired?: boolean
  IsSystemVariable?: boolean
  IsTemplateVariable?: boolean
  IsVisible?: boolean
  Percentage?: number
  PriceInstrumentId?: number
  PriceInstrumentName?: string
  PricePublisherId?: number
  PricePublisherName?: string
  PriceType?: string
  PriceTypeCvId?: number
  PriceValuationRuleId?: number
  PriceValuationRuleImplementation?: string
  PriceValuationRuleName?: string
  PriceValuationRuleSourceId?: number
  SpecificCounterPartyId?: number
  SpecificLocationId?: number
  SpecificProductId?: number
  SystemDataType?: string
  TradeDateRuleCvId?: number
  UOMConversionOverride?: number
  ValueEffectiveDateRule?: string
  ValueEffectiveDateRuleCvId?: number
  ValueSourceCvId?: number
  VariableName?: string
}

export interface IAffectedQuoteRowsResponse {
  Data: AffectedQuoteRow[]
}

export interface AffectedQuoteRow {
  QuoteConfigurationMappingId: number
  ProductName: string
  LocationName: string
  CounterPartyName: string
  QuoteConfigurationName: string
  QuoteConfigurationId: number
  MarketName: string
  ProductGroup: string
}

export type FormulaUpsertPayload = Omit<Partial<IFormula>, 'Variables'> & {
  Variables?: Partial<IFormulaVariable>[]
}

export interface IFormulaMetadataResponse {
  PublisherPriceTypes: { [publisherId: number]: MetadataItem[] }
  PublisherPriceInstruments: { [publisherId: number]: MetadataItem[] }
  Products: MetadataItem[]
  Locations: MetadataItem[]
  Publishers: MetadataItem[]
  Instruments: MetadataItem[]
  Markers: MetadataMarker[]
  DateRules: MetadataItem[]
  TradePeriodRules: MetadataItem[]
  CounterpartyMatchRules: MetadataItem[]
  PriceTypes: MetadataItem[]
  Sources: MetadataItem[]
  CounterParties: MetadataItem[]
  Categories: MetadataItem[]
  LocationHierarchies: MetadataItem[]
  ProductHierarchies: MetadataItem[]
  CounterPartyHierarchies: MetadataItem[]
}

export interface MetadataItem {
  Text: string
  Value: string
  GroupingValue: null | string
}

export interface MetadataMarker {
  ProductHierarchy: string
  ProductHierarchyTypeCvId: number
  LocationHierarchy: string
  LocationHierarchyTypeCvId: number
  CounterPartyHierarchyDefinitionId?: number
  Text: string
  Value: string
  GroupingValue: null | string
}

export interface FormulaAppliesTo {
  FormulaReferenceDataMappingId: number
  CounterParty: null
  CounterPartyId: null
  Location: string
  LocationId: number
  Product: string
  ProductId: number
}

export interface FormulaValidatePayload {
  Formula: string
  Variables: IFormulaVariable['VariableName'][]
}

export interface IFormulaValuationPayload {
  FormulaId: IFormulaOverviewResponse['Data'][number]['FormulaId']
  QuoteConfigurationId: IAffectedQuoteRowsResponse['Data'][number]['QuoteConfigurationId']
}
