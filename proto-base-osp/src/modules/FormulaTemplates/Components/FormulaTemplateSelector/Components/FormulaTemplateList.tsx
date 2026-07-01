import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import type { TemplateSelectorMetadata } from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import type { FormulaTemplateDetails } from '@modules/FormulaTemplates/Api/types.schema'
import { EmptyState } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Components/EmptyState'
import { TemplateCard } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Components/FormulaTemplateCard/TemplateCard'
import { FormulaTemplateVerticalList } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Components/FormulaTemplateVerticalList/FormulaTemplateVerticalList'
import type { FormulaTemplateFilter } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/Constants'
import { adaptSelectorMetadata } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/selectorHelpers'
import { useScrollControls } from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/useScrollControls'
import { generateVariableDisplayName } from '@modules/FormulaTemplates/Util/formHelpers'
import { isDefinedAndNotNull } from '@utils/index'
import { useEffect, useMemo, useState } from 'react'

interface FormulaTemplateChooserListProps {
  filters: FormulaTemplateFilter
  templates?: FormulaTemplateDetails[]
  isListMode: boolean
  metadata?: TemplateSelectorMetadata
  onTemplateSelect: (template: FormulaTemplateDetails) => void
}
export function FormulaTemplateList({
  filters,
  templates,
  isListMode,
  metadata,
  onTemplateSelect,
}: FormulaTemplateChooserListProps) {
  const [selectedComponents, setSelectedComponents] = useState<number[]>([])
  useEffect(() => {
    if (templates && templates.length > 0) {
      setSelectedComponents(() =>
        templates
          .flatMap((t) => t.FormulaTemplateVariables.map((v) => v.FormulaTemplateVariableId))
          .filter((v): v is number => isDefinedAndNotNull(v))
      )
    }
  }, [])

  const filteredTemplates = useMemo(() => {
    const adapted = adaptSelectorMetadata(metadata)
    return (
      templates?.filter((template) => {
        const keyword = filters.Keyword.toLowerCase()
        const matchesKeyword =
          keyword === '' ||
          template.Name?.toLowerCase().includes(keyword) ||
          template.FormulaTemplateVariables.some((v) => {
            const custom = v.DisplayName?.toLowerCase() ?? ''
            const autoGen = generateVariableDisplayName(v, adapted).toLowerCase()
            const varName = v.VariableName?.toLowerCase() ?? ''
            return custom.includes(keyword) || autoGen.includes(keyword) || varName.includes(keyword)
          })

        const matchesProduct =
          filters.ProductIds.length === 0 ||
          template.FormulaTemplateApplicableProducts.some((p) => {
            return filters.ProductIds.includes(p.ProductId.toString())
          })

        const matchesLocation =
          filters.LocationIds.length === 0 ||
          template.FormulaTemplateApplicableLocations.some((l) => filters.LocationIds.includes(l.LocationId.toString()))

        const matchesPriceType =
          filters.PriceTypeCvIds.length === 0 ||
          template.FormulaTemplateVariables.some((v) =>
            filters.PriceTypeCvIds.includes(v.PriceTypeCvId?.toString() ?? '')
          )

        const matchesCategory =
          filters.CategoryIds.length === 0 ||
          (template.FormulaTemplateCategoryId != null &&
            filters.CategoryIds.includes(template.FormulaTemplateCategoryId.toString()))

        return matchesKeyword && matchesProduct && matchesLocation && matchesPriceType && matchesCategory
      }) ?? []
    )
  }, [templates, filters, metadata])

  const { cardsScrollRef, scrollCards } = useScrollControls()

  const onComponentToggle = (componentId?: number) => {
    if (!componentId) return
    setSelectedComponents((prev) => {
      if (prev?.includes(componentId)) {
        return prev.filter((c) => c !== componentId)
      } else {
        return prev.concat(componentId)
      }
    })
  }
  const handleTemplateSelect = (selectedTemplate: FormulaTemplateDetails) => {
    onTemplateSelect({
      ...selectedTemplate,
      FormulaTemplateVariables: selectedTemplate.FormulaTemplateVariables.filter(
        (v) =>
          isDefinedAndNotNull(v.FormulaTemplateVariableId) && selectedComponents.includes(v.FormulaTemplateVariableId)
      ),
    })
  }

  if (!isListMode) {
    return (
      <Vertical gap={16} className={'template-chooser-list-view'} style={{ minHeight: 0, flex: 1 }}>
        <Horizontal className='template-chooser-cards-view'>
          <GraviButton
            icon={<LeftOutlined />}
            onClick={() => scrollCards('left')}
            className='ghost-gravi-button template-chooser-scroll-arrow template-chooser-scroll-arrow-left'
          />
          <div ref={cardsScrollRef} className='template-chooser-cards-scroll'>
            {filteredTemplates.length === 0 ? (
              <EmptyState />
            ) : (
              filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.FormulaTemplateId}
                  template={template}
                  selectedComponents={selectedComponents}
                  onComponentToggle={onComponentToggle}
                  onTemplateSelect={handleTemplateSelect}
                  metadata={metadata}
                />
              ))
            )}
          </div>
          <GraviButton
            icon={<RightOutlined />}
            onClick={() => scrollCards('right')}
            className='ghost-gravi-button template-chooser-scroll-arrow template-chooser-scroll-arrow-right'
          />
        </Horizontal>
      </Vertical>
    )
  }
  return (
    <Vertical
      gap={16}
      className='template-chooser-list-view p-4'
      style={{ minHeight: 0, flex: 1, alignItems: 'flex-start' }}
    >
      <div className='template-chooser-list-view' style={{ width: '100%' }}>
        {filteredTemplates.length === 0 ? (
          <EmptyState />
        ) : (
          filteredTemplates.map((template) => (
            <FormulaTemplateVerticalList
              key={template.FormulaTemplateId}
              template={template}
              metadata={metadata}
              selectedComponents={selectedComponents}
              onTemplateSelect={onTemplateSelect}
              onComponentToggle={onComponentToggle}
            />
          ))
        )}
      </div>
    </Vertical>
  )
}
