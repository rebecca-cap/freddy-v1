import { APIResponse, RecordCounts } from '@api/globalTypes'

export interface TradeEntrySetupVolumeThreshold {
  InstrumentName: string
  IsActive: boolean
  LocationName: string
  MaximumVolume: number
  MinimumVolume: number
  MinimumVolumeIncrement: number
  MonthlyMaximumVolume: number
  MonthlyMinimumVolume: number
  ProductName: string
  TradeEntrySetupId: number
  WarningVolumeThreshold: number
}

export type ActionStatus = 'Info' | 'Success' | 'Warning' | 'Error'

export type ReadTradeEntrySetupVolumeThresholdsResponse = APIResponse<TradeEntrySetupVolumeThreshold[]>

export type UpdateTradeEntrySetupVolumeThresholdsRequest = TradeEntrySetupVolumeThreshold[]

export interface UpdateTradeEntrySetupVolumeThresholdsResponse extends APIResponse<TradeEntrySetupVolumeThreshold[]> {
  ActionStatus: ActionStatus
  RecordCounts: RecordCounts
}
