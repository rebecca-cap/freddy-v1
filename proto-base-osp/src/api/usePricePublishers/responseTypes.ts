export interface PricePublisherGet {
  TotalRecords: number
  Data: PricePublisherData[]
  Query: { Count: number | null; Offset: number | null }
  Validations: any[]
}

interface PricePublisherData {
  Abbreviation: string
  IsActive: boolean
  Name: string
  PricePublisherId: string
  PricePublisherTypeCvId: number | null
  SourceExtractedDateTime: Date | null
  SourceId: number | null
  SourceSystemId: number | null
  SourceVerb?: string
}
