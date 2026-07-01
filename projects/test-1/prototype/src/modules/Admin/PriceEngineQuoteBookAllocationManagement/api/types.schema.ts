export type GetAllocationAssociationPayload = {
  QuoteConfigurationIds: number[]
  QuoteConfigurationMappingIds: number[]
  ProductIds: number[]
  LocationIds: number[]
}

export type GetAllocationAssociationsResponse = {
  QuoteConfigurationMappingId: number
  QuoteConfigurationName: string
  Product: string
  ProductId: number
  Location: string
  LocationId: number
  CounterParty: string
  LinkedAllocationIds: {
    AllocationId?: number
    AssociationId?: number
    QuoteConfigurationMappingId?: number
  }[]
}

export type GetAllocationsResponse = {
  AllocationConsignee: string
  AllocationConsigneeId: number
  AllocationId: number
  AllocationName: string
  AllocationProduct: string
  AllocationProductId: number
  AllocationTerminal: string
  AllocationTerminalId: number
  AllocationVolumes: [
    {
      AllocationEndDateTime: string | Date
      AllocationStartDateTime: string | Date
      AllocationTimezone: string
      AllocationUom: string
      AllocationVolumeId: number
      AllocationVolumeSourceId: string
      CarryForward: true
      CreatedDateTime: string | Date
      GPOAllowance: number
      GPOAmount: number
      GPORemaining: number
      LiftedAmount: number
      MaxAvailable: number
      MaxAvailableDate: string | Date
      MaxAvailableRefreshFrequencyTypeCvId: number
      MaxAvailableRefreshFrequencyTypeDisplay: string
      MaxAvailableRefreshFrequencyTypeMeaning: string
      NextRefreshDateTime: string | Date
      RefreshAmount: number
      RefreshDays: number
      RefreshFrequencyTypeCvId: number
      RefreshFrequencyTypeDisplay: string
      RefreshFrequencyTypeMeaning: string
      RemainingAmount: number
      ScaledStartAmount: number
      ScalePercent: number
      StartAmount: number
      Status: string
      UpdatedDateTime: string | Date
    }
  ]
  CreatedDateTime: string | Date
  IsActive: true
  SupplierCounterParty: string
  SupplierCounterPartyId: number
  UpdatedDateTime: string | Date
}

export type UpsertLinksPayload = {
  Links: {
    QuoteRowId: number
    AllocationId: number
  }[]
}

export type DeleteLinksPayload = {
  AllocationAssociationIds: (number | undefined)[]
}
