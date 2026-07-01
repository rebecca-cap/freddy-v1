import { MetadataListResponseItem } from '@api/globalTypes'

export interface AllocationProductAssociation {
  AllocationProductAssociationId: number
  ProductId: number
}

export interface ReferencesProduct {
  AllocationProductAssociations: AllocationProductAssociation[]
  AllocationProductId: number
  Display: string
  IdentifierData: string
}

export interface AllocationTerminalAssociation {
  AllocationTerminalAssociationId: number
  AllocationTerminalId: number
  LocationId: number
}

export interface ReferencesTerminal {
  AllocationTerminalAssociations: AllocationTerminalAssociation[]
  AllocationTerminalId: number
  Display: string
  IdentifierData: string
}

export interface AllocationConsigneeAssociation {
  AllocationConsigneeAssociationId: number
  CounterPartyId: number
}

export interface ReferencesConsignee {
  AllocationConsigneeAssociations: AllocationConsigneeAssociation[]
  AllocationConsigneeId: number
  Display: string
  IdentifierData: string
}

export interface Validation {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: string
}

export interface AllocationAssociationsReferencesResponseData {
  Data: {
    Products: ReferencesProduct[]
    Terminals: ReferencesTerminal[]
    Consignees: ReferencesConsignee[]
  }
  Query: string
  Validations: Validation[]
}

export interface ReferenceMetadataProduct {
  Text: string
  Value: string
  GroupingValue: string
}

export interface ReferenceMetadataLocation {
  Text: string
  Value: string
  GroupingValue: string
}

export interface ReferenceMetadataCounterParty {
  Text: string
  Value: string
  GroupingValue: string
}

export interface AllocationAssociationsReferencesMetadata {
  Data: {
    Products: ReferenceMetadataProduct[]
    Locations: ReferenceMetadataLocation[]
    CounterParties: ReferenceMetadataCounterParty[]
  }
  Query: string
  Validations: Validation[]
}

export interface AllocationAssociationReferencesSync {
  Products: ReferencesProduct[]
  Terminals: ReferencesTerminal[]
  Consignees: ReferencesConsignee[]
}

export interface CounterPartySetupOption {
  AuthorizationAllocationSetup: {
    TradeEntrySetupId: number
    ProductId: number
    Product: string
    LocationId: number
    Location: string
    MarketPlatformInstrumentId: number
    MarketPlatformInstrument: string
    IsActive: boolean
    TradeTypeCvId: number
    TradeType: string
  }
  CounterPartyId: number
  CounterPartyName: string
  LinkedAllocationId: number
  AuthorizationAllocationLinkId: number
  RefreshFrequencyTypeCvId: number
}

export interface AllocationVolume {
  AllocationEndDateTime: string
  AllocationStartDateTime: string
  AllocationTimezone: string
  AllocationUom: string
  AllocationVolumeId: number
  AllocationVolumeSourceId: string
  CarryForward: boolean
  CreatedDateTime: string
  GPOAllowance: number
  GPOAmount: number
  GPORemaining: number
  LiftedAmount: number
  MaxAvailable: number
  MaxAvailableDate: string
  MaxAvailableRefreshFrequencyTypeCvId: number
  MaxAvailableRefreshFrequencyTypeDisplay: string
  MaxAvailableRefreshFrequencyTypeMeaning: string
  NextRefreshDateTime: string
  RefreshAmount: number
  RefreshDays: number
  RefreshFrequencyTypeCvId: number
  RefreshFrequencyTypeDisplay: string
  RefreshFrequencyTypeMeaning: string
  RemainingAmount: number
  ScaledStartAmount: number
  ScalePercent: number
  StartAmount: number
  UpdatedDateTime: string
}

export interface Allocation {
  AllocationConsigneeId: number
  AllocationId: number
  AllocationName: string
  AllocationProductId: number
  AllocationTerminalId: number
  AllocationVolumes: AllocationVolume[]
  CreatedDateTime: string
  IsActive: boolean
  SupplierCounterParty: string
  SupplierCounterPartyId: number
  UpdatedDateTime: string
}

export interface AllocationManagementResponse {
  CounterPartySetupOptions: CounterPartySetupOption[]
  Allocations: Allocation[]
}

export interface Link {
  CounterPartyId: number
  TradeEntrySetupId: number
  AllocationId: number
  RefreshFrequencyTypeCvId: number
}

export interface UpsertLinksPayload {
  Links: Link[]
}

export interface UpsertLinksResponse {
  ActionStatus: string
  RecordCounts: {
    Create: number
    Read: number
    Update: number
    Delete: number
  }
  TotalRecords: number
  Data: Link[]
  Query: string
  Validations: Validation[]
}

export interface AuthorizationAllocationUnlinkPayload {
  AuthorizationAllocationLinkIds: number[]
}

export interface AllocationAssociationMetadataResponse {
  Data: {
    FrequencyTypeList: MetadataListResponseItem[]
  }
  Query: string
  Validations: Validation[]
}
