import {
  BenchmarkTypes,
  CreateWizardStates,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/types/page.types'

export const createWizardStates: { isSelectingType: CreateWizardStates; isConfiguring: CreateWizardStates } = {
  isSelectingType: 'isSelectingType',
  isConfiguring: 'isConfiguring',
}
export const benchmarkTypes: { Spot: BenchmarkTypes; Rack: BenchmarkTypes; Competitor: BenchmarkTypes } = {
  Spot: 'Spot',
  Rack: 'Rack',
  Competitor: 'Competitor',
}

export const benchMarkTypeDescriptions = {
  Spot: 'spot market references',
  Rack: 'rack pricing',
  Competitor: 'competitor pricing',
}
export const blankCompetitorRow = {
  PricePublisherId: null,
  CounterPartyId: null,
  Percentage: null,
}
