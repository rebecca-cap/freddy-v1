import { APIResponse } from '@api/globalTypes'
import { FlatSettingsForForm, StrategyMissWidgetSettings } from '@modules/CommandCenter/api/pageViewTypes.schema'

import { OriginalStrategyMissReportData, StrategyMissReport } from '../api/types.schema'

export function updateStrategyMissSettings(
  settings: FlatSettingsForForm,
  strategyMissSettings: StrategyMissWidgetSettings,
  setStrategyMissSettings: (settings: StrategyMissWidgetSettings) => void
) {
  if (strategyMissSettings) {
    const newThresholds = { ...strategyMissSettings.thresholds }
    newThresholds.missToStrategyCriticalAbove = settings.missToStrategyCriticalAbove
    newThresholds.missToStrategyCriticalBelow = settings.missToStrategyCriticalBelow
    newThresholds.missToStrategyWarningAbove = settings.missToStrategyWarningAbove
    newThresholds.missToStrategyWarningBelow = settings.missToStrategyWarningBelow

    const newSettings = {
      ...strategyMissSettings,
      filters: {
        ...strategyMissSettings?.filters,
        DateRange: settings.DateRange || strategyMissSettings?.filters?.DateRange,
        LocationIds: settings.LocationIds || [],
        ProductIds: settings.ProductIds || [],
        QuoteConfigurationIds: settings.QuoteConfigurationIds || [],
      },
      thresholds: newThresholds,
    }
    setStrategyMissSettings(newSettings)
  }
}

export function setupInitialStrategyMissValues(settings: StrategyMissWidgetSettings) {
  return {
    DateRange: settings.filters.DateRange,
    LocationIds: settings.filters.LocationIds,
    ProductIds: settings.filters.ProductIds,
    QuoteConfigurationIds: settings.filters.QuoteConfigurationIds,
    missToStrategyCriticalAbove: settings.thresholds.missToStrategyCriticalAbove,
    missToStrategyWarningAbove: settings.thresholds.missToStrategyWarningAbove,
    missToStrategyWarningBelow: settings.thresholds.missToStrategyWarningBelow,
    missToStrategyCriticalBelow: settings.thresholds.missToStrategyCriticalBelow,
  }
}

export function getStrategyMissDataWithStatus(
  originalStrategyMissReportData: APIResponse<OriginalStrategyMissReportData> | undefined,
  strategyMissSettings: StrategyMissWidgetSettings | null
) {
  if (!originalStrategyMissReportData?.Data || !strategyMissSettings?.thresholds) {
    return []
  }
  return originalStrategyMissReportData?.Data?.Rows?.map((row) => ({
    ...row,
    Status: getStatusFromStrategyMissRow({ row, allThresholds: strategyMissSettings?.thresholds }),
  }))
}

function getStatusFromStrategyMissRow({
  row,
  allThresholds,
}: {
  row: StrategyMissReport
  allThresholds: StrategyMissWidgetSettings['thresholds']
}) {
  if (Object.values(allThresholds).every((value) => value === null)) {
    return 'On Track'
  }
  const criticalMissToStrategy =
    (allThresholds.missToStrategyCriticalAbove !== null &&
      row.MissToStrategy >= allThresholds.missToStrategyCriticalAbove) ||
    (allThresholds.missToStrategyCriticalBelow !== null &&
      row.MissToStrategy <= allThresholds.missToStrategyCriticalBelow)
  const warningMissToStrategy =
    (allThresholds.missToStrategyWarningAbove !== null &&
      row.MissToStrategy >= allThresholds.missToStrategyWarningAbove) ||
    (allThresholds.missToStrategyWarningBelow !== null &&
      row.MissToStrategy <= allThresholds.missToStrategyWarningBelow)

  if (criticalMissToStrategy) {
    return 'Critical'
  }

  if (warningMissToStrategy) {
    return 'At Risk'
  }

  return 'On Track'
}
