import { Validation } from '@api/globalTypes'

export interface CreateBenchmarkPayload {
  PricePublisherId: number
  Differential: number
  Name: string
  ProductHierarchyId: number
  LocationHierarchyId: number
}

export interface CreateCompetitorBenchmarkPayload {
  Differential: number
  Name: string
  ProductHierarchyId: number
  LocationHierarchyId: number
  Competitors: [
    {
      PricePublisherId: number
      CounterPartyId: number
      Percentage: number
    }
  ]
}

export interface BenchmarkMetadataResponse {
  Data: {
    PricePublishers: [
      {
        Text: string
        Value: string
        GroupingValue: string
      }
    ]
    CounterParties: [
      {
        Text: string
        Value: string
        GroupingValue: string
      }
    ]
    ProductHierarchies: [
      {
        Text: string
        Value: string
      }
    ]
    LocationHierarchies: [
      {
        Text: string
        Value: string
      }
    ]
  }
  Query: string
  Validations: Validation[]
}

export interface CreateBenchmarkResponse {
  Data: {
    Id: number
    Name: string
    Formula: string
  }
  Query: string
  Validations: Validation[]
}
