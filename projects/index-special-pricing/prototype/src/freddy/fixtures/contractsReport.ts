// Freddy mock fixture — fictional
// /ContractManagement/Contracts — useContractsReport.useContractsOverviewQuery
// hits ContractManagement/report/GetAll. The consumer immediately maps each
// row to attach Locations/Products derived from Details, so each row MUST
// have a non-empty Details[] with FromLocationName, ProductName, Quantity.

const TYPE_PURCHASE = { typeCv: 1, type: 'Purchase' }
const TYPE_SALE = { typeCv: 2, type: 'Sale' }

const detail = (
  detailId: number,
  productId: number,
  productName: string,
  fromLocationId: number,
  fromLocationName: string,
  toLocationId: number,
  toLocationName: string,
  quantity: number,
  fromIso: string,
  toIso: string
) => ({
  TradeEntryDetailId: detailId,
  Book: 'Wholesale',
  BookId: 4001,
  FromDateTime: fromIso,
  FromLocationId: fromLocationId,
  FromLocationName: fromLocationName,
  ProductId: productId,
  ProductName: productName,
  ToDateTime: toIso,
  ToLocationId: toLocationId,
  ToLocationName: toLocationName,
  Quantity: quantity,
  Quantities: [
    { Quantity: quantity, QuantityDateTime: fromIso, IsActive: true, TradeEntryQuantityId: detailId * 10 },
  ],
})

const makeContract = (
  id: number,
  description: string,
  cp: { id: number; name: string },
  fromIso: string,
  toIso: string,
  kind: typeof TYPE_PURCHASE | typeof TYPE_SALE,
  details: ReturnType<typeof detail>[]
) => ({
  TradeEntryId: id,
  CreatedByCredentialId: 2001,
  CreatedByEmail: 'demo.trader@gravitate.energy',
  Description: description,
  Comments: '',
  CreatedDateTime: '2026-04-15T10:00:00Z',
  Details: details,
  ExternalCounterPartyId: cp.id,
  ExternalCounterPartyName: cp.name,
  FromDateTime: fromIso,
  ToDateTime: toIso,
  InternalCounterPartyId: 1,
  InternalCounterPartyName: 'Demo Refining Inc.',
  OrderStatus: 'Active',
  OrderStatusCvId: 1,
  OrderStatusCodeValueDisplay: 'Active',
  TradeEntryDateTime: '2026-04-15T10:00:00Z',
  TradeInstrument: 'Term Contract',
  TradeInstrumentId: 9100,
  Type: kind.type,
  TypeCvId: kind.typeCv,
  TotalVolume: details.reduce((s, d) => s + d.Quantity, 0),
  Book: 'Wholesale',
  HideDetails: false,
})

export const contractsReportFixture = {
  TotalRecords: 7,
  Data: [
    makeContract(
      11001,
      'FFS — Houston ULSD term',
      { id: 9002, name: 'Frontier Fuel Services' },
      '2026-05-01T00:00:00Z',
      '2026-07-31T23:59:59Z',
      TYPE_SALE,
      [
        detail(21001, 7001, 'ULSD', 5001, 'Houston Terminal', 5002, 'Dallas Hub', 25000, '2026-05-01T00:00:00Z', '2026-07-31T23:59:59Z'),
        detail(21002, 7002, 'Gasoline 87', 5001, 'Houston Terminal', 5002, 'Dallas Hub', 18000, '2026-05-01T00:00:00Z', '2026-07-31T23:59:59Z'),
      ]
    ),
    makeContract(
      11002,
      'Cascade — Salt Lake gasoline 91',
      { id: 9003, name: 'Cascade Logistics LLC' },
      '2026-05-01T00:00:00Z',
      '2026-06-30T23:59:59Z',
      TYPE_SALE,
      [
        detail(21003, 7003, 'Gasoline 91', 5004, 'Salt Lake Rack', 5005, 'Boise Terminal', 12000, '2026-05-01T00:00:00Z', '2026-06-30T23:59:59Z'),
      ]
    ),
    makeContract(
      11003,
      'Prairie — Dallas Jet A',
      { id: 9004, name: 'Prairie Trading Co.' },
      '2026-04-15T00:00:00Z',
      '2026-09-30T23:59:59Z',
      TYPE_SALE,
      [
        detail(21004, 7004, 'Jet A', 5002, 'Dallas Hub', 5006, 'Tulsa Rack', 30000, '2026-04-15T00:00:00Z', '2026-09-30T23:59:59Z'),
      ]
    ),
    makeContract(
      11004,
      'Demo Trucking — Phoenix term',
      { id: 9005, name: 'Demo Trucking Co.' },
      '2026-05-01T00:00:00Z',
      '2026-08-31T23:59:59Z',
      TYPE_SALE,
      [
        detail(21005, 7001, 'ULSD', 5007, 'Phoenix Rack', 5008, 'Albuquerque Hub', 22000, '2026-05-01T00:00:00Z', '2026-08-31T23:59:59Z'),
        detail(21006, 7002, 'Gasoline 87', 5007, 'Phoenix Rack', 5008, 'Albuquerque Hub', 15000, '2026-05-01T00:00:00Z', '2026-08-31T23:59:59Z'),
      ]
    ),
    makeContract(
      11005,
      'Heartland — biodiesel supply',
      { id: 9006, name: 'Heartland Energy Coop' },
      '2026-05-01T00:00:00Z',
      '2026-12-31T23:59:59Z',
      TYPE_PURCHASE,
      [
        detail(21007, 7005, 'Biodiesel B5', 5009, 'Des Moines Hub', 5010, 'Omaha Terminal', 8000, '2026-05-01T00:00:00Z', '2026-12-31T23:59:59Z'),
      ]
    ),
    makeContract(
      11006,
      'Coastal Bunker — ULSD',
      { id: 9007, name: 'Coastal Bunker Partners' },
      '2026-05-02T00:00:00Z',
      '2026-08-31T23:59:59Z',
      TYPE_SALE,
      [
        detail(21008, 7001, 'ULSD', 5001, 'Houston Terminal', 5011, 'Mobile Terminal', 40000, '2026-05-02T00:00:00Z', '2026-08-31T23:59:59Z'),
      ]
    ),
    makeContract(
      11007,
      'FFS — Austin gasoline',
      { id: 9002, name: 'Frontier Fuel Services' },
      '2026-05-10T00:00:00Z',
      '2026-07-10T23:59:59Z',
      TYPE_SALE,
      [
        detail(21009, 7002, 'Gasoline 87', 5002, 'Dallas Hub', 5012, 'Austin Rack', 16000, '2026-05-10T00:00:00Z', '2026-07-10T23:59:59Z'),
        detail(21010, 7003, 'Gasoline 91', 5002, 'Dallas Hub', 5012, 'Austin Rack', 9000, '2026-05-10T00:00:00Z', '2026-07-10T23:59:59Z'),
      ]
    ),
  ],
  Query: null,
  Validations: [],
}
