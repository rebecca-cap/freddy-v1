// Freddy mock fixture — fictional
// /Admin/Counterparties — Read returns { Data: CounterPartyOverviewData[] }.
// GetMetaData returns { Data: CounterPartyMetadata } with typed lists.
// IDs are real HFS counterparties; keep stable.

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
  MappedProductIds: opts.MappedProductIds ?? [67, 41],
  MappedLocationIds: opts.MappedLocationIds ?? [1142],
  SupplierEODPricePublicationTime: opts.SupplierEODPricePublicationTime ?? '17:00',
})

export const counterpartiesReadFixture = {
  TotalRecords: 7,
  Data: [
    // 1=Customer, 2=Supplier, 3=Both
    makeCp(177, 'BRAD HALL & ASSOC', 'BHA', 1, {
      HasCustomerPortal: true,
      MappedProductIds: [67, 41, 53],
      MappedLocationIds: [1142, 1701],
    }),
    makeCp(761, 'MUSKET CORP', 'MUS', 3, {
      HasCustomerPortal: true,
      MappedProductIds: [67, 41],
      MappedLocationIds: [1633, 1142],
    }),
    makeCp(800, 'OFFEN PETROLEUM', 'OFF', 1, {
      MappedProductIds: [67, 41, 53],
      MappedLocationIds: [1142, 1701, 1633],
    }),
    makeCp(704, 'MAVERIK INC', 'MAV', 1, {
      HasCustomerPortal: true,
      MappedProductIds: [67, 41, 53],
      MappedLocationIds: [1812, 1955],
    }),
    makeCp(1056, 'TARTAN OIL', 'TAR', 1, {
      MappedProductIds: [67, 41],
      MappedLocationIds: [1955, 2064],
    }),
    makeCp(1188, 'WESTERN CONVENIENCE STORES', 'WCS', 1, {
      HasCustomerPortal: true,
      MappedProductIds: [67, 41, 53],
      MappedLocationIds: [1142, 1701],
    }),
    makeCp(1342, 'KUM & GO LC', 'KMG', 1, {
      MappedProductIds: [67, 41],
      MappedLocationIds: [1633, 1812],
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
      { Text: 'Sinclair Internal Co.', Value: '1', GroupingValue: null },
      { Text: 'Sinclair Trading LLC', Value: '2', GroupingValue: null },
    ],
    EditableSources: [],
    LocationList: [
      { Text: 'DENVER', Value: '1142', GroupingValue: null },
      { Text: 'N PLATTE', Value: '1633', GroupingValue: null },
      { Text: 'CHEYENNE', Value: '1701', GroupingValue: null },
      { Text: 'SALT LAKE', Value: '1812', GroupingValue: null },
      { Text: 'ALBUQUERQUE', Value: '1955', GroupingValue: null },
      { Text: 'EL PASO', Value: '2064', GroupingValue: null },
    ],
    ProductList: [
      { Text: '#2 ULSD - 0032', Value: '67', GroupingValue: 'Refined' },
      { Text: 'UNL 87 - 0011', Value: '41', GroupingValue: 'Refined' },
      { Text: 'PREM UNL 91 - 0019', Value: '53', GroupingValue: 'Refined' },
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
