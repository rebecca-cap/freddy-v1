import type { Token } from './tokenizer'

type FunctionContext = 'Min' | 'Max' | 'other'

export function applyPercentMultiplierTransform(tokens: readonly Token[]): Token[] {
  return tokens.map((token, i) => {
    if (token.kind !== 'number') return token
    if (!token.text.includes('.')) return token
    if (!hasMultiplyNeighbor(tokens, i)) return token
    return { ...token, text: formatDecimalAsPercent(token.text) }
  })
}

function hasMultiplyNeighbor(tokens: readonly Token[], idx: number): boolean {
  for (let j = idx - 1; j >= 0; j--) {
    const t = tokens[j]
    if (t.kind === 'whitespace') continue
    if (t.kind === 'operator' && t.text === '*') return true
    break
  }
  for (let j = idx + 1; j < tokens.length; j++) {
    const t = tokens[j]
    if (t.kind === 'whitespace') continue
    if (t.kind === 'operator' && t.text === '*') return true
    break
  }
  return false
}

// Shift the decimal point via string ops — parseFloat * 100 introduces FP
// artifacts (e.g. 0.1 → 10.000000000000002).
function formatDecimalAsPercent(text: string): string {
  const dotIdx = text.indexOf('.')
  let intPart = text.slice(0, dotIdx)
  let fracPart = text.slice(dotIdx + 1)

  if (fracPart.length <= 2) {
    intPart += fracPart.padEnd(2, '0')
    fracPart = ''
  } else {
    intPart += fracPart.slice(0, 2)
    fracPart = fracPart.slice(2)
  }

  intPart = intPart.replace(/^0+/, '') || '0'
  fracPart = fracPart.replace(/0+$/, '')

  return fracPart ? `${intPart}.${fracPart}%` : `${intPart}%`
}

// Must run after applySectioningTransform — we inspect the whitespace after
// each open paren to decide whether to drop it entirely or replace with a space.
export function applyLowerHigherOfTransform(tokens: readonly Token[]): Token[] {
  const calls = collectFunctionCalls(tokens)
  const minMaxFunc = new Map<number, 'Min' | 'Max'>()
  const minMaxOpen = new Set<number>()
  const minMaxClose = new Set<number>()

  for (const call of calls) {
    if (call.name === 'Min' || call.name === 'Max') {
      minMaxFunc.set(call.funcIdx, call.name)
      minMaxOpen.add(call.openIdx)
      minMaxClose.add(call.closeIdx)
    }
  }

  if (minMaxFunc.size === 0) return [...tokens]

  const result: Token[] = []
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]

    const renamedTo = minMaxFunc.get(i)
    if (renamedTo) {
      result.push({ kind: 'function', text: renamedTo === 'Min' ? 'Lower of:' : 'Higher of:' })
      continue
    }

    if (t.kind === 'paren' && t.text === '(' && minMaxOpen.has(i)) {
      const next = tokens[i + 1]
      const nextStartsWithNewline = next && next.kind === 'whitespace' && next.text.includes('\n')
      if (!nextStartsWithNewline) {
        result.push({ kind: 'whitespace', text: ' ' })
      }
      continue
    }

    if (t.kind === 'paren' && t.text === ')' && minMaxClose.has(i)) {
      const last = result[result.length - 1]
      if (last && last.kind === 'whitespace' && last.text.includes('\n')) {
        result.pop()
      }
      continue
    }

    result.push(t)
  }

  return result
}

/**
 * Replaces argument-separator commas inside Min(...) / Max(...) calls with a
 * ` vs ` separator. Other function calls (Sum, Average, If) keep their commas.
 * Underlying formula text is unchanged — this only affects rendered tokens.
 */
export function applyVsTransform(tokens: readonly Token[]): Token[] {
  const stack: FunctionContext[] = []
  const result: Token[] = []
  let pendingFunc: string | null = null

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]

    if (t.kind === 'function') {
      pendingFunc = t.text
      result.push(t)
      continue
    }

    if (t.kind === 'paren' && t.text === '(') {
      stack.push(pendingFunc === 'Min' || pendingFunc === 'Max' ? pendingFunc : 'other')
      pendingFunc = null
      result.push(t)
      continue
    }

    if (t.kind === 'paren' && t.text === ')') {
      stack.pop()
      result.push(t)
      continue
    }

    if (t.kind === 'comma') {
      const top = stack[stack.length - 1]
      if (top === 'Min' || top === 'Max') {
        const last = result[result.length - 1]
        if (!last || last.kind !== 'whitespace') {
          result.push({ kind: 'whitespace', text: ' ' })
        }
        result.push({ kind: 'comma', text: 'vs' })
        const next = tokens[i + 1]
        if (!next || next.kind !== 'whitespace') {
          result.push({ kind: 'whitespace', text: ' ' })
        }
        continue
      }
    }

    if (t.kind !== 'whitespace') pendingFunc = null
    result.push(t)
  }

  return result
}

const INDENT = '  '

interface Call {
  funcIdx: number
  openIdx: number
  closeIdx: number
  name: string
}

function collectFunctionCalls(tokens: readonly Token[]): Call[] {
  const calls: Call[] = []
  const openStack: { funcIdx: number; openIdx: number; name: string }[] = []
  let pendingFunc: { idx: number; name: string } | null = null

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t.kind === 'function') {
      pendingFunc = { idx: i, name: t.text }
    } else if (t.kind === 'paren' && t.text === '(') {
      if (pendingFunc) {
        openStack.push({ funcIdx: pendingFunc.idx, openIdx: i, name: pendingFunc.name })
        pendingFunc = null
      } else {
        openStack.push({ funcIdx: -1, openIdx: i, name: '(' })
      }
    } else if (t.kind === 'paren' && t.text === ')') {
      const top = openStack.pop()
      if (top && top.funcIdx !== -1) {
        calls.push({ funcIdx: top.funcIdx, openIdx: top.openIdx, closeIdx: i, name: top.name })
      }
    } else if (t.kind !== 'whitespace') {
      pendingFunc = null
    }
  }
  return calls
}

/**
 * Splits Min(...) / Max(...) calls onto multiple lines when they contain nested
 * Min/Max calls. The closing paren returns to its function's column; arguments
 * indent one level deeper. Separators ('vs' / ',') start each new line.
 */
export function applySectioningTransform(tokens: readonly Token[]): Token[] {
  const calls = collectFunctionCalls(tokens)
  const minMaxCalls = calls.filter((c) => c.name === 'Min' || c.name === 'Max')

  const splittableFuncIdx = new Set<number>()
  for (const call of minMaxCalls) {
    const hasNested = minMaxCalls.some(
      (other) =>
        other.funcIdx !== call.funcIdx &&
        other.openIdx > call.openIdx &&
        other.closeIdx < call.closeIdx
    )
    if (hasNested) splittableFuncIdx.add(call.funcIdx)
  }

  if (splittableFuncIdx.size === 0) return [...tokens]

  const splittableOpenIdx = new Set<number>()
  const splittableCloseIdx = new Set<number>()
  for (const call of calls) {
    if (splittableFuncIdx.has(call.funcIdx)) {
      splittableOpenIdx.add(call.openIdx)
      splittableCloseIdx.add(call.closeIdx)
    }
  }

  interface Frame {
    depth: number
    innerParenDepth: number
  }
  const splitStack: Frame[] = []
  let parenDepth = 0
  const result: Token[] = []
  const indentOf = (n: number) => INDENT.repeat(n)

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]

    if (t.kind === 'paren' && t.text === '(') {
      parenDepth++
      result.push(t)
      if (splittableOpenIdx.has(i)) {
        const depth = splitStack.length + 1
        splitStack.push({ depth, innerParenDepth: parenDepth })
        result.push({ kind: 'whitespace', text: `\n${indentOf(depth)}` })
        if (i + 1 < tokens.length && tokens[i + 1].kind === 'whitespace') i++
      }
      continue
    }

    if (t.kind === 'paren' && t.text === ')') {
      if (splittableCloseIdx.has(i)) {
        const frame = splitStack.pop()
        const depth = frame ? frame.depth : 0
        if (result.length > 0 && result[result.length - 1].kind === 'whitespace') {
          result.pop()
        }
        result.push({ kind: 'whitespace', text: `\n${indentOf(depth - 1)}` })
      }
      parenDepth--
      result.push(t)
      continue
    }

    if (t.kind === 'comma') {
      const topFrame = splitStack[splitStack.length - 1]
      if (topFrame && parenDepth === topFrame.innerParenDepth) {
        if (result.length > 0 && result[result.length - 1].kind === 'whitespace') {
          result.pop()
        }
        result.push({ kind: 'whitespace', text: `\n${indentOf(topFrame.depth)}` })
        result.push(t)
        continue
      }
    }

    result.push(t)
  }

  return result
}
