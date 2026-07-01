import './formulaTemplateStyles.css'

import { FormulaTemplateEndpoints } from '@modules/FormulaTemplates/Api/FormulaTemplateEndpoints'
import { FormulaTemplateDetails } from '@modules/FormulaTemplates/Api/types.schema'
import { usePriceFormulaTemplate } from '@modules/FormulaTemplates/Api/usePriceFormulaTemplate'
import { FormulaTemplateDrawer } from '@modules/FormulaTemplates/Components/CreateEditDrawer/FormulaTemplateDrawer'
import { ViewMode } from '@modules/FormulaTemplates/Util/formConstants'
import { useEffect, useState } from 'react'

import { FormulaTemplatesGrid } from './Components/Grid/FormulaTemplatesGrid'

interface FormulaTemplatesCoreProps {
  endpoints: FormulaTemplateEndpoints
}

export function FormulaTemplatesCore({ endpoints }: FormulaTemplatesCoreProps) {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Partial<FormulaTemplateDetails> | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('Create')
  const { getAllFormulaTemplatesQuery } = usePriceFormulaTemplate(endpoints)
  const { data: formulaTemplates } = getAllFormulaTemplatesQuery()

  useEffect(() => {
    if (selectedTemplate) {
      setIsDrawerVisible(true)
    }
  }, [selectedTemplate])

  return (
    <>
      <FormulaTemplatesGrid
        setIsDrawerVisible={setIsDrawerVisible}
        isDrawerVisible={isDrawerVisible}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        setViewMode={setViewMode}
        formulaTemplates={formulaTemplates?.Data}
        endpoints={endpoints}
      />
      <FormulaTemplateDrawer
        setIsDrawerVisible={setIsDrawerVisible}
        isDrawerVisible={isDrawerVisible}
        setSelectedTemplate={setSelectedTemplate}
        selectedTemplate={selectedTemplate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        existingTemplates={formulaTemplates?.Data}
        endpoints={endpoints}
      />
    </>
  )
}
