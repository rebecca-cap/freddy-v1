export interface PriceNotification {
  QuoteConfigId: number
  QuoteConfigName: string
  LocationId: number
  LocationName: string
  ProductId: number
  ProductName: string
  EffectiveTime: string
  Price: number
  PriceDelta: number
  CustomerCount: number
  Status: 'Sent' | 'Not Sent'
  LastNotificationTime: string | null
  HasPricePublishedForPeriod: boolean
  HasBeenSent: boolean
  QuoteConfigurationMappingId: number
  QuotedValueId: null | number
}
export type PreviewMode = 'IntraDay' | 'EndOfDay' | 'EndOfDayCurrentPeriod'
