import { Validation } from '@api/globalTypes'
import { ColumnState, GridViewPayloadFilter } from '@hooks/useGridViewManager/api/types.schema'

export type UpsertPageViewPayload = {
  widgetSettings: WidgetSetting[]
  pageServerSideFilters: PageServerSideFilters
  display: string
  userPreferenceId?: number
}

export type WidgetSetting = {
  name: string // grid storage key
  gridConfigSettings: GridConfigSettingsPayload
  widgetGridSettings: WidgetGridSettings
}

export type GridConfigSettingsPayload = {
  filters: GridViewPayloadFilter[]
  columns: ColumnState[]
}

export type WidgetGridSettings = {
  VolumePace?: VolumePaceWidgetSettings
  IntradayCompetitorMovement?: IntradayCompetitorMovementWidgetSettings
  StrategyMiss?: StrategyMissWidgetSettings
  MarginSummary?: MarginSummaryWidgetSettings
}

export type IntradayCompetitorMovementWidgetSettings = {
  thresholds: IntradayCompetitorMovementThresholds
  filters: WidgetGridSettingsFilters
}

export type WidgetGridSettingsFilters = {
  LocationIds: number[]
  ProductIds: number[]
  QuoteConfigurationIds: number[]
}
export type WidgetGridSettingsFiltersWithDateRange = WidgetGridSettingsFilters & {
  DateRange: string
}
export type IntradayCompetitorMovementThresholds = {
  movementAlertCriticalAbove: number | null
  movementAlertCriticalBelow: number | null
  movementAlertWarningAbove: number | null
  movementAlertWarningBelow: number | null
  averageMoveCriticalAbove: number | null
  averageMoveCriticalBelow: number | null
  averageMoveWarningAbove: number | null
  averageMoveWarningBelow: number | null
}

export type MarginSummaryWidgetSettings = {
  thresholds: MarginSummaryThresholds
  filters: WidgetGridSettingsFiltersWithDateRange
}

export type MarginSummaryThresholds = {
  criticalAbove: number | null
  criticalBelow: number | null
  warningAbove: number | null
  warningBelow: number | null
}

export type StrategyMissWidgetSettings = {
  thresholds: StrategyMissThresholds
  filters: WidgetGridSettingsFiltersWithDateRange
}

export type StrategyMissThresholds = {
  missToStrategyCriticalAbove: number | null
  missToStrategyCriticalBelow: number | null
  missToStrategyWarningAbove: number | null
  missToStrategyWarningBelow: number | null
}

export type VolumePaceWidgetSettings = {
  thresholds: VolumePaceThresholds
  filters: WidgetGridSettingsFilters
}

export type VolumePaceThresholds = {
  weeklyCriticalAbove: number | null
  weeklyCriticalBelow: number | null
  weeklyWarningAbove: number | null
  weeklyWarningBelow: number | null
  monthlyCriticalAbove: number | null
  monthlyCriticalBelow: number | null
  monthlyWarningAbove: number | null
  monthlyWarningBelow: number | null
}

export type UpsertPageViewResponse = {
  Data: UpsertPageViewResponseData
  Query: string
  Validations: Validation[]
}

export type UpsertPageViewResponseData = {
  widgetSettings: WidgetSetting[]
  pageServerSideFilters: PageServerSideFilters
  display: string
  userPreferenceId: number
}

export type PageServerSideFilters = {
  LocationHierarchyTypeCvId: number
  ProductHierarchyTypeCvId: number
}

export type AllPageViewResponseData = {
  widgetSettings: WidgetSetting[]
  pageServerSideFilters: PageServerSideFilters
  display: string
  userPreferenceId: number
}

export interface FlatSettingsForForm {
  DateRange: string
  LocationIds: number[]
  ProductIds: number[]
  QuoteConfigurationIds: number[]
  movementAlertCriticalAbove: number
  movementAlertCriticalBelow: number
  movementAlertWarningAbove: number
  movementAlertWarningBelow: number
  averageMoveCriticalAbove: number
  averageMoveCriticalBelow: number
  averageMoveWarningAbove: number
  averageMoveWarningBelow: number
  criticalAbove: number
  criticalBelow: number
  warningAbove: number
  warningBelow: number
  missToStrategyCriticalAbove: number
  missToStrategyCriticalBelow: number
  missToStrategyWarningAbove: number
  missToStrategyWarningBelow: number
  weeklyCriticalAbove: number
  weeklyCriticalBelow: number
  weeklyWarningAbove: number
  weeklyWarningBelow: number
  monthlyCriticalAbove: number
  monthlyCriticalBelow: number
  monthlyWarningAbove: number
  monthlyWarningBelow: number
  volumePaceWeeklyCriticalAbove: number
  volumePaceWeeklyCriticalBelow: number
  volumePaceWeeklyWarningAbove: number
  volumePaceWeeklyWarningBelow: number
  volumePaceMonthlyCriticalAbove: number
  volumePaceMonthlyCriticalBelow: number
  volumePaceMonthlyWarningAbove: number
  volumePaceMonthlyWarningBelow: number
}
export type GridSettings =
  | IntradayCompetitorMovementWidgetSettings
  | MarginSummaryWidgetSettings
  | StrategyMissWidgetSettings
  | VolumePaceWidgetSettings
