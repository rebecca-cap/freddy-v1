export interface PriceFileLineItemsReportRow {
  DtnPriceFileImportLineItemId: number
  TransmissionId: string
  SupplierId: string
  TerminalId: string
  ProductId: string
  ImportedDateTime: Date
  PostedPrice: number
  AdjustedPrice: number
  LastProcessedDateTime: Date
  ParsedEffectiveStartDate: Date
}

export interface PriceFileLineItemsReportResponse {
  TotalRecords: number
  Data: PriceFileLineItemsReportRow[]
  Validations: Validation[]
}

export interface Validation {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: string
}
