export interface PriceTranslationRow {
  HasConflict: boolean
  HasAllReferenceData: boolean
  ReferenceDataKey: ReferenceDataKey
  CounterPartySourceIdentifier: string
  IsActive: boolean
  IgnoreConflicts: null | boolean
  LastImportedDateTime: string
  LocationSourceIdentifier: string
  PriceImportTranslatedIdentifierId: number
  PriceImportTypeCodeValueDisplay: string
  PriceImportTypeCvId: number
  ProductSourceIdentifier: string
  StatusCvId: number
  StatusMeaning: string
  TargetCounterPartyId: number
  TargetCounterPartyName: string
  TargetLocationId: number
  TargetLocationName: string
  TargetPricePublisherName: string
  TargetProductId: number
  TargetProductName: string
  TargetPublisherId: number
  Extras: Extras
}

interface Extras {
  additionalProp1: string
  additionalProp2: string
  additionalProp3: string
}

interface ReferenceDataKey {
  Item1: number
  Item2: number
  Item3: number
  Item4: number
}

export interface PriceTranslationMetadata {
  LocationSourceValues: SelectOption[]
  ProductSourceValues: SelectOption[]
  SupplierSourceValues: SelectOption[]
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
