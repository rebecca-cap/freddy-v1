import './styles.css'
import '@modules/FormulaTemplates/formulaTemplateStyles.css'

import { Vertical } from '@gravitate-js/excalibrr'
import {
  TemplateSelectorHeaderContext,
  TemplateSelectorMetadata,
} from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import { FormulaTemplateDetails } from '@modules/FormulaTemplates/Api/types.schema'
import {
  FormulaTemplateFilter,
  initialFilters,
} from '@modules/FormulaTemplates/Components/FormulaTemplateSelector/Util/Constants'
import { useState } from 'react'

import { Filters } from './Components/Filters'
import { FormulaTemplateList } from './Components/FormulaTemplateList'
import { Header } from './Components/Header'

interface FormulaTemplateChooserProps {
  isChoosingTemplate: boolean
  setIsChoosingTemplate: (isChoosingTemplate: boolean) => void
  metadata?: TemplateSelectorMetadata
  manageTemplatesLink?: string
  headerContext?: TemplateSelectorHeaderContext
  onTemplateSelect: (template: FormulaTemplateDetails) => void
}

export function FormulaTemplateSelector({
  onTemplateSelect,
  setIsChoosingTemplate,
  metadata,
  manageTemplatesLink,
  headerContext,
}: FormulaTemplateChooserProps) {
  const [isListMode, setIsListMode] = useState(false)
  const [filters, setFilters] = useState<FormulaTemplateFilter>(initialFilters)
  return (
    <Vertical className={'p-4'} gap={12} style={{ minWidth: '400px', minHeight: 0, overflow: 'hidden' }}>
      <Header
        setIsChoosingTemplate={setIsChoosingTemplate}
        manageTemplatesLink={manageTemplatesLink}
        headerContext={headerContext}
      />
      <Filters
        isListMode={isListMode}
        setIsListMode={setIsListMode}
        metadata={metadata}
        filters={filters}
        setFilters={setFilters}
      />

      <FormulaTemplateList
        filters={filters}
        isListMode={isListMode}
        templates={metadata?.FormulaTemplates}
        metadata={metadata}
        onTemplateSelect={onTemplateSelect}
      />
    </Vertical>
  )
}
