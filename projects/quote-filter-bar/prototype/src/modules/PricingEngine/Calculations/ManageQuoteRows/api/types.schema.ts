interface MetadataSelectOption {
  Text: string
  Value: string | number
  GroupingValue?: string
  CostSourceTypeCvId?: number
  IsMarker?: false
  IsContractManagement?: true
  IsInstrument?: false
}

export type BaseApiResponse<T> = {
  Data: T[]
  TotalRecords: number
  Query: {
    Validations?: any[]
  }
}

export type QuoteMappingMetadataKeys =
  | 'CounterParties'
  | 'Products'
  | 'Locations'
  | 'UnitOfMeasures'
  | 'PricePeriodStartOffsets'
  | 'StatusCodeValues'
  | 'CostSourceTypes'
  | 'PricePublisherInstruments'
  | 'IntegratedTradeCostSources'
  | 'ContractManagementCostSources'
  | 'PricePublishers'
  | 'QuoteStrategies'
  | 'QuoteGroups'
  | 'NetOrGrossTypeCodeValues'
  | 'Validations'
  | 'PublisherPriceInstruments'
  | 'Benchmarks'
  | 'AutomaticQuotePublicationTypes'
  | 'Markers'

export type QuoteConfigMetadataKeys =
  | 'PriceTypes'
  | 'Calendars'
  | 'Markers'
  | 'CostSources'
  | 'MappingSourceTypes'
  | 'CounterPartyComparisonTypes'
  | 'AutomaticQuotePublicationTypes'

export type QuoteConfigurationOverview = BaseApiResponse<QuoteConfigurationRow>
export type QuoteConfigurationCompetitorPricesOverview = BaseApiResponse<CompetitorPriceRow>
export type QuoteConfigurationMetadata = Record<QuoteConfigMetadataKeys, MetadataSelectOption[]>
export type QuoteMappingMetadata = { Data: Record<QuoteMappingMetadataKeys, MetadataSelectOption[]> }
export type QuoteConfigurationCreatePayload = Pick<
  QuoteConfigurationRow,
  'ConfigurationName' | 'DefaultCostSourceCvId' | 'DefaultCostSourceMarkerId' | 'TermsDiscount' | 'PublishedPriceIncludesTermsDiscount'
>

export type QuoteConfigurationCreateResponse = {
  Data: QuoteConfigurationRow
  Validations: { Message: string }[]
}

export type QuoteConfigurationGroup = {
  QuoteConfigurationMappingGroupId: number
  GroupName: string
  GroupDescription: string
}

export type QuoteConfigurationGroupUpsertPayload = Partial<QuoteConfigurationGroup>
export type QuoteConfigurationGroupUpsertResponse = {
  Data: QuoteConfigurationGroup
  Validations: { Message: string }[]
}

export type QuoteConfigurationMappingUpsertPayload = {
  rowOrRows: Partial<QuoteConfigurationRow> | Partial<QuoteConfigurationRow>[]
}

export type QuoteConfigurationMappingUpsertResponse = {
  Data: QuoteConfigurationRow[]
  Validations: { Message: string }[]
}

export type QuoteConfigurationRow = {
  HasQuoteRows: boolean
  QuoteRowCount: number
  QuoteConfigurationMappingId: number
  QuoteConfigurationId: number
  AutoPublishEstimates: null | boolean
  AdjustmentCounterPartyComparisonType: string
  AdjustmentCounterPartyComparisonTypeCvId: number
  AdjustmentPricePublisher: string
  AdjustmentPricePublisherId: number
  BaseCostCounterPartyComparisonType: string
  BaseCostCounterPartyComparisonTypeCvId: number
  BaseCostPricePublisher: string
  BaseCostPricePublisherId: number
  BaseCostPriceType: string
  BaseCostPriceTypeCvId: number
  Calendar: null | any // Change 'any' to the specific type if available
  CalendarId: null | number
  ConfigurationName: string
  CreatedDateTime: string
  DefaultCostSource: null | any // Change 'any' to the specific type if available
  DefaultCostSourceCvId: null | number
  DefaultCostSourceMarker: null | any // Change 'any' to the specific type if available
  DefaultCostSourceMarkerId: null | number
  MarketMoveMarker: null | any // Change 'any' to the specific type if available
  MarketMoveMarkerId: null | number
  HasGeneratedMappings: boolean
  IsActive: boolean
  MappingSourceType: string
  MappingSourceTypeCvId: number
  NetOrGross: null | string
  NetOrGrossCvId: null | number
  OutputCounterPartyComparisonType: string
  OutputCounterPartyComparisonTypeCvId: number
  OutputPricePublisher: string
  OutputPricePublisherId: number
  DefaultAutomaticQuotePublicationTypeCvId: number
  DefaultAutomaticQuotePublicationType: string
  AutomaticQuotePublicationTypeCvId: number
  AutomaticQuotePublicationTypeCodeValue: string
  UsesMarketMove: boolean | null
  TermsDiscount: number | null
  PublishedPriceIncludesTermsDiscount: boolean | null
}

export interface CompetitorPriceRow {
  QuoteCompetitorPriceAssociationId: number
  QuoteConfigurationMappingId: number
  PriceInstrumentId: number
  ProductId: number
  LocationId: number
  IsHiddenByDefault: boolean
  PriceInstrument: string
  PricePublisher: string
  Region: string
  Area: string
  Location: string
  ProductGroup: string
  Commodity: string
  Grade: string
  Product: string
}

export type GetMappingsResponse = BaseApiResponse<GetMappingsRow>
export type GetMappingsRow = {
  HasValuationsOrPublications: boolean
  Commodity: null
  ProductGroup: null | string
  Grade: null | string
  Region: string
  Area: string
  SpreadRowCount: number
  CompetitorAssociationCount: number
  DefaultNetOrGrossCvId: null | number
  SelectedCounterPartyName: string
  AdjustmentPriceInstrumentId: number
  AdjustmentPriceInstrumentPricePublisherId: number
  AlternateValuationProductId: null | number
  AlternateValuationProductName: null | string
  AutomaticQuotePublicationTypeCodeValue: null | string
  AutomaticQuotePublicationTypeCvId: null | number
  AutoPublishEstimates: boolean
  CalendarId: null | number
  CarrierCounterPartyId: null | number
  CarrierCounterPartyName: null | string
  CostPriceTypeCvId: number
  CostSourceCvId: number
  CostSourceExplicitPriceInstrument: null | string
  CostSourceExplicitPriceInstrumentId: null | number
  CostSourceMarker: string
  CostSourceMarkerId: number
  CostSourceQuoteConfigurationMappingId: null | number
  CostSourceTradeDetailId: null | number
  CostSourceTradeDetailSourceId: null | number
  CostSourceTradeDetailValuationPriceInstrumentId: null | number
  CostSourceTradeEntryDetailId: null | number
  CostSourceTradeEntryDetailValuationPriceInstrumentId: null | number
  CostSourceTradeEntryId: number
  CostSourceTradeEntryInternalContractNumber: null | string
  CostSourceTradeInternalContractNumber: null | string
  CostSourceType: string
  ExternalCounterPartyId: null | number
  ExternalCounterPartyName: null | string
  InternalCounterPartyId: null | number
  InternalCounterPartyName: null | string
  IntraDayAdjustmentPriceInstrumentId: number
  IntraDayAdjustmentPriceInstrumentPricePublisherId: number
  IsActive: boolean
  Location: {
    LocationReportingAttributes: {
      LocationReportingAttributeID: number
      Name: string
      Value: string
    }[]
  }
  LocationId: number
  LocationName: string
  MarketMoveOverridePriceInstrumentId: number
  MarketMoveOverridePriceInstrumentPricePublisherId: number
  MarketMoveMarker: null | string
  MarketMoveMarkerId: null | number
  NetOrGross: null | string
  NetOrGrossCodeValue: {
    Meaning: null | string
  }
  NetOrGrossCvId: null | number
  OutputPriceTypeCvId: number
  PricePeriodStartOffset: string
  Product: {
    ProductReportingAttributes: {
      Name: string
      ProductReportingAttributeID: number
      Value: string
    }[]
  }
  ProductId: number
  ProductName: string
  QuoteConfigurationCalendarId: null | number
  QuoteConfigurationDefaultPricePeriodStartOffset: string
  QuoteConfigurationDisplayName: string
  QuoteConfigurationHasGeneratedMappings: boolean
  QuoteConfigurationId: number
  QuoteConfigurationMappingAllocationAssociations: []
  QuoteConfigurationMappingBenchmarks: {
    PriceInstrumentId: number
    QuoteBenchmarkId: number
    QuoteBenchmarkIsActive: boolean
    QuoteConfigurationMappingBenchmarkId: number
  }[]
  QuoteConfigurationMappingGroup: string
  QuoteConfigurationMappingGroupId: number
  QuoteConfigurationMappingId: number
  QuoteConfigurationMappingSourceTypeCvId: number
  QuoteConfigurationName: string
  QuoteConfigurationUsesMarketMove: boolean
  SecondaryTargetPriceInstrumentId: number
  SecondaryTargetPricePublisherId: number
  SourceId: null
  SourcePriceInstrumentId: number
  SourcePriceInstrumentPricePublisherId: number
  SourceSystemId: null | number
  SpreadAmount: number
  SpreadParentMappingId: number
  StatusCvId: number
  StrategyQuoteBenchmark: null | string
  StrategyQuoteBenchmarkId: null | number
  StrategyQuoteBenchmarkIsActive: false
  SupplierCounterPartyId: null | number
  SupplierCounterPartyName: null | string
  TargetPriceInstrumentId: number
  TargetPricePublisherId: number
  TargetUnitOfMeasureId: null | number
  UnitOfMeasureName: null | string
  UsesMarketMove: null | boolean
  TermsDiscount: number | null
  PublishedPriceIncludesTermsDiscount: boolean | null
}
