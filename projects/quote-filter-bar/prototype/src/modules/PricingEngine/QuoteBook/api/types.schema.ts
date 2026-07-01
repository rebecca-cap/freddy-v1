import { PublicationMode } from '@modules/PricingEngine/QuoteBook/components/Drawers/QuoteBookPublishConfirmDrawer/schema.types'

export type PublicationModes = 'EndOfDay' | 'EndOfDayCurrentPeriod' | 'IntraDay'

export interface QuoteBookMetadataResponse {
  QuoteMappingGroups: {
    GroupDescription: string
    GroupName: string
    QuoteConfigurationMappingGroupId: number
  }[]
  Benchmarks: {
    Text: string
    Value: string
    GroupingValue: null
  }[]
  ProposedHeader: string
  OneBackHeader: string
  TwoBackHeader: string
  ShowMarketMoveColumns: boolean
}

export type QuoteBookOverview = {
  TotalRecords: number
  Data: Quote[]
}
export type DirtyQuote = {
  QuoteConfigurationMappingId: number
  BaseCurvePointPriceId: number
  Adjustment: number
}
export type Quote = {
  AdjustmentUpdatedDateTime: string
  LatestQuoteDate: string
  CarrierCounterPartyName: string
  ExternalCounterPartyName: string
  InternalCounterPartyName: string
  StrategyQuoteBenchmarkId: number
  SpreadParentMappingId: number
  StrategyBase: QuoteRowBenchmarkType
  Allocation: number
  LocationName: string
  ProductName: string
  AdjustedAfterPublish: boolean
  AdjustedDate: string
  CostSourceTradeEntryId: number
  SupplierCounterPartyName: string
  CostSourceType: string
  QuoteConfigurationId: number
  QuoteConfigurationMappingId: number
  QuoteConfigurationMappingGroup: string
  QuoteConfigurationMappingGroupId: number
  QuoteConfigurationName: string
  Adjustment: number | null
  QuoteStrategyName: string
  UnitOfMeasureName: string
  ProductGroup: string
  TargetPeriodEffectiveFrom: string
  TargetPeriodEffectiveTo: string
  PriorQuotePeriod: {
    PriceDifference: number
    ProfitDifference: number
    LiftingsDifference: number
    Liftings: number
    StrategyType: string
    Profit: number
    Start: string
    End: string
    BenchMarks: QuoteRowBenchmarkType[]
    Margin: number
    LastCost: number
    LastPrice: number
    LastDiff: number
    WeightedCost: number
    WeightedPrice: number
    WeightedDiff: number
  }
  SecondPriorQuotePeriod: {
    PriceDifference: number
    ProfitDifference: number
    LiftingsDifference: number
    Liftings: number
    StrategyType: string
    Profit: number
    Price: number
    Start: string
    End: string
    BenchMarks: QuoteRowBenchmarkType[]
    Margin: number
    LastCost: number
    LastPrice: number
    LastDiff: number
    WeightedCost: number
    WeightedPrice: number
    WeightedDiff: number
  }
  ProposedPrice: number
  Cost: null
  CostId: number | null
  CostFormulaResultId: null
  CostStatusSymbol: string
  LatestCostFormulaResultId: null
  PublishesNetAndGross: boolean
  TCIValue?: number
  RawMarketMoveValue?: number
  MarketMovePercentage?: number
  MarketMoveValue?: number
  MarketMoveOverride?: number
  MarketMoveOverrideId?: number
  MarketMoveOverrideUpdatedDateTime?: string | Date
  UsesMarketMove?: boolean | null
  Exceptions: QuoteRowExceptionsType[]
  SpreadOverride?: number
  SpreadOverrideId?: number
  SpreadOverrideUpdatedDateTime?: string | Date
  StrategyBaseTypeCvId?: number
}
export type QuoteRowExceptionsType = {
  PropertyName: string
  Message: string
  Category: string
  Identifier: number
  Severity: string
}
export type QuoteRowBenchmarkType = {
  PriceId: number
  QuotedValueId: number
  Value: number
  StatusSymbol: string
  Status: string
  BenchmarkId: number
}

export type QuoteBookEODPublishData = {
  QuoteConfigurationMappingId: string
  BaseCurvePointPriceId: string
  Adjustment: number
}
export type QuoteBookUpdateAdjustment = {
  PublicationMode: PublicationModes
  Updates: {
    QuoteConfigurationMappingId: number
    Adjustment: number
  }[]
}

export type QuoteBookSaveSpreadOverride = {
  PublicationMode: PublicationMode
  QuoteConfigurationMappingId: number
  OverrideValue: number
}
