import { Validation } from '@api/globalTypes'
import { Quantity } from '@api/useContractsReport/types'
import { FormulaTemplateDetails } from '@modules/FormulaTemplates/Api/types.schema'
import { Moment } from 'moment'

export interface TradeResponse {
  TotalRecords: number
  Data: Trade[]
  Query: Query
  Validations: Validation[]
}

export interface ContractManagementMetadata {
  TradeInstrumentList: TradeInstrumentList[]
  TradePriceTypeList: TradePriceTypeList[]
  InternalCounterPartyList: List[]
  ExternalCounterPartyList: List[]
  InternalColleagueList: List[]
  ExternalColleagueList: List[]
  ProductList: List[]
  LocationList: List[]
  CurrencyList: List[]
  PricePublisherList: List[]
  PriceInstrumentList: PriceInstrumentList[]
  UnitOfMeasureList: List[]
  FrequencyTypeList: List[]
  OrderStatusTypeList: List[]
  QuantityTypeList: List[]
  PriceTypeList: List[]
  PayOrReceiveTypeList: List[]
  NetOrGrossTypeList: List[]
  TradePriceValuationRuleList: List[]
  Books: List[]
  MovementTypes: List[]
  DefaultMaxAllocation: number
  DefaultMinAllocation: number
  MaxValidAllocation: number
  MinValidAllocation: number
  PublisherPriceTypes: Record<string, List[]>
  PublisherPriceInstruments: Record<string, List[]>
  PricePeriodStartOffsets: List[]
  OptionalVariableBehaviors: List[]
  FormulaTemplateDdtos: FormulaTemplateDetails[]
  PricingCalendars: List[]
}

export interface List {
  Text: string
  Value: string
  GroupingValue: null | string
}

export interface TradeInstrumentList {
  DefaultProductId: null | number
  DefaultUnitOfMeasureId: number
  DefaultFrequencyTypeCvId: number
  Text: string
  Value: string
  GroupingValue: null | string
}

export interface TradePriceTypeList {
  NumberOfFormulas: number
  Text: string
  Value: string
  GroupingValue: null | string
}

export interface PriceInstrumentList {
  CurrencyPerUnitDisplay: string
  UnitOfMeasureDisplay: string
  Text: string
  Value: string
  GroupingValue: string
}

interface Trade {
  DocumentListId: null | number
  EffectiveFromDateTime: Date
  EffectiveToDateTime: Date
  ExternalColleague: Colleague
  ExternalContractNumber: string
  ExternalCounterParty: Counterparty
  InternalColleague: Colleague
  InternalContractNumber: string
  InternalCounterParty: Counterparty
  IsActive: boolean
  NegotiatedTradeDateTime: Date
  OrderEntryId: null
  PropertyList: PropertyList
  PropertyListId: null
  SourceExtractedDateTime: Date
  SourceId: number
  SourceSystemId: number
  TradeDetails: TradeDetail[]
  TradeId: number
  TradeTypeCodeValue: TradeTypeCodeValue
  TradeTypeCvId: number
  VTrade: VTrade
}

interface Colleague {
  ColleagueId: number
  Email: string
  FirstName: string
  LastName: string
}

interface Counterparty {
  Abbreviation: string
  CounterPartyId: number
  Name: string
}

interface PropertyList {
  EntityRegisterId?: number
  Notes: any[]
  Properties: any[]
  PropertyListId: number
}

interface TradeDetail {
  DeliverOrReceiveCvId: number
  DeliverOrReceiveDisplay: string
  DeliveryFromDateTime: Date
  DeliveryToDateTime: Date
  DestinationLocation: Location
  DetailQuantity: number
  FrequencyCvId: number
  FrequencyTypeDisplay: string
  IsActive: boolean
  Location: Location
  MethodOfTransportationCvId: null
  MethodOfTransportationDisplay: null
  NetOrGrossCvId: null
  OriginLocation: Location
  Product: Product
  PropertyList: PropertyList
  TradeDetailId: number
  TradePrices: TradePrice[]
  UnitOfMeasureId: number
  VTradeDetail: VTradeDetail
}

interface Location {
  Abbreviation: string
  LocationId: number
  Name: string
}

interface Product {
  Abbreviation: string
  Name: string
  ProductId: number
}

interface TradePrice {
  Currency: Currency
  CurrencyId: number
  FixedPrice: number
  FromDateTime: Date
  IsActive: boolean
  PriceCategory: string
  PriceDescription: string
  ToDateTime: Date
  TradeDetailId: number
  TradePriceId: number
  UnitOfMeasure: UnitOfMeasure
  UnitOfMeasureId: number
}

interface Currency {
  CurrencyId: number
  Name: string
}

interface UnitOfMeasure {
  Abbreviation: string
  Name: string
  UnitOfMeasureId: number
}

interface VTradeDetail {
  AggregateContractQuantity: number
  AggregateContractQuantityUomid: number
  LiftedQuantity: number
  LiftedQuantityUomid: null
  Liftings: number
}

interface TradeTypeCodeValue {
  CodeValueId: number
  Display: string
}

interface VTrade {
  AggregateContractQuantity: number | null
  AggregateContractQuantityUomid: number
  ContractQuantity: number
  ContractUoM: string
  Frequency: string
  HasConfirm: boolean
  LiftedQuantity: number
  LiftedQuantityUomid: number
  Liftings: number
  MaxBolDateTime: null
  MaxInvoiceDateTime: null
}

interface Query {
  ProductIds: any[]
  LocationIds: any[]
  TradeTypeCvIds: any[]
  InternalCounterParties: any[]
  ExternalCounterParties: any[]
  MinEffectiveDate: Date
  MaxEffectiveDate: Date
  IncludeOverlappingEffectiveDates: boolean
  MinTradeDate: null
  MaxTradeDate: null
  IsActiveFilterType: string
  SearchString: null
  OrderingFields: OrderingField[]
  Count: number
  Offset: number
}

export interface OrderingField {
  FieldName: string
  SortDirection: string
}

export interface ContractDetails {
  Description: string
  Comments: string
  CreatedDateTime: Date
  Details: Detail[]
  ExternalColleagueFirstName: string
  ExternalColleagueId: number
  ExternalColleagueLastName: string
  ExternalCounterPartyId: number
  ExternalCounterPartyName: string
  FromDateTime: Date
  InternalColleagueFirstName: string
  InternalColleagueId: number
  InternalColleagueLastName: string
  InternalCounterPartyId: number
  InternalCounterPartyName: string
  IsExtracted: boolean
  OrderStatusCodeValueDisplay: string
  OrderStatusCvId: number
  ToDateTime: Date
  TradeEntryDateTime: Date
  TradeEntryId: number
  TradeInstrumentId: number
  TradeEntryTypeCvId: number
  TradeInstrumentName: string
  MovementTypeCvId: number
  BookId: number
  EffectiveDates?: (string | Date)[]
  ContractManagementRequiresQuantities?: boolean
  ValuationCalendarId: number
}

export interface Detail {
  Id?: string
  FrequencyCodeValueDisplay: string
  FrequencyCvId: number
  FromDateTime: Date | Moment
  FromLocationId: number
  FromLocationName: string
  NetOrGrossCodeValueDisplay: string
  NetOrGrossCvId: number
  Prices: Price[]
  ProductId: number
  ProductName: string
  Quantity: number
  MinimumAllocation: number
  MaximumAllocation: number
  ToDateTime: Date | Moment
  ToLocationId: number
  ToLocationName: string
  TradeEntryDetailId: number | undefined
  LocalTradeEntryDetailId: string
  UnitOfMeasureId: number
  UnitOfMeasureName: string
  EffectiveDates: (Moment | Date)[]
  isOpen: boolean
  PricePeriodStartOffset: string
  Quantities?: Quantity[] | null
  ValuationCalendarId: number
}

export interface Price {
  CurrencyId: number
  CurrencyName: string
  FormulaId?: number
  FromDate: Date | Moment
  IsActive?: boolean
  NetOrGrossCodeValueDisplay?: string
  NetOrGrossCvId?: number
  PayOrReceiveCodeValueDisplay: string
  PayOrReceiveCvId: number
  ToDate: Date | Moment
  TradeEntryPriceId?: number
  UnitOfMeasureId: number
  UnitOfMeasureName: string
  Formula?: Formula
  ProvisionType: string
  FixedValue: number | null
  Status: string
  LocalTradeEntryPriceId: number
}

export interface Formula {
  CreatedByCredentialId?: null | number
  CreatedDateTime?: Date
  Formula: string
  FormulaId: number
  FormulaReferenceDataMappings?: any[]
  FormulaVariables: FormulaVariable[]
  IsActive: boolean
  IsSystemCalculation?: boolean
  IsVisible?: boolean
  LocationHierarchyDisplay?: null | string
  LocationHierarchyTypeCvId?: null | number
  MarkerId?: null | number
  MarkerName?: null | string
  Name: string
  ParserType: string
  ProductHierarchyDisplay?: null | number
  ProductHierarchyTypeCvId?: null | number
}

export interface FormulaVariable {
  AllowMultiOrigin?: null | boolean
  CounterPartyMatchTypeCvId?: null | number
  CreatedByCredentialId?: null | number
  CreatedDateTime: Date
  DependentFormulaId: null | number
  Differential: number
  DisplayName: null | string
  FixedValue: null | string | number
  FormulaId: number
  FormulaVariableId: number
  FormulaVariableTemplateId: null | number
  IsCost: boolean
  IsRequired: boolean
  IsSystemVariable: boolean
  IsTemplateVariable: null | boolean
  IsVisible: boolean
  MissingOptionalPriceBehaviorCvId: null | number
  Percentage: number
  PriceInstrumentId: null | string
  PriceInstrumentName: null | string
  PricePublisherId: null | string
  PricePublisherName: null | string
  PriceTypeCvId: null | number
  PriceValuationRuleId: null | number | string
  PriceValuationRuleImplementation: null | string
  PriceValuationRuleName: null | string
  PriceValuationRuleSourceId: null | number
  SpecificCounterPartyId: null | number
  SpecificCounterPartyName: null | string
  SpecificLocationId: null | number
  SpecificProductId: null | number
  SystemDataType: string
  TradeDateRuleCvId: null | number
  UOMConversionOverride: null | number
  ValueEffectiveDateRuleCvId: null | number
  ValueSourceCvId: null | number
  VariableName: string
  PriceTypeDisplayName: null | string
}

export interface NewProvisionType {
  CurrencyId: number
  CurrencyName: string
  FromDate: Date | string
  IsActive?: boolean
  NetOrGrossCodeValueDisplay?: string
  NetOrGrossCvId?: number
  PayOrReceiveCodeValueDisplay: string
  PayOrReceiveCvId: number
  ToDate: Date | string
  TradeEntryPriceId?: number
  UnitOfMeasureId: number
  UnitOfMeasureName: string
  Formula?: newFormulaType
  ProvisionType: string
  FixedValue: number | null
  Status: string
  LocalTradeEntryPriceId: number | string
}
interface newFormulaType {
  FormulaId?: number
  FormulaVariables: {
    DisplayName: string
    FixedValue: string | number
    PriceTypeCvId: number
    ValueSourceCvId: number
    VariableName: string
  }[]
  Formula: string
  Name: string
  ParserType: string
}

export interface ContractDetailNetGrossDefaultResponse {
  NetGrossDefault: NetGrossDefault
  NetOrGrossDefaultId: number
  NetOrGrossCvId: number
  NetOrGrossDisplay: string
}

export interface NetGrossDefault {
  CounterParty: null
  CounterPartyId: null
  Location: string
  LocationId: number
  NetGrossDefaultId: number
  NetGrossDefaultType: string
  NetGrossDefaultTypeCvId: number
  NetOrGrossCodeValueDisplay: string
  NetOrGrossCvId: number
  Order: number
  Product: null
  ProductId: null
  QuoteConfiguration: null
  QuoteConfigurationId: null
  TradeEntryType: string
  TradeEntryTypeCvId: number
}
