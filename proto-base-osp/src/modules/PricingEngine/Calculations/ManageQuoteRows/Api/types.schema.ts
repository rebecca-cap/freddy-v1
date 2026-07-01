import type { InferResponse, components } from '@hooks/useTypedApi'

// ─── Row types derived from generated OpenAPI schema ────────────────────────

export type QuoteConfigurationRow = components['schemas']['CoreModel.DtoClasses.QuoteConfigurationManagementDDTO']

export type GetMappingsRow = components['schemas']['CoreModel.DtoClasses.QuoteConfigurationMappingDDTO']

// ─── Response types derived from endpoint return types ──────────────────────

export type QuoteConfigurationOverview = InferResponse<'/api/QuoteConfigurationManagement/GetConfigurations'>

export type QuoteConfigurationMappingUpsertResponse = InferResponse<'/api/QuoteConfigurationManagement/UpsertMappings'>

// ─── Payload types ───────────────────────────────────────────────────────────

export type QuoteConfigurationCreatePayload = Pick<
  QuoteConfigurationRow,
  | 'ConfigurationName'
  | 'DefaultCostSourceCvId'
  | 'DefaultCostSourceMarkerId'
  | 'CalendarId'
  | 'BaseCostCounterPartyComparisonTypeCvId'
  | 'OutputCounterPartyComparisonTypeCvId'
  | 'DefaultAutomaticQuotePublicationTypeCvId'
  | 'MarketMoveModeCvId'
  | 'TermsDiscount'
  | 'PublishedPriceIncludesTermsDiscount'
  | 'UseStartOfDayPriceInEodCurrentAnalytics'
  | 'HasOriginAndDestination'
  | 'UsesFreight'
  | 'UsesTax'
  | 'ExcludeFreightAndTaxFromMargin'
>

export type QuoteConfigurationMappingUpsertPayload = {
  rowOrRows: Partial<GetMappingsRow> | Partial<GetMappingsRow>[]
}

// ─── Metadata types (hand-authored — structure differs from generated SelectListItem) ────

interface MetadataSelectOption {
  Text: string
  Value: string | number
  GroupingValue?: string
  CostSourceTypeCvId?: number
  IsMarker?: false
  IsContractManagement?: true
  IsInstrument?: false
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
  | 'MarketMoveModes'

export type QuoteConfigurationMetadata = Record<QuoteConfigMetadataKeys, MetadataSelectOption[]>
export type QuoteMappingMetadata = { Data: Record<QuoteMappingMetadataKeys, MetadataSelectOption[]> }
export type UploadedQuoteRow = components['schemas']['Components.Parser.UploadedQuoteConfigMapping']
export type ValidationResult = components['schemas']['Library.Validation.ValidationResult']