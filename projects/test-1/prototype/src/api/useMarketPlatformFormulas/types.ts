export interface MetadataItem {
  Text: string
  Value: string
  GroupingValue: null | string
}

export interface Marker {
  ProductHierarchy: string
  ProductHierarchyTypeCvId: number
  LocationHierarchy: string
  LocationHierarchyTypeCvId: number
  CounterPartyHierarchyDefinitionId?: number
  Text: string
  Value: string
  GroupingValue: null | string
}

export interface MarketPlatformFormulaMetadata {
  LiveInstruments: MetadataItem[]
  Products: MetadataItem[]
  Locations: MetadataItem[]
  Publishers: MetadataItem[]
  Instruments: MetadataItem[]
  DateRules: MetadataItem[]
  TradePeriodRules: MetadataItem[]
  CounterpartyMatchRules: MetadataItem[]
  PriceTypes: MetadataItem[]
  Sources: MetadataItem[]
  CounterParties: MetadataItem[]
  Markers: Marker[]
  ProductHierarchies: MetadataItem[]
  LocationHierarchies: MetadataItem[]
  CounterPartyHierarchies: MetadataItem[]
  PublisherPriceTypes: { [publisherId: number]: MetadataItem[] }
}

export interface VariablesItem {
  $isNew?: boolean
  AllowMultiOrigin: boolean
  CounterPartyMatchTypeCvId: number
  FormulaVariableId: number
  IsCost: boolean
  IsPlaceholder: boolean
  IsRequired: boolean
  PriceInstrumentId: number
  PriceInstrumentName: string
  PricePublisher: string
  PricePublisherId: number
  PriceType: string
  PriceTypeCvId: number
  SpecificLocation: string
  SpecificLocationId: number
  SpecificProduct: string
  SpecificProductId: number
  TradeDateRule: string
  TradeDateRuleCvId: number
  ValueEffectiveDateRule: string
  ValueEffectiveDateRuleCvId: number
  ValueSource: string
  ValueSourceCvId: number
  VariableName: string
  AdditionalOptions: string
}

export interface AppliesToItem {
  CounterParty: string
  CounterPartyId: number
  FormulaReferenceDataMappingId: number
  Location: string
  LocationId: number
  Product: string
  ProductId: number
}

export interface LivePriceType {
  AllowMultiOrigin: boolean
  CounterPartyMatchTypeCvId: number
  FormulaVariableId: number
  IsCost: boolean
  IsRequired: boolean
  PriceInstrumentId: number
  PriceInstrumentName: string
  PricePublisher: string
  PricePublisherId: number
  PriceType: string
  PriceTypeCvId: number
  SpecificLocation: string
  SpecificLocationId: number
  SpecificProduct: string
  SpecificProductId: number
  TradeDateRule: string
  TradeDateRuleCvId: number
  ValueEffectiveDateRule: string
  ValueEffectiveDateRuleCvId: number
  ValueSource: string
  ValueSourceCvId: number
  VariableName: string
  AdditionalOptions: string
}

export interface FormulaData {
  $isNew?: boolean
  $blueprintId?: FormulaData['FormulaId']
  LivePrice: LivePriceType | null
  AppliesTo: AppliesToItem[]
  Formula: string
  FormulaId: number
  MarkerId: number
  MarkerName: string
  Name: string
  Variables: VariablesItem[]
  CreatedByCredentialId: number
  CreatedDateTime: string
  IsSystemCalculation: boolean
  IsVisible: boolean
  ParserType: string
}

export interface Validation {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: string // You may want to make this an enum if there are fixed values
}

export interface MarketPlatformFormulasResponse {
  TotalRecords: number
  Data: FormulaData[]
  Query: string
  Validations: Validation[]
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

export interface MarketPlatformFormulaUpsertPayload {
  Formula: string
  FormulaId: number
  MarkerId: number
  MarkerName: string
  Name: string
  LivePrice: LivePriceType
  AppliesTo: FormulaAppliesTo
  Variables: VariablesItem[]
}

export interface MarketPlatformFormulaValidatePayload {
  Formula: string
  Variables: VariablesItem['VariableName'][]
}

export interface AffectedSetup {
  TradeEntrySetupId: number
  ProductName: string
  LocationName: string
  MarketPlatformInstrumentId: number
  MarketName: string
  ProductGroup: string
}

export interface MarketPlatformFormulaAffectedSetupsResponse {
  TotalRecords: number
  Data: AffectedSetup[]
  Query: string
  Validations: Validation[]
}
