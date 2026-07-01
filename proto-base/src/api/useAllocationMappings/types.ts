export interface LocationsMetadataResponse {
  Locations: SelectOption[]
}

export interface SuppliersMetadataResponse {
  CounterParties: SelectOption[]
}

export interface ProductsMetadata {
  Products: SelectOption[]
}

export interface LocationTranslation {
  SourceValue: string
  SourceDisplay: string
  LocationId: number
  LocationName: string
}

export interface SupplierTranslation {
  SourceValue: string
  SourceDisplay: string
  CounterPartyId: number
  CounterPartyName: string
}

export interface ProductGroupTranslation {
  SourceValue: string
  SourceDisplay: string
  ProductIds: number[]
}

interface SelectOption {
  Text: string
  Value: string
  GroupingValue: null
}
