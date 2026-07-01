export interface Validation {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: 'Info' | 'Warning' | 'Error'
}

export interface MetadataListResponseItem {
  Text: string
  Value: string
  GroupingValue: null | string
  Label?: string
}

export interface APIResponse<T> {
  TotalRecords?: number
  Data: T
  Query: string
  Validations: Validation[]
}

export interface RecordCounts {
  Create: number
  Read: number
  Update: number
  Delete: number
}
