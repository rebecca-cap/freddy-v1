import type { components } from '@hooks/useTypedApi'

type FormulaResultComponent = components['schemas']['DtoClasses.FormulaResultDDTOTypes.FormulaResultComponentDDTO']

const REGEX_ESCAPE = /[.*+?^${}()|[\]\\]/g

function escapeRegex(input: string) {
  return input.replace(REGEX_ESCAPE, '\\$&')
}

function buildSubstitutionRegex(componentNames: string[]) {
  if (componentNames.length === 0) return null
  const sorted = [...componentNames].sort((a, b) => b.length - a.length).map(escapeRegex)
  // Use lookarounds (not \b) so names that start/end with non-word characters
  // (e.g. `$Diff`, `RBOB-NYH`) still anchor correctly against neighboring word chars.
  return new RegExp(`(?<!\\w)(?:${sorted.join('|')})(?!\\w)`, 'g')
}

function substitute(
  formula: string,
  resultComponents: FormulaResultComponent[],
  replace: (match: string, component: FormulaResultComponent) => string
): string {
  const byName = new Map<string, FormulaResultComponent>()
  for (const c of resultComponents) {
    if (c?.ComponentName) byName.set(c.ComponentName, c)
  }
  const regex = buildSubstitutionRegex([...byName.keys()])
  if (!regex) return formula
  return formula.replace(regex, (match) => {
    const component = byName.get(match)
    return component ? replace(match, component) : match
  })
}

export function substituteDisplayNames(formula: string | null | undefined, resultComponents: FormulaResultComponent[]) {
  if (!formula) return ''
  return substitute(formula, resultComponents, (match, component) => component.ComponentDisplayName || match)
}

export function substituteValues(formula: string | null | undefined, resultComponents: FormulaResultComponent[]) {
  if (!formula) return ''
  return substitute(formula, resultComponents, (_match, component) => {
    if (typeof component.ComponentResult === 'number') {
      return fmt.currency(component.ComponentResult)
    }
    if (component.IsRequired === false && component.IsMissing) return 'Optional Variable'
    return component.ComponentStatus || 'Missing'
  })
}
