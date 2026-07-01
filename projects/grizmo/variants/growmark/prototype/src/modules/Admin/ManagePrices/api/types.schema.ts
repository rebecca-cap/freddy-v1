import { MetadataListResponseItem } from '@api/globalTypes'

export interface Validation {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: string
}

export interface PriceUploadConfiguration {
  UploadType: string
  IdentifierType: string
  RequireAllConfiguredPriceTypes: boolean
  ValidateConfiguredPriceTypes: boolean
}

export interface PricePoints {
  [key: string]: number
}
export interface PriceModel {
  RowIdentifier: number
  SheetIdentifier: string | null
  PriceInstrumentId: number
  InstrumentName: string
  EffectiveFromDateTime: string | null
  EffectiveToDateTime: string | null
  TradePeriodFromDateTime: string | null
  TradePeriodToDateTime: string | null
  IsEstimate: boolean
  ProductId: number
  ProductName: string
  LocationId: number
  LocationName: string
  NewPoints: PricePoints
  ExistingPoints: PricePoints
  HasValidationErrors: boolean
  ValidationMessages: string[]
  Strings: any | null
  PriceConflicts: number[]
  PriceConflictCount: number
  IsUnchanged: boolean
  IsUpdate: boolean
  IsConflict: boolean
  IsNew: boolean
}

export interface UploadedModel {
  Model: PriceModel
  Validations: Validation[]
  Row: number
}

export interface SheetValidation {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: string
}

export interface PriceTypeInfo {
  PriceTypeCvId: number
  Display: string
}

export interface ValidationMessageItem {
  Item1: number
  Item2: string
}

export interface PriceUploadData {
  UploadConfiguration: PriceUploadConfiguration
  UniqueId: string
  UploadedModels: UploadedModel[]
  SheetName: string
  SheetValidations: SheetValidation[]
  PriceTypes: PriceTypeInfo[]
  ValidationMessages: ValidationMessageItem[]
  ValidationCount: number
}

export interface PriceUploadResponse {
  TotalRecords: number
  Data: PriceUploadData[]
  Validations: Validation[]
}

export interface PriceSubmitPayload {
  UploadConfiguration: PriceUploadConfiguration
  UniqueId: string
  UploadedModels: UploadedModel[]
  SheetName: string
  SheetValidations: SheetValidation[]
  PriceTypes: PriceTypeInfo[]
}

export interface PriceSubmitResponse {
  ActionStatus: string
  RecordCounts: {
    Create: number
    Read: number
    Update: number
    Delete: number
  }
  TotalRecords: number
  Data: {
    Saved: number
    Updated: number
  }
  Query: string
  Validations: Validation[]
}

export interface PriceMetadataResponse {
  Data: {
    PriceUploadTypeList: MetadataListResponseItem[]
    PricePublisherList: MetadataListResponseItem[]
    CurveIdentifierTypeList: MetadataListResponseItem[]
  }
  Query: string
  Validations: Validation[]
}

export interface TemplateDownloadParams {
  pricePublisherId: number
  curveIdentifierTypeId: string
  priceUploadTypeId: number
}

// Conflict Details API Types
export interface ConflictDetailsRequest {
  CurvePointIds: number[]
}

export interface ConflictPrice {
  PriceType: string
  Value: number
}

export interface ConflictDetailsData {
  CurvePointId: number
  EffectiveFromDateTime: string
  EffectiveToDateTime: string
  Prices: ConflictPrice[]
}

export interface ConflictDetailsResponse {
  TotalRecords: number
  Data: ConflictDetailsData[]
  Query: string
  Validations: Validation[]
}

// Pivoted structure for grid display - price types as columns
export interface ConflictDetailPivoted {
  CurvePointId: number
  EffectiveFromDateTime: string
  EffectiveToDateTime: string
  [priceType: string]: number | string // Dynamic price type columns
}
