// Freddy mock fixture — fictional
// MarketPlatform/Admin/TradeEntrySetup/Read returns { Data: TradeEntrySetup[] }.
// Consumer at src/modules/Admin/MarketPlatformSetups/index.tsx maps Data to grid.
// Cross-refs: ProductId in 7001-7012, LocationId in 5001-5012, MarketPlatformInstrumentId in 6001-6008.

const locationByIdx = [
  { id: 5001, name: 'Houston Terminal' },
  { id: 5002, name: 'Dallas Hub' },
  { id: 5003, name: 'Salt Lake Rack' },
  { id: 5004, name: 'Phoenix Terminal' },
  { id: 5005, name: 'Denver Rack' },
  { id: 5007, name: 'Long Beach Terminal' },
  { id: 5008, name: 'Chicago Hub' },
  { id: 5012, name: 'Portland Terminal' },
]

const productByIdx = [
  { id: 7001, name: 'ULSD' },
  { id: 7002, name: 'Gasoline 87' },
  { id: 7004, name: 'Gasoline 91' },
  { id: 7005, name: 'Jet A' },
  { id: 7006, name: 'Biodiesel B5' },
  { id: 7008, name: 'Renewable Diesel' },
]

const mpiByIdx = [
  { id: 6001, name: 'Prompt Rack' },
  { id: 6002, name: 'Forward Rack' },
  { id: 6003, name: 'Bulk Contract' },
  { id: 6005, name: 'Aviation Direct' },
  { id: 6006, name: 'Biofuel Allocation' },
]

const makeSetup = (
  id: number,
  loc: { id: number; name: string },
  prod: { id: number; name: string },
  mpi: { id: number; name: string },
  isActive: boolean,
  internalEntryOnly: boolean
) => ({
  TradeEntrySetupId: id,
  LocationId: loc.id,
  LocationName: loc.name,
  ProductId: prod.id,
  ProductName: prod.name,
  MarketPlatformInstrumentId: mpi.id,
  MarketPlatformInstrumentName: mpi.name,
  IsActive: isActive,
  InternalEntryOnly: internalEntryOnly,
})

const setups: ReturnType<typeof makeSetup>[] = []
let setupId = 4001
for (const loc of locationByIdx) {
  for (const prod of productByIdx.slice(0, 3)) {
    const mpi = mpiByIdx[setupId % mpiByIdx.length]
    setups.push(makeSetup(setupId, loc, prod, mpi, true, setupId % 5 === 0))
    setupId += 1
  }
}
// A few aviation/renewable rows for variety
setups.push(makeSetup(setupId++, locationByIdx[0], productByIdx[3], mpiByIdx[3], true, false))
setups.push(makeSetup(setupId++, locationByIdx[5], productByIdx[3], mpiByIdx[3], true, false))
setups.push(makeSetup(setupId++, locationByIdx[2], productByIdx[4], mpiByIdx[4], true, false))
setups.push(makeSetup(setupId++, locationByIdx[6], productByIdx[5], mpiByIdx[4], false, true))

export const marketPlatformSetupsReadFixture = {
  TotalRecords: setups.length,
  Data: setups,
  Query: null,
  Validations: [],
}

export const marketPlatformSetupsMetadataFixture = {
  Data: {
    Locations: locationByIdx.map((l) => ({ Text: l.name, Value: String(l.id), GroupingValue: null })),
    Products: productByIdx.map((p) => ({ Text: p.name, Value: String(p.id), GroupingValue: null })),
    MarketPlatformInstruments: mpiByIdx.map((m) => ({
      Text: m.name,
      Value: String(m.id),
      GroupingValue: null,
    })),
  },
  Query: null,
  Validations: [],
}
