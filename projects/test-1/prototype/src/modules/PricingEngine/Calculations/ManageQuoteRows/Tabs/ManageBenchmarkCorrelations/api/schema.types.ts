import { Validation } from '@api/globalTypes'

export type Benchmark = {
  CorrelatedCalculationId: number
  CorrelationCategoryCodeValueId: number
  CorrelationCategoryCodeValueMeaning: string
  CreatedDateTime: string
  FormulaString: string
  IsActive: boolean
  Name: string
}

export type CorrelatedCalculationAssociation = {
  CorrelatedCalculation: Benchmark
  CorrelationCategoryCvId: number
}

export type BenchmarkCorrelation = {
  CompetitorBenchmark: Benchmark
  SpotMarketBenchmark: Benchmark
  RackAverageBenchmark: Benchmark
  RackLowBenchmark: Benchmark
  CorrelatedCalculationAssociations: CorrelatedCalculationAssociation[]
  GroupName: string
  LocationId: number
  LocationName: string
  PricePeriodStartOffset: string
  ProductId: number
  ProductName: string
  QuoteConfigurationDisplayName: string
  QuoteConfigurationId: number
  QuoteConfigurationMappingId: number
}

export type BenchmarkCorrelationsResponse = {
  TotalRecords: number
  Data: BenchmarkCorrelation[]
  Query: string
  Validations: Validation[]
}

export type BenchmarkMetadataPricePublisher = {
  Text: string
  Value: string
  GroupingValue: string
}

export type BenchmarkMetadataCounterParty = {
  Text: string
  Value: string
  GroupingValue: string
}

export type BenchmarkMetadataBenchmarkItem = {
  CorrelatedCalculationId: number
  CorrelationCategoryCodeValueMeaning: string
  CorrelationCategoryCvId: number
  CreatedDateTime: string
  FormulaString: string
  IsActive: boolean
  Name: string
}

export type BenchmarkMetadataData = {
  PricePublishers: BenchmarkMetadataPricePublisher[]
  CounterParties: BenchmarkMetadataCounterParty[]
  SpotMarketBenchmarks: BenchmarkMetadataBenchmarkItem[]
  CompetitorBenchmarks: BenchmarkMetadataBenchmarkItem[]
  RackLowBenchmarks: BenchmarkMetadataBenchmarkItem[]
  RackAverageBenchmarks: BenchmarkMetadataBenchmarkItem[]
}

export type BenchmarkMetadataResponse = {
  Data: BenchmarkMetadataData
  Query: string
  Validations: Validation[]
}

export type CreateCorrelatedAssociationRequest = {
  QuoteConfigurationMappingId: number
  CorrelatedBenchmarkIds: number[]
}

export type CreateCorrelatedAssociationsResponse = {
  TotalRecords: number
  Data: BenchmarkCorrelation[]
  Query: string
  Validations: Validation[]
  message: string
}

export type CreateCorrelatedAssociationRequestPayload = CreateCorrelatedAssociationRequest[]

export const benchmarkKeyMap: Record<BenchmarkTypes, string> = {
  Spot: 'SpotMarketBenchmark',
  'Rack Low': 'RackLowBenchmark',
  'Rack Average': 'RackAverageBenchmark',
  Competitor: 'CompetitorBenchmark',
}

export type BenchmarkKey = (typeof benchmarkKeyMap)[keyof typeof benchmarkKeyMap]
export const benchmarkKeys: BenchmarkKey[] = Object.values(benchmarkKeyMap)

export type BenchmarkTypes = 'Spot' | 'Rack Low' | 'Rack Average' | 'Competitor'
export type CompetitorTypes = 'Multiple' | 'Single'
export type RackTypes = 'Rack Low' | 'Rack Average'
export type BenchmarkSubTypes = RackTypes | CompetitorTypes | undefined

export type LatestMeasurement = {
  Benchmark: Benchmark
  Measurement: number
  MeasurementDateTime: string
}

export type LatestMeasurementsResponse = {
  TotalRecords: number
  Data: LatestMeasurement[]
  Query: string
  Validations: Validation[]
}

// Core data types for the correlation chart
export type BenchmarkCorrelationDataPoint = {
  x: number // benchmark price delta
  y: number // volume per delta
  BenchmarkName?: string
}

export type BenchmarkCorrelationLine = {
  Slope: number
  Intercept: number
  RSquared: number
  Correlation: number
  STDError: number
  PValue: number
  BOLCount: number
  DaysIncluded: number
  OutliersRemoved: number
  MissingPrices: number
}

export type BenchmarkCorrelationData = {
  Benchmark: Benchmark
  DataPoints: BenchmarkCorrelationDataPoint[]
  BestFitLine: BenchmarkCorrelationLine
}

export type BenchmarkCorrelationResponse = {
  Data: BenchmarkCorrelationData
  Query: string
  Validations: Validation[]
}

export type BenchmarkCorrelationLatestMeasurementsAPIResponse = {
  TotalRecords: number
  Data: BenchmarkCorrelationLatestMeasurementsData[]
  Query: string
  Validations: Validation[]
}

export type BenchmarkCorrelationLatestMeasurementsData = {
  RSquared: number
  RMSE: number
  NumberOfSegments: number
  NumberOfDataPoints: number
  TotalVolume: number
  MinimumPriceDelta: number
  MaximumPriceDelta: number
  VolumesWithoutPricing: number
  VolumesWithoutValuation: number
  ValuationsMissingPricing: number
  DaysInRegression: number
  PValue: number
  StandardError: number
  OutliersRemoved: number
  StartDate: string
  EndDate: string
  SegmentData: SegmentData[]
  ChartPoints: ChartPointData[]
  RValue: number
  CorrelatedCalculationId: number
  QuoteConfigurationMappingId: number
  CorrelationCategoryCvId: number
  MeasurementValidations: Validation[]
}

export type ChartPointData = {
  XValue: number
  YValue: number
  Weight: number
  CounterPartyCount: number
  LiftingCount: number
}

export type SegmentData = {
  CorrelationDegree: number
  StructuredSegmentData: StructuredSegmentData
}

export type StructuredSegmentData = {
  StartX: number
  EndX: number
  Slope: number
  Intercept: number
  Equation: string
  SlopePValue: number
  CorrelationStandardError: number
}
