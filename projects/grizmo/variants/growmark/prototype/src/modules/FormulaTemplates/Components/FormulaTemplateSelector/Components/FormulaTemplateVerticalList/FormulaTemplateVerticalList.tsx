import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { TemplateSelectorMetadata } from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import { FormulaTemplateDetails } from '@modules/FormulaTemplates/Api/types.schema'
import { ComponentItem } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Components/FormulaTemplateCard/ComponentItem'
import { FormulaPreview } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Components/FormulaTemplateCard/FormulaPreview'
import {
  getTextFromId,
  hasPlaceholder,
} from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/selectorHelpers'
import { Tag } from 'antd'
import { useMemo } from 'react'

export interface FormulaTemplateChooserCardsProps {
  template: FormulaTemplateDetails
  selectedComponents: number[]
  onComponentToggle: (id: number) => void
  onTemplateSelect: (template: FormulaTemplateDetails) => void
  metadata?: TemplateSelectorMetadata
}

export function FormulaTemplateVerticalList({
  template,
  metadata,
  selectedComponents,
  onTemplateSelect,
  onComponentToggle,
}: FormulaTemplateChooserCardsProps) {
  const hasPlaceholders = hasPlaceholder(template.FormulaTemplateVariables)

  const selectedCount = useMemo(() => {
    const variableIds = template.FormulaTemplateVariables.map((v) => v.FormulaTemplateVariableId)
    return selectedComponents.filter((id) => variableIds.includes(id)).length
  }, [template, selectedComponents])

  const productNames = useMemo(() => {
    if (!metadata?.ProductList || !template.FormulaTemplateApplicableProducts?.length) return 'N/A'
    return (
      template.FormulaTemplateApplicableProducts.map(
        (p) => metadata.ProductList.find((prod) => String(prod.Value) === String(p.ProductId))?.Text
      )
        .filter(Boolean)
        .join(', ') || 'N/A'
    )
  }, [template.FormulaTemplateApplicableProducts, metadata?.ProductList])

  const locationNames = useMemo(() => {
    if (!metadata?.LocationList || !template.FormulaTemplateApplicableLocations?.length) return 'N/A'
    return (
      template.FormulaTemplateApplicableLocations.map((l) => getTextFromId(l.LocationId, metadata?.LocationList))
        .filter(Boolean)
        .join(', ') || 'N/A'
    )
  }, [template.FormulaTemplateApplicableLocations, metadata?.LocationList])

  const containerClass = hasPlaceholders ? 'template-list-item-has-placeholders  ' : 'bordered round-border'

  return (
    <Vertical className={`${containerClass} mb-4 template-list-item bg-1`}>
      <Horizontal justifyContent='space-between' alignItems='center' className='template-list-item-header bg-2 p-4'>
        <Vertical flex='1'>
          <Horizontal verticalCenter className='gap-16 mb-1 component-item-content'>
            <Texto category='h5' weight='600'>
              {template.Name}
            </Texto>
            {hasPlaceholders && (
              <Tag
                style={{
                  backgroundColor: 'var(--placeholder-color-dim, #f3e8ff)',
                  color: 'var(--placeholder-color, #722ed1)',
                  border: '1px solid var(--placeholder-color, #722ed1)',
                  borderRadius: 4,
                  fontSize: 9,
                  fontWeight: 600,
                }}
              >
                PLACEHOLDERS
              </Tag>
            )}
          </Horizontal>
          <Texto appearance='medium'>
            {template.FormulaTemplateCategoryDisplay} • {productNames} • {locationNames}
          </Texto>
        </Vertical>
        <Horizontal verticalCenter className='gap-16'>
          <Texto className={'component-blue-text'}>{selectedCount} components selected</Texto>
          <GraviButton buttonText='Select Template' appearance={'outline'} onClick={() => onTemplateSelect(template)} />
        </Horizontal>
      </Horizontal>

      <Vertical className='p-4'>
        <Horizontal className={'gap-10 mb-4 component-item-content'}>
          {(template.FormulaTemplateVariables || []).map((variable) => (
            <ComponentItem
              key={variable.FormulaTemplateVariableId}
              variable={variable}
              onToggle={onComponentToggle}
              compact={true}
              metadata={metadata}
              selectedComponents={selectedComponents}
            />
          ))}
        </Horizontal>
        <FormulaPreview
          compact={true}
          title='Formula Preview'
          templateVariables={template.FormulaTemplateVariables}
          metadata={metadata}
        />
      </Vertical>
    </Vertical>
  )
}
