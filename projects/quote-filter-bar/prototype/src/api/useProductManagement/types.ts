export interface SourceInfo {
  SourceSystemId: number
  SourceId: number
  SourceIdString: string
}

export interface ProductReportingAttribute {
  Name: string
  Value: string
}

export interface ProductOverviewData {
  ProductId: number
  Name: string
  Abbreviation: string
  ProductTypeCvId: number
  ProductGroupId: number
  AllowWeightedDistribution: boolean
  NotSoldSeparately: boolean
  IsTradingProduct: boolean
  MarketPlatformAdditionalProducts: number[]
  SourceInfo: SourceInfo
  IsActive: boolean
  Commodity: string
  ProductGroup: string
  Grade: string
  ProductReportingAttributes: ProductReportingAttribute[]
}

export interface ProductOverviewResponse {
  TotalRecords: number
  Data: ProductOverviewData[]
  Query: string
  Validations: {
    PropertyName: string
    Message: string
    Category: string
    Identifier: number
    Severity: 'Info' | 'Warning' | 'Error'
  }[]
}
