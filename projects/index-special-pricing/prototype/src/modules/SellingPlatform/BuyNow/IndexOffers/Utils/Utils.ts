export function stripLeadingPercentage(displayName: string | null | undefined): string {
  if (!displayName) return '-'
  return displayName.replace(/^-?\d+(?:\.\d+)?%\s+/, '')
}
