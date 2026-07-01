import { PEFormulaTemplateEndpoints } from '@modules/FormulaTemplates/Api/FormulaTemplateEndpoints'

import { FormulaTemplatesCore } from './FormulaTemplatesCore'

export function PEFormulaTemplatesPage() {
  return <FormulaTemplatesCore endpoints={PEFormulaTemplateEndpoints} />
}
