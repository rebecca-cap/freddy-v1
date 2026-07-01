// Freddy mock fixture — not used in production code paths.
//
// Shapes derived from src/modules/PricingEngine/QuoteBook/api/types.schema.ts:
//   - QuoteBookMetadataResponse has fields at TOP LEVEL (no Data wrapper).
//   - QuoteBookOverview = { TotalRecords, Data: Quote[] }.
//
// HF Sinclair variant — Sinclair Unbranded Rack Prices (Config 2,
// env "sinclair-pe-prod"). Terminal-arb framing: the hero pair is the
// DENVER vs N PLATTE #2 ULSD - 0032 rack spread over the 2026-02-28 →
// 2026-05-29 window (46 dual-active days). Decimal dollars only ($3.45/gal).
// Rack rows carry no external/carrier/supplier counterparty — they are
// internal HF Sinclair rack postings.
//
// Catalog grounding: every row except DENVER is a real (Config, Product,
// Location) combo from the Midcon CSV. Products and the N-Platte sibling
// terminal cluster (OMAHA 1634, LINCOLN MAG 1631, NORFOLK 1632, COLUMBUS
// NE 1627, GENEVA 1629, DONIPHAN 1628) are CSV-verified. DENVER - 1142 is
// Rocky-Mountain, NOT in this Midcon CSV — it is kept as the lone
// catalog-exempt row because the terminal-arb hero scenario is built on it
// (verifiedInCatalog: false flags this).

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
  Start: '2026-05-28T00:00:00Z',
  End: '2026-05-28T23:59:59Z',
  BenchMarks: [benchmark(1, 3.245), benchmark(2, 3.252)],
  Margin: 0.0354,
  LastCost: 3.2095,
  LastPrice: 3.2449,
  LastDiff: 0.0354,
  WeightedCost: 3.2102,
  WeightedPrice: 3.2456,
  WeightedDiff: 0.0354,
})

type QuoteSpec = {
  product: string
  location: string
  groupId: number
  mappingId: number
  proposedPrice: number
  locationId: number
  productId: number
  configId: number
  configName: string
  groupName: string
  external: string
  carrier: string
  supplier: string
  internal: string
  // false only for DENVER (Rocky-Mountain, not in the Midcon CSV) — kept
  // as the catalog-exempt arb hero. All other rows are CSV-verified.
  verifiedInCatalog: boolean
}

const makeQuote = (id: number, spec: QuoteSpec) => ({
  AdjustmentUpdatedDateTime: '2026-05-29T08:00:00Z',
  LatestQuoteDate: '2026-05-29T08:00:00Z',
  CarrierCounterPartyName: spec.carrier,
  ExternalCounterPartyName: spec.external,
  InternalCounterPartyName: spec.internal,
  StrategyQuoteBenchmarkId: id * 10,
  // null means "no parent spread row" — the grid filters out rows where this
  // field is defined-and-not-null (treats them as hidden spread children).
  // `0` looks like a sentinel but `isDefinedAndNotNull(0)` returns true, so
  // a zero here makes every row vanish.
  SpreadParentMappingId: null,
  StrategyBase: benchmark(id, spec.proposedPrice - 0.005),
  Allocation: 50,
  LocationName: spec.location,
  ProductName: spec.product,
  AdjustedAfterPublish: false,
  AdjustedDate: '2026-05-29T08:00:00Z',
  CostSourceTradeEntryId: id + 5000,
  SupplierCounterPartyName: spec.supplier,
  CostSourceType: 'Contract',
  QuoteConfigurationId: spec.configId,
  QuoteConfigurationMappingId: spec.mappingId,
  QuoteConfigurationMappingGroup: spec.groupName,
  QuoteConfigurationMappingGroupId: spec.groupId,
  QuoteConfigurationName: spec.configName,
  Adjustment: 0,
  QuoteStrategyName: 'Standard Markup',
  UnitOfMeasureName: 'GAL',
  ProductGroup: 'Refined Products',
  TargetPeriodEffectiveFrom: '2026-05-29T00:00:00Z',
  TargetPeriodEffectiveTo: '2026-05-30T00:00:00Z',
  PriorQuotePeriod: priorPeriod(),
  SecondPriorQuotePeriod: priorPeriod(),
  ProposedPrice: spec.proposedPrice,
  Cost: null,
  CostId: 200 + id,
  CostFormulaResultId: null,
  CostStatusSymbol: '✓',
  LatestCostFormulaResultId: null,
  PublishesNetAndGross: true,
  Exceptions: [],
})

const RACK_GROUP = 'Sinclair Unbranded Rack Prices'

export const quoteBookMetadataFixture = {
  // Top-level fields — NOT under .Data — per QuoteBookMetadataResponse
  QuoteMappingGroups: [
    {
      GroupDescription: 'Sinclair unbranded rack postings',
      GroupName: 'Sinclair Unbranded Rack Prices',
      QuoteConfigurationMappingGroupId: 1,
    },
    {
      GroupDescription: 'Sinclair branded rack postings',
      GroupName: 'Sinclair Branded Rack Prices',
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
  TotalRecords: 8,
  Data: [
    // HERO PAIR — DENVER vs N PLATTE #2 ULSD - 0032 terminal arb.
    // DEN-NPL spread = 3.45 - 3.12 = +$0.33 (median window spread).
    // DENVER is catalog-exempt (Rocky-Mountain, not in Midcon CSV).
    makeQuote(1, {
      product: '#2 ULSD - 0032',
      location: 'DENVER',
      groupId: 1,
      mappingId: 1278,
      proposedPrice: 3.45,
      locationId: 1142,
      productId: 67,
      configId: 2,
      configName: 'Sinclair Unbranded Rack Prices - DENVER - 1142, #2 ULSD - 0032',
      groupName: RACK_GROUP,
      external: '',
      carrier: '',
      supplier: '',
      internal: 'HF Sinclair',
      verifiedInCatalog: false,
    }),
    makeQuote(2, {
      product: '#2 ULSD - 0032',
      location: 'N PLATTE',
      groupId: 1,
      mappingId: 1983,
      proposedPrice: 3.12,
      locationId: 1633,
      productId: 67,
      configId: 2,
      configName: 'Sinclair Unbranded Rack Prices - N PLATTE - 1633, #2 ULSD - 0032',
      groupName: RACK_GROUP,
      external: '',
      carrier: '',
      supplier: '',
      internal: 'HF Sinclair',
      verifiedInCatalog: true,
    }),
    // Sibling rack rows — CSV-verified Midcon cluster terminals + products.
    makeQuote(3, {
      product: 'UNLD - 0024',
      location: 'OMAHA',
      groupId: 1,
      mappingId: 1640,
      proposedPrice: 3.08,
      locationId: 1634,
      productId: 24,
      configId: 2,
      configName: 'Sinclair Unbranded Rack Prices - OMAHA - 1634, UNLD - 0024',
      groupName: RACK_GROUP,
      external: '',
      carrier: '',
      supplier: '',
      internal: 'HF Sinclair',
      verifiedInCatalog: true,
    }),
    makeQuote(4, {
      product: '#1 ULSD - 0033',
      location: 'NORFOLK',
      groupId: 1,
      mappingId: 1638,
      proposedPrice: 3.38,
      locationId: 1632,
      productId: 33,
      configId: 2,
      configName: 'Sinclair Unbranded Rack Prices - NORFOLK - 1632, #1 ULSD - 0033',
      groupName: RACK_GROUP,
      external: '',
      carrier: '',
      supplier: '',
      internal: 'HF Sinclair',
      verifiedInCatalog: true,
    }),
    makeQuote(5, {
      product: 'PRM - 0028',
      location: 'LINCOLN MAG',
      groupId: 1,
      mappingId: 1637,
      proposedPrice: 3.52,
      locationId: 1631,
      productId: 28,
      configId: 2,
      configName: 'Sinclair Unbranded Rack Prices - LINCOLN MAG - 1631, PRM - 0028',
      groupName: RACK_GROUP,
      external: '',
      carrier: '',
      supplier: '',
      internal: 'HF Sinclair',
      verifiedInCatalog: true,
    }),
    makeQuote(6, {
      product: 'M/G10% - 0038',
      location: 'COLUMBUS NE',
      groupId: 1,
      mappingId: 1633,
      proposedPrice: 3.21,
      locationId: 1627,
      productId: 38,
      configId: 2,
      configName: 'Sinclair Unbranded Rack Prices - COLUMBUS NE - 1627, M/G10% - 0038',
      groupName: RACK_GROUP,
      external: '',
      carrier: '',
      supplier: '',
      internal: 'HF Sinclair',
      verifiedInCatalog: true,
    }),
    makeQuote(7, {
      product: '#2 ULSD - 0032',
      location: 'GENEVA',
      groupId: 1,
      mappingId: 1635,
      proposedPrice: 3.29,
      locationId: 1629,
      productId: 67,
      configId: 2,
      configName: 'Sinclair Unbranded Rack Prices - GENEVA - 1629, #2 ULSD - 0032',
      groupName: RACK_GROUP,
      external: '',
      carrier: '',
      supplier: '',
      internal: 'HF Sinclair',
      verifiedInCatalog: true,
    }),
    makeQuote(8, {
      product: 'UNLD - 0024',
      location: 'DONIPHAN',
      groupId: 1,
      mappingId: 1634,
      proposedPrice: 3.05,
      locationId: 1628,
      productId: 24,
      configId: 2,
      configName: 'Sinclair Unbranded Rack Prices - DONIPHAN - 1628, UNLD - 0024',
      groupName: RACK_GROUP,
      external: '',
      carrier: '',
      supplier: '',
      internal: 'HF Sinclair',
      verifiedInCatalog: true,
    }),
  ],
}
