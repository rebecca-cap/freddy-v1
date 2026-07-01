import { Metrics } from '@modules/Analytics/PricePerformance/components/types'

export interface ByCustomerGraphRow {
  Date: string
  DateValue: Date
  CellMetrics: Metrics
  SystemAverageMetrics: Metrics
  CounterParty: string
  CounterPartyId: number
}
export interface ByCustomerGridRow {
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
  CounterParty: string
  CounterPartyId: number
}

export interface PricePerformanceByCustomerResponse {
  GraphRows: ByCustomerGraphRow[]
  GridRows: ByCustomerGridRow[]
  HasData: boolean
}
