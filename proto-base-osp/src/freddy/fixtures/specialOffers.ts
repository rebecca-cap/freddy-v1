// Freddy mock fixture — fictional
// /SpecialOffers admin page + Create New Offer wizard.
//   - GetSpecialOffers  -> SpecialOffer[] (BARE ARRAY, not Data-wrapped)
//   - GetMetaData       -> { Data: SpecialOfferMetaDataModel } (drives the whole wizard)
//   - GetAuthorizedCounterPartyIds -> { Data: number[] } (step 4 authorization join)
//   - CreateSpecialOffer-> { Data: {...}, Validations: [] } (submit)
//
// Schema authority: frontend/src/types/api/schemas/SpecialOffers.Models.* (prod).
// The wizard derives offer-type CARDS from SpecialOfferTemplates grouped by
// CategoryType; each category's description comes from the template whose
// Name === CategoryType (case-insensitive). CategoryType MUST be lowercase —
// the component keys the gavel icon + auction logic off `=== 'auction'`.

const makeOffer = (
  id: number,
  name: string,
  product: string,
  location: string,
  volume: number,
  acceptedVolume: number,
  status: 'Scheduled' | 'Active' | 'Completed',
  liftStart: string,
  liftEnd: string,
  visibilityStart: string,
  visibilityEnd: string
) => ({
  SpecialOfferId: id,
  Type: 'Fixed Price',
  Name: name,
  Product: product,
  Location: location,
  Volume: volume,
  Status: status,
  Response: Math.round((acceptedVolume / volume) * 100),
  Created: '2026-04-15T09:30:00Z',
  LiftingStartDate: liftStart,
  LiftingEndDate: liftEnd,
  VisibilityStartDateTime: visibilityStart,
  VisibilityEndDateTime: visibilityEnd,
  CreatedByUserName: 'frank.overland@gravitate.energy',
  AcceptedVolume: acceptedVolume,
  PendingSubmissionCount: 0,
})

export const specialOffersListFixture = [
  makeOffer(15001, 'Houston ULSD Promo', 'ULSD', 'Houston Terminal', 25000, 18500, 'Active',
    '2026-05-02T00:00:00Z', '2026-05-09T23:59:59Z', '2026-04-28T08:00:00Z', '2026-05-04T17:00:00Z'),
  makeOffer(15002, 'Houston Gasoline Q2', 'Gasoline 87', 'Houston Terminal', 18000, 12000, 'Active',
    '2026-05-02T00:00:00Z', '2026-05-09T23:59:59Z', '2026-04-29T08:00:00Z', '2026-05-05T17:00:00Z'),
  makeOffer(15003, 'Dallas Premium Push', 'Gasoline 91', 'Dallas Hub', 12000, 12000, 'Completed',
    '2026-04-25T00:00:00Z', '2026-05-01T23:59:59Z', '2026-04-22T08:00:00Z', '2026-04-25T17:00:00Z'),
  makeOffer(15004, 'Salt Lake Jet A', 'Jet A', 'Salt Lake Rack', 30000, 8000, 'Active',
    '2026-05-02T00:00:00Z', '2026-05-09T23:59:59Z', '2026-04-30T08:00:00Z', '2026-05-06T17:00:00Z'),
  makeOffer(15005, 'Biodiesel B5 Special', 'Biodiesel B5', 'Dallas Hub', 8000, 0, 'Scheduled',
    '2026-05-10T00:00:00Z', '2026-05-17T23:59:59Z', '2026-05-05T08:00:00Z', '2026-05-12T17:00:00Z'),
  makeOffer(15006, 'Cascade Q1 Reach', 'ULSD', 'Salt Lake Rack', 20000, 19500, 'Completed',
    '2026-04-10T00:00:00Z', '2026-04-17T23:59:59Z', '2026-04-08T08:00:00Z', '2026-04-12T17:00:00Z'),
]

// --- Offer-type templates ---------------------------------------------------
// One "base" template per category (Name === CategoryType) supplies the category
// card's description + icon; index variants drive the index-pricing sub-flow.
const makeTemplate = (
  id: number,
  name: string,
  description: string,
  categoryType: 'auction' | 'special' | 'promotion',
  pricingMechanism: 'Fixed' | 'Index',
) => ({
  SpecialOfferTemplateId: id,
  Name: name,
  Description: description,
  CategoryType: categoryType,
  MarketPlatformInstrumentId: 201,
  MarketPlatformInstrumentName: 'Forward',
  PricingMechanismMeaning: pricingMechanism,
  PricingMechanismCvId: pricingMechanism === 'Index' ? 2 : 1,
  VolumeDistributionCvId: 1,
  EvaluationTypeCvId: 1,
  DefaultMinimumVolumePerOrder: 5000,
  DefaultMaximumVolumePerOrder: 50000,
  DefaultVolumeIncrement: 1000,
})

const specialOfferTemplates = [
  // Auction (gavel icon, bid flow). Base + index variant.
  makeTemplate(1, 'Auction', 'Customers bid against offered listings for set durations', 'auction', 'Fixed'),
  makeTemplate(2, 'Index Auction', 'Published index-based pricing where customers can submit bids on the index offer', 'auction', 'Index'),
  // Special (tag icon, direct terms). Base + index variant.
  makeTemplate(3, 'Special', 'Send specific price terms to selected customers for set durations', 'special', 'Fixed'),
  makeTemplate(4, 'Index Special', 'Send index-based price terms to selected customers for set durations', 'special', 'Index'),
]

// --- Product × location grid (step 2) --------------------------------------
const makeProductLocation = (
  setupId: number,
  product: string,
  productId: number,
  productGroup: string,
  location: string,
  locationId: number,
  locationGroup: string,
  timeZoneId: number,
  timeZoneAlias: string,
) => ({
  TradeEntrySetupId: setupId,
  MarketPlatformInstrumentId: 201,
  ProductId: productId,
  ProductName: product,
  ProductGroupName: productGroup,
  LocationId: locationId,
  LocationName: location,
  LocationGroupName: locationGroup,
  CurrencyId: 1,
  CurrencyName: 'US Dollar',
  CurrencySymbol: '$',
  UnitOfMeasureId: 1,
  UnitOfMeasureName: 'Gallon',
  UnitOfMeasureSymbol: 'gal',
  TimeZoneId: timeZoneId,
  TimeZoneAlias: timeZoneAlias,
})

// --- Eligible counterparties (step 4) --------------------------------------
// Shape = CounterPartySelectionDto: CounterPartyId/Name/AvailableCredit/
// CreditStatusDisplay/IsActive (NOT Value/Text). The grid joins these against
// GetAuthorizedCounterPartyIds to set each row's IsAuthorized flag.
const makeCounterParty = (
  id: number,
  name: string,
  availableCredit: number,
  creditStatus: string,
) => ({
  CounterPartyId: id,
  Name: name,
  AvailableCredit: availableCredit,
  CreditStatusDisplay: creditStatus,
  IsActive: true,
  AssociatedGroupTags: [],
})

export const specialOffersMetadataFixture = {
  Data: {
    SpecialOfferTemplates: specialOfferTemplates,
    ProductLocationSelections: [
      makeProductLocation(14001, 'ULSD', 7001, 'Refined Products', 'Houston Terminal', 5001, 'Gulf Coast', 1, 'America/Chicago'),
      makeProductLocation(14002, 'Gasoline 87', 7002, 'Refined Products', 'Houston Terminal', 5001, 'Gulf Coast', 1, 'America/Chicago'),
      makeProductLocation(14003, 'Gasoline 91', 7003, 'Refined Products', 'Dallas Hub', 5002, 'South Central', 1, 'America/Chicago'),
      makeProductLocation(14004, 'Jet A', 7004, 'Aviation', 'Salt Lake Rack', 5003, 'Mountain West', 3, 'America/Denver'),
      makeProductLocation(14005, 'Biodiesel B5', 7005, 'Renewables', 'Dallas Hub', 5002, 'South Central', 1, 'America/Chicago'),
    ],
    EligibleCounterParties: [
      makeCounterParty(9001, 'Demo Trucking Co.', 1250000, 'Good Standing'),
      makeCounterParty(9002, 'Frontier Fuel Services', 875000, 'Good Standing'),
      makeCounterParty(9003, 'Cascade Logistics', 2100000, 'Good Standing'),
      makeCounterParty(9004, 'Prairie Trading Co.', 430000, 'Watch'),
      makeCounterParty(9005, 'Sunbelt Wholesale', 0, 'On Hold'),
    ],
    // Resolved by getTimezoneIana: Value = numeric TimeZoneId, Text = IANA string
    // used directly for dayjs().tz(...). Must cover every ProductLocation TimeZoneId.
    ValidTimeZoneIds: [
      { Value: '1', Text: 'America/Chicago' },
      { Value: '2', Text: 'America/New_York' },
      { Value: '3', Text: 'America/Denver' },
      { Value: '4', Text: 'America/Los_Angeles' },
    ],
    IndexOfferMetaData: {
      Products: [
        { Value: '7001', Text: 'ULSD' },
        { Value: '7002', Text: 'Gasoline 87' },
        { Value: '7003', Text: 'Gasoline 91' },
      ],
      Locations: [
        { Value: '5001', Text: 'Houston Terminal' },
        { Value: '5002', Text: 'Dallas Hub' },
        { Value: '5003', Text: 'Salt Lake Rack' },
      ],
      EffectiveTimes: [
        { Value: 'AllDay', Text: 'All Day' },
        { Value: 'Daytime', Text: '06:00–18:00 CT' },
      ],
      WeekendRuleOptions: ['Friday', 'Monday', 'Skip'],
      HolidayRuleOptions: ['PriorBusinessDay', 'NextBusinessDay', 'Skip'],
      FormulaTemplates: [],
      PricePublishers: [
        { Value: '1', Text: 'OPIS' },
        { Value: '2', Text: 'Platts' },
      ],
      PriceInstruments: [
        { CurrencyPerUnitDisplay: 'USD/gal', UnitOfMeasureDisplay: 'GAL', Text: 'OPIS Average', Value: 'OPIS_AVG', GroupingValue: '1' },
        { CurrencyPerUnitDisplay: 'USD/gal', UnitOfMeasureDisplay: 'GAL', Text: 'OPIS Low', Value: 'OPIS_LOW', GroupingValue: '1' },
        { CurrencyPerUnitDisplay: 'USD/gal', UnitOfMeasureDisplay: 'GAL', Text: 'Platts Gulf Coast', Value: 'PLATTS_GC', GroupingValue: '2' },
      ],
      // Keyed by PricePublisher Value.
      PublisherPriceTypes: {
        '1': [
          { Value: 'Avg', Text: 'Average' },
          { Value: 'Low', Text: 'Low' },
          { Value: 'High', Text: 'High' },
        ],
        '2': [{ Value: 'Mean', Text: 'Mean' }],
      },
      PublisherPriceInstruments: {
        '1': [
          { Value: 'OPIS_AVG', Text: 'OPIS Average' },
          { Value: 'OPIS_LOW', Text: 'OPIS Low' },
        ],
        '2': [{ Value: 'PLATTS_GC', Text: 'Platts Gulf Coast' }],
      },
      TradePriceValuationRules: [
        { Value: '1', Text: 'Settlement Price' },
        { Value: '2', Text: 'Daily Average' },
      ],
    },
  },
  Query: null,
  Validations: [],
}

// Step 4 authorization lookup. Returns the CounterPartyIds orderable-permissioned
// for the selected product-location; the grid joins these against
// EligibleCounterParties. 9005 (On Hold) intentionally omitted to show the split.
export const authorizedCounterPartyIdsFixture = {
  Data: [9001, 9002, 9003, 9004],
  Query: null,
  Validations: [],
}

// Submit. createSpecialOffer treats an empty Validations array as success.
export const createSpecialOfferFixture = {
  Data: { SpecialOfferId: 15007 },
  Query: null,
  Validations: [],
}
