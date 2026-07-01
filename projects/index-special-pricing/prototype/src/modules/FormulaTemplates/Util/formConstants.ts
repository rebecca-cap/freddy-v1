import { FormulaTemplateVariable } from '@modules/FormulaTemplates/Api/usePriceFormulaTemplate'

export type ViewMode = 'Create' | 'Edit' | 'Duplicate'

export interface FormulaComponentRow extends FormulaTemplateVariable {
  IdForGrid?: number
}

export const placeholderText = {
  Percentage: '[*PCT*]',
  PricePublisherId: '[*PUB*]',
  PriceInstrumentId: '[*INSTR*]',
  PriceValuationRuleId: '[*DATE*]',
  PriceTypeCvId: '[*TYPE*]',
  Differential: '[*DIFFERENTIAL*]',
}
export function blankRow(newId: number): FormulaComponentRow {
  return {
    Percentage: null,
    PricePublisherId: null,
    PriceInstrumentId: null,
    PriceValuationRuleId: null,
    PriceTypeCvId: null,
    DisplayName: null,
    IdForGrid: newId,
  }
}
