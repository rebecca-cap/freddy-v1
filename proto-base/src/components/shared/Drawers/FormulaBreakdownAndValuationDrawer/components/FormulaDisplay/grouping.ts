import type { Token } from './tokenizer'

interface ParenPair {
  open: number
  close: number
}

function collectParenPairs(tokens: readonly Token[]): ParenPair[] {
  const stack: number[] = []
  const pairs: ParenPair[] = []
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t.kind === 'paren' && t.text === '(') {
      stack.push(i)
    } else if (t.kind === 'paren' && t.text === ')') {
      const open = stack.pop()
      if (open != null) {
        pairs.push({ open, close: i })
      }
    }
  }
  return pairs
}

/**
 * Maps each token index to the FormulaResultComponentId of the variable whose
 * "group" the token belongs to. A group is the largest paren-delimited
 * sub-expression that contains exactly one variable. Tokens with no
 * single-variable enclosing paren are mapped only if they are the variable
 * token itself; everything else is left unassigned (neutral color).
 */
export function buildGroupAssignments(tokens: readonly Token[]): Map<number, number> {
  const assignments = new Map<number, number>()

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t.kind === 'variable') {
      const id = t.component.FormulaResultComponentId
      if (id != null) assignments.set(i, id)
    }
  }

  const pairs = collectParenPairs(tokens)
  const pairVariables = pairs.map((pair) => {
    const vars = new Set<number>()
    for (let i = pair.open + 1; i < pair.close; i++) {
      const t = tokens[i]
      if (t.kind === 'variable') {
        const id = t.component.FormulaResultComponentId
        if (id != null) vars.add(id)
      }
    }
    return { pair, vars }
  })

  const variableIds = new Set<number>()
  for (const id of assignments.values()) variableIds.add(id)

  for (const variableId of variableIds) {
    let largest: ParenPair | null = null
    for (const { pair, vars } of pairVariables) {
      if (vars.size === 1 && vars.has(variableId)) {
        if (!largest || pair.close - pair.open > largest.close - largest.open) {
          largest = pair
        }
      }
    }
    if (largest) {
      for (let i = largest.open; i <= largest.close; i++) {
        assignments.set(i, variableId)
      }
    }
  }

  return assignments
}
