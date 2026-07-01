export interface AppliedAllocationStatusReportRow {
  OrderId: number
  TradeEntryDetailId: number
  OrderCreatedDateTime: string
  ProductName: string
  ToLocationName: string
  MarketPlatformInstrumentName: string
  Quantity: number
  TradeEntryFromDateTime: string
  TradeEntryToDateTime: string
  OrderStatusCodeValueMeaning: string
  ExternalCounterPartyName: string
  AllocationType: string
  AppliedStatusCvId: number
  AppliedDateTime: string
  AppliedStatusMessage: string
}

export type AppliedAllocationStatusReportResponse = AppliedAllocationStatusReportRow[]
