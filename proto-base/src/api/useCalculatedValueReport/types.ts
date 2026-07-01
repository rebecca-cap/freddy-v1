export interface CalculatedPriceOverviewResponse {
  TotalRecords: number
  Data: CalculatedPriceRow[]
}

export interface CalculatedPriceRow {
  TradeEntrySetupId: number;
  Key: string;
  Product: string;
  ProductId: number;
  Location: string;
  LocationId: number;
  Differential: number;
  Market: number;
  FullPrice: number;
  MarketPlatformInstrumentName: string;
  MarketPlatformInstrumentId: number;
  IsMissingPricing: boolean;
  EffectiveFromDateTime: Date | null;
  DeliveryPeriodName: string;
  FuturesMonth: Date | null;
  DeliveryPeriodConfigurationId: number;
}

export interface CalculatedPriceBreakDownResponse {
  TotalRecords: number
  Data: SecondaryPriceBreakDownRow[]
}

export interface SecondaryPriceBreakDownRow {
  Key: number;
  PricingId: number;
  PricingName: string;
  PricingPercentage: number;
  CurrentValue?: number | null;
  CalculatedValue?: number | null;
  BackingPrice: SimplePrice;
  PriceTypeCvId: number;
  PriceTypeDisplay: string;
  IsRequired: string;
  IsCostComponent: string;
}

interface SimplePrice {
  PriceId: number;
  PriceInstrumentId: number;
  PricePublisherId: number;
  PriceTypeCvId: number;
  EffectiveFromDate: Date;
  EffectiveToDate: Date;
  TradeFromDate?: Date | null;
  TradeToDate?: Date | null;
  PriceStatus: string;
  UnitOfMeasureId?: number | null;
  CurrencyId?: number | null;
  Price: number;
  FormulaResultId?: number | null;
  PointId: number;
  PointTypeCvId?: number | null;
  UpdatedDateTime?: Date | null;
}

export interface CalculatedPriceReportMetadataResult {
  TradeTypeList: ListItem[]
}

export interface ListItem {
  Text: string
  Value: string
  GroupingValue: null
}
