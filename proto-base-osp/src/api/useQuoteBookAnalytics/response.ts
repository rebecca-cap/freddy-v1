export interface TrendDataDTO {
  Date: string
  DateValue?: Date
  VolumeLifted: number
  PriceDelta: number
}
export interface PriceDeltaRangeDTO {
  Min: number
  Max: number
}
export interface HistogramDataDTO {
  PriceDelta: number
  VolumeLifted: number
}
export interface QuickMetricsDTO {
  AverageDelta: number
  AverageLifting: number
  AverageMargin: number
}
export interface AvailableBenchmarkDTO {
  BenchmarkId: number
  BenchmarkName: string
}
export interface BenchmarkSelectionDTO {
  RequestedBenchmarkId: number
  ComparisonTarget: string
  AvailableBenchmarks: AvailableBenchmarkDTO[]
}
export interface LiftingsToBenchmarkResponse {
  HasData: boolean
  TrendData: TrendDataDTO[]
  PriceDeltaRange: PriceDeltaRangeDTO
  MaxVolumeLifted: number
  HistogramData: HistogramDataDTO[]
  AverageLiftings: number
  QuickMetrics: QuickMetricsDTO
  BenchmarkSelection: BenchmarkSelectionDTO
}
export interface GraphDataDTO {
  Date: string
  DateValue: Date
  Volume: number
  Margin: number
}
export interface DetailDataDTO {
  Date: string
  DateValue: Date
  Margin: number
  Volume: number
}
export interface LiftingVsMarginResponseDTO {
  GraphData: GraphDataDTO[]
  Details: DetailDataDTO[]
  HasData: boolean
}
export type AgainstType = 'Liftings' | 'Margin' | 'Profit'
export type AnalyticsType = 'Customer' | 'LiftingVsBenchmark' | 'LiftingVsMargin' | 'Competitor' | 'Allocation'
