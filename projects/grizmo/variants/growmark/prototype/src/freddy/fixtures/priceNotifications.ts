// Freddy mock fixture — fictional
// /Admin/PriceNotifications — usePriceNotifications. All endpoints return APIResponse<T> = { Data: T, ... }

const products = [
  { ProductId: 7001, Name: 'ULSD No. 2', Status: 'Active', Abbreviation: 'ULSD', IsActive: true },
  { ProductId: 7002, Name: 'Gasoline 87 Unl', Status: 'Active', Abbreviation: 'UNL87', IsActive: true },
  { ProductId: 7003, Name: 'Gasoline 91 Prem', Status: 'Active', Abbreviation: 'UNL91', IsActive: true },
  { ProductId: 7004, Name: 'Jet A', Status: 'Active', Abbreviation: 'JETA', IsActive: true },
  { ProductId: 7005, Name: 'Biodiesel B5', Status: 'Active', Abbreviation: 'B5', IsActive: true },
  { ProductId: 7006, Name: 'Renewable Diesel', Status: 'Inactive', Abbreviation: 'RD', IsActive: false },
]

const locations = [
  { LocationId: 5001, Name: 'Houston Terminal', LocationType: 'Terminal', Status: 'Active', Abbreviation: 'HOU', IsActive: true },
  { LocationId: 5002, Name: 'Dallas Hub', LocationType: 'Hub', Status: 'Active', Abbreviation: 'DAL', IsActive: true },
  { LocationId: 5003, Name: 'Salt Lake Rack', LocationType: 'Rack', Status: 'Active', Abbreviation: 'SLC', IsActive: true },
  { LocationId: 5004, Name: 'Denver Terminal', LocationType: 'Terminal', Status: 'Active', Abbreviation: 'DEN', IsActive: true },
  { LocationId: 5005, Name: 'Phoenix Rack', LocationType: 'Rack', Status: 'Active', Abbreviation: 'PHX', IsActive: true },
  { LocationId: 5006, Name: 'Albuquerque Hub', LocationType: 'Hub', Status: 'Inactive', Abbreviation: 'ABQ', IsActive: false },
]

const counterParties = [
  { CounterPartyId: 9001, Name: 'Demo Refining Inc.' },
  { CounterPartyId: 9002, Name: 'Frontier Fuel Services' },
  { CounterPartyId: 9003, Name: 'Cascade Logistics' },
  { CounterPartyId: 9004, Name: 'Prairie Trading Co.' },
  { CounterPartyId: 9005, Name: 'Summit Energy Partners' },
]

const meta = (id: number | string, text: string) => ({ Text: text, Value: String(id), GroupingValue: null })

export const priceNotificationsProductsFixture = {
  TotalRecords: products.length,
  Data: products,
  Query: null,
  Validations: [],
}

export const priceNotificationsLocationsFixture = {
  TotalRecords: locations.length,
  Data: locations,
  Query: null,
  Validations: [],
}

export const priceNotificationsMetadataFixture = {
  Data: {
    Products: products.map((p) => meta(p.ProductId, p.Name)),
    Locations: locations.map((l) => meta(l.LocationId, l.Name)),
    QuoteConfigurations: [
      meta(101, 'Wholesale Rack'),
      meta(102, 'Bulk Contracts'),
      meta(103, 'Branded Wholesale'),
    ],
    CounterParties: counterParties.map((c) => meta(c.CounterPartyId, c.Name)),
    StatusCodeValues: [meta(401, 'Active'), meta(402, 'InActive')],
  },
  Query: null,
  Validations: [],
}

export const priceNotificationsRecipientDataFixture = {
  TotalRecords: counterParties.length,
  Data: counterParties.map((cp, i) => ({
    CounterPartyId: String(cp.CounterPartyId),
    CounterPartyName: cp.Name,
    SiteIds: i % 2 === 0 ? [`site-${cp.CounterPartyId}-a`, `site-${cp.CounterPartyId}-b`] : [`site-${cp.CounterPartyId}-a`],
  })),
  Query: null,
  Validations: [],
}

const subscription = (i: number, cpIdx: number, qcId: number) => ({
  PriceNotificationSubscriptionId: 4560 + i,
  QuoteConfigurationId: qcId,
  CounterPartyId: counterParties[cpIdx].CounterPartyId,
  CounterPartyName: counterParties[cpIdx].Name,
  ProductIds: [products[i % products.length].ProductId, products[(i + 1) % products.length].ProductId],
  LocationIds: [locations[i % locations.length].LocationId],
  CreatedDate: '2026-04-01T08:00:00Z',
  ModifiedDate: `2026-04-${String(15 + (i % 14)).padStart(2, '0')}T08:00:00Z`,
  IsActive: i % 5 !== 4,
})

export const priceNotificationsSubscriptionsFixture = {
  TotalRecords: 7,
  Data: [
    subscription(0, 0, 101),
    subscription(1, 1, 101),
    subscription(2, 2, 102),
    subscription(3, 3, 102),
    subscription(4, 4, 103),
    subscription(5, 0, 103),
    subscription(6, 1, 102),
  ],
  Query: null,
  Validations: [],
}
