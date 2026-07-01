// Freddy mock fixture — fictional
// /Admin/AllocationMappings — DTN file-import translations.
// Endpoints map source DTN identifiers to Gravitate counterparties / locations / products.
// Bare arrays for Read endpoints; flat object for Metadata endpoints.

const COUNTERPARTIES = [
  { id: 9001, name: 'Demo Counterparty Alpha' },
  { id: 9002, name: 'Prairie Trading Co.' },
  { id: 9003, name: 'Summit Distributors' },
  { id: 9004, name: 'Lone Star Wholesale' },
  { id: 9005, name: 'Cascade Logistics' },
  { id: 9101, name: 'Demo Refining Inc.' },
  { id: 9102, name: 'Frontier Fuel Services' },
] as const

const LOCATIONS = [
  { id: 5001, name: 'Houston Terminal' },
  { id: 5002, name: 'Dallas Hub' },
  { id: 5003, name: 'Salt Lake Rack' },
  { id: 5004, name: 'Phoenix Terminal' },
] as const

const PRODUCTS = [
  { id: 7001, name: 'ULSD' },
  { id: 7002, name: 'Gasoline 87' },
  { id: 7003, name: 'Gasoline 91' },
  { id: 7004, name: 'Jet A' },
  { id: 7005, name: 'Biodiesel B5' },
] as const

// Suppliers — Read returns SupplierTranslation[]
export const allocationMappingSuppliersFixture = [
  { SourceValue: 'DEMOREF', SourceDisplay: 'DEMOREF — Demo Refining', CounterPartyId: 9101, CounterPartyName: 'Demo Refining Inc.' },
  { SourceValue: 'FRNTRFFS', SourceDisplay: 'FRNTRFFS — Frontier Fuel', CounterPartyId: 9102, CounterPartyName: 'Frontier Fuel Services' },
  { SourceValue: 'CASCLOG', SourceDisplay: 'CASCLOG — Cascade Logistics', CounterPartyId: 9005, CounterPartyName: 'Cascade Logistics' },
  { SourceValue: 'PRRTRDG', SourceDisplay: 'PRRTRDG — Prairie Trading', CounterPartyId: 9002, CounterPartyName: 'Prairie Trading Co.' },
  { SourceValue: 'LSWHLSL', SourceDisplay: 'LSWHLSL — Lone Star Wholesale', CounterPartyId: 9004, CounterPartyName: 'Lone Star Wholesale' },
  { SourceValue: 'SMTDIST', SourceDisplay: 'SMTDIST — Summit Distributors', CounterPartyId: 9003, CounterPartyName: 'Summit Distributors' },
]

export const allocationMappingSuppliersMetadataFixture = {
  CounterParties: COUNTERPARTIES.map((c) => ({ Text: c.name, Value: String(c.id), GroupingValue: null })),
}

// Locations — LocationTranslation[]
export const allocationMappingLocationsFixture = [
  { SourceValue: 'HOU01', SourceDisplay: 'HOU01 — Houston', LocationId: 5001, LocationName: 'Houston Terminal' },
  { SourceValue: 'DAL01', SourceDisplay: 'DAL01 — Dallas', LocationId: 5002, LocationName: 'Dallas Hub' },
  { SourceValue: 'SLC01', SourceDisplay: 'SLC01 — Salt Lake', LocationId: 5003, LocationName: 'Salt Lake Rack' },
  { SourceValue: 'PHX01', SourceDisplay: 'PHX01 — Phoenix', LocationId: 5004, LocationName: 'Phoenix Terminal' },
]

export const allocationMappingLocationsMetadataFixture = {
  Locations: LOCATIONS.map((l) => ({ Text: l.name, Value: String(l.id), GroupingValue: null })),
}

// Product groups — ProductGroupTranslation[]
export const allocationMappingProductsFixture = [
  { SourceValue: 'ULSD', SourceDisplay: 'ULSD — Ultra Low Sulfur Diesel', ProductIds: [7001] },
  { SourceValue: 'CBOB87', SourceDisplay: 'CBOB87 — Conventional 87', ProductIds: [7002] },
  { SourceValue: 'PREM91', SourceDisplay: 'PREM91 — Premium 91', ProductIds: [7003] },
  { SourceValue: 'JETA', SourceDisplay: 'JETA — Jet A Kerosene', ProductIds: [7004] },
  { SourceValue: 'BIO5', SourceDisplay: 'BIO5 — Biodiesel B5 Blend', ProductIds: [7005] },
  { SourceValue: 'GASMIX', SourceDisplay: 'GASMIX — Gasoline (any grade)', ProductIds: [7002, 7003] },
]

export const allocationMappingProductsMetadataFixture = {
  Products: PRODUCTS.map((p) => ({ Text: p.name, Value: String(p.id), GroupingValue: null })),
}
