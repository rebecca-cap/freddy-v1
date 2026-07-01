import { RecordCounts, Validation } from '@api/globalTypes'

export interface CounterPartyOverviewResponse {
  TotalRecords: number
  Data: CounterPartyOverviewData[]
  Query: string
  Validations: Validation[]
}

export interface CounterPartyOverviewData {
  CounterPartyId: number | undefined
  Name: string
  Abbreviation: string
  HasCustomerPortal: boolean
  CounterpartyCategoryCvId: number
  PrimaryInternalCounterpartyId: number
  CreditStatusOverrideCvId?: number
  IsActive: boolean
  SourceInfo: SourceInfo | null
  HasTradeRelationship: boolean
  MappedProductIds: number[]
  MappedLocationIds: number[]
  SupplierEODPricePublicationTime: string
}

export interface SourceInfo {
  SourceSystemId?: string
  SourceId?: string
  SourceIdString?: string
}

export interface CounterPartyMetadataResponse {
  Data: CounterPartyMetadata
  Query: null
  Validations: Validation[]
}

export interface CounterPartyMetadata {
  IsSingleSourceSystem: boolean
  CounterPartyCategoryList: ListItem[]
  CreditStatusList: ListItem[]
  InternalCounterPartyList: ListItem[]
  EditableSources: EditableSource[]
  LocationList: ListItem[]
  ProductList: ListItem[]
  SupplierEODPricePublicationTimes: ListItem[]
}

export interface CounterPartyDistributionLists {
  CounterPartyId: number
  InternalColleagueList: ListItem[]
  ExternalColleagueList: ListItem[]
  MarketPlatformInternalColleagueIds: number[]
  MarketPlatformExternalColleagueIds: number[]
  PriceNotificationInternalColleagueIds: number[]
  PriceNotificationExternalColleagueIds: number[]
}

export interface ListItem {
  Text: string
  Value: string
  GroupingValue: string | null
}

export interface EditableSource extends ListItem {
  HasSourceId: boolean
  HasSourceIdString: boolean
}

export interface CreateOrUpdateResponse {
  ActionStatus: 'Success' | 'Error' | 'Info' | string
  RecordCounts: RecordCounts
  TotalRecords: number
  Data: CounterPartyOverviewData[]
  Query: string
  Validations: Validation[]
}

export type CounterPartyUpsert = Partial<CounterPartyOverviewData>
