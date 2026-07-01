export interface ContractMeasurementResopnse {
  contracts: Contract[]
}

export interface Contract {
  contract_id: string
  effective_from: string // Date
  effective_to: string // Date
  external_company: string
  internal_company: string
  ratability: number
  volume: number
  price_comparison: PriceComparison
  deltas: Deltas
}

export interface Deltas {
  header: string[]
  details: Detail[]
}

export interface Detail {
  terminal: string
  product: string
  deltas: Delta[]
}

export interface Delta {
  name: string
  value: number
}

export interface PriceComparison {
  is_better: boolean
  under_count: number
  under_average: number
  over_count: number
  over_average: number
}

export interface MeasurementBreakdownResponse {
  contract_performance: ContractPerformance
  grid: Grid
}

export interface ContractPerformance {
  has_volume: boolean
  graph_data: GraphDatum[]
  ratable_volume: number
  price_delta_max: number
  price_delta_min: number
  volume_max: number
}

export interface GraphDatum {
  volume: number
  price_delta: number
  date: string // date string
}

export interface Grid {
  has_volume: boolean
  rows: Row[]
}

export interface Row {
  date: string // Date
  contracted_volume: number
  lifted_volume: number
  savings: number
  deltas: Delta[]
}
