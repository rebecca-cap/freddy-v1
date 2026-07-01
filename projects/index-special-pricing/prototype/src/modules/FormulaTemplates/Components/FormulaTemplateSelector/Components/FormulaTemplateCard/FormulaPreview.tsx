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
  pricingDisplayText?: string | null
  templateVariables?: FormulaTemplateDetails['FormulaTemplateVariables']
  metadata?: TemplateSelectorMetadata
}

export function FormulaPreview({
  compact = false,
  title,
  pricingDisplayText,
  templateVariables,
  metadata,
}: FormulaPreviewProps) {
  const componentList = getFormulaComponentDisplay(templateVariables, metadata)
  const formulaContent = pricingDisplayText || renderFormulaPreview(componentList)
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
          {formulaContent}
        </Texto>
      </Vertical>
    )
  }
  return (
    <Vertical style={{ flex: 1, minHeight: 0 }}>
      <Texto appearance='medium' weight='600' className='mb-1' style={{ fontSize: '13px' }}>
        Display Name:
      </Texto>
      <Vertical className='formula-preview-box bg-2 bordered round-border'>
        <Texto className='formula-preview-code-small'>{formulaContent}</Texto>
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

function renderFormulaPreview(components: ComponentPart[][]): React.ReactNode {
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
