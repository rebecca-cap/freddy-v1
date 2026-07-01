import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { TemplateSelectorMetadata } from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import { FormulaTemplateDetails } from '@modules/FormulaTemplates/Api/types.schema'
import {
  ComponentPart,
  getFormulaComponentDisplay,
} from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/selectorHelpers'

export interface FormulaPreviewProps {
  compact?: boolean
  title?: string
  templateVariables?: FormulaTemplateDetails['FormulaTemplateVariables']
  metadata?: TemplateSelectorMetadata
}

export function FormulaPreview({ compact = false, title, templateVariables, metadata }: FormulaPreviewProps) {
  const componentList = getFormulaComponentDisplay(templateVariables, metadata)
  if (compact) {
    return (
      <Vertical flex={0.5} className={`formula-preview-compact component-item-content bg-2 p-3 round-border`}>
        {title && (
          <Texto
            category='h6'
            appearance='medium'
            weight='600'
            className='formula-preview-label'
            textTransform='uppercase'
          >
            {title}
          </Texto>
        )}
        <Texto category='p2' className='formula-preview-code'>
          {renderFormulaPreview(componentList)}
        </Texto>
      </Vertical>
    )
  }
  return (
    <Vertical flex={1}>
      <Texto appearance='medium' weight='600' className='mb-1 text-11'>
        Display Name:
      </Texto>
      <Vertical className='formula-preview-box bg-2 bordered round-border'>
        <Texto className='formula-preview-code-small'>{renderFormulaPreview(componentList)}</Texto>
      </Vertical>
    </Vertical>
  )
}

export function renderComponentPart(part: ComponentPart, key?: number): React.ReactNode {
  const classes = part.isPlaceholder
    ? 'component-placeholder-text'
    : part.type === 'percentage'
    ? 'component-blue-text'
    : ''
  return (
    <span key={key} className={classes}>
      {part.text || 'N/A'}{' '}
    </span>
  )
}

export function renderFormulaPreview(components: ComponentPart[][]): React.ReactNode {
  const classes = (part) => (part.isPlaceholder ? 'component-placeholder-text' : '')
  return components.map((componentParts, compIndex) => {
    // Check if percentage (first part) is negative
    const percentagePart = componentParts[0]
    const isNegative = percentagePart?.type === 'percentage' && percentagePart.text.startsWith('-')

    // Determine the operator to use before this component
    const operator = compIndex === 0 ? '' : isNegative ? ' - ' : ' + '

    return (
      <span key={compIndex}>
        {operator}
        {componentParts.map((part, partIndex) => {
          // Strip the minus sign from negative percentages (operator handles the sign)
          let displayText = part.text
          if (partIndex === 0 && isNegative && part.type === 'percentage') {
            displayText = part.text.slice(1) // Remove leading "-"
          }
          return (
            <span key={partIndex} className={classes(part)}>
              {displayText}
              {partIndex < componentParts.length - 1 ? ' ' : ''}
            </span>
          )
        })}
      </span>
    )
  })
}
