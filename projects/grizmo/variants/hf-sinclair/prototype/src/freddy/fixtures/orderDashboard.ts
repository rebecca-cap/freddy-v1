// Freddy mock fixture — fictional
// /Dashboard endpoints — same handler returns mixed prompt/forward orders;
// the consumer concatenates them so it just needs to render.

const order = (
  id: number,
  fullType: string,
  product: string,
  productId: number,
  fromLoc: string,
  qty: number,
  price: number,
  isBid: boolean,
  origin: string = 'Marketplace',
  effFrom: string = '2026-05-02T08:00:00Z',
  effTo: string = '2026-05-03T08:00:00Z'
) => ({
  TradeEntryId: id,
  FullTypeName: fullType,
  OrderOriginType: origin,
  IsBidOrOffer: isBid,
  ProductName: product,
  ProductId: productId,
  FromLocationName: fromLoc,
  ContractPricingMethodCodeValueMeaning: 'Fixed',
  Quantity: qty,
  Price: price,
  EffectiveFromDateTime: effFrom,
  EffectiveToDateTime: effTo,
  CreatedDateTime: '2026-05-01T07:30:00Z',
  SourceIndexOfferId: null,
  IndexOfferDisplay: null,
  CounterPartyName: 'Frontier Fuel Services',
  CounterPartyId: 9002,
})

const pendingOrdersData = [
  order(81001, 'Rack Sale - Prompt', 'ULSD', 7001, 'Houston Terminal', 8000, 2.7459, true),
  order(81002, 'Rack Sale - Prompt', 'Gasoline 87', 7002, 'Houston Terminal', 12000, 2.5821, false),
  order(81003, 'Rack Sale - Prompt', 'Gasoline 91', 7003, 'Dallas Hub', 5000, 2.8154, true),
  order(81004, 'Bulk Contract - Forward', 'ULSD', 7001, 'Dallas Hub', 25000, 2.7512, false, 'Auction'),
  order(81005, 'Bulk Contract - Forward', 'Jet A', 7004, 'Salt Lake Rack', 15000, 2.9812, true),
  order(81006, 'Rack Sale - Prompt', 'Biodiesel B5', 7005, 'Phoenix Terminal', 4000, 3.1245, false),
]

export const pendingOrdersFixture = {
  TotalRecords: pendingOrdersData.length,
  Data: pendingOrdersData,
  Query: null,
  Validations: [],
}

const processedOrdersData = [
  order(82001, 'Rack Sale - Prompt', 'ULSD', 7001, 'Houston Terminal', 9500, 2.7421, false, 'Marketplace', '2026-04-28T08:00:00Z', '2026-04-29T08:00:00Z'),
  order(82002, 'Rack Sale - Prompt', 'Gasoline 87', 7002, 'Houston Terminal', 14000, 2.5798, true, 'Marketplace', '2026-04-29T08:00:00Z', '2026-04-30T08:00:00Z'),
  order(82003, 'Bulk Contract - Forward', 'ULSD', 7001, 'Dallas Hub', 30000, 2.7488, false, 'Auction', '2026-04-25T08:00:00Z', '2026-04-26T08:00:00Z'),
  order(82004, 'Bulk Contract - Forward', 'Gasoline 91', 7003, 'Phoenix Terminal', 8000, 2.8201, true, 'Special', '2026-04-22T08:00:00Z', '2026-04-23T08:00:00Z'),
  order(82005, 'Rack Sale - Prompt', 'Jet A', 7004, 'Salt Lake Rack', 12000, 2.9758, false, 'Marketplace', '2026-04-30T08:00:00Z', '2026-05-01T08:00:00Z'),
]

export const processedOrdersFixture = {
  TotalRecords: processedOrdersData.length,
  Data: processedOrdersData,
  Query: null,
  Validations: [],
}

export const creditWidgetFixture = {
  Data: {
    CounterPartyCreditId: 90001,
    CreditLimit: 5000000,
    CreditHoldPercentage: 90,
    Arbalance: 1250000,
    CreditStatusDisplay: 'Within Limit',
  },
  Query: null,
  Validations: [],
}

const sparkPoints = (base: number, drift: number) =>
  Array.from({ length: 24 }, (_, i) => +(base + Math.sin(i / 3) * drift + i * 0.001).toFixed(4))

const productListing = (
  productId: number,
  product: string,
  locationId: number,
  location: string,
  price: number,
  isPriceUp: boolean,
  drift: number = 0.02
) => ({
  ProductId: productId,
  ProductName: product,
  LocationId: locationId,
  LocationName: location,
  Price: price,
  IsPriceUp: isPriceUp,
  SparkChartPoints: sparkPoints(price, drift),
})

export const dashboardPriceListingsFixture = {
  Data: [
    productListing(7001, 'ULSD', 5001, 'Houston Terminal', 2.7459, true),
    productListing(7002, 'Gasoline 87', 5001, 'Houston Terminal', 2.5821, false),
    productListing(7003, 'Gasoline 91', 5001, 'Houston Terminal', 2.8154, true),
    productListing(7001, 'ULSD', 5002, 'Dallas Hub', 2.7512, true),
    productListing(7002, 'Gasoline 87', 5002, 'Dallas Hub', 2.5874, false),
    productListing(7004, 'Jet A', 5003, 'Salt Lake Rack', 2.9812, true),
    productListing(7005, 'Biodiesel B5', 5004, 'Phoenix Terminal', 3.1245, false),
    productListing(7001, 'ULSD', 5005, 'Denver Rack', 2.7388, true),
  ],
  Query: null,
  Validations: [],
}
