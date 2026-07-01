export interface CompetitorPricingRecord {
  Average: number
  Category: string
  CategoryId: string
  CategoryRank: number
  Change: number
  CompetitorName: string
  CounterPartyId?: number
  CounterPartyName: string
  DeltaToMe: number
  IsSelectedRow: boolean
  LastChangedDate: Date
  LatestPriceEffectiveDate?: Date
  LocationId?: number
  LocationName: string
  MonthlyAverageRank: number
  OutOfProduct: boolean
  Price: number
  PriceInstrumentId: number
  PricePublisherId: number
  PublisherAbbreviation: string
  PublisherName: string
  Rank: number
  RankByCategory: Record<string, number>
  RawMonthlyAverageRank: number
}
