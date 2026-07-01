// Freddy mock fixture — fictional
// MarketPlatform/MarketPlatformAllSpecialOffers/GetAllSpecialOffers
// Consumed by OffersPage as data?.Data?.Offers. Each offer either has a
// SpecialOffer payload (OfferCategory='Special') or IndexOffer fields.

const makeSpecialOffer = (
  offerId: number,
  product: string,
  location: string,
  fixedPrice: number,
  totalVolume: number,
  expiresAt: string
) => ({
  TradeEntrySetupId: 30000 + offerId,
  SpecialOfferId: offerId,
  SpecialOfferName: `${product} ${location} Promo`,
  EvaluationTypeCvId: 1,
  SpecialOfferType: 'FixedPrice',
  PricingMechanismCvId: 1,
  PricingMechanism: 'Fixed Price',
  TotalVolumeAvailable: totalVolume,
  OfferExpirationDateTime: expiresAt,
  TimeRemaining: '2 days',
  MinimumVolumePerOrder: 5000,
  MaxVolumePerOrder: totalVolume,
  VolumeIncrement: 1000,
  OrderEffectiveStartDateTime: '2026-05-02T00:00:00Z',
  OrderEffectiveEndDateTime: '2026-05-09T23:59:59Z',
  FixedPrice: fixedPrice,
  MarketOffset: 0,
  HasPendingSubmission: false,
  SubmissionStatus: 'None',
  SubmittedPrice: 0,
  SubmittedVolume: 0,
  CanSubmitOrder: true,
  IsBid: false,
})

const makeStandardOffer = (
  id: number,
  productId: number,
  product: string,
  locationId: number,
  location: string,
  offerId: number,
  price: number,
  volume: number,
  expiresAt: string
) => ({
  ItemKey: {
    TradeEntrySetupId: 30000 + offerId,
    DeliveryPeriodConfigurationId: 6000 + id,
    DeliveryPeriodGroupId: null,
    SpecialOfferId: offerId,
    IndexOfferId: null,
  },
  OfferCategory: 'Special' as const,
  ProductId: productId,
  ProductName: product,
  LocationId: locationId,
  LocationName: location,
  SpecialOffer: makeSpecialOffer(offerId, product, location, price, volume, expiresAt),
  IndexOfferId: null,
  FormulaDisplayName: null,
  ContractDifferential: null,
  IndexOfferType: null,
  PricingEffectiveTimes: null,
  IsBid: false,
  HasPendingSubmission: false,
  SubmissionStatus: null,
  CanSubmitOrder: true,
  PendingSubmissionOrderId: null,
  MarketPlatformInstrumentId: 201,
  MarketInstrumentName: 'Forward',
  LoadingNumberSelectionIsRequiredButNoneWereFound: false,
})

const makeIndexOffer = (
  id: number,
  productId: number,
  product: string,
  locationId: number,
  location: string,
  indexOfferId: number,
  formulaName: string,
  differential: number
) => ({
  ItemKey: {
    TradeEntrySetupId: 30100 + indexOfferId,
    DeliveryPeriodConfigurationId: 6100 + id,
    DeliveryPeriodGroupId: null,
    SpecialOfferId: null,
    IndexOfferId: indexOfferId,
  },
  OfferCategory: 'Index' as const,
  ProductId: productId,
  ProductName: product,
  LocationId: locationId,
  LocationName: location,
  SpecialOffer: null,
  IndexOfferId: indexOfferId,
  FormulaDisplayName: formulaName,
  ContractDifferential: differential,
  IndexOfferType: 'Daily',
  PricingEffectiveTimes: '06:00–18:00 CT',
  IsBid: false,
  HasPendingSubmission: false,
  SubmissionStatus: null,
  CanSubmitOrder: true,
  PendingSubmissionOrderId: null,
  MarketPlatformInstrumentId: 201,
  MarketInstrumentName: 'Forward',
  LoadingNumberSelectionIsRequiredButNoneWereFound: false,
})

export const allSpecialOffersFixture = {
  Data: {
    Offers: [
      makeStandardOffer(1, 7001, 'ULSD', 5001, 'Houston Terminal', 15001, 2.7250, 25000, '2026-05-04T17:00:00Z'),
      makeStandardOffer(2, 7002, 'Gasoline 87', 5001, 'Houston Terminal', 15002, 2.5650, 18000, '2026-05-05T17:00:00Z'),
      makeStandardOffer(3, 7003, 'Gasoline 91', 5002, 'Dallas Hub', 15003, 2.7980, 12000, '2026-05-04T17:00:00Z'),
      makeStandardOffer(4, 7004, 'Jet A', 5003, 'Salt Lake Rack', 15004, 2.9120, 30000, '2026-05-06T17:00:00Z'),
      makeStandardOffer(5, 7005, 'Biodiesel B5', 5002, 'Dallas Hub', 15005, 3.1450, 8000, '2026-05-07T17:00:00Z'),
      makeIndexOffer(6, 7001, 'ULSD', 5001, 'Houston Terminal', 15010, 'OPIS Avg + 0.025', 0.025),
      makeIndexOffer(7, 7002, 'Gasoline 87', 5002, 'Dallas Hub', 15011, 'Platts Low + 0.018', 0.018),
    ],
    CreditStatus: 'Normal',
    EstimatedRemainingCreditBalance: 4250000,
  },
  Query: null,
  Validations: [],
}
