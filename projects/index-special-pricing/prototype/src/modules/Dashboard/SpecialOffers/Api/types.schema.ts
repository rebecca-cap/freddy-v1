import type { components } from '@hooks/useTypedApi'

// BE-backed types — inferred from the OpenAPI schema.

export type SpecialOffer = components['schemas']['SpecialOffers.Models.SpecialOfferViewModel']

export type SpecialOfferListResponse = SpecialOffer[]

export type EligibleCounterPartyGroupTag = components['schemas']['SpecialOffers.Models.CounterPartyGroupTagModel']

export type CustomerGroupTag = EligibleCounterPartyGroupTag

export type EligibleCounterParty = components['schemas']['SpecialOffers.Models.CounterPartySelectionDto']

export type InvitedCounterPartyWithTags =
  components['schemas']['SpecialOffers.Models.InvitedCounterPartiesWithGroupTagsModel']

export type ProductLocationSelection = components['schemas']['SpecialOffers.Models.ProductLocationSelectionModel']

export type SpecialOfferTemplate = components['schemas']['SpecialOffers.Models.SpecialOfferTemplateSelectionModel']

export type SpecialOfferMetadataResponseData = components['schemas']['SpecialOffers.Models.SpecialOfferMetaDataModel']

export type PriceInstrument = components['schemas']['UI.SelectList.PriceInstrumentSelectItem']

export type IndexOfferMetaData = components['schemas']['Service.MetaData.IndexOfferMetaDataModel']

export type IndexOfferFormulaVariable = components['schemas']['CoreModel.DtoClasses.IndexOfferFormulaVariableModel']

export type IndexOfferFormula = components['schemas']['CoreModel.DtoClasses.FormulaDDTO']

export type FormulaReferenceDataMapping =
  components['schemas']['DtoClasses.FormulaDDTOTypes.FormulaReferenceDataMappingDDTO']

export type IndexPricingInfo = components['schemas']['Service.Creation.CreatePublishedIndexOfferInput']

export type IndexOfferViewDisplayModel = components['schemas']['CoreModel.DtoClasses.IndexOfferDisplayModel']

export type IndexOfferViewFormulaVariableModel =
  components['schemas']['CoreModel.DtoClasses.IndexOfferFormulaVariableModel']

export type CreateSpecialOfferRequest = components['schemas']['SpecialOffers.Models.SpecialOfferUpsertRequest']

export type CreateOfferResponseData = components['schemas']['SpecialOffers.Models.SpecialOfferUpsertResult']

export type GetSpecialOfferBreakdownRequest =
  components['schemas']['SpecialOffers.Models.GetSpecialOfferBreakdownRequest']

export type SpecialOfferBreakdownOfferInfo = components['schemas']['SpecialOffers.Models.SpecialOfferInfoModel']

export type SpecialOfferBreakdownSubmittedOrder = components['schemas']['SpecialOffers.Models.SpecialOfferOrderModel']

export type SpecialOfferBreakdownCustomerEngagement =
  components['schemas']['SpecialOffers.Models.SpecialOfferEngagementModel']

export type SpecialOfferBreakdownPricePoint = components['schemas']['SpecialOffers.Models.PriceDiscoveryPoint']

export type SpecialOfferBreakdownPriceDiscovery =
  components['schemas']['SpecialOffers.Models.SpecialOfferPriceDiscoveryModel']

export type SpecialOfferBreakdownVolumeAnalysis =
  components['schemas']['SpecialOffers.Models.SpecialOfferVolumeAnalysisModel']

export type SpecialOfferBreakdownResponseData = components['schemas']['SpecialOffers.Models.SpecialOfferBreakdownModel']

export type ApproveSpecialOfferOrderResponseData =
  components['schemas']['SpecialOffers.Models.SpecialOfferOrderActionResult']

export type RejectSpecialOfferOrderResponseData = ApproveSpecialOfferOrderResponseData

export type UpdateSpecialOfferRequest = components['schemas']['SpecialOffers.Models.ModifySpecialOfferRequest']

export type UpdateSpecialOfferResponseData = components['schemas']['SpecialOffers.Models.ModifySpecialOfferResult']

// FE-only types — no BE counterpart. Local form state, display helpers, literal unions.

export type SpecialOfferStatus = 'Scheduled' | 'Completed' | 'Active'

/** Local builder-row shape for the index formula builder grid (not persisted; derived into IndexPricingInfo on submit). */
export interface IndexOfferFormulaComponent {
  Percentage: number | null
  PricePublisherId: number | null
  PriceInstrumentId: number | null
  PriceValuationRuleId: number | null
  PriceTypeCvId: number | null
  DisplayName: string | null
  Differential?: number | null
  IdForGrid?: number
}

/** Form values collected from the ConfigureIndexPrice drawer; transformed into IndexPricingInfo in FormHelpers. */
export interface IndexPricingFormData {
  ProductId: number
  LocationId: number
  PricingEffectiveTimes: string
  PricingWeekendBehavior: string
  PricingHolidayBehavior: string
  AdditionalFreetextTerms?: string
  FormulaDifferential: number
  IsInternalOnly?: boolean
  formulaComponents: IndexOfferFormulaComponent[]
  PricingDisplayText: string
  ReservePrice?: number
}

/** Client-side Ant form shape for the Validate preview request. */
export interface ValidateRequest {
  SpecialOfferId: number
  SpecialOfferTemplateId: number
  MinimumVolumePerOrder: number
  MaximumVolumePerOrder: number
  VolumeIncrement: number
  TotalVolume: number
  ReservePrice: number
  FixedPrice: number
  MarketOffset: number
  VisibilityStartDateTime: Date
  VisibilityEndDateTime: Date
  OrderEffectiveStartDateTime: Date
  OrderEffectiveEndDateTime: Date
  CounterPartyIds: number[]
}
