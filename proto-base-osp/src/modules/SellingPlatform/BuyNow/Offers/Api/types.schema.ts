import type { InferRequestBody, InferResponse, components } from '@hooks/useTypedApi'

// BE-backed types — inferred from the OpenAPI schema.

export type ItemKey = components['schemas']['Abstraction.Models.MarketPlatformItemKey']

export type SelectedItemKey = ItemKey

export type MarketPlatformItem = components['schemas']['Service.AvailableItems.MarketPlatformItemDisplayModel']

export type SpecialOfferDetails = components['schemas']['Service.AvailableItems.SpecialOfferInfo']

export type ItemGroup = components['schemas']['Service.AvailableItems.MarketPlatformItemGroup']

export type ItemsAvailableForOrderData =
  components['schemas']['Service.AvailableItems.MarketPlatformAvailableItemsResult']

export type OrderEntryData = components['schemas']['BeginOrder.Models.MarketPlatformOrderEntryDataResult']

export type OrderEntrySelectedItem = components['schemas']['BeginOrder.Models.MarketPlatformOrderOrderEntryItem']

export type PriceAdjustmentDetail = components['schemas']['BeginOrder.Models.MarketPlatformPriceAdjustmentDataItem']

export type LoadingNumber = components['schemas']['BeginOrder.Models.LoadingNumberDataItem']

export type SimpleLocation = components['schemas']['BeginOrder.Models.LocationDataItem']

export type SubmitOrderRequest = components['schemas']['Service.SubmitOrder.MarketPlatformOrderSubmitRequest']

export type SubmitOrderItem = components['schemas']['Service.SubmitOrder.MarketPlatformSubmitItem']

export type AllSpecialOffersDisplayModel = components['schemas']['SpecialOffers.Models.AllSpecialOffersDisplayModel']

export type AllSpecialOffersResult = components['schemas']['SpecialOffers.Models.AllSpecialOffersResult']

export type IndexOfferBeginOrderRequest =
  InferRequestBody<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/BeginIndexOfferOrder'>

export type IndexOfferOrderEntryDataResult = components['schemas']['Service.BeginOrder.IndexOfferOrderEntryDataResult']

export type IndexOfferOrderEntryItem = components['schemas']['Service.BeginOrder.IndexOfferOrderEntryItem']

export type FormulaVariableData = components['schemas']['IndexOffers.Domain.FormulaVariableData']

export type IndexOfferSubmitOrderRequest = components['schemas']['Service.SubmitOrder.IndexOfferSubmitOrderRequest']

// Response envelopes — inferred from the endpoints.

export type GetItemsAvailableForOrderResponse =
  InferResponse<'/api/MarketPlatform/OrderEntry/GetItemsAvailableForOrder'>

export type GetOrderEntryDataResponse = InferResponse<'/api/MarketPlatform/OrderEntry/GetOrderEntryData'>

export type SubmitOrderResponse =
  InferResponse<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/SubmitStandardOfferOrder'>

export type GetAllSpecialOffersResponse =
  InferResponse<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/GetAllSpecialOffers'>

export type IndexOfferBeginOrderResponse =
  InferResponse<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/BeginIndexOfferOrder'>

export type IndexOfferSubmitOrderResponse =
  InferResponse<'/api/MarketPlatform/MarketPlatformAllSpecialOffers/SubmitIndexOfferOrder'>

export type IndexOfferUpdateOrderResponse =
  InferResponse<'/api/MarketPlatform/MarketPlatformIndexOfferEntry/UpdateOrder'>

export type IndexOfferUpdateOrderRequest =
  InferRequestBody<'/api/MarketPlatform/MarketPlatformIndexOfferEntry/UpdateOrder'>

// Request shapes not in OpenAPI — kept local.

export interface GetItemsAvailableForOrderRequest {
  MarketPlatformInstrumentId: number | null
  IgnoreProductLocationPermissions?: boolean
  IncludeHistoricalPricingInformation?: boolean
  FilterToSpecialOffersOnly?: boolean
}

export type GetOrderEntryDataRequest = {
  SelectedItemKeys: SelectedItemKey[]
  OnlyAssignedAdditionalProducts: boolean
}

// FE-only types — local form and display state, no BE counterpart.

/** FE credit display shape — merges BE fields (EstimatedRemainingCreditBalance) with client-side flags. */
export interface CreditData {
  creditHold?: boolean
  creditStatus?: string
  totalCreditBalance?: number | null
  remainingCreditBalance?: number | null
  EstimatedRemainingCreditBalance?: number | null
}

/** FE additional-item shape with form-state flags (`selected`, `key`) overlaid on the BE item. */
export interface AdditionalItem {
  ItemType: string
  ProductId: number
  LocationId: number
  ProductName: string
  LocationName: string
  PriceAdjustmentDetails: any[]
  LoadingNumbersList: any[]
  LiftingLocations: any[]
  DestinationLocations: any[]
  ItemKey: ItemKey
  Price: number
  IndexPrice: number
  Margin: number
  FuturesMonth: string
  IsPlaceholder: boolean
  DeliveryPeriodName: string
  selected: boolean
  key: string
}

/** FE filter/select shape for MPI subtype dropdowns. */
export type ValidSubtype = {
  MarketPlatformInstrumentSubtypeId: number
  Name: string
  Description?: string
  IsActive: boolean
  AllowMarket: boolean
  AllowBid: boolean
  AllowVolumeEdits: boolean
  VolumeDistributionTypeMeaning?: string
  ContractPricingMethodMeaning?: string
}

export type SelectedAdditionalItem = {
  ItemKey: ItemKey
}
