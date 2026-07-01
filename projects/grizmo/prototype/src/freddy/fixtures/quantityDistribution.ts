// Freddy mock fixture — fictional
// Response shape: APIResponse<{ Rows, PeriodDisplayMappings }>

const periods = [60101, 60102, 60103, 60104, 60105, 60106]
const periodDisplayMappings: Record<string, string> = {
  '60101': 'Week 1',
  '60102': 'Week 2',
  '60103': 'Week 3',
  '60104': 'Week 4',
  '60105': 'Week 5',
  '60106': 'Week 6',
}

const cellsFor = (productId: number, locationId: number, baseWeight: number) =>
  periods.map((PeriodId, i) => ({
    ProductId: productId,
    LocationId: locationId,
    PeriodId,
    Weight: baseWeight + i * 0.5,
    IsChanged: false,
  }))

const row = (productId: number, productName: string, locationId: number, locationName: string, base: number) => ({
  Id: `${productId}-${locationId}`,
  ProductId: productId,
  LocationId: locationId,
  ProductName: productName,
  LocationName: locationName,
  Cells: cellsFor(productId, locationId, base),
})

export const quantityDistributionFixture = {
  Data: {
    Rows: [
      row(7001, 'ULSD', 5001, 'Houston Terminal', 10),
      row(7002, 'Gasoline 87', 5001, 'Houston Terminal', 12),
      row(7003, 'Gasoline 91', 5001, 'Houston Terminal', 8),
      row(7001, 'ULSD', 5002, 'Dallas Hub', 9),
      row(7002, 'Gasoline 87', 5002, 'Dallas Hub', 11),
      row(7004, 'Jet A', 5003, 'Salt Lake Rack', 6),
      row(7005, 'Biodiesel B5', 5004, 'Phoenix Terminal', 4),
      row(7001, 'ULSD', 5005, 'Denver Rack', 7),
    ],
    PeriodDisplayMappings: periodDisplayMappings,
  },
  Query: null,
  Validations: [],
}
