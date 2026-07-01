// Freddy mock fixture — fictional
// /AdminDashboard endpoints. Pending/RecentlyProcessed share row shape with
// /OrderDashboard but go through different endpoint URLs. The chart endpoints
// (GetProcessedVolume / GetProcessedProfit / GetProcessedPromptVolume /
// GetProcessedForwardVolume) return TOP-LEVEL fields (no Data wrapper):
//   { TotalQuantity, QuantitySparkPoints } — the consumer reads
//   processedVolumeData?.QuantitySparkPoints directly.

const counterparties = [
  'Demo Trucking Co.',
  'Frontier Fuel Services',
  'Cascade Logistics',
  'Prairie Trading Co.',
  'Sunbelt Wholesale',
  'Northbridge Petroleum',
]

const dateOffset = (days: number) => {
  const d = new Date('2026-05-02T08:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString()
}

const makeAdminOrder = (id: number, isForward: boolean, status: string) => {
  const cp = counterparties[id % counterparties.length]
  const created = dateOffset(-(id % 21) - 1)
  const products = ['ULSD', 'Gasoline 87', 'Gasoline 91', 'Jet A', 'Biodiesel B5']
  const locations = ['Houston Terminal', 'Dallas Hub', 'Salt Lake Rack']
  return {
    TradeEntryId: 14040 + id,
    OrderStatusCodeValueDisplay: status,
    OrderStatus: status,
    OrderStatusCvId: 100 + (id % 5),
    FullTypeName: isForward ? 'Forward Fixed Price' : 'Prompt Market',
    TradeTypeMeaning: isForward ? 'Forward' : 'Prompt',
    OrderOriginType: id % 3 === 0 ? 'Special' : 'Marketplace',
    IsBidOrOffer: id % 4 === 0,
    SourceIndexOfferId: null,
    IndexOfferDisplay: null,
    ProductId: 7001 + (id % products.length),
    ProductName: products[id % products.length],
    LocationId: 5001 + (id % locations.length),
    FromLocationName: locations[id % locations.length],
    ContractPricingMethodCodeValueMeaning: isForward ? 'Fixed' : 'Spot',
    Quantity: 5000 + (id % 9) * 5000,
    Price: Number((2.45 + (id % 17) * 0.04).toFixed(4)),
    EffectiveFromDateTime: created,
    EffectiveToDateTime: dateOffset(-(id % 21)),
    CreatedDateTime: created,
    OrderAcceptedDateTime: status === 'Accepted' || status === 'Filled' ? created : null,
    ExternalCounterPartyName: cp,
    ExternalCounterPartyId: 9001 + (id % 5),
    InternalCounterPartyName: 'Houston Terminal Demo Co.',
    LoadingNumbers: [{ LoadingNumberId: 11500 + id, Name: `LN-${11500 + id}` }],
  }
}

const adminPendingRows = Array.from({ length: 9 }, (_, i) => makeAdminOrder(i, i % 2 === 0, 'Pending'))
const adminRecentlyProcessedRows = [
  makeAdminOrder(40, false, 'Filled'),
  makeAdminOrder(41, false, 'Accepted'),
  makeAdminOrder(42, false, 'Declined'),
  makeAdminOrder(43, true, 'Filled'),
  makeAdminOrder(44, true, 'Accepted'),
  makeAdminOrder(45, true, 'Canceled'),
  makeAdminOrder(46, true, 'Filled'),
  makeAdminOrder(47, false, 'Filled'),
  makeAdminOrder(48, true, 'Accepted'),
  makeAdminOrder(49, false, 'Accepted'),
]

export const adminDashboardPendingFixture = {
  Data: adminPendingRows,
  TotalRecords: adminPendingRows.length,
  Query: null,
  Validations: [],
}

export const adminDashboardRecentlyProcessedFixture = {
  Data: adminRecentlyProcessedRows,
  TotalRecords: adminRecentlyProcessedRows.length,
  Query: null,
  Validations: [],
}

const sparkSeries = (base: number, count: number, jitter: number) =>
  Array.from({ length: count }, (_, i) =>
    Math.round(base + Math.sin((i + 1) / 3) * jitter + (i / count) * jitter * 0.5)
  )

// Chart endpoints — TOP LEVEL (no Data wrapper).
export const adminProcessedVolumeFixture = {
  TotalQuantity: 1_485_000,
  QuantitySparkPoints: sparkSeries(60_000, 30, 12_000),
}

export const adminProcessedProfitFixture = {
  TotalProfit: 412_350,
  ProfitSparkPoints: sparkSeries(15_000, 30, 4_500),
  TotalQuantity: 1_485_000,
  QuantitySparkPoints: sparkSeries(60_000, 30, 12_000),
}

export const adminProcessedPromptVolumeFixture = {
  TotalQuantity: 642_000,
  QuantitySparkPoints: sparkSeries(25_000, 30, 6_000),
}

export const adminProcessedForwardVolumeFixture = {
  TotalQuantity: 843_000,
  QuantitySparkPoints: sparkSeries(35_000, 30, 8_000),
}
