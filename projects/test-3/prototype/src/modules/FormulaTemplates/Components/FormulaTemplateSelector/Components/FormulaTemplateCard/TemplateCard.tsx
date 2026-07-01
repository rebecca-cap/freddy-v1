import '../../styles.css'

import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ComponentItem } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Components/FormulaTemplateCard/ComponentItem'
import { FormulaPreview } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Components/FormulaTemplateCard/FormulaPreview'
import { FormulaTemplateChooserCardsProps } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Components/FormulaTemplateVerticalList/FormulaTemplateVerticalList'
import { hasPlaceholder } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/selectorHelpers'
import { Card } from 'antd'
import { useMemo } from 'react'

import { CardMetadata } from './CardMetadata'
import { CardTitle } from './CardTitle'

export function TemplateCard({
  template,
  selectedComponents,
  onComponentToggle,
  onTemplateSelect,
  metadata,
}: FormulaTemplateChooserCardsProps) {
  const hasPlaceholders = hasPlaceholder(template.FormulaTemplateVariables)

  const selectedCount = useMemo(() => {
    const variableIds = template.FormulaTemplateVariables.map((variable) => variable.FormulaTemplateVariableId)
    return selectedComponents.filter((id) => variableIds.includes(id)).length
  }, [template, selectedComponents])
  return (
    <Card
      className={`template-card ${hasPlaceholders && 'template-card-has-placeholders'}`}
      title={
        <Vertical className={'gap-10'}>
          <CardTitle name={template.Name} hasPlaceholders={hasPlaceholders} />
          <CardMetadata template={template} metadata={metadata} />
        </Vertical>
      }
      bordered={false}
    >
      <Vertical justifyContent={'space-between'} className={'h-100'}>
        <Horizontal justifyContent='space-between' verticalCenter className='my-2'>
          <Texto className={'text-11'} weight='600'>
            Select Components:
          </Texto>
          <Texto className={'text-10 component-blue-text'} weight='600'>
            {selectedCount} selected
          </Texto>
        </Horizontal>
        <div className={'component-container bordered round-border mb-3 p-2'}>
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
        </div>
        <FormulaPreview compact={false} templateVariables={template.FormulaTemplateVariables} metadata={metadata} />
        <Horizontal justifyContent='space-between' className='mb-2'>
          <GraviButton
            key='select'
            buttonText='Select Template'
            onClick={() => onTemplateSelect(template)}
            className='template-card-select-button '
            appearance={'outline'}
          />
        </Horizontal>
      </Vertical>
    </Card>
  )
}
