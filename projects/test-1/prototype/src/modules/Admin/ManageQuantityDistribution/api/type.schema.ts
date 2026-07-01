export interface QuantityDistributionCell {
  ProductId: number
  LocationId: number
  PeriodId: number
  Weight: number | null
  IsChanged?: boolean
}

export interface QuantityDistributionRow {
  Id: string
  ProductId: number
  LocationId: number
  ProductName: string
  LocationName: string
  Cells: QuantityDistributionCell[]
}

export interface QuantityDistributionData {
  Rows: QuantityDistributionRow[]
  PeriodDisplayMappings: Record<string, string>
}

export interface Validation {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: 'Info' | 'Warning' | 'Error'
}

export interface QuantityDistributionResponse {
  Data: QuantityDistributionData
  Query: string
  Validations: Validation[]
}

// Request types for upsert operation
export type QuantityDistributionUpsertRequest = QuantityDistributionCell

export type QuantityDistributionBulkUpsertRequest = QuantityDistributionUpsertRequest[]

// Additional utility types for form handling and API operations
export interface QuantityDistributionFilter {
  productId?: number
  locationId?: number
  productName?: string
  locationName?: string
  periodIds?: number[]
}
