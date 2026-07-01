import { MetadataListResponseItem, Validation } from '@api/globalTypes'
import { FormulaTemplateDetails } from '@modules/FormulaTemplates/Api/types.schema'

export type SpecialOfferStatus = 'Scheduled' | 'Completed' | 'Active'

export interface SpecialOffer {
  SpecialOfferId: number
  Type: string
  Name: string
  Product: string
  Location: string
  Volume: number
  Status: SpecialOfferStatus
  Response: number
  Created: string
  LiftingStartDate: string
  LiftingEndDate: string
  VisibilityStartDateTime: string
  VisibilityEndDateTime: string
  CreatedByUserName: string
  AcceptedVolume: number
  PendingSubmissionCount: number
}

export type SpecialOfferListResponse = SpecialOffer[]

export interface SpecialOfferMetadataResponseData {
  SpecialOfferTemplates: SpecialOfferTemplate[]
  ProductLocationSelections: ProductLocationSelection[]
  EligibleCounterParties: MetadataListResponseItem[]
  IndexOfferMetaData: IndexOfferMetaData
}

export interface ProductLocationSelection {
  TradeEntrySetupId: number
  MarketPlatformInstrumentId: number
  ProductName: string
  ProductGroupName: string
  LocationName: string
  LocationGroupName: string
  ProductId: number
  LocationId: number
}

export interface SpecialOfferTemplate {
  SpecialOfferTemplateId: number
  Name: string
  Description: string
  CategoryType: string
  MarketPlatformInstrumentId: number
  MarketPlatformInstrumentName: string
  PricingMechanismMeaning: string
  PricingMechanismCvId: number
  VolumeDistributionCvId: number
  EvaluationTypeCvId: number
  DefaultMinimumVolumePerOrder: number
  DefaultMaximumVolumePerOrder: number
  DefaultVolumeIncrement: number
}

export interface PriceInstrument {
  CurrencyPerUnitDisplay: string
  UnitOfMeasureDisplay: string
  Text: string
  Value: string
  GroupingValue: string
}

export interface IndexOfferMetaData {
  Products: MetadataListResponseItem[]
  Locations: MetadataListResponseItem[]
  EffectiveTimes: MetadataListResponseItem[]
  WeekendRuleOptions: string[]
  HolidayRuleOptions: string[]
  FormulaTemplates: FormulaTemplateDetails[]
  PricePublishers: MetadataListResponseItem[]
  PriceInstruments: PriceInstrument[]
  PublisherPriceTypes: Record<string, MetadataListResponseItem[]>
  PublisherPriceInstruments: Record<string, MetadataListResponseItem[]>
  TradePriceValuationRules: MetadataListResponseItem[]
}

export interface FormulaReferenceDataMapping {
  CounterPartyId: number
  CounterPartyName: string
  LocationId: number
  LocationName: string
  ProductId: number
  ProductName: string
}

export interface IndexOfferFormulaVariable {
  AllowMultiOrigin?: boolean
  CounterPartyMatchTypeCvId?: number
  CreatedByCredentialId?: number
  CreatedDateTime?: string
  DependentFormulaId?: number
  Differential?: number | null
  DisplayName: string
  FixedValue?: number
  FormulaId?: number
  FormulaVariableId?: number
  FormulaVariableTemplateId?: number
  IsCost?: boolean
  IsPlaceholder?: boolean
  IsRequired?: boolean
  IsSystemVariable?: boolean
  IsTemplateVariable?: boolean
  IsVisible?: boolean
  MissingOptionalPriceBehaviorCvId?: number
  Percentage: number
  PriceInstrumentId: number | null
  PriceInstrumentName?: string
  PricePublisherId: number | null
  PricePublisherName?: string
  PriceTypeCvId: number | null
  PriceValuationRuleId: number | null
  PriceValuationRuleImplementation?: string
  PriceValuationRuleName?: string
  PriceValuationRuleSourceId?: number
  SpecificCounterPartyId?: number
  SpecificCounterPartyName?: string
  SpecificLocationId?: number
  SpecificProductId?: number
  SystemDataType?: string
  TradeDateRuleCvId?: number
  UOMConversionOverride?: number
  ValueEffectiveDateRuleCvId?: number
  ValueSourceCvId?: number
  VariableName?: string
}

export interface IndexOfferFormula {
  CounterPartyHierarchyDefinitionId?: number
  CreatedByCredentialId?: number
  CreatedDateTime?: string
  Formula?: string
  FormulaId?: number
  FormulaReferenceDataMappings?: FormulaReferenceDataMapping[]
  FormulaVariables: IndexOfferFormulaVariable[]
  IsActive?: boolean
  IsSystemCalculation?: boolean
  IsVisible?: boolean
  LocationHierarchyDisplay?: string
  LocationHierarchyTypeCvId?: number
  MarkerId?: number
  MarkerName?: string
  ParserType?: string
  ProductHierarchyDisplay?: string
  ProductHierarchyTypeCvId?: number
}

export interface IndexPricingInfo {
  ProductId: number
  LocationId: number
  EffectiveTime: string
  WeekendRule: string
  HolidayRule: string
  AdditionalFreetextTerms?: string
  InternalFormulaDisplayNameOverride?: string
  ExternalFormulaDisplayNameOverride?: string
  PricingFormulaDefaultText: string
  Formula: IndexOfferFormula
  ContractDifferential?: number
  StartDate: string
  EndDate: string
}

export interface IndexOfferFormulaComponent {
  Percentage: number | null
  PricePublisherId: number | null
  PriceInstrumentId: number | null
  PriceValuationRuleId: number | null
  PriceTypeCvId: number | null
  DisplayName: string
  Differential?: number | null
  IdForGrid?: number
  isDisplayNameCustomized?: boolean
}

/** Form values collected from ConfigureIndexPrice drawer */
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
  PricingFormulaDefaultText: string
  ReservePrice?: number
  InternalDisplayName?: string
  ExternalDisplayName?: string
}

export interface CreateSpecialOfferRequest {
  SpecialOfferId?: number
  SpecialOfferTemplateId: number
  MinimumVolumePerOrder: number
  MaximumVolumePerOrder: number
  VolumeIncrement: number
  TotalVolume: number
  ReservePrice?: number
  FixedPrice?: number
  MarketOffset?: number
  VisibilityStartDateTime: Date | string
  VisibilityEndDateTime: Date | string
  OrderEffectiveStartDateTime: Date | string
  OrderEffectiveEndDateTime: Date | string
  CounterPartyIds: string[]
  TradeEntrySetupIds: string[]
  InvitationTriggerDateTimeTZ: Date
  IndexPricingInfo?: IndexPricingInfo
}

export interface SpecialOfferBreakdownOfferInfo {
  CreatedBy: string | null
  CreatedDateTime: string
  SpecialOfferId: number
  Name: string
  Description: string
  VisibilityStartDateTime: string // ISO string from API
  VisibilityEndDateTime: string // ISO string from API
  OrderEffectiveStartDateTime: string // ISO string from API
  OrderEffectiveEndDateTime: string // ISO string from API
  TotalVolume: number
  ReservePrice: number
  FixedPrice: number
  MarketOffset: number
  PricingMechanismName: string
  VolumeDistributionName: string
  EvaluationTypeName: string
  TotalResponses: number
  InvitationNotificationTriggerDateTimeUTC: string | null
  InvitationNotificationSentDateTimeUTC: string | null
  /** Index offer display data (populated only for index-based special offers) */
  IndexOfferDisplay?: IndexOfferViewDisplayModel
}

/** Display model for index offer viewing in Special Offers Management */
export interface IndexOfferViewDisplayModel {
  TradeEntryId: number
  FormulaDisplayName: string
  FormulaString: string
  ContractDifferential: number | null
  PricingEffectiveTimes: string | null
  PricingWeekendBehavior: string | null
  PricingHolidayBehavior: string | null
  AdditionalFreetextTerms: string | null
  FormulaVariables: IndexOfferViewFormulaVariableModel[]
}

/** Display model for a formula variable within index offer viewing display */
export interface IndexOfferViewFormulaVariableModel {
  VariableName: string
  VariableDisplayName: string
  Value: number | null
  ValueSourceType: string
  PricePublisherName: string | null
  PriceInstrumentName: string | null
  PriceTypeName: string | null
  PriceValuationRuleName: string | null
}

export interface SpecialOfferBreakdownSubmittedOrder {
  TradeEntryId: number
  CustomerName: string
  OrderPrice: number
  OrderVolume: number
  SubmittedDateTime: string // ISO string
  OrderStatus: string
  PriceType: string
  OrderStatusCvId: number
}

export interface SpecialOfferBreakdownCustomerEngagement {
  InvitedCount: number
  ViewedCount: number
  SubmittedCount: number
  AcceptedCount: number
  ApprovalPercentage: number
  InvitedCustomerNames?: string[]
  ViewedCustomerNames?: string[]
  SubmittedCustomerNames?: string[]
  AcceptedCustomerNames?: string[]
  InvitedCounterParties?: MetadataListResponseItem[]
}

export interface SpecialOfferBreakdownPricePoint {
  Price: number
  Volume: number
  Status?: string
}

export interface SpecialOfferBreakdownPriceDiscovery {
  IsAuction: boolean
  ReservePrice: number
  BidPrices: SpecialOfferBreakdownPricePoint[]
}

export interface SpecialOfferBreakdownVolumeAnalysis {
  TotalVolume: number
  AcceptedVolume: number
  PendingVolume: number
  RemainingVolume: number
  IsOverSubscribed: boolean
  OverSubscriptionPercentage: number
  RejectedVolume?: number
}

export interface SpecialOfferBreakdownResponseData {
  OfferInfo: SpecialOfferBreakdownOfferInfo
  SubmittedOrders: SpecialOfferBreakdownSubmittedOrder[]
  CustomerEngagement: SpecialOfferBreakdownCustomerEngagement
  PriceDiscovery: SpecialOfferBreakdownPriceDiscovery
  VolumeAnalysis: SpecialOfferBreakdownVolumeAnalysis
}

export interface ApproveSpecialOfferOrderRequest {
  TradeEntryId: number
}

export interface RejectSpecialOfferOrderRequest {
  TradeEntryId: number
}

export interface ApproveSpecialOfferOrderResponseData {
  Success: boolean
  Message: string
  TradeEntryId: number
  NewStatus: string
  Validations: Validation[]
}

export type RejectSpecialOfferOrderResponseData = ApproveSpecialOfferOrderResponseData

export type UpdateSpecialOfferRequest = {
  SpecialOfferId: number
  NewVisibilityEndDateTime?: string | null
  NewRemainingVolume?: number | null
}

export type UpdateSpecialOfferResponseData = {
  SpecialOfferId: number
  SpecialOfferName: string
  VisibilityEndDateTime: string
  TotalVolume: number
  AcceptedVolume: number
  RemainingVolume: number
  Status: string
  VisibilityDateModified: boolean
  VolumeModified: boolean
}
