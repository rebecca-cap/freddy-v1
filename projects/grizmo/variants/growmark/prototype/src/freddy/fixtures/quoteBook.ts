// Freddy mock fixture — not used in production code paths.
//
// Shapes derived from src/modules/PricingEngine/QuoteBook/api/types.schema.ts:
//   - QuoteBookMetadataResponse has fields at TOP LEVEL (no Data wrapper).
//   - QuoteBookOverview = { TotalRecords, Data: Quote[] }.
//
// GROWMARK variant — Inventory Replacement Cost framing.
// Domain model (critical):
//   Output     = Price                (published price; Output instrument 995325)
//   Adjustment = user-entered diff     (Adjustment instrument 995329)
//   Cost       = Price − Adjustment    (Build-Up instrument 995331, formula-only)
// The OPIS Low 6 PM benchmark (PriceInstrumentId 1259108) feeds the cost build-up.
// Cost-tracking config, not customer quoting — counterparty fields stay blank.
//
// Window: May 22–29 2026. No weekend postings. There are NO BillOfLadingDetail
// liftings in this window, so there is no volume-weighted average — the
// weighted-* values below mirror the last posting rather than a lifting-weighted
// roll-up.

const benchmark = (id: number, value: number) => ({
  PriceId: id,
  QuotedValueId: id + 1000,
  Value: value,
  StatusSymbol: '✓',
  Status: 'Published',
  BenchmarkId: 1259108,
})

// Prior posting period. No weekend postings; no liftings in-window, so the
// weighted-* values intentionally equal the last-* values (no lifting-weighted
// average is possible without BillOfLadingDetail rows).
const priorPeriod = (lastPrice: number, lastCost: number) => ({
  PriceDifference: 0.0125,
  ProfitDifference: 0,
  LiftingsDifference: 0,
  Liftings: 0,
  StrategyType: 'IntraDay',
  Profit: 0,
  Start: '2026-05-28T00:00:00Z',
  End: '2026-05-28T23:59:59Z',
  BenchMarks: [benchmark(1259108, lastCost)],
  Margin: Number((lastPrice - lastCost).toFixed(4)),
  LastCost: lastCost,
  LastPrice: lastPrice,
  LastDiff: Number((lastPrice - lastCost).toFixed(4)),
  WeightedCost: lastCost,
  WeightedPrice: lastPrice,
  WeightedDiff: Number((lastPrice - lastCost).toFixed(4)),
})

const makeQuote = (
  id: number,
  product: string,
  location: string,
  proposedPrice: number,
  adjustment: number,
  quoteConfigurationId: number,
  groupId: number,
  groupName: string,
  quoteConfigurationMappingId: number = 1000 + id
) => {
  // ENFORCED: Cost = Output(Price) − Adjustment.
  const cost = Number((proposedPrice - adjustment).toFixed(4))
  return {
    AdjustmentUpdatedDateTime: '2026-05-29T12:30:00Z',
    LatestQuoteDate: '2026-05-29T12:30:00Z',
    // Inventory-replacement cost tracking — no counterparties.
    CarrierCounterPartyName: '',
    ExternalCounterPartyName: '',
    InternalCounterPartyName: '',
    StrategyQuoteBenchmarkId: id * 10,
    // null means "no parent spread row" — the grid filters out rows where this
    // field is defined-and-not-null (treats them as hidden spread children).
    // `0` looks like a sentinel but `isDefinedAndNotNull(0)` returns true, so
    // a zero here makes every row vanish.
    SpreadParentMappingId: null,
    // StrategyBase carries the OPIS Low 6 PM cost build-up value (the Cost).
    StrategyBase: benchmark(1259108, cost),
    Allocation: 50,
    LocationName: location,
    ProductName: product,
    AdjustedAfterPublish: false,
    AdjustedDate: '2026-05-29T12:30:00Z',
    CostSourceTradeEntryId: id + 5000,
    SupplierCounterPartyName: '',
    CostSourceType: 'Formula',
    QuoteConfigurationId: quoteConfigurationId,
    QuoteConfigurationMappingId: quoteConfigurationMappingId,
    QuoteConfigurationMappingGroup: groupName,
    QuoteConfigurationMappingGroupId: groupId,
    QuoteConfigurationName: `${product} ${location}`,
    Adjustment: adjustment,
    QuoteStrategyName: 'Inventory Replacement Cost',
    UnitOfMeasureName: 'GAL',
    ProductGroup: 'Refined Products',
    TargetPeriodEffectiveFrom: '2026-05-29T00:00:00Z',
    TargetPeriodEffectiveTo: '2026-05-30T00:00:00Z',
    PriorQuotePeriod: priorPeriod(proposedPrice, cost),
    SecondPriorQuotePeriod: priorPeriod(proposedPrice, cost),
    ProposedPrice: proposedPrice,
    Cost: null,
    CostId: 200 + id,
    CostFormulaResultId: null,
    CostStatusSymbol: '✓',
    LatestCostFormulaResultId: null,
    PublishesNetAndGross: true,
    Exceptions: [],
  }
}

export const quoteBookMetadataFixture = {
  // Top-level fields — NOT under .Data — per QuoteBookMetadataResponse
  QuoteMappingGroups: [
    {
      GroupDescription:
        'Cost-tracking config: Output = published price; Cost = Output − user-entered Adjustment (Build-Up). OPIS Low 6 PM benchmark feeds the cost build-up.',
      GroupName: 'Inventory Replacement Cost Unbranded',
      QuoteConfigurationMappingGroupId: 1,
    },
    {
      GroupDescription:
        'Sibling cost-tracking config for branded supply; same Output/Adjustment/Build-Up roles, branded benchmark basis.',
      GroupName: 'Inventory Replacement Cost Branded',
      QuoteConfigurationMappingGroupId: 2,
    },
  ],
  Benchmarks: [
    { Text: 'OPIS Low 6 PM', Value: 'OPIS_LOW_6PM', GroupingValue: null },
  ],
  ProposedHeader: 'Today',
  OneBackHeader: 'Yesterday',
  TwoBackHeader: '2 Days Ago',
  ShowMarketMoveColumns: true,
}

export const quoteBookRowsFixture = {
  TotalRecords: 6,
  Data: [
    // HERO row. Latest posting 2026-05-29 12:30 Intra Day.
    // Cost = 3.4490 − 0.0350 = 3.4140.
    makeQuote(
      1,
      '189877 - #2 ULS CL',
      '1207 - NORTH LITTLE ROCK, AR - MPL- N',
      3.449,
      0.035,
      29,
      1,
      'Inventory Replacement Cost Unbranded',
      163043
    ),
    makeQuote(
      2,
      '189878 - #2 ULS DYED',
      '1207 - NORTH LITTLE ROCK, AR - MPL- N',
      3.4012,
      0.035,
      29,
      1,
      'Inventory Replacement Cost Unbranded'
    ),
    makeQuote(
      3,
      '189901 - UNL 87',
      '1208 - LITTLE ROCK, AR - MPL- S',
      3.6125,
      0.04,
      29,
      1,
      'Inventory Replacement Cost Unbranded'
    ),
    makeQuote(
      4,
      '189903 - PREM UNL',
      '1211 - FORT SMITH, AR - MPL- W',
      3.689,
      0.025,
      29,
      1,
      'Inventory Replacement Cost Unbranded'
    ),
    makeQuote(
      5,
      '189877 - #2 ULS CL',
      '1215 - MEMPHIS, TN - MPL- E',
      3.4657,
      0.0375,
      30,
      2,
      'Inventory Replacement Cost Branded'
    ),
    makeQuote(
      6,
      '189901 - UNL 87',
      '1219 - TULSA, OK - MPL- N',
      3.5443,
      0.04,
      30,
      2,
      'Inventory Replacement Cost Branded'
    ),
  ],
}
