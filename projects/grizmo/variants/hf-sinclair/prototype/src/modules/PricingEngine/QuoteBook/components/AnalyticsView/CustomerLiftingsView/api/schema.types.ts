export interface CustomerLiftingsResponse {
  Rows: CustomerLiftingRow[]
  Totals: CustomerLiftingTotals
}

export interface CustomerLiftingRow {
  CounterPartyId: number
  CounterParty: string

  CounterPartyTotalQuantity: number
  CounterPartyAvgLiftingSize: number
  SharePercentage: number
  AvgBoLsPerWeek: number

  AvgDeltaToQuote: number
  AvgInvoicedMargin: number
  AvgQuotedMargin: number

  AvgMarginLostToDiscount: number
  AvgPercentDiscount: number

  TotalProfitsLostToDiscount: number
}

export interface CustomerLiftingTotals {
  TotalVolume: number
  StrategyDelta: number
  TotalDiscounted: number
  Customers: number
}
