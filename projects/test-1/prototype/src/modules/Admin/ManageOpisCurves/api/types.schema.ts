import { Validation } from '@api/globalTypes'

export interface OpisCurveResponse {
  TotalRecords: number
  Data: OpisCurveItem[]
  Query: string
  Validations: Validation[]
}

export interface OpisCurveItem {
  OPISCurveId: number
  OPISProductId: number
  OPISProductName: string
  CityId: number
  CityName: string
  SupplierId: number
  SupplierName: string
  BenchmarkId: number
  BenchmarkName: string
  Branded: string
  NetOrGross: string
  PriceInstrumentId: number
  ExchangeSymbol: string
}

export interface OpisMetadataResponse {
  ExchangeSymbolList: string[]
}

export interface ActivateOpisCurveRequest {
  OpisCurveIds: number[]
}

export interface UpdateInstrumentSymbolRequest {
  OPISCurveId: number
  ExchangeSymbol: string
}
