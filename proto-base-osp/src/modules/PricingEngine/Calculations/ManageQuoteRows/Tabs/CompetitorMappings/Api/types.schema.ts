// PE-5456 Competitor Mappings — types derived from generated OpenAPI schema.
// Re-run `yarn genapi` if BE shapes change.

import type { InferRequestBody, InferResponse, components } from '@hooks/useTypedApi'

export type SelectListItem = components['schemas']['Core.Library.SelectListItem']

// ─── Quote row selection grid ───────────────────────────────────────────────
// Uses the same DDTO the existing Quote Rows tab consumes; this guarantees the
// new tab's grid stays in sync with column field names + cache shape.
export type CompetitorMappingQuoteRow = components['schemas']['CoreModel.DtoClasses.QuoteConfigurationMappingDDTO']

// ─── Master-detail row (existing competitor associations) ────────────────────
export type CompetitorAssociation =
  components['schemas']['Admin.CompetitorPricing.CompetitorPricingAssociationDisplayModel']

// ─── Metadata response ───────────────────────────────────────────────────────
// The Metadata endpoint returns a plain `DataResult` (untyped) on the wire, so
// we shape `Data` ourselves to match `CompetitorPricingAdminMetadataResult`
// (backend/Gravitate.Modules.PricingEngine.Services/Admin/CompetitorPricing/CompetitorPricingAdminModels.cs).
export type CompetitorMappingsMetadata = {
  PricePublisherList: SelectListItem[]
  PriceInstrumentList: SelectListItem[]
  PublisherPriceInstruments: Record<number, SelectListItem[]>
  ProductHierarchyList: SelectListItem[]
  LocationHierarchyList: SelectListItem[]
  QuoteCompetitorCategoryList: SelectListItem[]
}

// ─── Find Matching Competitors ──────────────────────────────────────────────
export type FindMatchingCompetitorsRequest =
  InferRequestBody<'/api/QuoteBook/Analytics/CompetitorPriceAdmin/FindMatchingCompetitors'>

export type FindMatchingCompetitorsResponse =
  InferResponse<'/api/QuoteBook/Analytics/CompetitorPriceAdmin/FindMatchingCompetitors'>

export type CompetitorMatchResultGroup = components['schemas']['Admin.CompetitorPricing.CompetitorMatchResultGroup']
export type CompetitorMatchResult = components['schemas']['Admin.CompetitorPricing.CompetitorMatchResult']

// ─── Mutations ───────────────────────────────────────────────────────────────
export type CompetitorPricingAssociation = components['schemas']['Admin.CompetitorPricing.CompetitorPricingAssociation']

export type BulkCreateMappingsRequest = InferRequestBody<'/api/QuoteBook/Analytics/CompetitorPriceAdmin/Upsert'>

export type UpdateAssociationCategoryRequest =
  InferRequestBody<'/api/QuoteBook/Analytics/CompetitorPriceAdmin/UpdateAssociationCategory'>

export type UpdateRankCategoriesRequest = InferRequestBody<'/api/QuoteConfigurationManagement/UpdateRankCategories'>

// Visibility + single-add both ride on the existing `Upsert` endpoint with a
// single-item `Associations` array — no dedicated request types on the BE.
export type ToggleVisibilityRequest = {
  QuoteConfigurationMappingId: number
  PriceInstrumentId: number
  IsHiddenByDefault: boolean
  IsHighlighted?: boolean
  QuoteCompetitorCategoryId?: number | null
}

export type AddSingleAssociationRequest = {
  QuoteConfigurationMappingId: number
  PriceInstrumentId: number
  QuoteCompetitorCategoryId: number | null
  IsHiddenByDefault: boolean
}

type UpsertAssociation = NonNullable<BulkCreateMappingsRequest['Associations']>[number]
export type BulkUpdateVisibilityRequest = {
  Associations: Array<
    Required<
      Pick<
        UpsertAssociation,
        'QuoteConfigurationMappingId' | 'PriceInstrumentId' | 'IsHiddenByDefault' | 'IsHighlighted'
      >
    > & { QuoteCompetitorCategoryId: number | null }
  >
}
