// Freddy mock fixture — fictional
// /Admin/PriceConfiguration — usePriceConfigurations.
// MarketPlatform/Admin/PriceConfiguration/MetaData consumer reads .Data.LocationGroupList / .Data.ProductGroupList.
// MarketPlatform/Admin/PriceConfiguration/GetAll consumer reads top-level rows (Data).

const opt = (id: number, text: string) => ({ Text: text, Value: String(id), GroupingValue: null })

export const priceConfigurationMetadataFixture = {
  Data: {
    LocationGroupList: [
      opt(5001, 'Houston Terminal'),
      opt(5002, 'Dallas Hub'),
      opt(5003, 'Salt Lake Rack'),
      opt(5004, 'Denver Terminal'),
      opt(5005, 'Phoenix Rack'),
    ],
    ProductGroupList: [
      opt(7001, 'ULSD No. 2'),
      opt(7002, 'Gasoline 87 Unl'),
      opt(7003, 'Gasoline 91 Prem'),
      opt(7004, 'Jet A'),
      opt(7005, 'Biodiesel B5'),
    ],
    Benchmarks: [
      opt(6001, 'OPIS Average'),
      opt(6002, 'OPIS Low'),
      opt(6003, 'Platts USGC'),
      opt(6004, 'NYMEX Settle'),
    ],
    PricePublishers: [
      opt(4001, 'Demo Publisher One'),
      opt(4002, 'Frontier Rack Service'),
      opt(4003, 'Cascade Spot Quote'),
    ],
    UnitsOfMeasure: [opt(1, 'GAL'), opt(2, 'BBL'), opt(3, 'MT')],
  },
  Query: null,
  Validations: [],
}

const makeConfig = (i: number, locId: number, prodId: number) => ({
  MarketPlatformPriceConfigurationId: 4540 + i,
  LocationId: locId,
  ProductId: prodId,
  Name: `Config ${i + 1}`,
  BenchmarkId: 6001 + (i % 4),
  BenchmarkName: ['OPIS Average', 'OPIS Low', 'Platts USGC', 'NYMEX Settle'][i % 4],
  Adjustment: 0.0125 + (i % 5) * 0.005,
  IsActive: i % 7 !== 6,
  PricePublisherId: 4001 + (i % 3),
  UnitOfMeasure: 'GAL',
  ModifiedDate: `2026-04-${String(15 + (i % 14)).padStart(2, '0')}T12:00:00Z`,
  ModifiedBy: ['frank.overland@gravitate.energy', 'demo.user@example.com'][i % 2],
  Variables: [],
  Futures: [],
})

const pairs: Array<[number, number]> = [
  [5001, 7001], [5001, 7002], [5001, 7003],
  [5002, 7001], [5002, 7002],
  [5003, 7001], [5003, 7004],
  [5004, 7001], [5004, 7005],
  [5005, 7002],
]

export const priceConfigurationReadFixture = {
  TotalRecords: pairs.length,
  Data: pairs.map(([locId, prodId], i) => makeConfig(i, locId, prodId)),
  Query: null,
  Validations: [],
}
