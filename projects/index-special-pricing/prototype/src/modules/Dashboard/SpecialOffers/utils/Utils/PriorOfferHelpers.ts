import type {
  IndexOfferFormulaComponent,
  IndexPricingFormData,
  ProductLocationSelection,
  SpecialOffer,
  SpecialOfferBreakdownResponseData,
  SpecialOfferMetadataResponseData,
  SpecialOfferTemplate,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'

type TextValueItem = { Text?: string | null; Value?: string | null }

export interface PriorOfferPrefill {
  template?: SpecialOfferTemplate
  productLocation?: ProductLocationSelection
  counterPartyIds: number[]
  // Form reuses ReservePrice field for both auction reserve and non-auction fixed prices.
  price?: number
  timeZoneId?: number
  indexPricingData?: IndexPricingFormData
}

export const buildPrefillFromPriorOffer = (
  priorOffer: SpecialOffer,
  breakdown: SpecialOfferBreakdownResponseData | undefined,
  metadata: SpecialOfferMetadataResponseData | undefined
): PriorOfferPrefill => {
  const offerInfo = breakdown?.OfferInfo
  const templates = metadata?.SpecialOfferTemplates ?? []

  // Grid row's `Type` is the pricing mechanism, not the template name — match by mechanism + category.
  const pricingMechanism = offerInfo?.PricingMechanismName ?? priorOffer.Type
  const evaluationType = offerInfo?.EvaluationTypeName
  const template =
    templates.find(
      (t) =>
        t.PricingMechanismMeaning?.toLowerCase() === pricingMechanism?.toLowerCase() &&
        t.CategoryType?.toLowerCase() === evaluationType?.toLowerCase()
    ) ??
    templates.find((t) => t.PricingMechanismMeaning?.toLowerCase() === pricingMechanism?.toLowerCase()) ??
    templates.find((t) => t.Name === priorOffer.Type)

  const productLocationCandidates = template?.MarketPlatformInstrumentId
    ? metadata?.ProductLocationSelections?.filter(
        (pl) => pl.MarketPlatformInstrumentId === template.MarketPlatformInstrumentId
      )
    : metadata?.ProductLocationSelections
  const productLocation = productLocationCandidates?.find(
    (pl) => pl.ProductName === priorOffer.Product && pl.LocationName === priorOffer.Location
  )

  const counterPartyIds =
    breakdown?.CustomerEngagement?.InvitedCounterPartiesWithTags?.map((cp) => cp.CounterPartyId).filter(
      (id): id is number => typeof id === 'number'
    ) ?? []

  const price = offerInfo?.FixedPrice ?? offerInfo?.ReservePrice ?? undefined

  const indexPricingData = buildIndexPricingPrefill(breakdown, metadata, productLocation)

  return {
    template,
    productLocation,
    counterPartyIds,
    price,
    timeZoneId: offerInfo?.TimeZoneId ?? priorOffer.TimeZoneId ?? undefined,
    indexPricingData,
  }
}

const findIdByText = (list: TextValueItem[] | null | undefined, text: string | null | undefined) => {
  if (!list || !text) return undefined
  const match = list.find((item) => item.Text === text)
  if (!match?.Value) return undefined
  const parsed = parseInt(match.Value, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

const buildIndexPricingPrefill = (
  breakdown: SpecialOfferBreakdownResponseData | undefined,
  metadata: SpecialOfferMetadataResponseData | undefined,
  productLocation: ProductLocationSelection | undefined
): IndexPricingFormData | undefined => {
  const display = breakdown?.OfferInfo?.IndexOfferDisplay
  const indexMeta = metadata?.IndexOfferMetaData
  if (!display || !indexMeta || !productLocation?.ProductId || !productLocation?.LocationId) {
    return undefined
  }

  const formulaComponents: IndexOfferFormulaComponent[] = (display.FormulaVariables ?? []).map(
    (variable, index): IndexOfferFormulaComponent => {
      const publisherId = findIdByText(indexMeta.PricePublishers, variable.PricePublisherName)
      const instrumentId = findIdByText(indexMeta.PriceInstruments, variable.PriceInstrumentName)
      const valuationRuleId = findIdByText(indexMeta.TradePriceValuationRules, variable.PriceValuationRuleName)
      const publisherPriceTypes = publisherId != null ? indexMeta.PublisherPriceTypes?.[String(publisherId)] : undefined
      const priceTypeCvId = findIdByText(publisherPriceTypes, variable.PriceTypeName)

      return {
        Percentage: variable.Percentage ?? null,
        PricePublisherId: publisherId ?? null,
        PriceInstrumentId: instrumentId ?? null,
        PriceValuationRuleId: valuationRuleId ?? null,
        PriceTypeCvId: priceTypeCvId ?? null,
        Differential: variable.Differential ?? null,
        DisplayName: variable.VariableDisplayName ?? null,
        IdForGrid: index,
      }
    }
  )

  // Breakdown returns PricingEffectiveTimes as the display Text; the form Select stores the
  // SelectListItem.Value (a TimeSpan string). Match by Text to recover the right Value.
  const effectiveTimeOption = indexMeta.EffectiveTimes?.find((opt) => opt.Text === display.PricingEffectiveTimes)
  const pricingEffectiveTimes = effectiveTimeOption?.Value ?? display.PricingEffectiveTimes ?? ''

  return {
    ProductId: productLocation.ProductId,
    LocationId: productLocation.LocationId,
    PricingEffectiveTimes: pricingEffectiveTimes,
    PricingWeekendBehavior: display.PricingWeekendBehavior ?? '',
    PricingHolidayBehavior: display.PricingHolidayBehavior ?? '',
    AdditionalFreetextTerms: display.AdditionalFreetextTerms ?? undefined,
    FormulaDifferential: display.ContractDifferential ?? 0,
    formulaComponents,
    PricingDisplayText: display.PricingDisplayText ?? '',
    ReservePrice: breakdown?.OfferInfo?.ReservePrice ?? undefined,
  }
}
