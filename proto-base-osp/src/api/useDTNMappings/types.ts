export interface DTNMappingsResponse {
  Data: Data
  Query: null
  Validations: any[]
}

export interface Data {
  LocationRules: LocationRule[]
  ProductRules: ProductRule[] // should be something like product rule with a product id
  SupplierRules: SupplierRule[]
}
interface BaseRule {
  DataTranslationRuleId: number // PK in database (use for getRowId)
  SourceValue: string // identifier used to indicate what the piece of reference data is. (could come from DTN)
  Display: string // Source Name for product location or supplier
  IsHidden: boolean
}
export interface LocationRule extends BaseRule {
  TargetLocationId?: number // hook up to metadata for locations
}

export interface ProductRule extends BaseRule {
  TargetProductId?: number
}

export interface SupplierRule extends BaseRule {
  TargetCounterPartyId?: number // number, nullable
  TargetPricePublisherId?: number // number, nullable
}

export interface DTNMetadataResponse {
  Products: SelectOption[]
  Locations: SelectOption[]
  CounterParties: SelectOption[]
  PricePublishers: SelectOption[]
}

interface SelectOption {
  Text: string
  Value: string
  GroupingValue: null
}

export interface CreateOrUpdateMappingsPayload {
  LocationRules?: Partial<LocationRule>[]
  ProductRules?: Partial<ProductRule>[]
  SupplierRules?: Partial<SupplierRule>[]
}
