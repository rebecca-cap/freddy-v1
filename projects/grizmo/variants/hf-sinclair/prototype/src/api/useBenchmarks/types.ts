export interface UpsertBenchmarkPayload {
  Name: string
  IsActive: boolean
  MarkerId?: string
  Marker?: string
  NewMarker?: {
    Name: string
    ProductHierarchyTypeCvId: string
    LocationHierarchyTypeCvId: string
  }
  QuoteBenchmarkAssociations: {
    QuoteBenchmarkAssociationId?: number | string
    QuoteBenchmarkId?: number | string
    QuoteConfigurationId: number | string
  }[]
  QuoteBenchmarkId?: number | string
  PricePublisher?: number | string
  PricePublisherId?: number | string
}
