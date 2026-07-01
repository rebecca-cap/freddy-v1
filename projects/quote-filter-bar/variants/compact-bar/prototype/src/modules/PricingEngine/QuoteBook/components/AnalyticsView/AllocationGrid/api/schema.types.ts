export interface AllocationDataResponse {
  Rows: {
    QuoteConfigurationMappingId: number
    AllocationId: number
    AllocationConsignee: string
    AllocationProduct: string
    AllocationTerminal: string
    AllocationName: string
    Monthly: VolumeAllocationData
    Daily: VolumeAllocationData
    Weekly: VolumeAllocationData
  }[]
}

export interface VolumeAllocationData {
  // Used by all
  Forecast: number
  AllocationPercentageAdjustment: number
  Liftings: number
  AllocationStatus: string

  // Used by Monthly and Weekly
  ToDateForecast?: number
  ToDatePercentageOfForecast?: number

  // Used by Daily and Weekly
  ScaledAllocationAmount?: number
  Remaining?: number
}
