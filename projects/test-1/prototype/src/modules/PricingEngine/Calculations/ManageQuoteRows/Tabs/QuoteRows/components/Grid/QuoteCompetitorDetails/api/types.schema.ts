export type UpsertQuoteCompetitorDetailsRequest = {
  Associations: {
    QuoteConfigurationMappingId: number
    PriceInstrumentId: number
    IsHiddenByDefault: boolean
  }[]
}
