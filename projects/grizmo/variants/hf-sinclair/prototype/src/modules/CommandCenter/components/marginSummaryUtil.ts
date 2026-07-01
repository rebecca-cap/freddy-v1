import { APIResponse } from '@api/globalTypes'
import { FlatSettingsForForm, MarginSummaryWidgetSettings } from '@modules/CommandCenter/api/pageViewTypes.schema'
import { MarginColumn, MarginSummary, OriginalMarginSummaryData } from '@modules/CommandCenter/api/types.schema'

export function updateMarginSummarySettings(
  settings: FlatSettingsForForm,
  marginSummarySettings: MarginSummaryWidgetSettings,
  setMarginSummarySettings: (settings: MarginSummaryWidgetSettings) => void
) {
  const newSettings = {
    ...marginSummarySettings,
    filters: {
      ...marginSummarySettings?.filters,
      DateRange: settings.DateRange || marginSummarySettings?.filters?.DateRange,
      LocationIds: settings.LocationIds || [],
      ProductIds: settings.ProductIds || [],
      QuoteConfigurationIds: settings.QuoteConfigurationIds || [],
    },
    thresholds: {
      ...marginSummarySettings?.thresholds,
      criticalAbove: settings.criticalAbove,
      criticalBelow: settings.criticalBelow,
      warningAbove: settings.warningAbove,
      warningBelow: settings.warningBelow,
    },
  }
  setMarginSummarySettings(newSettings)
}

export function setupInitialMarginSummaryValues(settings: MarginSummaryWidgetSettings) {
  return {
    DateRange: settings.filters.DateRange,
    LocationIds: settings.filters.LocationIds,
    ProductIds: settings.filters.ProductIds,
    QuoteConfigurationIds: settings.filters.QuoteConfigurationIds,
    criticalAbove: settings.thresholds.criticalAbove,
    criticalBelow: settings.thresholds.criticalBelow,
    warningAbove: settings.thresholds.warningAbove,
    warningBelow: settings.thresholds.warningBelow,
  }
}

export function getMarginSummaryDataWithStatus({
  originalMarginSummaryData,
  marginSummarySettings,
}: {
  originalMarginSummaryData: APIResponse<OriginalMarginSummaryData> | undefined
  marginSummarySettings: MarginSummaryWidgetSettings | null
}) {
  if (!originalMarginSummaryData?.Data || !marginSummarySettings?.thresholds) {
    return []
  }
  return originalMarginSummaryData?.Data?.Rows.map((row) => ({
    ...row,
    Status: getStatusFromMarginSummaryRow({ row, allThresholds: marginSummarySettings?.thresholds }),
  }))
}

export function getStatusFromMarginSummaryRow({
  row,
  allThresholds,
}: {
  row: MarginSummary
  allThresholds: MarginSummaryWidgetSettings['thresholds']
}) {
  if (Object.values(allThresholds).every((value) => value === null)) {
    return 'On Track'
  }
  const margins = Object.values(row.MarginColumns)
  const criticalMargin: boolean = margins.some(
    (margin: MarginColumn) =>
      (allThresholds.criticalAbove !== null && margin.WeightedAverageMargin >= allThresholds.criticalAbove) ||
      (allThresholds.criticalBelow !== null && margin.WeightedAverageMargin <= allThresholds.criticalBelow)
  )
  const warningMargin: boolean = margins.some(
    (margin: MarginColumn) =>
      (allThresholds.warningAbove !== null && margin.WeightedAverageMargin >= allThresholds.warningAbove) ||
      (allThresholds.warningBelow !== null && margin.WeightedAverageMargin <= allThresholds.warningBelow)
  )

  if (criticalMargin) {
    return 'Critical'
  }

  if (warningMargin) {
    return 'At Risk'
  }

  return 'On Track'
}
