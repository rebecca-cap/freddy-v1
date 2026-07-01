// Freddy mock fixture — not used in production code paths.
//
// Shapes derived from src/modules/PricingEngine/QuoteBook/api/types.schema.ts:
//   - QuoteBookMetadataResponse has fields at TOP LEVEL (no Data wrapper).
//   - QuoteBookOverview = { TotalRecords, Data: Quote[] }.
//
// Realistic-looking data so the grid actually shows rows (clearly fictional
// counterparty names, products, locations).

const benchmark = (id: number, value: number) => ({
  PriceId: id,
  QuotedValueId: id + 1000,
  Value: value,
  StatusSymbol: '✓',
  Status: 'Published',
  BenchmarkId: id,
})

const priorPeriod = () => ({
  PriceDifference: 0.0125,
  ProfitDifference: 1250,
  LiftingsDifference: 12,
  Liftings: 84,
  StrategyType: 'EndOfDay',
  Profit: 18450,
  Start: '2026-04-25T00:00:00Z',
  End: '2026-04-25T23:59:59Z',
  BenchMarks: [benchmark(1, 2.745), benchmark(2, 2.752)],
  Margin: 0.0354,
  LastCost: 2.7095,
  LastPrice: 2.7449,
  LastDiff: 0.0354,
  WeightedCost: 2.7102,
  WeightedPrice: 2.7456,
  WeightedDiff: 0.0354,
})

const makeQuote = (
  id: number,
  product: string,
  location: string,
  customer: string,
  proposedPrice: number,
  groupId: number = 1,
  groupName: string = 'Wholesale Rack'
) => ({
  AdjustmentUpdatedDateTime: '2026-05-02T08:00:00Z',
  LatestQuoteDate: '2026-05-02T08:00:00Z',
  CarrierCounterPartyName: `${customer} Logistics`,
  ExternalCounterPartyName: customer,
  InternalCounterPartyName: 'Houston Terminal Demo Co.',
  StrategyQuoteBenchmarkId: id * 10,
  // null = a normal (non-spread) row; 0 made the grid hide every row. (was: 0)
  SpreadParentMappingId: null,
  StrategyBase: benchmark(id, proposedPrice - 0.005),
  Allocation: 50,
  LocationName: location,
  ProductName: product,
  AdjustedAfterPublish: false,
  AdjustedDate: '2026-05-02T08:00:00Z',
  CostSourceTradeEntryId: id + 5000,
  SupplierCounterPartyName: 'Demo Refining Inc.',
  CostSourceType: 'Contract',
  QuoteConfigurationId: 100 + id,
  QuoteConfigurationMappingId: 1000 + id,
  QuoteConfigurationMappingGroup: groupName,
  QuoteConfigurationMappingGroupId: groupId,
  QuoteConfigurationName: `${product} ${location}`,
  Adjustment: 0,
  QuoteStrategyName: 'Standard Markup',
  UnitOfMeasureName: 'GAL',
  ProductGroup: 'Refined Products',
  TargetPeriodEffectiveFrom: '2026-05-02T00:00:00Z',
  TargetPeriodEffectiveTo: '2026-05-03T00:00:00Z',
  PriorQuotePeriod: priorPeriod(),
  SecondPriorQuotePeriod: priorPeriod(),
  ProposedPrice: proposedPrice,
  Cost: null,
  CostId: 200 + id,
  CostFormulaResultId: null,
  CostStatusSymbol: '✓',
  LatestCostFormulaResultId: null,
  PublishesNetAndGross: true,
  Exceptions: [],
})

export const quoteBookMetadataFixture = {
  // Top-level fields — NOT under .Data — per QuoteBookMetadataResponse
  QuoteMappingGroups: [
    {
      GroupDescription: 'Wholesale rack quotes',
      GroupName: 'Wholesale Rack',
      QuoteConfigurationMappingGroupId: 1,
    },
    {
      GroupDescription: 'Bulk contract quotes',
      GroupName: 'Bulk Contracts',
      QuoteConfigurationMappingGroupId: 2,
    },
  ],
  Benchmarks: [
    { Text: 'OPIS Average', Value: 'OPIS_AVG', GroupingValue: null },
    { Text: 'OPIS Low', Value: 'OPIS_LOW', GroupingValue: null },
    { Text: 'Platts', Value: 'PLATTS', GroupingValue: null },
  ],
  ProposedHeader: 'Today',
  OneBackHeader: 'Yesterday',
  TwoBackHeader: '2 Days Ago',
  ShowMarketMoveColumns: true,
}

export const quoteBookRowsFixture = {
  TotalRecords: 6,
  Data: [
    makeQuote(1, 'ULSD', 'Houston Terminal', 'Demo Trucking Co.', 2.7459),
    makeQuote(2, 'Gasoline 87', 'Houston Terminal', 'Demo Trucking Co.', 2.5821),
    makeQuote(3, 'Gasoline 91', 'Houston Terminal', 'Demo Trucking Co.', 2.8154),
    makeQuote(4, 'ULSD', 'Dallas Hub', 'Frontier Fuel Services', 2.7512, 2, 'Bulk Contracts'),
    makeQuote(5, 'Gasoline 87', 'Dallas Hub', 'Frontier Fuel Services', 2.5874, 2, 'Bulk Contracts'),
    makeQuote(6, 'Biodiesel B20', 'Dallas Hub', 'Demo Trucking Co.', 3.1245, 2, 'Bulk Contracts'),
  ],
}
