import type { MetadataListResponseItem } from '@api/globalTypes'
import type { ContractManagementMetadata, FormulaVariable } from '@modules/ContractManagement/api/types.schema'
import { blankFormulaPrice } from '@components/shared/Formulas/FormulaBuilder'
import type { TemplateSelectorMetadata } from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import type {
  FormulaTemplateDetails,
  FormulaTemplateMetadata,
  FormulaTemplateVariable,
} from '@modules/FormulaTemplates/Api/usePriceFormulaTemplate'
import { placeholderText } from '@modules/FormulaTemplates/Util/formConstants'
import {
  generateVariableDisplayName,
  mapFormulaVariableToTemplateVariable,
} from '@modules/FormulaTemplates/Util/formHelpers'
import { isDefinedAndNotNull } from '@utils/index'

export function getCategoryOptions(
  templates: FormulaTemplateDetails[] | undefined
): { value: string; label: string }[] {
  if (!templates) return []
  const seen = new Map<string, string>()
  templates.forEach((t) => {
    if (t.FormulaTemplateCategoryId != null && t.FormulaTemplateCategoryDisplay) {
      seen.set(String(t.FormulaTemplateCategoryId), t.FormulaTemplateCategoryDisplay)
    }
  })
  return Array.from(seen, ([value, label]) => ({ value, label }))
}

export const getTextFromId = (id: number | string, metadataList?: MetadataListResponseItem[]) => {
  return metadataList?.find((m) => m.Value == id)?.Text || ''
}

export const hasPlaceholder = (formulaComponents?: FormulaTemplateVariable[]) => {
  return formulaComponents?.some(
    (component) =>
      !isDefinedAndNotNull(component.Percentage) ||
      !isDefinedAndNotNull(component.PricePublisherId) ||
      !isDefinedAndNotNull(component.PriceInstrumentId) ||
      !isDefinedAndNotNull(component.TradeDateRuleCvId) ||
      !isDefinedAndNotNull(component)
  )
}

/**
 * Determines if a formula variable is "blank" (only has default values).
 * A blank variable is one created by useProvisionGroups when switching to Formula type,
 * which has Percentage=100 and all other key fields are null/empty.
 */
function isBlankFormulaVariable(variable: FormulaVariable): boolean {
  const hasOnlyDefaultPercentage = variable.Percentage === 100
  const hasNoPublisher = !isDefinedAndNotNull(variable.PricePublisherId)
  const hasNoInstrument = !isDefinedAndNotNull(variable.PriceInstrumentId)
  const hasNoDateRule = !isDefinedAndNotNull(variable.TradeDateRuleCvId)
  const hasNoValueSource = !isDefinedAndNotNull(variable.ValueSourceCvId)
  const hasNoFixedValue = !isDefinedAndNotNull(variable.FixedValue)
  const hasNoDifferential = !variable.Differential || variable.Differential === 0

  return (
    hasOnlyDefaultPercentage &&
    hasNoPublisher &&
    hasNoInstrument &&
    hasNoDateRule &&
    hasNoValueSource &&
    hasNoFixedValue &&
    hasNoDifferential
  )
}

export interface ComponentPart {
  text: string
  type: 'percentage' | 'publisher' | 'instrument' | 'dateRule' | 'priceType' | 'displayName'
  isPlaceholder: boolean
}

export function getFormulaComponentDisplay(formulaComponents, metadata?: TemplateSelectorMetadata): ComponentPart[][] {
  if (!formulaComponents) return []

  return formulaComponents.reduce((acc, component) => {
    acc.push([
      {
        text: !isDefinedAndNotNull(component.Percentage) ? placeholderText['Percentage'] : `${component.Percentage}%`,
        type: 'percentage',
        isPlaceholder: !isDefinedAndNotNull(component.Percentage),
      },
      {
        text: isDefinedAndNotNull(component.PricePublisherId)
          ? metadata?.PricePublisherList?.find((item) => item.Value == component.PricePublisherId)?.Text || ''
          : placeholderText['PricePublisherId'],
        type: 'publisher',
        isPlaceholder: !isDefinedAndNotNull(component.PricePublisherId),
      },
      {
        text: isDefinedAndNotNull(component.PriceInstrumentId)
          ? metadata?.PriceInstrumentList?.find((item) => item.Value == component.PriceInstrumentId)?.Text || ''
          : placeholderText['PriceInstrumentId'],
        type: 'instrument',
        isPlaceholder: !isDefinedAndNotNull(component.PriceInstrumentId),
      },
      {
        text: isDefinedAndNotNull(component.PriceValuationRuleId)
          ? metadata?.TradePriceValuationRuleList?.find((item) => item.Value == component.PriceValuationRuleId)?.Text ||
            ''
          : placeholderText['PriceValuationRuleId'],
        type: 'dateRule',
        isPlaceholder: !isDefinedAndNotNull(component.PriceValuationRuleId),
      },
      {
        text: isDefinedAndNotNull(component.PriceTypeCvId)
          ? metadata?.PriceTypeList?.find((item) => item.Value == component.PriceTypeCvId)?.Text || ''
          : placeholderText['PriceTypeCvId'],
        type: 'priceType',
        isPlaceholder: !isDefinedAndNotNull(component.PriceTypeCvId),
      },
    ])
    return acc
  }, [] as ComponentPart[][])
}

function mapTemplateVariableToFormulaVariable(
  templateVar: FormulaTemplateVariable,
  variableName: string,
  metadata?: ContractManagementMetadata
): FormulaVariable {
  const priceTypeName = metadata?.PriceTypeList?.find(
    (item) => item.Value == templateVar?.PriceTypeCvId?.toString()
  )?.Text
  const priceValuationRuleName = metadata?.TradePriceValuationRuleList?.find(
    (item) => item.Value == templateVar?.PriceValuationRuleId?.toString()
  )?.Text
  return {
    ...blankFormulaPrice(variableName),
    AllowMultiOrigin: templateVar.AllowMultiOrigin ?? null,
    CounterPartyMatchTypeCvId: templateVar.CounterPartyMatchTypeCvId ?? null,
    Differential: templateVar.Differential ?? 0,
    DisplayName: templateVar.DisplayName ?? '',
    FixedValue: templateVar.FixedValue ?? null,
    FormulaVariableTemplateId: templateVar.FormulaTemplateVariableId ?? null,
    IsCost: templateVar.IsCost ?? false,
    IsRequired: templateVar.IsRequired ?? true,
    IsSystemVariable: templateVar.IsSystemVariable ?? false,
    IsTemplateVariable: templateVar.IsTemplateVariable ?? true,
    IsVisible: templateVar.IsVisible ?? false,
    MissingOptionalPriceBehaviorCvId: templateVar.MissingOptionalPriceBehaviorCvId ?? null,
    Percentage: templateVar.Percentage ?? 100,
    PriceInstrumentId: templateVar.PriceInstrumentId?.toString() ?? null,
    PriceInstrumentName: '',
    PricePublisherId: templateVar.PricePublisherId?.toString() ?? null,
    PricePublisherName: '',
    PriceTypeCvId: templateVar.PriceTypeCvId?.toString() ?? null,
    PriceTypeDisplayName: priceTypeName ?? null,
    PriceValuationRuleId: templateVar.PriceValuationRuleId?.toString() ?? null,
    PriceValuationRuleImplementation: '',
    PriceValuationRuleName: priceValuationRuleName ?? null,
    SpecificCounterPartyId: templateVar.SpecificCounterPartyId ?? null,
    SpecificCounterPartyName: null,
    SpecificLocationId: templateVar.SpecificLocationId ?? null,
    SpecificProductId: templateVar.SpecificProductId ?? null,
    SystemDataType: templateVar.SystemDataType ?? '',
    TradeDateRuleCvId: templateVar.TradeDateRuleCvId ?? null,
    UOMConversionOverride: templateVar.UOMConversionOverride ?? null,
    ValueEffectiveDateRuleCvId: templateVar.PriceValuationRuleId ?? null,
    ValueSourceCvId: templateVar.ValueSourceCvId ?? null,
  }
}

export function getUpdatedProvision(provisionToEdit, selectedTemplate, targetGroupIndex, metadata): any {
  const existingVariables = provisionToEdit?.Formula?.FormulaVariables || []

  const groupNumber = targetGroupIndex + 1

  const existingInTargetGroup = existingVariables.filter((v) => v.VariableName?.split('_')[3] === String(groupNumber))
  const existingInOtherGroups = existingVariables.filter((v) => v.VariableName?.split('_')[3] !== String(groupNumber))

  // Filter out blank variables from target group (keep edited ones)
  // Blank variables are those with only default values (Percentage=100, everything else null/empty)
  const keptFromTargetGroup = existingInTargetGroup.filter((v) => !isBlankFormulaVariable(v))
  const existingCount = keptFromTargetGroup.length

  // Map template variables to formula variables with unique names
  const newVariables = selectedTemplate.FormulaTemplateVariables.map((templateVar, index) => {
    const varIndex = existingCount + index + 1
    const variableName = `var_${varIndex}_group_${groupNumber}`
    const result = mapTemplateVariableToFormulaVariable(templateVar, variableName, metadata)
    return result
  })

  // Merge: other groups + kept target group vars + new template vars
  const updatedFormulaVariables = [...existingInOtherGroups, ...keptFromTargetGroup, ...newVariables]

  // Append template name to formula name
  const currentName = provisionToEdit?.Formula?.Name || ''
  const newName = currentName ? `${currentName} + ${selectedTemplate.Name}` : selectedTemplate.PricingDisplayText

  // Update provision state only (form will be populated by ProvisionEditor's useEffect)
  const updatedProvision = { ...provisionToEdit }
  if (updatedProvision.Formula) {
    updatedProvision.Formula = {
      ...updatedProvision.Formula,
      Name: newName,
      FormulaVariables: updatedFormulaVariables,
    }
  }
  return updatedProvision
}

export function getTemplateDetails(
  provisionForm,
  managedDetail,
  groupIndex: number,
  metadata?: FormulaTemplateMetadata
) {
  // Get current form values for the specific group
  const currentFormValues = provisionForm.getFieldsValue()
  const groupVariables = currentFormValues.Groups?.[groupIndex] || []

  // Map to template variables with unique IDs for the grid
  const templateVariables = groupVariables.map((variable, index) => ({
    ...mapFormulaVariableToTemplateVariable(variable, metadata),
    IdForGrid: `new-${index}`,
  }))

  // Build unique locations array (deduplicate if FromLocationId === ToLocationId)
  const locationIds = new Set<number>()
  if (managedDetail.FromLocationId) locationIds.add(managedDetail.FromLocationId)
  if (managedDetail.ToLocationId) locationIds.add(managedDetail.ToLocationId)
  const locations = Array.from(locationIds).map((id) => ({ LocationId: id }))

  // Build template details object
  const templateDetails: Partial<FormulaTemplateDetails> = {
    Name: undefined,
    FormulaTemplateApplicableProducts: [{ ProductId: managedDetail.ProductId }],
    FormulaTemplateApplicableLocations: locations,
    FormulaTemplateVariables: templateVariables,
    FormulaTemplateCategoryId: null,
    FormulaTemplateCategoryDisplay: null,
    PricingDisplayText: null,
    FormulaTemplateId: undefined,
    CreatedByCredentialId: undefined,
    CreatedDateTime: null,
    IsActive: true,
    IsSystemCalculation: false,
    IsVisible: true,
    MarkerId: null,
    ParserType: null,
  }
  return templateDetails
}

export function adaptSelectorMetadata(
  metadata?: TemplateSelectorMetadata
): Partial<FormulaTemplateMetadata> | undefined {
  if (!metadata) return undefined
  return {
    Publishers: metadata.PricePublisherList,
    Instruments: metadata.PriceInstrumentList,
    PriceTypes: metadata.PriceTypeList,
    DateRules: metadata.TradePriceValuationRuleList,
  }
}

export function getCustomDisplayName(
  variable: FormulaTemplateVariable,
  metadata?: TemplateSelectorMetadata
): string | null {
  if (!variable.DisplayName || !metadata) return null
  const defaultName = generateVariableDisplayName(variable, adaptSelectorMetadata(metadata))
  return variable.DisplayName !== defaultName ? variable.DisplayName : null
}
