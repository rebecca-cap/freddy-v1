export interface IBaseResponse<T> {
  Data: T
  Validations?: Validation[]
  Query: string
  TotalRecords: number
}

export interface Validation {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: string
}

export type ContractGetAllResponse = IBaseResponse<ContractData[]>
export type GetDetailValuationDataResponse = IBaseResponse<ValuationData[]>
export type MergedContractDetailData = ContractReportDetail & ValuationData

interface ValuationData {
  TradeEntryDetailId: number
  PriceId: number
  EffectiveFromDate: string // Date
  EffectiveToDate: string // Date
  PriceStatus: string
  FormulaResultId: number
  PriceStatusDisplay: string
  PriceInstrumentId: number
  Price: number
}

interface ContractData {
  CreatedByCredentialId: number
  CreatedByEmail: string
  Description: string
  Comments: string
  CreatedDateTime: Date
  Details: ContractReportDetail[]
  ExternalCounterPartyId: number
  ExternalCounterPartyName: string
  FromDateTime: Date
  InternalCounterPartyId: number
  InternalCounterPartyName?: string
  OrderStatus?: string
  OrderStatusCvId: number
  ToDateTime: Date
  TradeEntryDateTime: Date
  TradeEntryId: number
  TradeInstrument?: string
  TradeInstrumentId: number
  Type?: string
  TypeCvId: number
  TotalVolume: number
  Book?: string
}

export interface ContractReportDetail {
  TradeEntryDetailId: number
  Book?: string
  BookId?: number
  FromDateTime: Date
  FromLocationId?: number
  FromLocationName?: string
  ProductId: number
  ProductName: string
  Quantities: Quantity[]
  Quantity: number | null
  ToDateTime: Date
  ToLocationId?: number
  ToLocationName?: string
}

export interface Quantity {
  Quantity: number
  QuantityDateTime?: string
  IsActive?: boolean
  TradeEntryQuantityId: number | null
}
