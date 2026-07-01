import { APIResponse, MetadataListResponseItem, RecordCounts } from '@api/globalTypes'

// Main MPI Configuration DTO - matches backend MarketPlatformInstrumentConfigurationDDTO
export interface MarketPlatformInstrument {
  // Identity
  MarketPlatformInstrumentId: number
  InstrumentName: string
  MarkerId: number
  TradeTypeCvId: number

  // Loading numbers
  InactivateLoadingNumbersOnUse: boolean
  LoadingNumberBehaviorCvId: number

  // Product and Location Associations
  ProductAssociationTypeCvId: number | null
  LocationAssociationTypeCvId: number | null
  OriginLocationAssociationTypeCvId: number | null
  AllowAdditionalLocationSelection: boolean
  UseDestinationLocations: boolean

  // Calendars and Timing
  CalendarId: number | null
  PricingCalendarId: number | null
  PromptDefaultOrderDurationOffset: string | null
  PromptsEffectiveTillEndOfMonth: boolean | null

  // Order Types
  AllowBid: boolean
  AllowMarketOrder: boolean
  InitialOrderStatusCvId: number | null

  // Special Features
  IsTradeAtSettle: boolean
  HasDeliveryPeriodGroups: boolean
  AllowOverridingDatesOnPromptOrders: boolean

  // Allocations
  AllowsAllocations: boolean
  RequireAllocationsForPrimaryProducts: boolean
  DecrementAllocations: boolean

  // Display fields (from backend joins/lookups)
  Calendar?: string
  InitialOrderStatus?: string
  LocationGroupLocationHierarchyType?: string
  OriginLocationAssociationType?: string
  PriceAdjustmentProductHierarchyType?: string
  TradeType?: string
  Marker?: string

  // Additional IDs for hierarchies
  LocationGroupLocationHierarchyTypeCvId?: number | null
  PriceAdjustmentProductHierarchyTypeCvId?: number | null

  // Nested collections
  MarketPlatformInstrumentRoles?: MarketPlatformInstrumentRoleDTO[]
  MarketPlatformInstrumentSubtypes?: MarketPlatformInstrumentSubtypeDTO[]
}

// MPI Role DTO
export interface MarketPlatformInstrumentRoleDTO {
  RoleId: number
  Role: string
}

// MPI Subtype DTO - matches backend MarketPlatformInstrumentSubtypeDDTO
export interface MarketPlatformInstrumentSubtypeDTO {
  MarketPlatformInstrumentSubtypeId: number
  MarketPlatformInstrumentId: number
  Name: string
  Description: string
  IsActive: boolean
  AllowBid: boolean
  AllowMarket: boolean
  AllowVolumeEdits: boolean
  ContractPricingMethodCvId: number | null
  VolumeDistributionTypeCvId: number | null

  // Display fields
  ContractPricingMethod?: string
  ContractPricingMethodMeaning?: string
  VolumeDistributionType?: string
  VolumeDistributionTypeMeaning?: string
  MarketPlatformInstrumentName?: string
}

// MPI Subtype with Parent Info (for flattened grid display)
export interface MarketPlatformInstrumentSubtypeWithParent extends MarketPlatformInstrumentSubtypeDTO {
  ParentInstrumentName?: string
  ParentMPIId?: number
}

// Metadata response - matches backend MarketPlatformInstrumentMetaDataModel
export interface MPIMetadata {
  InitialOrderStatus: MetadataListResponseItem[]
  ProductAssociationTypes: MetadataListResponseItem[]
  LocationAssociationTypes: MetadataListResponseItem[]
  LoadingNumberBehaviors: MetadataListResponseItem[]
  Calendars: MetadataListResponseItem[]
  ContractPricingMethods: MetadataListResponseItem[]
  VolumeDistributionTypes: MetadataListResponseItem[]
}

export type ActionStatus = 'Info' | 'Success' | 'Warning' | 'Error'

// API Response types
export type ReadMPIsResponse = APIResponse<MarketPlatformInstrument[]>

export type UpdateMPIsRequest = MarketPlatformInstrument[]

export interface UpdateMPIsResponse extends APIResponse<MarketPlatformInstrument[]> {
  ActionStatus: ActionStatus
  RecordCounts: RecordCounts
}

// Subtype API types
export type ReadMPISubtypesResponse = APIResponse<MarketPlatformInstrumentSubtypeDTO[]>

export type UpdateMPISubtypesRequest = MarketPlatformInstrumentSubtypeDTO[]

export interface UpdateMPISubtypesResponse extends APIResponse<MarketPlatformInstrumentSubtypeDTO[]> {
  ActionStatus: ActionStatus
  RecordCounts: RecordCounts
}
