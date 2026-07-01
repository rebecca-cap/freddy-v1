import { IndexOfferFormulaComponent, IndexOfferMetaData } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { placeholderText } from '@modules/FormulaTemplates/Util/formConstants'
import { checkDiffAndGetDisplayNameString } from '@modules/FormulaTemplates/Util/formHelpers'
import { isDefinedAndNotNull } from '@utils/index'

export const validateFormulaComponents =
  (metadata?: IndexOfferMetaData) => (_: unknown, value: IndexOfferFormulaComponent[]) => {
    if (!value || value.length === 0) {
      return Promise.reject('At least 1 component is required')
    }

    const fieldDisplayNames: Record<string, string> = {
      Percentage: 'Percentage',
      PricePublisherId: 'Publisher',
      PriceInstrumentId: 'Instrument',
      PriceValuationRuleId: 'Date Rule',
      PriceTypeCvId: 'Type',
    }

    const rowErrors: Map<number, string[]> = new Map()

    for (let i = 0; i < value.length; i++) {
      const component = value[i]
      const errors: string[] = []

      // Check for missing required fields
      for (const [field, displayName] of Object.entries(fieldDisplayNames)) {
        if (!isDefinedAndNotNull(component[field as keyof IndexOfferFormulaComponent])) {
          errors.push(displayName)
        }
      }

      // Check for invalid values (present but not valid for publisher)
      const publisherId = component.PricePublisherId
      if (isDefinedAndNotNull(publisherId)) {
        // Validate Instrument
        if (isDefinedAndNotNull(component.PriceInstrumentId)) {
          const validInstruments =
            metadata?.PriceInstruments?.filter((i) => i.GroupingValue === publisherId?.toString()) || []
          const isValidInstrument = validInstruments.some((i) => i.Value === component.PriceInstrumentId?.toString())
          if (!isValidInstrument) {
            errors.push('Invalid instrument')
          }
        }

        // Validate Type
        if (isDefinedAndNotNull(component.PriceTypeCvId)) {
          const validTypes = metadata?.PublisherPriceTypes?.[publisherId] || []
          const isValidType = validTypes.some((t) => t.Value === component.PriceTypeCvId?.toString())
          if (!isValidType) {
            errors.push('Invalid type')
          }
        }
      }

      if (errors.length > 0) {
        rowErrors.set(i + 1, errors)
      }
    }

    if (rowErrors.size > 0) {
      return Promise.reject(
        <ul>
          {Array.from(rowErrors.entries()).map(([rowNum, fields]) => (
            <li key={rowNum}>
              Row {rowNum}: {fields.join(', ')}
            </li>
          ))}
        </ul>
      )
    }

    return Promise.resolve()
  }

export function generateIndexOfferDisplayName(
  component: IndexOfferFormulaComponent,
  metadata?: IndexOfferMetaData
): string {
  const percent = isDefinedAndNotNull(component.Percentage) ? `${component.Percentage}%` : placeholderText['Percentage']
  const publisher = isDefinedAndNotNull(component.PricePublisherId)
    ? metadata?.PricePublishers?.find((item) => item.Value == component.PricePublisherId?.toString())?.Text ||
      placeholderText['PricePublisherId']
    : placeholderText['PricePublisherId']
  const instrument = isDefinedAndNotNull(component.PriceInstrumentId)
    ? metadata?.PriceInstruments?.find((item) => item.Value == component.PriceInstrumentId?.toString())?.Text ||
      placeholderText['PriceInstrumentId']
    : placeholderText['PriceInstrumentId']
  // Flatten all publisher price types to find the display text (allows displaying types not valid for current publisher)
  const allPriceTypes = Object.values(metadata?.PublisherPriceTypes || {}).flat()
  const type = isDefinedAndNotNull(component.PriceTypeCvId)
    ? allPriceTypes.find((item) => item.Value == component.PriceTypeCvId?.toString())?.Text ||
      placeholderText['PriceTypeCvId']
    : placeholderText['PriceTypeCvId']
  const dateRule = isDefinedAndNotNull(component.PriceValuationRuleId)
    ? metadata?.TradePriceValuationRules?.find((item) => item.Value == component.PriceValuationRuleId?.toString())
        ?.Text || placeholderText['PriceValuationRuleId']
    : placeholderText['PriceValuationRuleId']

  return checkDiffAndGetDisplayNameString({
    percent,
    publisher,
    instrument,
    dateRule,
    type,
    differential: component.Differential ?? undefined,
  })
}
