import type { components } from '@hooks/useTypedApi'
import { Tooltip } from 'antd'
import React, { useMemo } from 'react'

import { buildGroupAssignments } from './grouping'
import { useFormulaHover } from './HoverContext'
import { FORMULA_SEMANTIC_COLORS, buildVariableColorMap } from './palette'
import styles from './styles.module.css'
import { type Token, tokenize } from './tokenizer'
import {
  applyLowerHigherOfTransform,
  applyPercentMultiplierTransform,
  applySectioningTransform,
  applyVsTransform,
} from './transforms'

type FormulaResultComponent = components['schemas']['DtoClasses.FormulaResultDDTOTypes.FormulaResultComponentDDTO']

export type FormulaDisplayMode = 'template' | 'calculated'

interface FormulaDisplayProps {
  formula: string | null | undefined
  components: readonly FormulaResultComponent[]
  mode: FormulaDisplayMode
}

const PERCENTAGE_TOLERANCE = 1e-9

export function FormulaDisplay({ formula, components, mode }: FormulaDisplayProps) {
  const tokens = useMemo(() => {
    const base = tokenize(formula ?? '', components)
    const sectioned = applySectioningTransform(base)
    const withVs = applyVsTransform(sectioned)
    const withLowerHigher = applyLowerHigherOfTransform(withVs)
    return mode === 'template' ? applyPercentMultiplierTransform(withLowerHigher) : withLowerHigher
  }, [formula, components, mode])
  const variableColors = useMemo(() => buildVariableColorMap(components), [components])
  const groupAssignments = useMemo(() => buildGroupAssignments(tokens), [tokens])
  const componentsById = useMemo(() => {
    const map = new Map<number, FormulaResultComponent>()
    for (const c of components) {
      if (c?.FormulaResultComponentId != null) map.set(c.FormulaResultComponentId, c)
    }
    return map
  }, [components])
  const { hoveredComponentId, setHoveredComponentId } = useFormulaHover()

  return (
    <pre className={styles.formulaDisplay} onMouseLeave={() => setHoveredComponentId(null)}>
      {tokens.map((token, i) => {
        const groupId = groupAssignments.get(i)
        const groupColor = groupId != null ? variableColors.get(groupId) : undefined
        const groupComponent = groupId != null ? componentsById.get(groupId) : undefined
        const isHighlighted = groupId != null && groupId === hoveredComponentId
        return (
          <TokenSpan
            key={i}
            token={token}
            mode={mode}
            groupColor={groupColor}
            groupComponent={groupComponent}
            isHighlighted={isHighlighted}
            groupId={groupId}
            onHover={setHoveredComponentId}
          />
        )
      })}
    </pre>
  )
}

interface TokenSpanProps {
  token: Token
  mode: FormulaDisplayMode
  groupColor: string | undefined
  groupComponent: FormulaResultComponent | undefined
  isHighlighted: boolean
  groupId: number | undefined
  onHover: (id: number | null) => void
}

const tooltipMouseEnterDelay = 0.3

function TokenSpan({ token, mode, groupColor, groupComponent, isHighlighted, groupId, onHover }: TokenSpanProps) {
  const classes: string[] = []
  if (isHighlighted) classes.push(styles.highlighted)
  const handleMouseEnter = () => onHover(groupId ?? null)
  const tooltip = groupComponent
    ? groupComponent.ComponentDisplayName || groupComponent.PriceInstrumentName || groupComponent.ComponentName
    : undefined
  const wrapWithTooltip = (node: React.ReactElement) =>
    tooltip ? (
      <Tooltip title={tooltip} mouseEnterDelay={tooltipMouseEnterDelay}>
        {node}
      </Tooltip>
    ) : (
      node
    )

  if (token.kind === 'variable') {
    const { component } = token
    let text: string
    let color: string
    if (mode === 'template') {
      text = component.ComponentDisplayName || token.text
      color = groupColor ?? FORMULA_SEMANTIC_COLORS.default
    } else if (typeof component.ComponentResult === 'number') {
      text = fmt.currency(component.ComponentResult)
      color = groupColor ?? FORMULA_SEMANTIC_COLORS.default
    } else if (component.IsRequired === false && component.IsMissing) {
      text = 'Optional Variable'
      color = FORMULA_SEMANTIC_COLORS.missing
    } else {
      text = component.ComponentStatus || 'Missing'
      color = FORMULA_SEMANTIC_COLORS.missing
    }
    return wrapWithTooltip(
      <span className={classes.join(' ')} style={{ color }} onMouseEnter={handleMouseEnter}>
        {text}
      </span>
    )
  }

  let color: string
  let displayText = token.text
  switch (token.kind) {
    case 'function': {
      color = groupColor ?? FORMULA_SEMANTIC_COLORS.function
      const isRenamedLabel = token.text === 'Lower of:' || token.text === 'Higher of:'
      classes.push(isRenamedLabel ? styles.functionLabel : styles.function)
      break
    }
    case 'number': {
      color = groupColor ?? FORMULA_SEMANTIC_COLORS.number
      const percentageText = tryFormatPercentage(token.text, groupComponent)
      if (percentageText) displayText = percentageText
      break
    }
    case 'operator':
    case 'paren':
    case 'comma':
      color = groupColor ?? FORMULA_SEMANTIC_COLORS.operator
      break
    case 'string':
      color = FORMULA_SEMANTIC_COLORS.string
      break
    case 'comment':
      color = FORMULA_SEMANTIC_COLORS.comment
      break
    case 'deleted-variable':
      color = FORMULA_SEMANTIC_COLORS.missing
      break
    default:
      color = FORMULA_SEMANTIC_COLORS.default
  }

  return wrapWithTooltip(
    <span className={classes.join(' ')} style={{ color }} onMouseEnter={handleMouseEnter}>
      {displayText}
    </span>
  )
}

function tryFormatPercentage(text: string, component: FormulaResultComponent | undefined): string | null {
  if (!component || component.Percentage == null) return null
  const value = parseFloat(text)
  if (Number.isNaN(value)) return null
  const expected = Math.abs(component.Percentage) / 100
  if (Math.abs(value - expected) > PERCENTAGE_TOLERANCE) return null
  return `${Math.abs(component.Percentage)}%`
}
