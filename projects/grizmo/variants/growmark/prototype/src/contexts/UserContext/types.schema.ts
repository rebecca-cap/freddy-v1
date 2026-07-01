import { Validation } from '@api/globalTypes'

export interface OrderEntryResponse {
  TotalRecords: number
  Data: OrderEntryResponseDatum[]
  Validations: Validation[]
}

export interface OrderEntryResponseDatum {
  Email: string
  ColleagueId: number
  CredentialId: number | null
  CounterPartyId: number
  CounterPartyName: string
  FirstName: string
  LastName: string
  PreferredContactMethodCvId: number
  IsActive: boolean
  IsApproved: boolean
  IdentityProviderId: number
  IsLocked: boolean
  ExternalId: null
  IsOptedOutOfMarketingNotifications: boolean | null
  Roles: CounterPartyAssociation[]
  CounterPartyAssociations: CounterPartyAssociation[]
  QuoteConfigurationMappingGroups: CounterPartyAssociation[]
}

export interface CounterPartyAssociation {
  Id: number
  Name: string
}

export interface OrderEntryMetadataResponse {
  Data: OrderEntryMetadataData
  Validations: Validation[]
}

export interface OrderEntryMetadataData {
  InternalRolesList: ContactMethodsList[]
  ExternalRolesList: ContactMethodsList[]
  QuoteConfigurationMappingGroups: ContactMethodsList[]
  CounterPartyList: ContactMethodsList[]
  IdentityProvidersList: ContactMethodsList[]
  ContactMethodsList: ContactMethodsList[]
}

export interface ContactMethodsList {
  Text: string
  Value: string
  GroupingValue: null | string | number
  IsInternal?: boolean
}

export interface OrderUpsertResponse {
  TotalRecords: number
  Data: OrderUpsertResponseDatum[]
  Validations: Validation[]
}

export interface OrderUpsertResponseDatum {
  Email: string
  ColleagueId: number
  CredentialId: number
  CounterPartyId: number
  CounterPartyName: string
  FirstName: string
  LastName: string
  PreferredContactMethodCvId: number
  IsActive: boolean
  IsApproved: boolean
  IdentityProviderId: number
  IsLocked: boolean
  ExternalId: null
  IsOptedOutOfMarketingNotifications: boolean | null
  Roles: Role[]
  CounterPartyAssociations: any[]
  QuoteConfigurationMappingGroups: any[]
}

export interface Role {
  Id: number
  Name: string
}
