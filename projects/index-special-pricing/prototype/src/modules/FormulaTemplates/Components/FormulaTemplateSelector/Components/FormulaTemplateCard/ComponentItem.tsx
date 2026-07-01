import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { TemplateSelectorMetadata } from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import type { FormulaTemplateVariable } from '@modules/FormulaTemplates/Api/types.schema'
import {
  getCustomDisplayName,
  getFormulaComponentDisplay,
} from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/selectorHelpers'
import { Checkbox, theme } from 'antd'
import { useMemo } from 'react'

import { renderComponentPart } from './FormulaPreview'

// antd v4 (this proto-base) has no `theme.useToken` — it's v5-only. Fall back to a design-system
// token so the production template card renders here; in v5 the real hook is used unchanged.
const useThemeToken =
  (theme as { useToken?: () => { token: { colorSuccess?: string } } })?.useToken ??
  (() => ({ token: { colorSuccess: 'var(--theme-success)' } }))

export interface ComponentItemProps {
  variable: FormulaTemplateVariable
  selectedComponents: number[]
  onToggle: (id: number) => void
  compact?: boolean
  metadata?: TemplateSelectorMetadata
}

export function ComponentItem({
  variable,
  onToggle,
  compact = false,
  metadata,
  selectedComponents,
}: ComponentItemProps) {
  const { token } = useThemeToken()
  const isSelected = useMemo(() => {
    if (!selectedComponents) return false
    return selectedComponents?.some((comp) => comp == variable.FormulaTemplateVariableId)
  }, [selectedComponents])

  const parts = getFormulaComponentDisplay([variable], metadata)[0] || []

  const percentage = parts.find((p) => p.type === 'percentage')
  const publisher = parts.find((p) => p.type === 'publisher')
  const instrument = parts.find((p) => p.type === 'instrument')
  const dateRule = parts.find((p) => p.type === 'dateRule')
  const priceType = parts.find((p) => p.type === 'priceType')
  const customDisplayName = getCustomDisplayName(variable, metadata)
  return (
    <Horizontal
      gap={8}
      className={`component-item p-2  ${compact && 'component-item-compact'} ${
        isSelected ? 'component-item-selected' : 'bordered round-border component-item-unselected'
      }  `}
      onClick={() => variable.FormulaTemplateVariableId && onToggle(variable.FormulaTemplateVariableId)}
      style={{ cursor: 'pointer', minHeight: 'fit-content' }}
    >
      <Checkbox checked={isSelected} className='component-item-checkbox' />
      <div className='component-item-content'>
        {customDisplayName && (
          <Texto
            className='mb-1'
            style={{ fontSize: compact ? '11px' : '12px', color: 'var(--gray-600)', overflowWrap: 'anywhere' }}
          >
            <span style={{ fontWeight: 600 }}>Display Name:</span> {customDisplayName}
          </Texto>
        )}
        <div
          className={`component-item-info-row ${compact && 'component-item-info-row-compact'}`}
          style={{ fontSize: '13px' }}
        >
          <span>
            {percentage && renderComponentPart(percentage)}
            <span style={{ color: token.colorSuccess, fontWeight: 'bold' }}>+ </span>
            {publisher && renderComponentPart(publisher)}
            {instrument && renderComponentPart(instrument)}
            <br />
            {dateRule && renderComponentPart(dateRule)}
            <span style={{ color: 'var(--gray-500)' }}>• </span>
            {priceType && renderComponentPart(priceType)}
          </span>
        </div>
      </div>
    </Horizontal>
  )
}
