type Validation = {
  Message: string
  Category?: string
  Severity: 'Info' | 'Warning' | 'Error'
}

export type ParsedCategory = {
  tradeEntrySetupId: number | null
  field: string
}

const camelToTitle = (s: string) =>
  s
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // ABCd -> AB Cd
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // minVolume -> min Volume
    .trim()

export const prettyFieldFromCategory = (category?: string): ParsedCategory => {
  if (!category) return { tradeEntrySetupId: null, field: '' }

  const m = category.match(/^TradeEntrySetupId\s+(\d+)\.([A-Za-z0-9_]+)$/)
  if (m) {
    const [, idStr, fieldRaw] = m
    return {
      tradeEntrySetupId: Number(idStr),
      field: camelToTitle(fieldRaw),
    }
  }

  const dotIdx = category.lastIndexOf('.')
  const fieldRaw = dotIdx >= 0 ? category.slice(dotIdx + 1) : category
  return {
    tradeEntrySetupId: null,
    field: camelToTitle(fieldRaw),
  }
}

export const getFirstError = (validations?: Validation[]) => (validations ?? []).find((v) => v.Severity === 'Error')
