import type {
  IndexPricingFormData,
  SpecialOfferMetadataResponseData,
} from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { mapTemplateToComponents } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureIndexPrice/Utils/TemplateHelpers'

/** Payload carried when the user switches quick-create → the existing full-setup wizard. */
export interface FullSetupCarry {
  values: Record<string, unknown>
  templateId?: number
  category?: string
  productSetupId?: number
  counterPartyIds: number[]
  indexPricingData?: IndexPricingFormData | null
}

/** Pricing mechanism a preset is scoped to (mirrors backend PricingMechanismMeaning). The
 *  on-screen Deal-type toggle is index vs fixed only — this is the offer flow, so offer/auction
 *  isn't a choice here (auction would be a separate entry point). */
export type DealPricing = 'index' | 'fixed'

/**
 * The customer filter state a preset remembers — the two stacking toggles on the shared customer
 * grid. `authorizedOnly` narrows to authorized-to-lift; `availableCredit` drops On-Hold rows
 * (keeping Good Standing + Watch) and sorts by available credit. They compose (not exclusive).
 * Group/Favorites chips are quick-SELECTS, not filters, so they aren't part of this state.
 */
export interface CustomerFilterState {
  authorizedOnly: boolean
  availableCredit: boolean
}

/** Reece's stated default: authorized-to-lift on, available-credit on. */
export const DEFAULT_CUSTOMER_FILTERS: CustomerFilterState = {
  authorizedOnly: true,
  availableCredit: true,
}

/**
 * Quick-create "presets" — a saved way of doing business that pre-fills the offer form.
 *
 * PROTOTYPE NOTE: presets are mock/local (no backend). They are intentionally abstract —
 * `resolvePreset` maps each one onto whatever the live metadata provides (first Index
 * template, a matching product-location, the first N eligible customers) so a preset
 * always populates regardless of the mock data set. Real presets would persist the exact
 * template / product-location / customer / formula selections per the dev handoff.
 *
 * `pricing`/`category` scope a preset to one deal type (offer presets ≠ auction presets); the
 * deal-type selector filters the dropdown to the matching set.
 */
export interface OfferPreset {
  id: string
  name: string
  description: string
  pricing: DealPricing
  /** Total offered volume to pre-fill (gal). */
  totalVolume?: number
  /** Fallback count if `counterPartyIds` is absent — pre-select the first N eligible. */
  customerCount?: number
  /** The EXACT customers to pre-select (Reece: "a preset comes in with these already set"). */
  counterPartyIds?: number[]
  /** The favorited customers to restore on apply (favorites travel with the preset). */
  favoriteIds?: number[]
  /** Fixed offer price (decimal dollars/gal) to pre-fill — only for `pricing: 'fixed'` presets. */
  fixedPrice?: number
  /** Customer filter toggles to restore on apply. */
  customerFilters?: CustomerFilterState
}

export const OFFER_PRESETS: OfferPreset[] = [
  {
    id: 'g3-fast-fill',
    name: 'G3 Suboctane fast-fill',
    description: 'Index · Group 3 Suboctane, standard daily customers',
    pricing: 'index',
    totalVolume: 210000,
    counterPartyIds: [9001, 9003, 9006],
    favoriteIds: [9001, 9003],
    customerFilters: { authorizedOnly: true, availableCredit: true },
  },
  {
    id: 'premium-kc-daily',
    name: 'Premium — KC daily',
    description: 'Index · Premium grade, Kansas City lifting group',
    pricing: 'index',
    totalVolume: 120000,
    counterPartyIds: [9002, 9004],
    favoriteIds: [9002, 9004],
    customerFilters: { authorizedOnly: true, availableCredit: false },
  },
  // ponytail: mock fixed-pricing presets so the Index/Fixed toggle visibly filters. Real presets
  // would persist per-pricing template/product/formula; these reuse the same abstract resolve path
  // (fixed still resolves the index-special template under the hood this pass).
  {
    id: 'rack-fixed-daily',
    name: 'Rack fixed — daily',
    description: 'Fixed · rack-priced daily allocation',
    pricing: 'fixed',
    totalVolume: 150000,
    counterPartyIds: [9001, 9010],
    favoriteIds: [9010],
    fixedPrice: 2.15,
    customerFilters: { authorizedOnly: true, availableCredit: true },
  },
  {
    id: 'term-fixed-allocation',
    name: 'Term fixed allocation',
    description: 'Fixed · monthly term volume, credit-sorted',
    pricing: 'fixed',
    totalVolume: 300000,
    counterPartyIds: [9012, 9016],
    favoriteIds: [9016],
    fixedPrice: 2.35,
    customerFilters: { authorizedOnly: false, availableCredit: true },
  },
]

/** Error message for an invalid new preset name (blank or duplicate, case-insensitive), or null if OK. */
export function validatePresetName(name: string, existingNames: string[]): string | null {
  const trimmed = name.trim()
  if (!trimmed) return 'Name is required'
  if (existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase()))
    return 'A preset with that name already exists'
  return null
}

/**
 * The default template for the quick-create flow: Index Special (Index-priced + the
 * "special" category). Falls back to any Index template, then the first template.
 */
export function pickIndexSpecialTemplate(metadata?: SpecialOfferMetadataResponseData) {
  const templates = metadata?.SpecialOfferTemplates ?? []
  return (
    templates.find((t) => t.PricingMechanismMeaning === 'Index' && t.CategoryType === 'special') ??
    templates.find((t) => t.PricingMechanismMeaning === 'Index') ??
    templates[0]
  )
}

/** The Fixed-pricing counterpart of {@link pickIndexSpecialTemplate}: the "Special" (fixed) template. */
export function pickFixedSpecialTemplate(metadata?: SpecialOfferMetadataResponseData) {
  const templates = metadata?.SpecialOfferTemplates ?? []
  return (
    templates.find((t) => t.PricingMechanismMeaning === 'Fixed' && t.CategoryType === 'special') ??
    templates.find((t) => t.PricingMechanismMeaning === 'Fixed') ??
    templates[0]
  )
}

export interface ResolvedPreset {
  templateId?: number
  category?: string
  productSetupId?: number
  productId?: number
  locationId?: number
  timeZoneId?: number
  counterPartyIds: number[]
  indexPricingData?: IndexPricingFormData | null
  /** Customer filter toggles the orchestrator restores on apply. */
  customerFilters: CustomerFilterState
  /** Favorited customers the orchestrator restores on apply. */
  favoriteIds: number[]
  /** antd form values to apply directly. */
  values: Record<string, unknown>
}

/**
 * Resolve an abstract preset against the current metadata into concrete form values +
 * the grid selections (product-location, customers) the container applies imperatively.
 */
export function resolvePreset(
  preset: OfferPreset,
  metadata?: SpecialOfferMetadataResponseData
): ResolvedPreset {
  // Fixed presets resolve the "Special" (fixed) template; index presets the "Index Special" one.
  // The index-pricing block below is guarded on the template's mechanism, so a fixed template
  // yields `indexPricingData: null` automatically — the fixed price rides in `values.ReservePrice`.
  const template =
    preset.pricing === 'fixed' ? pickFixedSpecialTemplate(metadata) : pickIndexSpecialTemplate(metadata)

  const productLocations = metadata?.ProductLocationSelections ?? []
  const productLocation =
    productLocations.find((pl) => pl.MarketPlatformInstrumentId === template?.MarketPlatformInstrumentId) ??
    productLocations[0]

  const eligible = metadata?.EligibleCounterParties ?? []
  const eligibleIdSet = new Set(eligible.map((cp) => cp.CounterPartyId).filter((id): id is number => id != null))
  // Restore the preset's EXACT customers (filtered to what's still eligible); fall back to the
  // first-N-eligible only for legacy presets that stored a count instead of ids.
  const counterPartyIds =
    preset.counterPartyIds?.length
      ? preset.counterPartyIds.filter((id) => eligibleIdSet.has(id))
      : eligible
          .slice(0, preset.customerCount ?? 0)
          .map((cp) => cp.CounterPartyId)
          .filter((id): id is number => id != null)
  const favoriteIds = (preset.favoriteIds ?? []).filter((id) => eligibleIdSet.has(id))

  // A complete, sendable index price so a preset is genuinely one-tap. Resolve a REAL
  // formula template from the metadata (product-applicable, else the first) and map its
  // variables into proper grid components — so the populated formula reads as genuinely
  // configured (named publisher/instrument/type rows), not placeholder tokens.
  const idxMeta = metadata?.IndexOfferMetaData
  const idxTemplates = idxMeta?.FormulaTemplates ?? []
  const productIdStr = productLocation?.ProductId?.toString()
  const formulaTemplate =
    idxTemplates.find((t) =>
      t.FormulaTemplateApplicableProducts?.some((p) => p.ProductId?.toString() === productIdStr)
    ) ?? idxTemplates[0]
  const presetFormulaComponents = formulaTemplate
    ? mapTemplateToComponents(formulaTemplate, { current: 1 }, idxMeta)
    : []
  const indexPricingData: IndexPricingFormData | null =
    productLocation && template?.PricingMechanismMeaning === 'Index' && presetFormulaComponents.length
      ? {
          ProductId: productLocation.ProductId as number,
          LocationId: productLocation.LocationId as number,
          PricingEffectiveTimes: idxMeta?.EffectiveTimes?.[0]?.Value ?? 'AllDay',
          PricingWeekendBehavior: idxMeta?.WeekendRuleOptions?.[0] ?? 'Friday',
          PricingHolidayBehavior: idxMeta?.HolidayRuleOptions?.[0] ?? 'PriorBusinessDay',
          FormulaDifferential: 0.025,
          formulaComponents: presetFormulaComponents,
          PricingDisplayText: formulaTemplate?.PricingDisplayText ?? '',
        }
      : null

  const values: Record<string, unknown> = {
    SpecialOfferTemplateId: template?.SpecialOfferTemplateId,
    MinimumVolumePerOrder: template?.DefaultMinimumVolumePerOrder,
    MaximumVolumePerOrder: template?.DefaultMaximumVolumePerOrder,
    VolumeIncrement: template?.DefaultVolumeIncrement,
    TotalVolume: preset.totalVolume,
    CounterPartyIds: counterPartyIds,
  }
  if (productLocation?.TradeEntrySetupId != null) {
    values.ProductLocation = [productLocation.TradeEntrySetupId]
    values.TimeZoneId = productLocation.TimeZoneId ?? undefined
  }
  if (indexPricingData) values.IndexPrice = indexPricingData
  if (preset.pricing === 'fixed' && preset.fixedPrice != null) values.ReservePrice = preset.fixedPrice

  return {
    templateId: template?.SpecialOfferTemplateId,
    category: template?.CategoryType ?? undefined,
    productSetupId: productLocation?.TradeEntrySetupId ?? undefined,
    productId: productLocation?.ProductId ?? undefined,
    locationId: productLocation?.LocationId ?? undefined,
    timeZoneId: productLocation?.TimeZoneId ?? undefined,
    counterPartyIds,
    indexPricingData,
    customerFilters: preset.customerFilters ?? DEFAULT_CUSTOMER_FILTERS,
    favoriteIds,
    values,
  }
}
