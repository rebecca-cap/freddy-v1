import {
  IntradayCompetitorMovementWidgetSettings,
  MarginSummaryWidgetSettings,
  StrategyMissWidgetSettings,
  VolumePaceWidgetSettings,
} from './pageViewTypes.schema'

export const volumePaceGridSettings: VolumePaceWidgetSettings = {
  filters: {
    LocationIds: [],
    ProductIds: [],
    QuoteConfigurationIds: [],
  },
  thresholds: {
    weeklyCriticalAbove: null,
    weeklyCriticalBelow: null,
    weeklyWarningAbove: null,
    weeklyWarningBelow: null,
    monthlyCriticalAbove: null,
    monthlyCriticalBelow: null,
    monthlyWarningAbove: null,
    monthlyWarningBelow: null,
  },
}

export const intradayMovementGridSettings: IntradayCompetitorMovementWidgetSettings = {
  filters: {
    LocationIds: [],
    ProductIds: [],
    QuoteConfigurationIds: [],
  },
  thresholds: {
    movementAlertCriticalAbove: null,
    movementAlertCriticalBelow: null,
    movementAlertWarningAbove: null,
    movementAlertWarningBelow: null,
    averageMoveCriticalAbove: null,
    averageMoveCriticalBelow: null,
    averageMoveWarningAbove: null,
    averageMoveWarningBelow: null,
  },
}

export const strategyMissGridSettings: StrategyMissWidgetSettings = {
  filters: {
    DateRange: 'OneDay',
    LocationIds: [],
    ProductIds: [],
    QuoteConfigurationIds: [],
  },
  thresholds: {
    missToStrategyCriticalAbove: null,
    missToStrategyCriticalBelow: null,
    missToStrategyWarningAbove: null,
    missToStrategyWarningBelow: null,
  },
}
export const marginSummaryGridSettings: MarginSummaryWidgetSettings = {
  filters: {
    DateRange: 'OneDay',
    LocationIds: [],
    ProductIds: [],
    QuoteConfigurationIds: [],
  },
  thresholds: {
    criticalAbove: null,
    criticalBelow: null,
    warningAbove: null,
    warningBelow: null,
  },
}
