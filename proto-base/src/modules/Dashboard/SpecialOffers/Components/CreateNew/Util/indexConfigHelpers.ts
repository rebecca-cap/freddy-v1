import {
  IndexOfferFormula,
  IndexOfferFormulaVariable,
  IndexPricingFormData,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { isDefinedAndNotNull } from '@utils/index'

export function convertComponentsToFormula(indexPricingData: IndexPricingFormData): IndexOfferFormula {
  const components = indexPricingData.formulaComponents
  const formulaVariables: IndexOfferFormulaVariable[] = components.map((component, index) => ({
    VariableName: `var_${index + 1}`,
    DisplayName: component.DisplayName || '',
    Percentage: component.Percentage ?? 100,
    PricePublisherId: component.PricePublisherId,
    PriceInstrumentId: component.PriceInstrumentId,
    PriceValuationRuleId: component.PriceValuationRuleId,
    PriceTypeCvId: component.PriceTypeCvId,
    Differential: component.Differential,
  }))

  const formulaString = formulaVariables.map((v) => v.VariableName).join(' + ')

  return {
    FormulaVariables: formulaVariables,
    Formula: formulaString,
  }
}
export function getPriceAdjustValue(savedIndexData: any, isAuction: boolean): string | undefined {
  if (!savedIndexData) return ''
  if (isAuction) {
    return isDefinedAndNotNull(savedIndexData.ReservePrice) ? fmt.currency(savedIndexData.ReservePrice) : ''
  }
  return isDefinedAndNotNull(savedIndexData.FormulaDifferential)
    ? `${fmt.currency(savedIndexData.FormulaDifferential)}`
    : ''
}
