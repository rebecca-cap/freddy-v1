import { MetadataListResponseItem } from '@api/globalTypes'

export interface Product {
  ProductId: number
  Name: string
  Status: string
  Abbreviation: string
  IsActive: boolean
}

export interface Location {
  LocationId: number
  Name: string
  LocationType: string
  Status: string
  Abbreviation: string
  IsActive: boolean
}

export interface RecipientData {
  CounterPartyId: string
  CounterPartyName: string
  SiteIds: string[]
}

export interface MetadataData {
  Products: MetadataListResponseItem[]
  Locations: MetadataListResponseItem[]
  QuoteConfigurations: MetadataListResponseItem[]
  CounterParties: MetadataListResponseItem[]
  StatusCodeValues: MetadataListResponseItem[]
}

export interface SubscriptionData {
  PriceNotificationSubscriptionId: number
  QuoteConfigurationId: number
  CounterPartyId: number
  CounterPartyName: string
  ProductIds: number[]
  LocationIds: number[]
  CreatedDate: Date
  ModifiedDate: Date
  IsActive: boolean
}
