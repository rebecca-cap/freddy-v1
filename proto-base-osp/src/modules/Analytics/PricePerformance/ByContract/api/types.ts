import { Metrics } from '@modules/Analytics/PricePerformance/components/types'

export interface ByContractGridRow {
  TradeEntryId: number
  StartDate: string | Date
  EndDate: string | Date
  ExternalCounterPartyId: number
  ExternalCounterParty: string
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
}
export interface ByContractGraphRow {
  TradeEntryId: number
  StartDate: string | Date
  EndDate: string | Date
  ExternalCounterPartyId: number
  ExternalCounterParty: string
  Date: string
  DateValue: string | Date
  CellMetrics: Metrics
  SystemAverageMetrics: Metrics
}
export interface ContractWithPriceLocationGridRow {
  TradeEntryId: number
  Location: string
  LocationId: number
  Product: string
  ProductId: number
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
}
export interface ContractWithPriceLocationGraphRow {
  TradeEntryId: number
  Location: string
  LocationId: number
  Product: string
  ProductId: number
  Date: string
  DateValue: string | Date
  CellMetrics: Metrics
  SystemAverageMetrics: Metrics
}
export interface PricePerformanceByContractResponse {
  GraphRows: ByContractGraphRow[]
  GridRows: ByContractGridRow[]
  ContractPricePerformanceWithPriceLocation: {
    GraphRows: ContractWithPriceLocationGraphRow[]
    GridRows: ContractWithPriceLocationGridRow[]
    HasData: boolean
  }
  HasData: boolean
}
