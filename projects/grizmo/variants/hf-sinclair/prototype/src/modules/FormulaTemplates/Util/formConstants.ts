import { FormulaTemplateVariable } from '@modules/FormulaTemplates/Api/types.schema'

export type ViewMode = 'Create' | 'Edit' | 'Duplicate'

export interface FormulaComponentRow extends FormulaTemplateVariable {
  IdForGrid?: number
  isDisplayNameCustomized?: boolean
}

export const placeholderText = {
  Percentage: '[*PCT*]',
  PricePublisherId: '[*PUB*]',
  PriceInstrumentId: '[*INSTR*]',
  PriceValuationRuleId: '[*DATE*]',
  PriceTypeCvId: '[*TYPE*]',
  Differential: '[*DIFFERENTIAL*]',
}
const initialDisplayName = `${placeholderText.Percentage} ${placeholderText.PricePublisherId} ${placeholderText.PriceInstrumentId} ${placeholderText.PriceValuationRuleId} ${placeholderText.PriceTypeCvId}`

export function blankRow(newId: number): FormulaComponentRow {
  return {
    Percentage: null,
    PricePublisherId: null,
    PriceInstrumentId: null,
    PriceValuationRuleId: null,
    PriceTypeCvId: null,
    DisplayName: initialDisplayName,
    IdForGrid: newId,
    isDisplayNameCustomized: false,
  }
}
