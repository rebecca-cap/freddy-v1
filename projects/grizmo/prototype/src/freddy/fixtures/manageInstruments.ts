// Freddy mock fixture — fictional
// GetAllMarketPlatformInstruments returns ReadMPIsResponse — { Data: MarketPlatformInstrument[] }.
// GetMetaData returns APIResponse<MPIMetadata>.
// IDs 6001–6030 reserved for cross-team references (MPIs).

const initialOrderStatusOptions = [
  { Text: 'Pending', Value: '1', GroupingValue: null },
  { Text: 'Approved', Value: '2', GroupingValue: null },
  { Text: 'Auto-Approve', Value: '3', GroupingValue: null },
]

const productAssociationTypes = [
  { Text: 'Single Product', Value: '1', GroupingValue: null },
  { Text: 'Product Group', Value: '2', GroupingValue: null },
  { Text: 'Hierarchy', Value: '3', GroupingValue: null },
]

const locationAssociationTypes = [
  { Text: 'Single Location', Value: '1', GroupingValue: null },
  { Text: 'Location Group', Value: '2', GroupingValue: null },
  { Text: 'Hierarchy', Value: '3', GroupingValue: null },
]

const loadingNumberBehaviors = [
  { Text: 'Required', Value: '1', GroupingValue: null },
  { Text: 'Optional', Value: '2', GroupingValue: null },
  { Text: 'None', Value: '3', GroupingValue: null },
]

const calendars = [
  { Text: 'Standard Trading', Value: '1', GroupingValue: null },
  { Text: '24/7', Value: '2', GroupingValue: null },
  { Text: 'Business Days', Value: '3', GroupingValue: null },
]

const contractPricingMethods = [
  { Text: 'Fixed', Value: '1', GroupingValue: null },
  { Text: 'Index', Value: '2', GroupingValue: null },
  { Text: 'Formula', Value: '3', GroupingValue: null },
]

const volumeDistributionTypes = [
  { Text: 'Even Daily', Value: '1', GroupingValue: null },
  { Text: 'Weighted', Value: '2', GroupingValue: null },
  { Text: 'Custom', Value: '3', GroupingValue: null },
]

const makeSubtype = (id: number, parentId: number, name: string, description: string) => ({
  MarketPlatformInstrumentSubtypeId: id,
  MarketPlatformInstrumentId: parentId,
  Name: name,
  Description: description,
  IsActive: true,
  AllowBid: true,
  AllowMarket: true,
  AllowVolumeEdits: false,
  ContractPricingMethodCvId: 2,
  VolumeDistributionTypeCvId: 1,
  ContractPricingMethod: 'Index',
  ContractPricingMethodMeaning: 'Index',
  VolumeDistributionType: 'Even Daily',
  VolumeDistributionTypeMeaning: 'Even Daily',
  MarketPlatformInstrumentName: name,
})

const makeMPI = (
  id: number,
  name: string,
  tradeType: string,
  tradeTypeCvId: number,
  isTas: boolean,
  allowsAllocations: boolean,
  subtypes: ReturnType<typeof makeSubtype>[] = []
) => ({
  MarketPlatformInstrumentId: id,
  InstrumentName: name,
  MarkerId: id + 1000,
  TradeTypeCvId: tradeTypeCvId,
  InactivateLoadingNumbersOnUse: false,
  LoadingNumberBehaviorCvId: 2,
  ProductAssociationTypeCvId: 1,
  LocationAssociationTypeCvId: 1,
  OriginLocationAssociationTypeCvId: null,
  AllowAdditionalLocationSelection: false,
  UseDestinationLocations: false,
  CalendarId: 1,
  PricingCalendarId: 1,
  PromptDefaultOrderDurationOffset: 'P0D',
  PromptsEffectiveTillEndOfMonth: false,
  AllowBid: true,
  AllowMarketOrder: true,
  InitialOrderStatusCvId: 2,
  IsTradeAtSettle: isTas,
  HasDeliveryPeriodGroups: false,
  AllowOverridingDatesOnPromptOrders: false,
  AllowsAllocations: allowsAllocations,
  RequireAllocationsForPrimaryProducts: false,
  DecrementAllocations: allowsAllocations,
  Calendar: 'Standard Trading',
  InitialOrderStatus: 'Approved',
  LocationGroupLocationHierarchyType: 'Default',
  OriginLocationAssociationType: 'None',
  PriceAdjustmentProductHierarchyType: 'Default',
  TradeType: tradeType,
  Marker: name,
  LocationGroupLocationHierarchyTypeCvId: 1,
  PriceAdjustmentProductHierarchyTypeCvId: 1,
  MarketPlatformInstrumentRoles: [
    { RoleId: 1, Role: 'Buyer' },
    { RoleId: 2, Role: 'Seller' },
  ],
  MarketPlatformInstrumentSubtypes: subtypes,
})

export const manageInstrumentsReadFixture = {
  TotalRecords: 8,
  Data: [
    makeMPI(6001, 'Prompt Rack', 'Prompt', 1, false, true, [
      makeSubtype(6101, 6001, 'Standard Prompt', 'Same-day rack lifting'),
      makeSubtype(6102, 6001, 'Express Prompt', 'Priority dispatch lane'),
    ]),
    makeMPI(6002, 'Forward Rack', 'Forward', 2, false, true, [
      makeSubtype(6103, 6002, 'Monthly Forward', '30-day forward window'),
    ]),
    makeMPI(6003, 'Bulk Contract', 'Contract', 3, false, false, [
      makeSubtype(6104, 6003, 'Tier 1 Contract', 'Strategic accounts'),
      makeSubtype(6105, 6003, 'Tier 2 Contract', 'Standard contracts'),
    ]),
    makeMPI(6004, 'Trade-At-Settle', 'TAS', 4, true, false),
    makeMPI(6005, 'Aviation Direct', 'Direct', 5, false, true, [
      makeSubtype(6106, 6005, 'Jet A Lift', 'Commercial aviation lifting'),
    ]),
    makeMPI(6006, 'Biofuel Allocation', 'Allocation', 6, false, true, [
      makeSubtype(6107, 6006, 'Renewable Diesel', 'R99 allocation lane'),
      makeSubtype(6108, 6006, 'B20 Blend', 'B20 allocation lane'),
    ]),
    makeMPI(6007, 'Pipeline Cycle', 'Cycle', 7, false, false),
    makeMPI(6008, 'Bid Block', 'Bid', 8, false, true),
  ],
  Query: null,
  Validations: [],
}

export const manageInstrumentsMetadataFixture = {
  Data: {
    InitialOrderStatus: initialOrderStatusOptions,
    ProductAssociationTypes: productAssociationTypes,
    LocationAssociationTypes: locationAssociationTypes,
    LoadingNumberBehaviors: loadingNumberBehaviors,
    Calendars: calendars,
    ContractPricingMethods: contractPricingMethods,
    VolumeDistributionTypes: volumeDistributionTypes,
    InstrumentTypeList: [
      { Text: 'Prompt', Value: '1', GroupingValue: null },
      { Text: 'Forward', Value: '2', GroupingValue: null },
      { Text: 'Contract', Value: '3', GroupingValue: null },
    ],
    UnitOfMeasureList: [
      { Text: 'Gallon', Value: 'GAL', GroupingValue: null },
      { Text: 'Barrel', Value: 'BBL', GroupingValue: null },
    ],
    CurrencyList: [{ Text: 'USD', Value: 'USD', GroupingValue: null }],
  },
  Query: null,
  Validations: [],
}
