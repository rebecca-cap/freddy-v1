// Freddy mock fixture — fictional
// AvailabilityMaintenance grid: response is GridResponse = { Rows, MaxPromptUpdateFromAllocationDateTime }.
// NOT wrapped in { Data }.

const periods = [
  { id: 60001, name: 'May 02', date: '2026-05-02' },
  { id: 60002, name: 'May 03', date: '2026-05-03' },
  { id: 60003, name: 'May 04', date: '2026-05-04' },
  { id: 60004, name: 'May 05', date: '2026-05-05' },
  { id: 60005, name: 'May 06', date: '2026-05-06' },
  { id: 60006, name: 'May 07', date: '2026-05-07' },
  { id: 60007, name: 'May 08', date: '2026-05-08' },
]

const cells = (avId: number, supplierId: number, baseQty: number) =>
  periods.map((p, i) => ({
    AvailableVolumeId: avId,
    SupplierId: supplierId,
    PeriodId: p.id,
    PeriodName: p.name,
    CellFullName: `${p.name} ${supplierId}`,
    AvailableQuantity: baseQty + i * 1000,
    IsChanged: false,
    PeriodFullDate: `${p.date}T00:00:00Z`,
  }))

const row = (
  avId: number,
  name: string,
  product: string,
  productId: number,
  location: string,
  locationId: number,
  supplierId: number,
  baseQty: number
) => ({
  AvailableVolumeName: name,
  AvailableVolumeId: avId,
  Product: product,
  ProductId: productId,
  Location: location,
  LocationId: locationId,
  GridCells: cells(avId, supplierId, baseQty),
  RowHasAvailableLessThanMinimum: false,
  AssociatedSetups: [70000 + avId],
  AssociatedProducts: [productId],
  AssociatedLocations: [locationId],
})

export const availabilityMaintenanceGridFixture = {
  Rows: [
    row(80001, 'Houston ULSD Daily', 'ULSD', 7001, 'Houston Terminal', 5001, 9001, 25000),
    row(80002, 'Houston Gas 87 Daily', 'Gasoline 87', 7002, 'Houston Terminal', 5001, 9001, 30000),
    row(80003, 'Houston Gas 91 Daily', 'Gasoline 91', 7003, 'Houston Terminal', 5001, 9001, 12000),
    row(80004, 'Dallas ULSD Daily', 'ULSD', 7001, 'Dallas Hub', 5002, 9001, 22000),
    row(80005, 'Dallas Gas 87 Daily', 'Gasoline 87', 7002, 'Dallas Hub', 5002, 9001, 28000),
    row(80006, 'Salt Lake Jet A', 'Jet A', 7004, 'Salt Lake Rack', 5003, 9001, 8000),
    row(80007, 'Phoenix B5 Daily', 'Biodiesel B5', 7005, 'Phoenix Terminal', 5004, 9001, 5000),
    row(80008, 'Denver ULSD Daily', 'ULSD', 7001, 'Denver Rack', 5005, 9001, 18000),
  ],
  MaxPromptUpdateFromAllocationDateTime: '2026-05-02T07:30:00Z',
}
