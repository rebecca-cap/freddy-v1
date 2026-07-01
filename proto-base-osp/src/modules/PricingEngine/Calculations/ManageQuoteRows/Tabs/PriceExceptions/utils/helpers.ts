import type { GetForConfigurationResponse, GetMetaDataResponse, SavePayload } from '../Api/usePriceExceptionsTyped'
import { type ThresholdBound, thresholdOrderingPairs } from './constants'

type ThresholdRow = NonNullable<GetForConfigurationResponse['Data']>[number]
type ThresholdEntry = NonNullable<ThresholdRow['Thresholds']>[number]
type ComponentMeta = NonNullable<GetMetaDataResponse['Components']>[number]

/** Returns the first failing bound pair, or null if ordering is valid. */
export function findThresholdViolation(
  entry: Pick<ThresholdEntry, ThresholdBound>
): { lower: ThresholdBound; upper: ThresholdBound } | null {
  for (const [lower, upper] of thresholdOrderingPairs) {
    const lowerVal = entry[lower]
    const upperVal = entry[upper]
    if (lowerVal != null && upperVal != null && lowerVal > upperVal) {
      return { lower, upper }
    }
  }
  return null
}

export function buildNameToCvIdMap(metaData: ComponentMeta[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const m of metaData) {
    const cvId = m.Value == null ? NaN : parseInt(m.Value, 10)
    if (m.Text && !Number.isNaN(cvId)) {
      map.set(m.Text, cvId)
    }
  }
  return map
}

export function buildSavePayload(
  rows: ThresholdRow[],
  nameToCvId: Map<string, number>
): SavePayload {
  return {
    Rows: rows.map((row) => ({
      QuoteConfigurationMappingId: row.QuoteConfigurationMappingId,
      Thresholds: (row.Thresholds ?? []).map((t) => ({
        PricingExceptionComponentCvId:
          t.PricingExceptionComponentCvId ?? nameToCvId.get(t.PricingExceptionComponentName ?? ''),
        CriticalBelow: t.CriticalBelow,
        WarningBelow: t.WarningBelow,
        WarningAbove: t.WarningAbove,
        CriticalAbove: t.CriticalAbove,
      })),
    })),
  }
}
