// Freddy mock fixture — Growmark Inventory Replacement Cost variant.
// /Admin/Counterparties — Read returns { Data: CounterPartyOverviewData[] }.
// GetMetaData returns { Data: CounterPartyMetadata } with typed lists.
// Counterparty names are intentionally BLANK — cost-tracking config carries no
// customer. IDs 9001-9002 are referenced by users.ts and quoteBook.ts; keep stable.

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
    Note: string
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
  MappedProductIds: opts.MappedProductIds ?? [189877, 189878],
  MappedLocationIds: opts.MappedLocationIds ?? [1207],
  SupplierEODPricePublicationTime: opts.SupplierEODPricePublicationTime ?? '18:00',
  Note: opts.Note ?? '',
})

export const counterpartiesReadFixture = {
  TotalRecords: 2,
  Data: [
    // 1=Customer, 2=Supplier, 3=Both
    // Names intentionally blank — unbranded supplier slots for cost-tracking config.
    makeCp(9001, '', '', 2, {
      MappedProductIds: [189877, 189878],
      MappedLocationIds: [1207],
      Note: 'Unbranded supplier slot — name intentionally blank. Cost-tracking config carries no customer.',
    }),
    makeCp(9002, '', '', 2, {
      MappedProductIds: [189901, 189903],
      MappedLocationIds: [1208, 1211],
      Note: 'Unbranded supplier slot — name intentionally blank.',
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
      { Text: 'Internal Cost Center', Value: '1', GroupingValue: null },
      { Text: 'Internal Trading', Value: '2', GroupingValue: null },
    ],
    EditableSources: [],
    LocationList: [
      { Text: '1207 - NORTH LITTLE ROCK, AR - MPL- N', Value: '1207', GroupingValue: null },
      { Text: '1208 - LITTLE ROCK, AR - MPL- S', Value: '1208', GroupingValue: null },
      { Text: '1211 - FORT SMITH, AR - MPL- W', Value: '1211', GroupingValue: null },
      { Text: '1215 - MEMPHIS, TN - MPL- E', Value: '1215', GroupingValue: null },
      { Text: '1219 - TULSA, OK - MPL- N', Value: '1219', GroupingValue: null },
    ],
    ProductList: [
      { Text: '189877 - #2 ULS CL', Value: '189877', GroupingValue: 'Refined' },
      { Text: '189878 - #2 ULS DYED', Value: '189878', GroupingValue: 'Refined' },
      { Text: '189901 - UNL 87', Value: '189901', GroupingValue: 'Refined' },
      { Text: '189903 - PREM UNL', Value: '189903', GroupingValue: 'Refined' },
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
