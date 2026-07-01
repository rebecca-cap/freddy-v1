// Freddy mock fixture — fictional
// usePublishersGetQuery does resp.Data.map(...) — Type A envelope.

const publisherTypes = [101, 102] // matches codeSetFixture PricePublisherType.CodeValueIds
const priceTypes = [201, 202]

const sources = [
  ['DEMO', 'Demo Wholesale Index', 101, 'src-demo-1'],
  ['FRNT', 'Frontier Rack Service', 101, 'src-frnt-1'],
  ['CSCD', 'Cascade Spot Quote', 102, 'src-cscd-1'],
  ['PRRT', 'Prairie Trading Index', 102, 'src-prrt-1'],
  ['SMMT', 'Summit Daily Average', 101, 'src-smmt-1'],
  ['BLRG', 'Blue Ridge Wholesale', 101, 'src-blrg-1'],
  ['MTNW', 'Mountain West Spot', 102, 'src-mtnw-1'],
  ['HRZN', 'Horizon Refined Index', 101, 'src-hrzn-1'],
  ['NRTH', 'Northstar Pipeline Index', 101, 'src-nrth-1'],
  ['LKSD', 'Lakeside Daily Spot', 102, 'src-lksd-1'],
  ['RVRB', 'Riverbend Wholesale', 101, 'src-rvrb-1'],
  ['DSRT', 'Desert Sun Spot', 102, 'src-dsrt-1'],
] as const

export const pricePublishersFixture = {
  TotalRecords: sources.length,
  Data: sources.map(([abbr, name, typeId, srcId], i) => ({
    Abbreviation: abbr,
    IsActive: i < 10,
    Name: name,
    PricePublisherId: 4001 + i,
    PricePublisherTypeCvId: typeId,
    SourceExtractedDateTime: i % 3 === 0 ? '2026-05-02T06:00:00Z' : '2026-05-01T18:30:00Z',
    SourceId: srcId,
    SourceSystemId: `sys-${100 + i}`,
    PriceTypes: [
      { PriceTypeCvId: priceTypes[i % 2], ExtractPrices: true },
    ],
  })),
  Query: { Count: null, Offset: null },
  Validations: [],
}
