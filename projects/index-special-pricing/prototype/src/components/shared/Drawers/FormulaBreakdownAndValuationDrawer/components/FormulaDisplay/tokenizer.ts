import type { components } from '@hooks/useTypedApi'

type FormulaResultComponent = components['schemas']['DtoClasses.FormulaResultDDTOTypes.FormulaResultComponentDDTO']

export type Token =
  | { kind: 'function'; text: string }
  | { kind: 'number'; text: string }
  | { kind: 'operator'; text: string }
  | { kind: 'paren'; text: '(' | ')' }
  | { kind: 'comma'; text: string }
  | { kind: 'whitespace'; text: string }
  | { kind: 'string'; text: string }
  | { kind: 'comment'; text: string }
  | { kind: 'variable'; text: string; component: FormulaResultComponent }
  | { kind: 'deleted-variable'; text: string }
  | { kind: 'unknown'; text: string }

const FUNCTION_NAMES = ['Sum', 'Min', 'Max', 'Average', 'If']
const REGEX_ESCAPE = /[.*+?^${}()|[\]\\]/g

function escapeRegex(input: string): string {
  return input.replace(REGEX_ESCAPE, '\\$&')
}

export function tokenize(formula: string, components: readonly FormulaResultComponent[]): Token[] {
  if (!formula) return []

  const variableByName = new Map<string, FormulaResultComponent>()
  for (const c of components) {
    if (c?.ComponentName) variableByName.set(c.ComponentName, c)
  }
  const variableNames = [...variableByName.keys()].sort((a, b) => b.length - a.length)

  // Lookarounds match the existing substitution behavior so names with leading
  // or trailing non-word chars (e.g. `RBOB-NYH`, `$Diff`) anchor correctly.
  const variableRegex =
    variableNames.length > 0
      ? new RegExp(`(?<!\\w)(?:${variableNames.map(escapeRegex).join('|')})(?!\\w)`, 'y')
      : null

  // Case-insensitive; matched text is normalized to canonical case below.
  const functionRegex = new RegExp(`(?:${FUNCTION_NAMES.join('|')})(?!\\w)`, 'iy')
  const deletedRegex = /DELETED_VARIABLE(?!\w)/y
  const commentRegex = /#[^\n]*/y
  const stringRegex = /"([^"\\]|\\.)*"/y
  const whitespaceRegex = /\s+/y
  // Second alternative covers leading-dot decimals like `.9` as one token.
  const numberRegex = /\d+(?:\.\d+)?|\.\d+/y
  const operatorRegex = /\+\+|--|&&|\|\||[=!<>+\-*/%]/y
  const identifierRegex = /[a-zA-Z_]\w*/y

  const tokens: Token[] = []
  let i = 0

  const tryMatch = (regex: RegExp): string | null => {
    regex.lastIndex = i
    const match = regex.exec(formula)
    return match && match.index === i ? match[0] : null
  }

  while (i < formula.length) {
    const commentMatch = tryMatch(commentRegex)
    if (commentMatch) {
      tokens.push({ kind: 'comment', text: commentMatch })
      i += commentMatch.length
      continue
    }

    const stringMatch = tryMatch(stringRegex)
    if (stringMatch) {
      tokens.push({ kind: 'string', text: stringMatch })
      i += stringMatch.length
      continue
    }

    const whitespaceMatch = tryMatch(whitespaceRegex)
    if (whitespaceMatch) {
      tokens.push({ kind: 'whitespace', text: whitespaceMatch })
      i += whitespaceMatch.length
      continue
    }

    const deletedMatch = tryMatch(deletedRegex)
    if (deletedMatch) {
      tokens.push({ kind: 'deleted-variable', text: deletedMatch })
      i += deletedMatch.length
      continue
    }

    if (variableRegex) {
      const variableMatch = tryMatch(variableRegex)
      if (variableMatch) {
        const component = variableByName.get(variableMatch)
        if (component) {
          tokens.push({ kind: 'variable', text: variableMatch, component })
          i += variableMatch.length
          continue
        }
      }
    }

    const functionMatch = tryMatch(functionRegex)
    if (functionMatch) {
      const canonical = FUNCTION_NAMES.find((n) => n.toLowerCase() === functionMatch.toLowerCase()) ?? functionMatch
      tokens.push({ kind: 'function', text: canonical })
      i += functionMatch.length
      continue
    }

    const numberMatch = tryMatch(numberRegex)
    if (numberMatch) {
      tokens.push({ kind: 'number', text: numberMatch })
      i += numberMatch.length
      continue
    }

    const operatorMatch = tryMatch(operatorRegex)
    if (operatorMatch) {
      tokens.push({ kind: 'operator', text: operatorMatch })
      i += operatorMatch.length
      continue
    }

    const ch = formula[i]
    if (ch === '(' || ch === ')') {
      tokens.push({ kind: 'paren', text: ch as '(' | ')' })
      i++
      continue
    }
    if (ch === ',') {
      tokens.push({ kind: 'comma', text: ',' })
      i++
      continue
    }

    const identifierMatch = tryMatch(identifierRegex)
    if (identifierMatch) {
      tokens.push({ kind: 'unknown', text: identifierMatch })
      i += identifierMatch.length
      continue
    }

    tokens.push({ kind: 'unknown', text: ch })
    i++
  }

  return tokens
}
