import { GridViewResponse } from '@hooks/useGridViewManager/api/types.schema'

export interface GetUserInfoResponse {
  Data: Data
  Query: object
  Validations: Validation[]
}

export interface Data {
  UserDefinedGridViews: GridViewResponse[]
  CredentialId: number
  ColleagueId: number
  Email: string
  First: string
  Last: string
  MobilePhone: string
  OfficePhone: string
  Fax: string
  CounterPartyDisplay: string
  CounterPartyId: string
  CounterPartyDomain: string
  PreferredContactMethod: string
  PreferredContactMethodMeaning: string
  AllowedImpersonationModes: string[]
  Permissions: string[]
}

export interface Validation {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: string
}

export type SecurityContext = {
  CredentialId: number
  CurrentCounterPartyId: number
  Roles: string[]
  ImpersonationModeMeaning: string
  ImpersonationModeDisplay: string
  CurrentPortalId: number
  SourceSystemIds: number[]
  CustomValues: any
  InternalCounterPartyIds: any
  NeedsToAcceptTermsAndConditions: boolean
  TermsOfUseUrl: string
  PrivacyPolicyUrl: string
}
