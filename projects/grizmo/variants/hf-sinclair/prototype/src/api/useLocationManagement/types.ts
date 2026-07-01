export interface LocationOverviewResponse {
  TotalRecords: number
  Data: LocationOverviewData[]
  Query: string
  Validations: ValidationMessage[]
}

export interface LocationOverviewData {
  LocationId: number
  Name: string
  Abbreviation: string
  LocationTypeCvId: number
  Latitude: number
  Longitude: number
  LocationGroupId: number
  NetOrGross: number
  MarketPlatformAssociatedProducts: number[]
  SourceInfo: SourceInfo
  IsActive: boolean
  Region: string
  Area: string
  LocationReportingAttributes: LocationReportingAttribute[]
}

export interface SourceInfo {
  SourceSystemId: number
  SourceId: number
  SourceIdString: string
}

export interface LocationReportingAttribute {
  Name: string
  Value: string
}

export interface ValidationMessage {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: 'Info' | 'Warning' | 'Error' // adjust if other severities exist
}
