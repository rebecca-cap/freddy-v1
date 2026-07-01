// Freddy mock fixture — fictional
// MarketPlatform/OrderEntry/GetOrderEntryData. Hit by PromptContext and
// ForwardsContext when a user selects a price grid cell. Consumers read
// response.Data.SelectedItems[].DeliveryPeriodName and ItemKey, plus
// OrderTimeLimitInSeconds and ValidSubtypes. MarketPlatformInstrumentId
// is consumed at the top level of Data by some flows.

const constraints = {
  VolumeIncrement: 1000,
  MinVolume: 5000,
  MaxVolume: 50000,
  MinMonthlyVolume: 0,
  MaxMonthlyVolume: 0,
  WarningVolume: 30000,
  AllowMultipleLoadingNumbers: true,
  AllowNoteEntry: true,
  MaximumBidExpiration: '2026-05-09T23:59:59Z',
  OriginLocationMinimumReqSelection: 1,
}

const defaults = {
  DefaultBidExpiryDateTime: '2026-05-03T17:00:00Z',
  DefaultCounterPartyId: 9001,
}

const makeSelectedItem = (
  id: number,
  product: string,
  location: string,
  price: number,
  futuresMonth: string,
  deliveryPeriodName: string
) => ({
  Constraints: constraints,
  Defaults: defaults,
  AdditionalItems: [],
  QuantityDistributionWeightPercentage: 100,
  QuantityDistributionWeight: 1,
  ProductId: 7000 + id,
  LocationId: 5000 + id,
  ProductName: product,
  LocationName: location,
  Price: price,
  IndexPrice: price,
  Margin: 0.0325,
  FuturesMonth: futuresMonth,
  IsPlaceholder: false,
  DeliveryPeriodName: deliveryPeriodName,
  PriceAdjustmentDetails: [],
  LoadingNumbersList: [],
  // Kept empty on purpose: OrderDetail.handleNextStep maps these into
  // selectedItemMeta.LiftingLocationsList and then filters with an UNGUARDED
  // `formValues?.LiftingLocationIds.includes(...)` (siblings use Array.isArray
  // guards; this one doesn't). A non-empty list + an unselected "Preferred
  // Terminals" field crashes the confirm step. Preferred terminals are
  // optional, so an empty list keeps the buyer flow working on mock data.
  LiftingLocations: [],
  // Also empty: when DestinationLocations is non-empty the confirm step makes
  // "Destination State" a required field ("must be chosen"), which blocks a
  // one-click demo submit. Empty = no required destination, frictionless flow.
  DestinationLocations: [],
  ItemKey: {
    TradeEntrySetupId: 14000 + id,
    DeliveryPeriodConfigurationId: 6000 + id,
    DeliveryPeriodGroupId: null,
    SpecialOfferId: null,
  },
})

const validSubtypes = [
  {
    MarketPlatformInstrumentSubtypeId: 2011,
    Name: 'Fixed Price',
    Description: 'Fixed price forward',
    IsActive: true,
    AllowMarket: true,
    AllowBid: true,
    AllowVolumeEdits: true,
    VolumeDistributionTypeMeaning: 'Even',
    ContractPricingMethodMeaning: 'Fixed',
  },
  {
    MarketPlatformInstrumentSubtypeId: 2012,
    Name: 'Index',
    Description: 'Index-priced forward',
    IsActive: true,
    AllowMarket: true,
    AllowBid: false,
    AllowVolumeEdits: true,
    VolumeDistributionTypeMeaning: 'Even',
    ContractPricingMethodMeaning: 'Index',
  },
]

export const orderEntryDataFixture = {
  Data: {
    MarketPlatformInstrumentId: 201,
    AllowBid: true,
    IsTas: false,
    CreditStatus: 'Normal',
    EstimatedRemainingCreditBalance: 4250000,
    SelectedItems: [
      makeSelectedItem(1, 'ULSD', 'Houston Terminal', 2.7459, '2026-06', 'June 2026'),
      makeSelectedItem(2, 'Gasoline 87', 'Dallas Hub', 2.5821, '2026-06', 'June 2026'),
    ],
    ItemGroups: [],
    IsInternalUser: false,
    ExternalColleagueOverrideList: {},
    InternalCounterPartyOverrideList: {},
    ShowDateOverrideFields: false,
    DateOverrideMinDate: '2026-05-02T00:00:00Z',
    DateOverrideMaxDate: '2026-08-31T23:59:59Z',
    ValidSubtypes: validSubtypes,
    CreditData: {
      creditHold: false,
      creditStatus: 'Normal',
      totalCreditBalance: 5000000,
      remainingCreditBalance: 4250000,
      EstimatedRemainingCreditBalance: 4250000,
    },
    OrderTimeLimitInSeconds: 60,
    State: 'Active',
    PromptDefaultDates: {
      DefaultStartDate: '2026-05-02T00:00:00Z',
      DefaultEndDate: '2026-05-09T23:59:59Z',
    },
    IsBid: false,
  },
  Query: null,
  Validations: [],
}

const makeForwardItem = (i: number, periodLabel: string, futuresMonth: string, price: number) => ({
  SparkChartPoints: null,
  DailyHigh: price + 0.018,
  DailyLow: price - 0.022,
  IsPriceUp: i % 2 === 0,
  DisplayName: periodLabel,
  ItemKey: { TradeEntrySetupId: 8000 + i, DeliveryPeriodConfigurationId: 9000 + i, DeliveryPeriodGroupId: null },
  Price: price,
  Differential: 0.0125,
  IndexPrice: price - 0.0125,
  Margin: 0.041 + (i % 4) * 0.003,
  FuturesMonth: futuresMonth,
})

const forwardPeriods = [
  { label: 'Jun 2026', month: '2026-06-01T00:00:00Z', basePrice: 2.7459 },
  { label: 'Jul 2026', month: '2026-07-01T00:00:00Z', basePrice: 2.7612 },
  { label: 'Aug 2026', month: '2026-08-01T00:00:00Z', basePrice: 2.7780 },
  { label: 'Sep 2026', month: '2026-09-01T00:00:00Z', basePrice: 2.7905 },
  { label: 'Oct 2026', month: '2026-10-01T00:00:00Z', basePrice: 2.8040 },
  { label: 'Nov 2026', month: '2026-11-01T00:00:00Z', basePrice: 2.8155 },
]

export const forwardPricesFixture = {
  Data: {
    ItemGroups: [
      {
        MarketPlatformInstrumentId: 201,
        MarketInstrumentName: 'ULSD Houston',
        TradeEntrySetupId: 8001,
        IsTradeAtSettle: false,
        TradeTypeMeaning: 'Forward',
        ProductId: 7001,
        ProductSortOrder: null,
        LocationId: 5001,
        ProductName: 'ULSD',
        LocationName: 'Houston Terminal',
        MarketPlatformItems: forwardPeriods.map((p, i) => makeForwardItem(i + 1, p.label, p.month, p.basePrice)),
      },
      {
        MarketPlatformInstrumentId: 201,
        MarketInstrumentName: 'Gasoline 87 Dallas',
        TradeEntrySetupId: 8002,
        IsTradeAtSettle: false,
        TradeTypeMeaning: 'Forward',
        ProductId: 7002,
        ProductSortOrder: null,
        LocationId: 5002,
        ProductName: 'Gasoline 87',
        LocationName: 'Dallas Hub',
        MarketPlatformItems: forwardPeriods.map((p, i) => makeForwardItem(i + 10, p.label, p.month, p.basePrice - 0.18)),
      },
    ],
    CreditStatus: 'Normal',
    EstimatedRemainingCreditBalance: 4250000,
  },
  Query: { MarketPlatformInstrumentId: 201, IgnoreProductLocationPermissions: false, IncludeHistoricalPricingInformation: true },
  Validations: [],
}

// MarketPlatform/OrderEntry/SubmitOrder — the buyer's "confirm order" call,
// shared by PromptContext + ForwardsContext. handleSubmitOrder treats an empty
// Validations array as success and renders
// <OrderSuccess tradeEntryId={response.Data.TradeEntryId} /> ("Order #N Saved
// Successfully" toast + confetti). Return a concrete order id + loading number
// so the confirmation reads like a real TABS-allocated order.
export const submitOrderFixture = {
  Data: {
    TradeEntryId: 81247,
    OrderStatus: 'Accepted',
    OrderStatusCodeValueDisplay: 'Accepted',
    LoadingNumbers: [{ LoadingNumberId: 11247, Name: 'LN-11247', Display: 'LN-11247' }],
  },
  Query: null,
  Validations: [],
}
