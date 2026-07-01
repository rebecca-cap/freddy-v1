// Freddy mock fixture — fictional
// Backs /Admin/AuthorizationAllocationAssociations, /Admin/AllocationAssociationManagement.
// Consumer (AuthorizationAllocationMappings.tsx:62) crashes when
// referenceData?.Data?.Consignees|Products|Terminals is undefined and it
// calls .reduce. Each reference list must include `*Associations[]` arrays.
// IDs: Allocations 1001–1050, Authorizations 1100–1130.
// Cross-refs: Counterparties 9001+ (T1), Locations 5001+ (T2), Products 7001+ (T2).

const SUPPLIERS = [
  { id: 9101, name: 'Demo Refining Inc.' },
  { id: 9102, name: 'Frontier Fuel Services' },
  { id: 9103, name: 'Cascade Logistics' },
] as const

const CUSTOMERS = [
  { id: 9001, name: 'Demo Counterparty Alpha' },
  { id: 9002, name: 'Prairie Trading Co.' },
  { id: 9003, name: 'Summit Distributors' },
  { id: 9004, name: 'Lone Star Wholesale' },
  { id: 9005, name: 'Cascade Logistics' },
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

const refreshDaily = {
  RefreshFrequencyTypeCvId: 301,
  RefreshFrequencyTypeDisplay: 'Daily',
  RefreshFrequencyTypeMeaning: 'DAILY',
}

const makeVolume = (id: number, start: number) => ({
  AllocationEndDateTime: '2026-05-31T23:59:59Z',
  AllocationStartDateTime: '2026-05-01T00:00:00Z',
  AllocationTimezone: 'America/Chicago',
  AllocationUom: 'GAL',
  AllocationVolumeId: 4000 + id,
  AllocationVolumeSourceId: `DTN-VOL-${4000 + id}`,
  CarryForward: true,
  CreatedDateTime: '2026-04-15T08:00:00Z',
  GPOAllowance: 5000,
  GPOAmount: start * 0.05,
  GPORemaining: start * 0.04,
  LiftedAmount: start * 0.35,
  MaxAvailable: start,
  MaxAvailableDate: '2026-05-02T00:00:00Z',
  MaxAvailableRefreshFrequencyTypeCvId: 301,
  MaxAvailableRefreshFrequencyTypeDisplay: 'Daily',
  MaxAvailableRefreshFrequencyTypeMeaning: 'DAILY',
  NextRefreshDateTime: '2026-05-03T00:00:00Z',
  RefreshAmount: Math.round(start / 30),
  RefreshDays: 1,
  ...refreshDaily,
  RemainingAmount: start * 0.65,
  ScaledStartAmount: start,
  ScalePercent: 100,
  StartAmount: start,
  Status: 'Active',
  UpdatedDateTime: '2026-05-02T06:00:00Z',
})

// 6 external (DTN-side) allocations
const ALLOCATIONS = [
  { i: 0, prod: 0, term: 0, cons: 0, supp: 0, vol: 50000 },
  { i: 1, prod: 1, term: 0, cons: 0, supp: 0, vol: 35000 },
  { i: 2, prod: 0, term: 1, cons: 1, supp: 1, vol: 28000 },
  { i: 3, prod: 2, term: 1, cons: 1, supp: 1, vol: 22000 },
  { i: 4, prod: 4, term: 2, cons: 2, supp: 2, vol: 18000 },
  { i: 5, prod: 3, term: 3, cons: 3, supp: 0, vol: 15000 },
].map((a) => {
  const id = 1001 + a.i
  return {
    AllocationConsigneeId: 2001 + a.cons,
    AllocationId: id,
    AllocationName: `${SUPPLIERS[a.supp].name.split(' ')[0]}-${PRODUCTS[a.prod].name}-${LOCATIONS[a.term].name.split(' ')[0]}`,
    AllocationProductId: 3001 + a.prod,
    AllocationTerminalId: 4001 + a.term,
    AllocationVolumes: [makeVolume(id, a.vol)],
    CreatedDateTime: '2026-04-10T08:00:00Z',
    IsActive: true,
    SupplierCounterParty: SUPPLIERS[a.supp].name,
    SupplierCounterPartyId: SUPPLIERS[a.supp].id,
    UpdatedDateTime: '2026-05-02T06:00:00Z',
  }
})

// Counterparty/authorization setup options. Each row is a Gravitate
// authorization-side configuration. AuthorizationAllocationLinkId set on
// rows already linked to an external allocation.
const COUNTERPARTY_SETUPS = [
  { i: 0, cp: 0, prod: 0, loc: 0, linked: 1001, link: 1101 },
  { i: 1, cp: 0, prod: 1, loc: 0, linked: 1002, link: 1102 },
  { i: 2, cp: 1, prod: 0, loc: 1, linked: 1003, link: 1103 },
  { i: 3, cp: 1, prod: 2, loc: 1, linked: 1004, link: 1104 },
  { i: 4, cp: 2, prod: 4, loc: 2, linked: 1005, link: 1105 },
  { i: 5, cp: 3, prod: 3, loc: 3, linked: 1006, link: 1106 },
  { i: 6, cp: 4, prod: 0, loc: 0, linked: 0, link: 0 },
  { i: 7, cp: 4, prod: 1, loc: 1, linked: 0, link: 0 },
  { i: 8, cp: 2, prod: 0, loc: 2, linked: 0, link: 0 },
].map((s) => ({
  AuthorizationAllocationSetup: {
    TradeEntrySetupId: 6001 + s.i,
    ProductId: PRODUCTS[s.prod].id,
    Product: PRODUCTS[s.prod].name,
    LocationId: LOCATIONS[s.loc].id,
    Location: LOCATIONS[s.loc].name,
    MarketPlatformInstrumentId: 6500 + s.i,
    MarketPlatformInstrument: `${PRODUCTS[s.prod].name} ${LOCATIONS[s.loc].name}`,
    IsActive: true,
    TradeTypeCvId: 401,
    TradeType: 'Lifting',
  },
  CounterPartyId: CUSTOMERS[s.cp].id,
  CounterPartyName: CUSTOMERS[s.cp].name,
  LinkedAllocationId: s.linked,
  AuthorizationAllocationLinkId: s.link,
  RefreshFrequencyTypeCvId: 301,
}))

// Reference data: maps DTN-side ids -> Gravitate ids (associations).
const REFERENCES_PRODUCTS = PRODUCTS.map((p, idx) => ({
  AllocationProductAssociations: [
    { AllocationProductAssociationId: 7100 + idx, ProductId: p.id },
  ],
  AllocationProductId: 3001 + idx,
  Display: p.name,
  IdentifierData: `DTN-PROD-${p.name.replace(/\s+/g, '').toUpperCase()}`,
}))

const REFERENCES_TERMINALS = LOCATIONS.map((l, idx) => ({
  AllocationTerminalAssociations: [
    { AllocationTerminalAssociationId: 7200 + idx, AllocationTerminalId: 4001 + idx, LocationId: l.id },
  ],
  AllocationTerminalId: 4001 + idx,
  Display: l.name,
  IdentifierData: `DTN-TERM-${l.name.replace(/\s+/g, '').toUpperCase()}`,
}))

const REFERENCES_CONSIGNEES = CUSTOMERS.slice(0, 4).map((c, idx) => ({
  AllocationConsigneeAssociations: [
    { AllocationConsigneeAssociationId: 7300 + idx, CounterPartyId: c.id },
  ],
  AllocationConsigneeId: 2001 + idx,
  Display: c.name,
  IdentifierData: `DTN-CONS-${c.id}`,
}))

// === Exports ===

// admin/allocation/management/ReadManagementData
export const allocationManagementReadFixture = {
  CounterPartySetupOptions: COUNTERPARTY_SETUPS,
  Allocations: ALLOCATIONS,
}

// admin/allocation/management/GetMetadata — used for FrequencyTypeList
export const allocationManagementMetadataFixture = {
  Data: {
    FrequencyTypeList: [
      { Text: 'Daily', Value: '301', GroupingValue: null },
      { Text: 'Weekly', Value: '302', GroupingValue: null },
      { Text: 'Monthly', Value: '303', GroupingValue: null },
      { Text: 'On Demand', Value: '304', GroupingValue: null },
    ],
  },
  Query: '',
  Validations: [],
}

// admin/allocation/reference/GetReferences
export const allocationReferencesFixture = {
  Data: {
    Products: REFERENCES_PRODUCTS,
    Terminals: REFERENCES_TERMINALS,
    Consignees: REFERENCES_CONSIGNEES,
  },
  Query: '',
  Validations: [],
}

// admin/allocation/reference/GetMetaDataForReferences
export const allocationReferenceMetadataFixture = {
  Data: {
    Products: PRODUCTS.map((p) => ({ Text: p.name, Value: String(p.id), GroupingValue: null })),
    Locations: LOCATIONS.map((l) => ({ Text: l.name, Value: String(l.id), GroupingValue: null })),
    CounterParties: CUSTOMERS.map((c) => ({ Text: c.name, Value: String(c.id), GroupingValue: null })),
  },
  Query: '',
  Validations: [],
}

// QuoteBook/Analytics/Allocation/Admin/GetAllocations — bare array
export const quoteBookAllocationsFixture = ALLOCATIONS.map((a) => ({
  AllocationConsignee: REFERENCES_CONSIGNEES.find((c) => c.AllocationConsigneeId === a.AllocationConsigneeId)?.Display ?? '',
  AllocationConsigneeId: a.AllocationConsigneeId,
  AllocationId: a.AllocationId,
  AllocationName: a.AllocationName,
  AllocationProduct: REFERENCES_PRODUCTS.find((p) => p.AllocationProductId === a.AllocationProductId)?.Display ?? '',
  AllocationProductId: a.AllocationProductId,
  AllocationTerminal: REFERENCES_TERMINALS.find((t) => t.AllocationTerminalId === a.AllocationTerminalId)?.Display ?? '',
  AllocationTerminalId: a.AllocationTerminalId,
  AllocationVolumes: a.AllocationVolumes,
  CreatedDateTime: a.CreatedDateTime,
  IsActive: a.IsActive,
  SupplierCounterParty: a.SupplierCounterParty,
  SupplierCounterPartyId: a.SupplierCounterPartyId,
  UpdatedDateTime: a.UpdatedDateTime,
}))

// QuoteBook/Analytics/Allocation/Admin/GetAssociations — bare array
export const quoteBookAllocationAssociationsFixture = [
  {
    QuoteConfigurationMappingId: 8001,
    QuoteConfigurationName: 'ULSD Houston Wholesale',
    Product: 'ULSD',
    ProductId: 7001,
    Location: 'Houston Terminal',
    LocationId: 5001,
    CounterParty: 'Demo Counterparty Alpha',
    LinkedAllocationIds: [{ AllocationId: 1001, AssociationId: 9501, QuoteConfigurationMappingId: 8001 }],
  },
  {
    QuoteConfigurationMappingId: 8002,
    QuoteConfigurationName: 'Gasoline 87 Houston Wholesale',
    Product: 'Gasoline 87',
    ProductId: 7002,
    Location: 'Houston Terminal',
    LocationId: 5001,
    CounterParty: 'Demo Counterparty Alpha',
    LinkedAllocationIds: [{ AllocationId: 1002, AssociationId: 9502, QuoteConfigurationMappingId: 8002 }],
  },
  {
    QuoteConfigurationMappingId: 8003,
    QuoteConfigurationName: 'ULSD Dallas Bulk',
    Product: 'ULSD',
    ProductId: 7001,
    Location: 'Dallas Hub',
    LocationId: 5002,
    CounterParty: 'Prairie Trading Co.',
    LinkedAllocationIds: [{ AllocationId: 1003, AssociationId: 9503, QuoteConfigurationMappingId: 8003 }],
  },
  {
    QuoteConfigurationMappingId: 8004,
    QuoteConfigurationName: 'Gasoline 91 Dallas Bulk',
    Product: 'Gasoline 91',
    ProductId: 7003,
    Location: 'Dallas Hub',
    LocationId: 5002,
    CounterParty: 'Prairie Trading Co.',
    LinkedAllocationIds: [{ AllocationId: 1004, AssociationId: 9504, QuoteConfigurationMappingId: 8004 }],
  },
  {
    QuoteConfigurationMappingId: 8005,
    QuoteConfigurationName: 'Biodiesel B5 Salt Lake',
    Product: 'Biodiesel B5',
    ProductId: 7005,
    Location: 'Salt Lake Rack',
    LocationId: 5003,
    CounterParty: 'Summit Distributors',
    LinkedAllocationIds: [{ AllocationId: 1005, AssociationId: 9505, QuoteConfigurationMappingId: 8005 }],
  },
  {
    QuoteConfigurationMappingId: 8006,
    QuoteConfigurationName: 'Jet A Phoenix',
    Product: 'Jet A',
    ProductId: 7004,
    Location: 'Phoenix Terminal',
    LocationId: 5004,
    CounterParty: 'Lone Star Wholesale',
    LinkedAllocationIds: [{ AllocationId: 1006, AssociationId: 9506, QuoteConfigurationMappingId: 8006 }],
  },
  {
    QuoteConfigurationMappingId: 8007,
    QuoteConfigurationName: 'ULSD Phoenix Retail',
    Product: 'ULSD',
    ProductId: 7001,
    Location: 'Phoenix Terminal',
    LocationId: 5004,
    CounterParty: 'Cascade Logistics',
    LinkedAllocationIds: [],
  },
]
