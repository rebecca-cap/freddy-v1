// Freddy mock fixture — fictional

const contracts = [
  { tradeId: 11000, cpId: 9001, cpName: 'Demo Trucking Co.', start: '2026-01-15', end: '2026-12-31' },
  { tradeId: 11001, cpId: 9002, cpName: 'Frontier Fuel Services', start: '2026-02-01', end: '2026-08-31' },
  { tradeId: 11002, cpId: 9003, cpName: 'Cascade Logistics', start: '2025-11-01', end: '2026-10-31' },
  { tradeId: 11003, cpId: 9004, cpName: 'Prairie Trading Co.', start: '2026-03-01', end: '2027-02-28' },
  { tradeId: 11004, cpId: 9005, cpName: 'Summit Transport Group', start: '2026-01-01', end: '2026-06-30' },
  { tradeId: 11005, cpId: 9006, cpName: 'Coastal Distribution LLC', start: '2025-12-01', end: '2026-11-30' },
  { tradeId: 11006, cpId: 9007, cpName: 'Heartland Carriers', start: '2026-02-15', end: '2026-09-15' },
  { tradeId: 11007, cpId: 9008, cpName: 'Ridgeline Petroleum', start: '2026-01-10', end: '2026-12-15' },
  { tradeId: 11008, cpId: 9009, cpName: 'Northstar Fuel Co.', start: '2026-03-15', end: '2027-03-14' },
  { tradeId: 11009, cpId: 9010, cpName: 'Beacon Energy Partners', start: '2025-10-01', end: '2026-09-30' },
] as const

const locations = [
  { id: 5001, name: 'Houston Terminal' },
  { id: 5002, name: 'Dallas Hub' },
  { id: 5003, name: 'Salt Lake Rack' },
  { id: 5004, name: 'Phoenix Distribution' },
  { id: 5005, name: 'Denver Terminal' },
] as const

const products = [
  { id: 7001, name: 'ULSD' },
  { id: 7002, name: 'Gasoline 87' },
  { id: 7003, name: 'Gasoline 91' },
  { id: 7004, name: 'Jet A' },
  { id: 7005, name: 'Biodiesel B5' },
] as const

const prng = (seedInit: number) => {
  let s = seedInit >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const startDate = new Date('2026-02-01T00:00:00Z')
const totalDays = 91
const round = (n: number, dp = 4) => Number(n.toFixed(dp))

type Series = { date: string; iso: string; liftings: number; profit: number; margin: number }
const buildSeries = (seed: number, baseLift: number, baseProfit: number, baseMargin: number): Series[] => {
  const rand = prng(seed)
  const out: Series[] = []
  let lift = baseLift, profit = baseProfit, margin = baseMargin
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate.getTime() + i * 86400000)
    const seasonal = Math.sin((i / totalDays) * Math.PI * 2) * 0.05
    lift = Math.max(500, lift + (rand() - 0.5) * baseLift * 0.12 + seasonal * baseLift * 0.05)
    profit = Math.max(100, profit + (rand() - 0.5) * baseProfit * 0.15)
    margin = Math.max(0.02, Math.min(0.45, margin + (rand() - 0.5) * 0.012))
    out.push({
      date: d.toISOString().slice(0, 10),
      iso: d.toISOString(),
      liftings: Math.round(lift),
      profit: Math.round(profit),
      margin: round(margin, 4),
    })
  }
  return out
}

const sysSeries = buildSeries(123, 14000, 7500, 0.06)
const sumLift = sysSeries.reduce((a, b) => a + b.liftings, 0)
const sumProfit = sysSeries.reduce((a, b) => a + b.profit, 0)
const sysAvgMargin = round(sysSeries.reduce((a, b) => a + b.margin, 0) / sysSeries.length, 4)
const sysAvgLift = Math.round(sumLift / contracts.length)
const sysAvgProfit = Math.round(sumProfit / contracts.length)

const graphRows: any[] = []
const gridRows: any[] = []
const locGraphRows: any[] = []
const locGridRows: any[] = []

contracts.forEach((c, idx) => {
  const base = buildSeries(5000 + idx * 17, 4500 + idx * 600, 2400 + idx * 290, 0.04 + idx * 0.013)
  base.forEach((pt, i) => {
    const sys = sysSeries[i]
    graphRows.push({
      TradeEntryId: c.tradeId,
      StartDate: c.start,
      EndDate: c.end,
      ExternalCounterPartyId: c.cpId,
      ExternalCounterParty: c.cpName,
      Date: pt.date,
      DateValue: new Date(pt.iso),
      CellMetrics: { Liftings: pt.liftings, Profit: pt.profit, AverageMargin: pt.margin },
      SystemAverageMetrics: {
        Liftings: Math.round(sys.liftings / contracts.length),
        Profit: Math.round(sys.profit / contracts.length),
        AverageMargin: sys.margin,
      },
    })
  })
  const totalLift = base.reduce((a, b) => a + b.liftings, 0)
  const totalProfit = base.reduce((a, b) => a + b.profit, 0)
  const cAvgMargin = round(base.reduce((a, b) => a + b.margin, 0) / base.length, 4)
  const trendStart = base.length - 30
  gridRows.push({
    TradeEntryId: c.tradeId,
    StartDate: c.start,
    EndDate: c.end,
    ExternalCounterPartyId: c.cpId,
    ExternalCounterParty: c.cpName,
    ProfitTrend: base.slice(trendStart).map((p) => p.profit),
    LiftingTrend: base.slice(trendStart).map((p) => p.liftings),
    MarginTrend: base.slice(trendStart).map((p) => p.margin),
    TotalLifted: totalLift,
    TotalProfit: totalProfit,
    AverageMargin: cAvgMargin,
    SystemAverageMargin: sysAvgMargin,
    SystemAverageLiftings: sysAvgLift,
    SystemAverageProfit: sysAvgProfit,
    MarginDiffFromAverage: round(cAvgMargin - sysAvgMargin, 4),
    ProfitDiffFromAverage: totalProfit - sysAvgProfit,
    LiftingsDiffFromAverage: totalLift - sysAvgLift,
  })

  // Per-contract breakdown by location/product (2 splits per contract)
  const loc1 = locations[idx % locations.length]
  const prod1 = products[idx % products.length]
  const loc2 = locations[(idx + 1) % locations.length]
  const prod2 = products[(idx + 2) % products.length]
  ;[
    { loc: loc1, prod: prod1, seedOff: 0 },
    { loc: loc2, prod: prod2, seedOff: 50 },
  ].forEach(({ loc, prod, seedOff }) => {
    const lbase = buildSeries(6000 + idx * 23 + seedOff, 2200, 1200, 0.05)
    lbase.forEach((pt, i) => {
      const sys = sysSeries[i]
      locGraphRows.push({
        TradeEntryId: c.tradeId,
        Location: loc.name,
        LocationId: loc.id,
        Product: prod.name,
        ProductId: prod.id,
        Date: pt.date,
        DateValue: new Date(pt.iso),
        CellMetrics: { Liftings: pt.liftings, Profit: pt.profit, AverageMargin: pt.margin },
        SystemAverageMetrics: {
          Liftings: Math.round(sys.liftings / (contracts.length * 2)),
          Profit: Math.round(sys.profit / (contracts.length * 2)),
          AverageMargin: sys.margin,
        },
      })
    })
    const lTotalLift = lbase.reduce((a, b) => a + b.liftings, 0)
    const lTotalProfit = lbase.reduce((a, b) => a + b.profit, 0)
    const lAvgMargin = round(lbase.reduce((a, b) => a + b.margin, 0) / lbase.length, 4)
    const lTrendStart = lbase.length - 30
    locGridRows.push({
      TradeEntryId: c.tradeId,
      Location: loc.name,
      LocationId: loc.id,
      Product: prod.name,
      ProductId: prod.id,
      ProfitTrend: lbase.slice(lTrendStart).map((p) => p.profit),
      LiftingTrend: lbase.slice(lTrendStart).map((p) => p.liftings),
      MarginTrend: lbase.slice(lTrendStart).map((p) => p.margin),
      TotalLifted: lTotalLift,
      TotalProfit: lTotalProfit,
      AverageMargin: lAvgMargin,
      SystemAverageMargin: sysAvgMargin,
      SystemAverageLiftings: Math.round(sysAvgLift / 2),
      SystemAverageProfit: Math.round(sysAvgProfit / 2),
      MarginDiffFromAverage: round(lAvgMargin - sysAvgMargin, 4),
      ProfitDiffFromAverage: lTotalProfit - Math.round(sysAvgProfit / 2),
      LiftingsDiffFromAverage: lTotalLift - Math.round(sysAvgLift / 2),
    })
  })
})

export const analyticsByContractFixture = {
  GraphRows: graphRows,
  GridRows: gridRows,
  ContractPricePerformanceWithPriceLocation: {
    GraphRows: locGraphRows,
    GridRows: locGridRows,
    HasData: true,
  },
  HasData: true,
}
