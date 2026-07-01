import { APIResponse } from '@api/globalTypes'
import {
  FlatSettingsForForm,
  IntradayCompetitorMovementWidgetSettings,
} from '@modules/CommandCenter/api/pageViewTypes.schema'

import { IntradayCompetitorMovement, OriginalIntradayCompetitorMovementData } from '../api/types.schema'
export function updateIntradayMovementSettings(
  settings: FlatSettingsForForm,
  intradayMovementSettings: IntradayCompetitorMovementWidgetSettings,
  setIntradayMovementSettings: (settings: IntradayCompetitorMovementWidgetSettings) => void
) {
  const newSettings = {
    ...intradayMovementSettings,
    filters: {
      LocationIds: settings.LocationIds || [],
      ProductIds: settings.ProductIds || [],
      QuoteConfigurationIds: settings.QuoteConfigurationIds || [],
    },
    thresholds: {
      movementAlertCriticalAbove: settings.movementAlertCriticalAbove,
      movementAlertCriticalBelow: settings.movementAlertCriticalBelow,
      movementAlertWarningAbove: settings.movementAlertWarningAbove,
      movementAlertWarningBelow: settings.movementAlertWarningBelow,
      averageMoveCriticalAbove: settings.averageMoveCriticalAbove,
      averageMoveCriticalBelow: settings.averageMoveCriticalBelow,
      averageMoveWarningAbove: settings.averageMoveWarningAbove,
      averageMoveWarningBelow: settings.averageMoveWarningBelow,
    },
  }
  setIntradayMovementSettings(newSettings)
}

export function getIntradayCompetitorMovementDataWithStatus(
  originalIntradayCompetitorMovementData: APIResponse<OriginalIntradayCompetitorMovementData> | undefined,
  intradayCompetitorMovementSettings: IntradayCompetitorMovementWidgetSettings | null
) {
  if (!originalIntradayCompetitorMovementData?.Data || !intradayCompetitorMovementSettings?.thresholds) {
    return []
  }
  return originalIntradayCompetitorMovementData?.Data?.Rows?.map((row) => ({
    ...row,
    Status: getStatusFromIntradayCompetitorMovementRow({
      row,
      allThresholds: intradayCompetitorMovementSettings?.thresholds,
    }),
  }))
}

function getStatusFromIntradayCompetitorMovementRow({
  row,
  allThresholds,
}: {
  row: IntradayCompetitorMovement
  allThresholds: IntradayCompetitorMovementWidgetSettings['thresholds']
}) {
  if (Object.values(allThresholds).every((value) => value === null)) {
    return 'On Track'
  }
  const criticalMovementAlert =
    (allThresholds.movementAlertCriticalAbove !== null && row.MovesToday >= allThresholds.movementAlertCriticalAbove) ||
    (allThresholds.movementAlertCriticalBelow !== null && row.MovesToday <= allThresholds.movementAlertCriticalBelow)
  const criticalAverageMove =
    (allThresholds.averageMoveCriticalAbove !== null && row.AvgMove >= allThresholds.averageMoveCriticalAbove) ||
    (allThresholds.averageMoveCriticalBelow !== null && row.AvgMove <= allThresholds.averageMoveCriticalBelow)

  if (criticalMovementAlert || criticalAverageMove) {
    return 'Critical'
  }

  const warningMovementAlert =
    (allThresholds.movementAlertWarningAbove !== null && row.MovesToday >= allThresholds.movementAlertWarningAbove) ||
    (allThresholds.movementAlertWarningBelow !== null && row.MovesToday <= allThresholds.movementAlertWarningBelow)
  const warningAverageMove =
    (allThresholds.averageMoveWarningAbove !== null && row.AvgMove >= allThresholds.averageMoveWarningAbove) ||
    (allThresholds.averageMoveWarningBelow !== null && row.AvgMove <= allThresholds.averageMoveWarningBelow)

  if (warningMovementAlert || warningAverageMove) {
    return 'At Risk'
  }

  return 'On Track'
}

export function setupInitialIntradayMovementValues(settings: IntradayCompetitorMovementWidgetSettings) {
  return {
    DateRange: 'OneDay',
    LocationIds: settings.filters.LocationIds,
    ProductIds: settings.filters.ProductIds,
    QuoteConfigurationIds: settings.filters.QuoteConfigurationIds,
    movementAlertCriticalBelow: settings.thresholds.movementAlertCriticalBelow,
    movementAlertWarningAbove: settings.thresholds.movementAlertWarningAbove,
    movementAlertWarningBelow: settings.thresholds.movementAlertWarningBelow,
    movementAlertCriticalAbove: settings.thresholds.movementAlertCriticalAbove,
    averageMoveCriticalAbove: settings.thresholds.averageMoveCriticalAbove,
    averageMoveCriticalBelow: settings.thresholds.averageMoveCriticalBelow,
    averageMoveWarningAbove: settings.thresholds.averageMoveWarningAbove,
    averageMoveWarningBelow: settings.thresholds.averageMoveWarningBelow,
  }
}
