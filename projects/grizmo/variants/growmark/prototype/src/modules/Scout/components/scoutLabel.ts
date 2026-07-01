// scoutLabel — compact-form helper for long context labels.
//
// Context labels are slash-delimited "Client / Product / LOCATION - code"
// strings (e.g. "Casey / Lubricant / LAS VEGAS NV - 910"). The most identifying
// segment is the LAST one (the location), so the compact form prefers it; the
// full string is exposed via a Tooltip by the callers (ScoutRowTag,
// ScoutRowDivider). Pure + dependency-free so both the bubble and the divider
// can share one truncation policy.

const MAX = 26

export function compactLabel(label: string): string {
  if (!label) return label
  const segments = label
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean)
  // Prefer the trailing (most identifying) segment when the full string is long.
  const candidate =
    segments.length > 1 ? segments[segments.length - 1] : label
  if (candidate.length <= MAX) return candidate
  return `${candidate.slice(0, MAX - 1).trimEnd()}…`
}
