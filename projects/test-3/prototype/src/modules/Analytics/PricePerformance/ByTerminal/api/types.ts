import { Metrics } from '@modules/Analytics/PricePerformance/components/types'

export interface ByTerminalGraphRow {
  Date: string
  DateValue: Date
  CellMetrics: Metrics
  SystemAverageMetrics: Metrics
  Location: string
  LocationId: number
}
export interface ByTerminalGridRow {
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
  Location: string
  LocationId: number
}
export interface PricePerformanceByTerminalResponse {
  GraphRows: ByTerminalGraphRow[]
  GridRows: ByTerminalGridRow[]
  HasData: boolean
}
