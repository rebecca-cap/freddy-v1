type MetricType = 'Volume' | 'Price'

interface SparkGraphData {
  Name: string
  Total: number
  VariancePercent: number
  Type: MetricType
  Values: number[]
}

interface ProfitTrendsData {
  Date: Date
  Profit: number
  VolumeLifted: number
}

interface CommodityPriceGraphData {
  date: Date
  price: number
}

interface CommodityPriceDetails {
  Open: number
  High: number
  Low: number
  Bid: number
  Ask: number
  PercentChange: number
  LastPrice: number
  Change: number
  LongName: string
  Source: string
}

interface CommodityPriceSelector {
  ShortName: string
  Price: number
  PercentChange: number
}

interface CommodityPrice {
  Graph: CommodityPriceGraphData[]
  Details: CommodityPriceDetails
  Selector: CommodityPriceSelector
}

interface CustomerPerformanceData {
  Customer: string
  TotalVolumeLifted: number
  Margin: number
  Score: number
  Thumbnail: string // Base64 encoded icon
}

interface TopProduct {
  Name: string
  TotalProfit: number
  AverageMargin: number
  TotalLiftings: number
}

interface TerminalGroupPerformanceData {
  Name: string
  Score: number
  TotalProfit: number
  AverageMargin: number
  TotalLiftings: number
  TopProducts: TopProduct[]
}

export interface PricingAnalyticsResponse {
  SparkGraphs: SparkGraphData[]
  ProfitTrends: ProfitTrendsData[]
  CommodityPrices: CommodityPrice[]
  MarketPrices: CommodityPrice[]
  CustomerPerformance: CustomerPerformanceData[]
  TerminalGroupPerformance: TerminalGroupPerformanceData[]
}
