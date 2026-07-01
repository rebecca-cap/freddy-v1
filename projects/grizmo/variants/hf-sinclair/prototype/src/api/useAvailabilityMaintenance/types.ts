export interface AvailableVolumeRow {
  LocationGroup: string
  ProductGroup: string
  AvailableVolumeId: number
  AvailableVolumeName: string
  LocationName: string
  MarketPlatformInstrumentInstrumentName: string
  ProductName: string
  TradeEntrySetupId: number
}

export interface VolumeGroups {
  AvailableVolumeList: ItemDetails[]
}

export interface ItemDetails {
  Text: string
  Value: string
  GroupingValue: string | null
  AllocationId: number | null
}

export interface VolumeSetupPayload {
  AvailableVolumeId: number
  AvailableVolumeName: string
  LocationName: string
  MarketPlatformInstrumentInstrumentName: string
  ProductName: string
  TradeEntrySetupId: number
}

export interface VolumeSetupGroupPayload {
  AvailableVolumeId: number
  AvailableVolumeName: string | null
  IsActive: boolean
  AllocationId: number | null
}

export interface UnmappedAllocationsResp {
  AllocationConsigneeId: number
  AllocationId: number
  AllocationName: string
  AllocationProductId: number
  AllocationTerminalId: number
  AllocationVolumes: [
    {
      AllocationEndDateTime: Date
      AllocationStartDateTime: Date
      AllocationTimezone: string
      AllocationUom: string
      AllocationVolumeId: number
      AllocationVolumeSourceId: string
      CarryForward: boolean
      CreatedDateTime: Date
      GPOAllowance: number
      GPOAmount: number
      GPORemaining: number
      LiftedAmount: number
      MaxAvailable: number
      MaxAvailableDate: Date
      MaxAvailableRefreshFrequencyTypeCvId: number
      MaxAvailableRefreshFrequencyTypeDisplay: string
      MaxAvailableRefreshFrequencyTypeMeaning: string
      NextRefreshDateTime: Date
      RefreshAmount: number
      RefreshDays: number
      RefreshFrequencyTypeCvId: number
      RefreshFrequencyTypeDisplay: string
      RefreshFrequencyTypeMeaning: string
      RemainingAmount: number
      ScaledStartAmount: number
      ScalePercent: number
      StartAmount: number
      UpdatedDateTime: Date
    }
  ]
  CreatedDateTime: Date
  IsActive: boolean
  SupplierCounterParty: string
  SupplierCounterPartyId: number
  UpdatedDateTime: Date
}
