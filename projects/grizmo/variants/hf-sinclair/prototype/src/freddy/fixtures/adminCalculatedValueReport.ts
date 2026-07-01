// Freddy mock fixture — fictional
// CalculatedPriceReport metadata + secondary breakdown.
// Note: ReadCalculatedValues is owned by the existing calculatedValueReport.ts (T7).

export const adminCalculatedValueReportMetadataFixture = {
  TradeTypeList: [
    { Text: 'Forward', Value: '40001', GroupingValue: null },
    { Text: 'Prompt', Value: '40002', GroupingValue: null },
    { Text: 'Spot', Value: '40003', GroupingValue: null },
    { Text: 'Contract', Value: '40004', GroupingValue: null },
  ],
}

const breakdownRow = (
  id: number,
  pricingName: string,
  pct: number,
  current: number,
  calculated: number,
  priceTypeDisplay: string = 'Average'
) => ({
  Key: id,
  PricingId: id,
  PricingName: pricingName,
  PricingPercentage: pct,
  CurrentValue: current,
  CalculatedValue: calculated,
  BackingPrice: {
    PriceId: 50000 + id,
    PriceInstrumentId: 4001,
    PricePublisherId: 3001,
    PriceTypeCvId: 5101,
    EffectiveFromDate: '2026-05-01T00:00:00Z',
    EffectiveToDate: '2026-05-02T00:00:00Z',
    TradeFromDate: '2026-05-01T00:00:00Z',
    TradeToDate: '2026-05-01T23:59:59Z',
    PriceStatus: 'Published',
    UnitOfMeasureId: 1,
    CurrencyId: 1,
    Price: current,
    FormulaResultId: null,
    PointId: 1,
    PointTypeCvId: null,
    UpdatedDateTime: '2026-05-02T06:30:00Z',
  },
  PriceTypeCvId: 5101,
  PriceTypeDisplay: priceTypeDisplay,
  IsRequired: 'true',
  IsCostComponent: 'false',
})

export const adminCalculatedValueSecondaryBreakdownFixture = {
  TotalRecords: 5,
  Data: [
    breakdownRow(1, 'OPIS Houston ULSD Avg', 100, 2.7459, 2.7584),
    breakdownRow(2, 'Platts Gulf Coast ULSD', 50, 2.7421, 2.7546, 'Low'),
    breakdownRow(3, 'OPIS Dallas ULSD Avg', 75, 2.7512, 2.7637),
    breakdownRow(4, 'Argus Mid-Con Diesel', 25, 2.7388, 2.7513, 'High'),
    breakdownRow(5, 'OPIS Salt Lake Jet A', 100, 2.9812, 2.9937),
  ],
}
