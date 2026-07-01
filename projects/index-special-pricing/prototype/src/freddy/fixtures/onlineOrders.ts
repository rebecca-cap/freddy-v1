// Freddy mock fixture — fictional
// EntityReport/Read for /OnlineOrders. Type A envelope: { Data: T[] }.
// EntityReport/Read is shared by /OnlineOrders, /ContractManagement/*, and
// /Admin/IntegrationStatus — the registry only matches by path so this
// fixture serves all of them. Rows are shaped for OnlineOrders consumers.

const orderStatuses = ['Pending', 'Accepted', 'Filled', 'Declined', 'Canceled'] as const

const counterparties = [
  'Demo Trucking Co.',
  'Frontier Fuel Services',
  'Cascade Logistics',
  'Prairie Trading Co.',
  'Sunbelt Wholesale',
] as const

const products = [
  { id: 7001, name: 'ULSD' },
  { id: 7002, name: 'Gasoline 87' },
  { id: 7003, name: 'Gasoline 91' },
  { id: 7004, name: 'Jet A' },
  { id: 7005, name: 'Biodiesel B5' },
] as const

const locations = [
  { id: 5001, name: 'Houston Terminal' },
  { id: 5002, name: 'Dallas Hub' },
  { id: 5003, name: 'Salt Lake Rack' },
] as const

const makeOrderRow = (id: number) => {
  const product = products[id % products.length]
  const location = locations[id % locations.length]
  const counterparty = counterparties[id % counterparties.length]
  const status = orderStatuses[id % orderStatuses.length]
  const isBid = id % 3 === 0
  const isForward = id % 2 === 0
  const dayOffset = (id % 30) - 15
  const baseDate = new Date('2026-05-02T08:00:00Z')
  baseDate.setUTCDate(baseDate.getUTCDate() + dayOffset)
  const created = baseDate.toISOString()
  const accepted = status === 'Accepted' || status === 'Filled' ? created : null
  const price = 2.45 + (id % 17) * 0.04
  const quantity = 5000 + (id % 9) * 5000

  return {
    TradeEntryId: 14000 + id,
    OrderStatusCodeValueDisplay: status,
    OrderStatus: status,
    OrderStatusCvId: 100 + (id % 5),
    FullTypeName: isForward ? 'Forward Fixed Price' : 'Prompt Market',
    TradeTypeMeaning: isForward ? 'Forward' : 'Prompt',
    OrderOriginType: id % 4 === 0 ? 'Auction' : id % 4 === 1 ? 'Special' : 'Marketplace',
    IsBidOrOffer: isBid,
    SourceIndexOfferId: id % 7 === 0 ? 15010 + id : null,
    IndexOfferDisplay: id % 7 === 0 ? { FormulaDisplayName: 'OPIS Avg + 0.025' } : null,
    ProductId: product.id,
    ProductName: product.name,
    LocationId: location.id,
    FromLocationId: location.id,
    FromLocationName: location.name,
    ToLocationName: location.name,
    ContractPricingMethodCodeValueMeaning: isForward ? 'Fixed' : 'Spot',
    Quantity: quantity,
    Price: Number(price.toFixed(4)),
    EffectiveFromDateTime: created,
    EffectiveToDateTime: created,
    CreatedDateTime: created,
    OrderAcceptedDateTime: accepted,
    SubmittedDateTime: created,
    ExternalCounterPartyName: counterparty,
    ExternalCounterPartyId: 9001 + (id % 5),
    InternalCounterPartyName: 'Houston Terminal Demo Co.',
    LoadingNumbers: [
      { LoadingNumberId: 11000 + id, Name: `LN-${11000 + id}`, Display: `LN-${11000 + id}` },
    ],
    Notes: '',
  }
}

const orderRows = Array.from({ length: 24 }, (_, i) => makeOrderRow(i + 1))

export const onlineOrdersReadFixture = {
  Data: orderRows,
  TotalRecords: orderRows.length,
  Query: null,
  Validations: [],
}
