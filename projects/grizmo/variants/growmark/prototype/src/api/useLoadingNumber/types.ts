export interface LoadingNumberOverviewResponse {
  TotalRecords: number
  Data: LoadingNumberOverviewData[]
}

export interface LoadingNumberOverviewData {
  CarrierCounterPartyId: number
  CreatedDateTime: Date
  CustomerCounterPartyId: number | null
  DestinationLocationId: number
  Display: string
  ExternalReferenceNumber: string
  IsActive: boolean
  LoadNumber: string
  LoadingNumberId: number
  MarketPlatformInstrumentId: number
  Notes: string
  OriginLocationId: number
  ProductId: number
  SourceIdentifier: SourceInfo
  SourceIdentifierId: number
  SupplierCounterPartyId: number
  TaxLocationId: number
  TradeTypeCvId: number
  UpdatedDateTime: Date
}

export interface SourceInfo {
  SourceId?: number
  SourceIdString?: string
  SourceSystemId?: number
}

export interface LoadingNumberMetadataResponse {
  Data: LoadingNumberMetadata
  Query: null
  Validations: any[]
}

export interface LoadingNumberMetadata {
  Products: ListItem[]
  Locations: ListItem[]
  CounterParties: ListItem[]
  TradeTypes: ListItem[]
  MarketPlatformInstruments: ListItem[]
  AllowProtectedFieldUpdates: boolean
}

export interface ListItem {
  Text: string
  Value: string
  GroupingValue: null
}
