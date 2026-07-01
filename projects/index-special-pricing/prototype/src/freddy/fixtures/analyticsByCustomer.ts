// Freddy mock fixture — fictional

// Daily series 2026-02-01 → 2026-05-02 (91 days). Deterministic random walk.

const customers = [
  { id: 9001, name: 'Demo Trucking Co.' },
  { id: 9002, name: 'Frontier Fuel Services' },
  { id: 9003, name: 'Cascade Logistics' },
  { id: 9004, name: 'Prairie Trading Co.' },
  { id: 9005, name: 'Summit Transport Group' },
  { id: 9006, name: 'Coastal Distribution LLC' },
  { id: 9007, name: 'Heartland Carriers' },
  { id: 9008, name: 'Ridgeline Petroleum' },
  { id: 9009, name: 'Northstar Fuel Co.' },
  { id: 9010, name: 'Beacon Energy Partners' },
  { id: 9011, name: 'Stonebridge Logistics' },
  { id: 9012, name: 'Redwood Bulk Haulers' },
] as const

// Mulberry32 PRNG for deterministic series
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
const totalDays = 91 // through 2026-05-02

const round = (n: number, dp = 4) => Number(n.toFixed(dp))

type Series = { date: string; iso: string; liftings: number; profit: number; margin: number }

const buildSeries = (seed: number, baseLift: number, baseProfit: number, baseMargin: number): Series[] => {
  const rand = prng(seed)
  const out: Series[] = []
  let lift = baseLift
  let profit = baseProfit
  let margin = baseMargin
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

const sysSeries = buildSeries(42, 18000, 9500, 0.062)

const sumLift = sysSeries.reduce((a, b) => a + b.liftings, 0)
const sumProfit = sysSeries.reduce((a, b) => a + b.profit, 0)
const avgMargin = sysSeries.reduce((a, b) => a + b.margin, 0) / sysSeries.length
const sysAvgLift = Math.round(sumLift / customers.length)
const sysAvgProfit = Math.round(sumProfit / customers.length)
const sysAvgMargin = round(avgMargin, 4)

const graphRows: any[] = []
const gridRows: any[] = []

customers.forEach((cp, idx) => {
  const base = buildSeries(1000 + idx * 7, 6000 + idx * 800, 3200 + idx * 350, 0.05 + idx * 0.012)
  base.forEach((pt, i) => {
    const sys = sysSeries[i]
    graphRows.push({
      Date: pt.date,
      DateValue: new Date(pt.iso),
      CellMetrics: { Liftings: pt.liftings, Profit: pt.profit, AverageMargin: pt.margin },
      SystemAverageMetrics: {
        Liftings: Math.round(sys.liftings / customers.length),
        Profit: Math.round(sys.profit / customers.length),
        AverageMargin: sys.margin,
      },
      CounterParty: cp.name,
      CounterPartyId: cp.id,
    })
  })

  const totalLift = base.reduce((a, b) => a + b.liftings, 0)
  const totalProfit = base.reduce((a, b) => a + b.profit, 0)
  const cpAvgMargin = round(base.reduce((a, b) => a + b.margin, 0) / base.length, 4)

  // Sparkline trend = last 30 daily values
  const trendStart = base.length - 30
  gridRows.push({
    ProfitTrend: base.slice(trendStart).map((p) => p.profit),
    LiftingTrend: base.slice(trendStart).map((p) => p.liftings),
    MarginTrend: base.slice(trendStart).map((p) => p.margin),
    TotalLifted: totalLift,
    TotalProfit: totalProfit,
    AverageMargin: cpAvgMargin,
    SystemAverageMargin: sysAvgMargin,
    SystemAverageLiftings: sysAvgLift,
    SystemAverageProfit: sysAvgProfit,
    MarginDiffFromAverage: round(cpAvgMargin - sysAvgMargin, 4),
    ProfitDiffFromAverage: totalProfit - sysAvgProfit,
    LiftingsDiffFromAverage: totalLift - sysAvgLift,
    CounterParty: cp.name,
    CounterPartyId: cp.id,
  })
})

export const analyticsByCustomerFixture = {
  GraphRows: graphRows,
  GridRows: gridRows,
  HasData: true,
}
