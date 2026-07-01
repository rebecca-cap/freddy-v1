import type { components } from '@hooks/useTypedApi'

type FormulaResultComponent = components['schemas']['DtoClasses.FormulaResultDDTOTypes.FormulaResultComponentDDTO']

export const FORMULA_SEMANTIC_COLORS = {
  function: '#5B6B8C',
  number: '#1F4E79',
  operator: '#6B7280',
  missing: '#D62728',
  string: '#A31515',
  comment: '#82C09A',
  default: 'inherit',
} as const

// Okabe-Ito CVD-safe palette; yellow omitted (poor contrast on light bg).
export const VARIABLE_PALETTE = [
  '#0072B2',
  '#D55E00',
  '#009E73',
  '#CC79A7',
  '#56B4E9',
  '#E69F00',
  '#6E4196',
] as const

export function buildVariableColorMap(components: readonly FormulaResultComponent[]): Map<number, string> {
  const sorted = [...components]
    .filter((c): c is FormulaResultComponent & { FormulaResultComponentId: number } => c?.FormulaResultComponentId != null)
    .sort((a, b) => a.FormulaResultComponentId - b.FormulaResultComponentId)

  const map = new Map<number, string>()
  sorted.forEach((c, i) => {
    map.set(c.FormulaResultComponentId, VARIABLE_PALETTE[i % VARIABLE_PALETTE.length])
  })
  return map
}
