import { Metrics } from '@modules/Analytics/PricePerformance/components/types'

export interface ByChannelGraphRow {
  Date: string
  DateValue: Date
  CellMetrics: Metrics
  SystemAverageMetrics: Metrics
  Channel: string
  ChannelId: number
}
export interface ByChannelGridRow {
  ProfitTrend: number[]
  LiftingTrend: number[]
  MarginTrend: number[]
  TotalLifted: number
  TotalProfit: number
  AverageMargin: number
  SystemAverageMargin: number
  SystemAverageLiftings: number
  SystemAverageProfit: number
  MarginDiffFromAverage: number
  ProfitDiffFromAverage: number
  LiftingsDiffFromAverage: number
  Channel: string
  ChannelId: number
}

export interface ByChannelCustomerGraphRow extends ByChannelGraphRow {
  CounterParty: string
  CounterPartyId: number
}
export interface ByChannelCustomerGridRow extends ByChannelGridRow {
  CounterParty: string
  CounterPartyId: number
}
export interface PricePerformanceByChannelResponse {
  GraphRows: ByChannelGraphRow[]
  GridRows: ByChannelGridRow[]
  CustomerPricePerformanceWithChannel: {
    GraphRows: ByChannelCustomerGraphRow[]
    GridRows: ByChannelCustomerGridRow[]
  }
  HasData: boolean
}
