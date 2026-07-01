export interface ForwardTrade {
  productName: string
  locationName: string
  price: number
  type: string
  note: string
  enteredVolume: number
  volume: number
  additionalItems: []
  bidExpiration: Date
  maxBidExpiration: Date
  selectedSubtype: string
  selectedDeliveryPeriods: []
  distributionWeights: []
  override: { price: number; futuresPrice: number }
  additionalOptions: {
    externalColleagueOverride: []
    internalCounterPartyOverride: []
    externalNotification: boolean
    indexPrice: number
    liftingLocationsList: []
    loadingNumbersList: []
    priceAdjustments: []
  }
}

export interface ForwardsContextResult {
  clearTradeTimer: () => void
  initializeTimerInterval: () => void
  isPriceExpired: boolean
  tradeTimer: number
  isModalVisible: boolean
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  refetchOrderEntryInfo: (selectedItemKeys: string[]) => void
  availableItems?: any[]
  areItemsLoading: boolean
  orderEntryInfo: any
  marketPlatformInstrument: any
  hasTasInstruments: boolean
  tasMode: ((isChecked: any) => void) | undefined
  toggleTasMode: ((isChecked: any) => void) | undefined
  hasBadSelection: boolean
  selectedGridCells: any[]
  setSelectedGridCells: React.Dispatch<React.SetStateAction<any[]>>
  selectedPeriodIds: any[]
  error: string
  setError: React.Dispatch<React.SetStateAction<string>>
  deliveryPeriods: any[]
  setDeliveryPeriods: React.Dispatch<React.SetStateAction<any[]>>
  submitOrder: () => Promise<void>
  validSubtypes: any[]
  onlyAssigned: boolean
  toggleOnlyAssigned: React.Dispatch<React.SetStateAction<boolean>>
  forwardInstruments: any[]
  selectedMarketInstrumentId: string | number
  setSelectedMarketInstrumentId: React.Dispatch<React.SetStateAction<string | number>>
  currentCounterParty: string
}
