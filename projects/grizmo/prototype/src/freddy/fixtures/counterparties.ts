// Freddy mock fixture — fictional
// /Admin/Counterparties — Read returns { Data: CounterPartyOverviewData[] }.
// GetMetaData returns { Data: CounterPartyMetadata } with typed lists.
// IDs 9001-9010 are referenced by users.ts and quoteBook.ts; keep stable.

const makeCp = (
  id: number,
  name: string,
  abbr: string,
  category: 1 | 2 | 3,
  opts: Partial<{
    HasCustomerPortal: boolean
    HasTradeRelationship: boolean
    IsActive: boolean
    MappedProductIds: number[]
    MappedLocationIds: number[]
    SupplierEODPricePublicationTime: string
    CreditStatusOverrideCvId: number
  }> = {}
) => ({
  CounterPartyId: id,
  Name: name,
  Abbreviation: abbr,
  HasCustomerPortal: opts.HasCustomerPortal ?? false,
  CounterpartyCategoryCvId: category,
  PrimaryInternalCounterpartyId: 1,
  CreditStatusOverrideCvId: opts.CreditStatusOverrideCvId ?? 1,
  IsActive: opts.IsActive ?? true,
  SourceInfo: null,
  HasTradeRelationship: opts.HasTradeRelationship ?? true,
  MappedProductIds: opts.MappedProductIds ?? [7001, 7002],
  MappedLocationIds: opts.MappedLocationIds ?? [5001],
  SupplierEODPricePublicationTime: opts.SupplierEODPricePublicationTime ?? '17:00',
})

export const counterpartiesReadFixture = {
  TotalRecords: 10,
  Data: [
    // 1=Customer, 2=Supplier, 3=Both
    makeCp(9001, 'Demo Refining Inc.', 'DRI', 2, {
      HasCustomerPortal: true,
      MappedProductIds: [7001, 7002, 7003, 7004],
      MappedLocationIds: [5001, 5002],
    }),
    makeCp(9002, 'Frontier Fuel Services', 'FFS', 1, {
      HasCustomerPortal: true,
      MappedProductIds: [7001, 7002],
      MappedLocationIds: [5002, 5003],
    }),
    makeCp(9003, 'Cascade Logistics LLC', 'CLG', 1, {
      MappedProductIds: [7001],
      MappedLocationIds: [5001, 5003, 5004],
    }),
    makeCp(9004, 'Prairie Trading Co.', 'PTC', 3, {
      HasCustomerPortal: true,
      MappedProductIds: [7001, 7002, 7005],
      MappedLocationIds: [5002],
    }),
    makeCp(9005, 'Summit Energy Partners', 'SEP', 1, {
      MappedProductIds: [7002, 7003],
      MappedLocationIds: [5004],
    }),
    makeCp(9006, 'Bayou Petroleum Group', 'BPG', 2, {
      HasCustomerPortal: false,
      MappedProductIds: [7001, 7002, 7003, 7004, 7005],
      MappedLocationIds: [5001],
      SupplierEODPricePublicationTime: '17:30',
    }),
    makeCp(9007, 'Northstar Distribution', 'NSD', 1, {
      HasCustomerPortal: true,
      MappedProductIds: [7001, 7002],
      MappedLocationIds: [5003, 5004],
    }),
    makeCp(9008, 'Mesa Fuel Marketing', 'MFM', 1, {
      MappedProductIds: [7001, 7002, 7004],
      MappedLocationIds: [5001, 5004],
    }),
    makeCp(9009, 'Atlas Bulk Carriers', 'ABC', 3, {
      MappedProductIds: [7001, 7003],
      MappedLocationIds: [5001, 5002, 5003],
    }),
    makeCp(9010, 'Riverbend Refiners', 'RBR', 2, {
      IsActive: false,
      HasTradeRelationship: false,
      MappedProductIds: [7001, 7002],
      MappedLocationIds: [5001],
      SupplierEODPricePublicationTime: '16:00',
    }),
  ],
  Query: '',
  Validations: [],
}

export const counterpartiesMetadataFixture = {
  Data: {
    IsSingleSourceSystem: true,
    CounterPartyCategoryList: [
      { Text: 'Customer', Value: '1', GroupingValue: null },
      { Text: 'Supplier', Value: '2', GroupingValue: null },
      { Text: 'Customer & Supplier', Value: '3', GroupingValue: null },
    ],
    CreditStatusList: [
      { Text: 'Approved', Value: '1', GroupingValue: null },
      { Text: 'Watch', Value: '2', GroupingValue: null },
      { Text: 'Hold', Value: '3', GroupingValue: null },
      { Text: 'Suspended', Value: '4', GroupingValue: null },
    ],
    InternalCounterPartyList: [
      { Text: 'Demo Internal Co.', Value: '1', GroupingValue: null },
      { Text: 'Demo Trading LLC', Value: '2', GroupingValue: null },
    ],
    EditableSources: [],
    LocationList: [
      { Text: 'Houston Terminal', Value: '5001', GroupingValue: null },
      { Text: 'Dallas Hub', Value: '5002', GroupingValue: null },
      { Text: 'Salt Lake Rack', Value: '5003', GroupingValue: null },
      { Text: 'Phoenix Distribution', Value: '5004', GroupingValue: null },
    ],
    ProductList: [
      { Text: 'ULSD', Value: '7001', GroupingValue: 'Refined' },
      { Text: 'Gasoline 87', Value: '7002', GroupingValue: 'Refined' },
      { Text: 'Gasoline 91', Value: '7003', GroupingValue: 'Refined' },
      { Text: 'Jet A', Value: '7004', GroupingValue: 'Refined' },
      { Text: 'Biodiesel B5', Value: '7005', GroupingValue: 'Renewable' },
    ],
    SupplierEODPricePublicationTimes: [
      { Text: '16:00', Value: '16:00', GroupingValue: null },
      { Text: '17:00', Value: '17:00', GroupingValue: null },
      { Text: '17:30', Value: '17:30', GroupingValue: null },
      { Text: '18:00', Value: '18:00', GroupingValue: null },
    ],
  },
  Query: null,
  Validations: [],
}
