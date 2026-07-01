// Freddy mock fixture — fictional
// PromptProvider/ForwardsProvider expect { Data: [...] }. ForwardsProvider
// derives forwardInstruments by filtering on TradeTypeMeaning === 'Forward'
// and crashes on forwardInstruments[0].MarketPlatformInstrumentId when the
// list is empty (BuyForwards page.jsx:54). Provide one Prompt and two
// Forward instruments so both pages have tabs.

export const marketPlatformInstrumentsFixture = {
  Data: [
    {
      MarketPlatformInstrumentId: 101,
      Name: 'Prompt',
      IsTas: false,
      AllowBid: true,
      TradeTypeMeaning: 'Prompt',
      AutoRefreshIntervalInSeconds: 30,
      HasDeliveryPeriodGroups: false,
      Subtypes: [],
    },
    {
      MarketPlatformInstrumentId: 201,
      Name: 'Forward',
      IsTas: false,
      AllowBid: true,
      TradeTypeMeaning: 'Forward',
      AutoRefreshIntervalInSeconds: 60,
      HasDeliveryPeriodGroups: false,
      Subtypes: [
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
      ],
    },
    {
      MarketPlatformInstrumentId: 202,
      Name: 'Forward TAS',
      IsTas: true,
      AllowBid: false,
      TradeTypeMeaning: 'Forward',
      AutoRefreshIntervalInSeconds: 60,
      HasDeliveryPeriodGroups: false,
      Subtypes: [],
    },
  ],
  Query: null,
  Validations: [],
}
