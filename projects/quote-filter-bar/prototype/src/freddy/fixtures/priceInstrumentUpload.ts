// Freddy mock fixture — fictional
// Drives /Admin/IntegrationStatus, which renders <EntityReport reportKey='IntegrationStatus' />.
// EntityReport/Read consumer expects { Data: [] } row payload (the grid maps Data directly).
// Legacy PriceInstrumentUpload/GetPriceInstrumentUploadData kept for older consumers.

const sources = [
  'OPIS Daily Feed',
  'Platts Wholesale',
  'DTN Refined Products',
  'NYMEX Settlements',
  'Argus Spot Prices',
  'Internal Rack Sheet',
]

const statuses = ['Success', 'Success', 'Warning', 'Success', 'Failed', 'Success']

const makeRow = (i: number) => ({
  PriceInstrumentUploadId: 4500 + i,
  Source: sources[i % sources.length],
  FileName: `prices_${20260502 + (i % 7)}.csv`,
  Status: statuses[i % statuses.length],
  RecordsProcessed: 1200 + i * 37,
  RecordsRejected: i % 5 === 4 ? 47 : i % 3,
  StartedAt: `2026-05-${String(2 - (i % 3)).padStart(2, '0')}T0${i % 9}:15:00Z`,
  CompletedAt: `2026-05-${String(2 - (i % 3)).padStart(2, '0')}T0${i % 9}:18:42Z`,
  DurationSeconds: 220 + (i * 13) % 180,
  Publisher: ['Demo Publisher One', 'Frontier Rack Service', 'Cascade Spot Quote'][i % 3],
  PriceCount: 1500 + i * 29,
  TriggeredBy: i % 4 === 0 ? 'Schedule' : 'Manual',
  EnvironmentName: 'demo-prod',
  ErrorMessage: statuses[i % statuses.length] === 'Failed' ? 'Connection timeout to upstream feed' : '',
})

export const integrationStatusReportFixture = {
  TotalRecords: 18,
  Data: Array.from({ length: 18 }, (_, i) => makeRow(i)),
  Query: null,
  Validations: [],
}

export const priceInstrumentUploadFixture = {
  Data: {
    PricePublishers: [
      { PricePublisherId: 4001, Name: 'Demo Publisher One', LastUpload: '2026-05-02T06:00:00Z', Status: 'Success' },
      { PricePublisherId: 4002, Name: 'Frontier Rack Service', LastUpload: '2026-05-02T05:45:00Z', Status: 'Success' },
      { PricePublisherId: 4003, Name: 'Cascade Spot Quote', LastUpload: '2026-05-01T22:10:00Z', Status: 'Warning' },
    ],
    UploadHistory: integrationStatusReportFixture.Data.slice(0, 12),
    PendingUploads: [
      { Source: 'OPIS Daily Feed', ScheduledFor: '2026-05-03T06:00:00Z' },
      { Source: 'DTN Refined Products', ScheduledFor: '2026-05-03T07:30:00Z' },
    ],
  },
  Query: null,
  Validations: [],
}
