export const fakeSubtypes = [
  {
    MarketPlatformInstrumentSubtypeId: 1,
    Name: 'Average Pricing',
    Description:
      'A multi-month order where pricing will be the same for all months based on the weighted average.  Monthly gallons can vary.',
    IsActive: true,
    AllowMarket: true,
    AllowBid: true,
    VolumeDistributionTypeMeaning: 'Rateable',
    ContractPricingMethodMeaning: 'WeightedAverage',
  },
  {
    MarketPlatformInstrumentSubtypeId: 3,
    Name: 'Monthly Pricing',
    Description:
      'A single month or multi-month order where pricing will be based on each individual month.  Monthly gallons can vary.',
    IsActive: true,
    AllowMarket: true,
    AllowBid: false,
    VolumeDistributionTypeMeaning: 'Rateable',
    ContractPricingMethodMeaning: 'DeliveryPeriod',
  },
  {
    MarketPlatformInstrumentSubtypeId: 5,
    Name: 'Pull Anytime/Full Flex/Strip Pricing',
    Description:
      'A multi-month order where the premium month price is used, and gallons can be lifted at any time during the contracting period.',
    IsActive: true,
    AllowMarket: true,
    AllowBid: true,
    VolumeDistributionTypeMeaning: 'PullAnytime',
    ContractPricingMethodMeaning: 'HighPrice',
  },
  {
    MarketPlatformInstrumentSubtypeId: 7,
    Name: 'Heat Curve',
    Description: 'Distribute volume using forecasted conditions.',
    IsActive: true,
    AllowMarket: true,
    AllowBid: true,
    VolumeDistributionTypeMeaning: 'Weighted',
    ContractPricingMethodMeaning: 'WeightedAverage',
  },
]
export const mockedProps = {
  subTypes: fakeSubtypes,
  form: {
    getFieldsValue: () => fakeSubtypes[0],
    setFieldsValue: () => {},
  },
  selectedSubtype: {},
  setSelectedSubtype: jest.fn(),
}
export const noSubtypeProps = {
  subTypes: undefined,
  form: {
    getFieldsValue: () => undefined,
    setFieldsValue: () => {},
    selectedDealType: () => {},
    setSelectedDealType: () => {},
  },
}
export const initialValues = {
  subTypes: fakeSubtypes,
  form: {
    getFieldsValue: () => undefined,
    setFieldsValue: () => {},
    selectedDealType: fakeSubtypes[0],
    setSelectedDealType: () => {},
  },
}
