export type QuoteHistoryResponse = {
  Data: { Rows?: QuoteHistoryRow[] | null }
}
export type Benchmark = {
  BenchmarkId: number
  Value: number
  Change: number
}

export type QuoteHistoryRow = {
  StartDate: Date | string
  EndDate: Date | string
  WeightedCost: number
  LastCost: number
  LastPrice: number
  LastDiff: number
  PriceChange: number
  DiffChange: number
  Liftings: number
  LiftingsChange: number
  Profit: number
  Margin: number
  ProfitChange: number
  IsMidday: boolean
  Benchmarks: Benchmark[]
}
