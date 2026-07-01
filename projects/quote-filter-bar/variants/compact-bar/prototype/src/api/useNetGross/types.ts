export interface MetadataItem {
  Text: string
  Value: string
  GroupingValue: string
}

export interface NetGrossMetadataResponse {
  ProductList: MetadataItem[]
  LocationList: MetadataItem[]
  CounterPartyList: MetadataItem[]
  NetOrGrossTypeList: MetadataItem[]
  TradeEntryTypeList: MetadataItem[]
  QuoteConfigurationList: MetadataItem[]
  NetOrGrossDefaultTypeList: MetadataItem[]
}

export interface NetGrossRulesItem {
  CounterParty: string
  CounterPartyId: number
  Location: string
  LocationId: number
  NetGrossDefaultId: number
  NetGrossDefaultType: string
  NetGrossDefaultTypeCvId: number
  NetOrGrossCodeValueDisplay: string
  NetOrGrossCvId: number
  Order: number
  Product: string
  ProductId: number
  QuoteConfiguration: string
  QuoteConfigurationId: number
  TradeEntryType: string
  TradeEntryTypeCvId: number
}

export interface Validation {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: 'Info'
}

export interface NetGrossRulesResponse {
  TotalRecords: number
  Data: NetGrossRulesItem[]
  Query: string
  Validations: Validation[]
}

export interface NetGrossDefault {
  CounterParty: string
  CounterPartyId: number
  Location: string
  LocationId: number
  NetGrossDefaultId: number
  NetGrossDefaultType: string
  NetGrossDefaultTypeCvId: number
  NetOrGrossCodeValueDisplay: string
  NetOrGrossCvId: number
  Order: number
  Product: string
  ProductId: number
  QuoteConfiguration: string
  QuoteConfigurationId: number
  TradeEntryType: string
  TradeEntryTypeCvId: number
}

export interface NetGrossDefaultResponse {
  NetGrossDefault: NetGrossDefault
  NetOrGrossDefaultId: number
  NetOrGrossCvId: number
  NetOrGrossDisplay: string
}
