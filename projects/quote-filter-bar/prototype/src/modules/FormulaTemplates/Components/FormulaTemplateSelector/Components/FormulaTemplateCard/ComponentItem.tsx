import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { TemplateSelectorMetadata } from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import { FormulaTemplateVariable } from '@modules/FormulaTemplates/Api/types.schema'
import { getFormulaComponentDisplay } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/selectorHelpers'
import { Checkbox } from 'antd'
import { useMemo } from 'react'

import { renderComponentPart } from './FormulaPreview'

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
  return (
    <Horizontal
      className={`component-item p-2  ${compact && 'component-item-compact'} ${
        isSelected ? 'component-item-selected' : 'bordered round-border component-item-unselected'
      }  `}
      onClick={() => variable.FormulaTemplateVariableId && onToggle(variable.FormulaTemplateVariableId)}
      style={{ cursor: 'pointer', minHeight: 'fit-content' }}
    >
      <Checkbox checked={isSelected} className='component-item-checkbox' />
      <div className='component-item-content'>
        <div
          className={`component-item-info-row ${compact && 'component-item-info-row-compact'}`}
          style={{ fontSize: '11px' }}
        >
          <span>
            {percentage && renderComponentPart(percentage)}
            <span style={{ color: '#28a745', fontWeight: 'bold' }}>+ </span>
            {publisher && renderComponentPart(publisher)}
            {instrument && renderComponentPart(instrument)}
            <br />
            {dateRule && renderComponentPart(dateRule)}
            <span style={{ color: '#8C8C8C' }}>• </span>
            {priceType && renderComponentPart(priceType)}
          </span>
        </div>
      </div>
    </Horizontal>
  )
}
