import { APIResponse } from '@api/globalTypes'
import { FlatSettingsForForm, VolumePaceWidgetSettings } from '@modules/CommandCenter/api/pageViewTypes.schema'

import { OriginalVolumePaceData, VolumePace } from '../api/types.schema'

export function updateVolumePaceSettings(
  settings: FlatSettingsForForm,
  volumePaceSettings: VolumePaceWidgetSettings,
  setVolumePaceSettings: (settings: VolumePaceWidgetSettings) => void
) {
  if (volumePaceSettings) {
    const newThresholds = { ...volumePaceSettings.thresholds }
    newThresholds.weeklyCriticalAbove = settings.weeklyCriticalAbove
    newThresholds.weeklyCriticalBelow = settings.weeklyCriticalBelow
    newThresholds.weeklyWarningAbove = settings.weeklyWarningAbove
    newThresholds.weeklyWarningBelow = settings.weeklyWarningBelow
    newThresholds.monthlyCriticalAbove = settings.monthlyCriticalAbove
    newThresholds.monthlyCriticalBelow = settings.monthlyCriticalBelow
    newThresholds.monthlyWarningAbove = settings.monthlyWarningAbove
    newThresholds.monthlyWarningBelow = settings.monthlyWarningBelow
    const newSettings = {
      ...volumePaceSettings,
      filters: {
        ...volumePaceSettings?.filters,
        LocationIds: settings.LocationIds || [],
        ProductIds: settings.ProductIds || [],
        QuoteConfigurationIds: settings.QuoteConfigurationIds || [],
      },
      thresholds: newThresholds,
    }
    setVolumePaceSettings(newSettings)
  }
}
export function getVolumePaceDataWithStatus(
  originalVolumePaceData: APIResponse<OriginalVolumePaceData> | undefined,
  volumePaceSettings: VolumePaceWidgetSettings | null
) {
  if (!originalVolumePaceData?.Data || !volumePaceSettings?.thresholds) {
    return []
  }
  return originalVolumePaceData?.Data?.Rows?.map((row) => ({
    ...row,
    Status: getStatusFromVolumePaceRow({
      row,
      allThresholds: volumePaceSettings?.thresholds,
    }),
  }))
}

function getStatusFromVolumePaceRow({
  row,
  allThresholds,
}: {
  row: VolumePace
  allThresholds: VolumePaceWidgetSettings['thresholds']
}) {
  if (Object.values(allThresholds).every((value) => value === null)) {
    return 'On Track'
  }
  const criticalWeekly =
    (allThresholds.weeklyCriticalAbove !== null && row.WeeklyPacePercent >= allThresholds.weeklyCriticalAbove) ||
    (allThresholds.weeklyCriticalBelow !== null && row.WeeklyPacePercent <= allThresholds.weeklyCriticalBelow)
  const criticalMonthly =
    (allThresholds.monthlyCriticalAbove !== null && row.MtdPacePercent >= allThresholds.monthlyCriticalAbove) ||
    (allThresholds.monthlyCriticalBelow !== null && row.MtdPacePercent <= allThresholds.monthlyCriticalBelow)

  if (criticalWeekly || criticalMonthly) {
    return 'Critical'
  }

  const warningWeekly =
    (allThresholds.weeklyWarningAbove !== null && row.WeeklyPacePercent >= allThresholds.weeklyWarningAbove) ||
    (allThresholds.weeklyWarningBelow !== null && row.WeeklyPacePercent <= allThresholds.weeklyWarningBelow)

  const warningMonthly =
    (allThresholds.monthlyWarningAbove !== null && row.MtdPacePercent >= allThresholds.monthlyWarningAbove) ||
    (allThresholds.monthlyWarningBelow !== null && row.MtdPacePercent <= allThresholds.monthlyWarningBelow)

  if (warningWeekly || warningMonthly) {
    return 'At Risk'
  }

  return 'On Track'
}

export function setupInitialVolumePaceValues(settings: VolumePaceWidgetSettings) {
  return {
    DateRange: 'OneDay',
    LocationIds: settings.filters.LocationIds,
    ProductIds: settings.filters.ProductIds,
    QuoteConfigurationIds: settings.filters.QuoteConfigurationIds,
    weeklyCriticalAbove: settings.thresholds.weeklyCriticalAbove,
    weeklyCriticalBelow: settings.thresholds.weeklyCriticalBelow,
    weeklyWarningAbove: settings.thresholds.weeklyWarningAbove,
    weeklyWarningBelow: settings.thresholds.weeklyWarningBelow,
    monthlyCriticalAbove: settings.thresholds.monthlyCriticalAbove,
    monthlyCriticalBelow: settings.thresholds.monthlyCriticalBelow,
    monthlyWarningAbove: settings.thresholds.monthlyWarningAbove,
    monthlyWarningBelow: settings.thresholds.monthlyWarningBelow,
    thresholdTimeRange: 'Weekly',
  }
}
