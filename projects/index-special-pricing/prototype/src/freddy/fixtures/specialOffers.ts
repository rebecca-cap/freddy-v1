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
  groups: { TagId: number; TagName: string }[] = [],
) => ({
  CounterPartyId: id,
  Name: name,
  AvailableCredit: availableCredit,
  CreditStatusDisplay: creditStatus,
  IsActive: true,
  AssociatedGroupTags: groups,
})

// --- Index formula templates (the "Choose a formula template" chooser) ----
// Authored against the IndexOfferMetaData ids below (publishers 1/2, instruments
// OPIS_AVG/OPIS_LOW/PLATTS_GC, types Avg/Low/Mean, rules 1/2) so mapTemplateToComponents
// produces valid, named grid rows. ApplicableProducts drive the product-narrowed list.
const idxVariable = (
  id: number,
  name: string,
  publisherId: number,
  instrumentId: string,
  typeId: string,
  ruleId: string,
  percentage = 100,
  differential = 0,
) => ({
  FormulaTemplateVariableId: id,
  VariableName: name,
  DisplayName: null,
  PricePublisherId: publisherId,
  PriceInstrumentId: instrumentId,
  PriceTypeCvId: typeId,
  PriceValuationRuleId: ruleId,
  Percentage: percentage,
  Differential: differential,
  IsPlaceholder: false,
  IsRequired: true,
  IsVisible: true,
})

const idxTemplate = (
  id: number,
  name: string,
  displayText: string,
  products: number[],
  variables: ReturnType<typeof idxVariable>[],
) => ({
  FormulaTemplateId: id,
  Name: name,
  FormulaTemplateCategoryId: 1,
  FormulaTemplateCategoryDisplay: 'Index',
  FormulaTemplateApplicableProducts: products.map((ProductId) => ({ ProductId })),
  FormulaTemplateApplicableLocations: [{ LocationId: 5001 }, { LocationId: 5002 }],
  FormulaTemplateVariables: variables,
  PricingDisplayText: displayText,
  IsActive: true,
  IsSystemCalculation: false,
  IsVisible: true,
  MarkerId: null,
  ParserType: 'Default',
  CreatedByCredentialId: 2001,
  CreatedDateTime: '2026-04-01T00:00:00Z',
})

const indexFormulaTemplates = [
  idxTemplate(13101, 'OPIS Houston ULSD Average', 'OPIS Average', [7001], [
    idxVariable(131011, 'Index', 1, 'OPIS_AVG', 'Avg', '2', 100),
  ]),
  idxTemplate(13102, 'Platts USGC Mean', 'Platts Mean', [7001], [
    idxVariable(131021, 'Index', 2, 'PLATTS_GC', 'Mean', '1', 100),
  ]),
  idxTemplate(13103, 'OPIS 50/50 Avg·Low Blend', '0.5·OPIS Avg + 0.5·OPIS Low', [7001, 7002, 7003], [
    idxVariable(131031, 'High leg', 1, 'OPIS_AVG', 'Avg', '2', 50),
    idxVariable(131032, 'Low leg', 1, 'OPIS_LOW', 'Low', '2', 50),
  ]),
]

// Customer group tags — referenced by EligibleCounterParties below. A customer can belong to
// several at once (the Groups column shows them; >2 collapse to a popover).
const GULF = { TagId: 301, TagName: 'Gulf Coast' }
const MIDCON = { TagId: 302, TagName: 'Midcon' }
const MTN_WEST = { TagId: 303, TagName: 'Mountain West' }
const TIER1 = { TagId: 304, TagName: 'Tier 1' }
const PREFERS_INDEX = { TagId: 305, TagName: 'Prefers Index' }

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
      makeCounterParty(9001, 'Demo Trucking Co.', 1250000, 'Good Standing', [GULF]),
      makeCounterParty(9002, 'Frontier Fuel Services', 875000, 'Good Standing', [MIDCON]),
      makeCounterParty(9003, 'Cascade Logistics', 2100000, 'Good Standing', [GULF, MTN_WEST]),
      makeCounterParty(9004, 'Prairie Trading Co.', 430000, 'Watch', [MIDCON]),
      makeCounterParty(9005, 'Sunbelt Wholesale', 0, 'On Hold'),
      // A bunch more — many UNGROUPED (no tags) so the full picker shows far more than the group
      // chips imply; varied credit status + available credit so the filters visibly bite. 9006 is
      // in three groups (exercises the Groups column's >2 popover).
      makeCounterParty(9006, 'Redwood Petroleum', 1800000, 'Good Standing', [TIER1, PREFERS_INDEX, GULF]),
      makeCounterParty(9007, 'Cobalt Energy Partners', 640000, 'Good Standing'),
      makeCounterParty(9008, 'Granite State Fuels', 1100000, 'Watch', [TIER1]),
      makeCounterParty(9009, 'Harbor Point Trading', 95000, 'On Hold'),
      makeCounterParty(9010, 'Sierra Valley Oil', 2400000, 'Good Standing', [MTN_WEST, TIER1]),
      makeCounterParty(9011, 'Meridian Bulk', 510000, 'Good Standing'),
      makeCounterParty(9012, 'Ironwood Logistics', 1350000, 'Good Standing', [PREFERS_INDEX]),
      makeCounterParty(9013, 'Cypress Fuel Co.', 280000, 'Watch'),
      makeCounterParty(9014, 'Lakeshore Energy', 760000, 'Good Standing', [MIDCON]),
      makeCounterParty(9015, 'Anchor Distributing', 0, 'On Hold'),
      makeCounterParty(9016, 'Vanguard Petroleum', 3100000, 'Good Standing', [TIER1, PREFERS_INDEX]),
      makeCounterParty(9017, 'Brightway Fuels', 420000, 'Good Standing'),
      makeCounterParty(9018, 'Northgate Supply', 1050000, 'Watch', [GULF]),
      makeCounterParty(9019, 'Pioneer Trading', 185000, 'On Hold'),
      makeCounterParty(9020, 'Summit Ridge Energy', 920000, 'Good Standing'),
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
        { Value: 'AllDay', Text: 'Midnight – Midnight' },
        { Value: '6to6', Text: '6 AM – 6 AM' },
      ],
      WeekendRuleOptions: ['Friday', 'Saturday'],
      HolidayRuleOptions: ['PriorBusinessDay', 'NextBusinessDay', 'Skip'],
      FormulaTemplates: indexFormulaTemplates,
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
// for the selected product-location; the grid joins these against EligibleCounterParties.
// The On-Hold customers (9005, 9009, 9015, 9019) plus a couple others (9013) are intentionally
// omitted so the "Authorized to lift" filter has a real split to show.
export const authorizedCounterPartyIdsFixture = {
  Data: [9001, 9002, 9003, 9004, 9006, 9007, 9008, 9010, 9011, 9012, 9014, 9016, 9017, 9018, 9020],
  Query: null,
  Validations: [],
}

// Submit. createSpecialOffer treats an empty Validations array as success.
export const createSpecialOfferFixture = {
  Data: { SpecialOfferId: 15007 },
  Query: null,
  Validations: [],
}
