import { OSPFormulaTemplateEndpoints } from '@modules/FormulaTemplates/Api/FormulaTemplateEndpoints'

import { FormulaTemplatesCore } from './FormulaTemplatesCore'

export function OSPFormulaTemplatesPage() {
  return <FormulaTemplatesCore endpoints={OSPFormulaTemplateEndpoints} />
}
