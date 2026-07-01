// Freddy mock fixture — fictional

const terminals = [
  { id: 5001, name: 'Houston Terminal' },
  { id: 5002, name: 'Dallas Hub' },
  { id: 5003, name: 'Salt Lake Rack' },
  { id: 5004, name: 'Phoenix Distribution' },
  { id: 5005, name: 'Denver Terminal' },
  { id: 5006, name: 'Albuquerque Rack' },
  { id: 5007, name: 'Tulsa Hub' },
  { id: 5008, name: 'Oklahoma City Terminal' },
  { id: 5009, name: 'Kansas City Rack' },
  { id: 5010, name: 'Memphis Distribution' },
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

const sysSeries = buildSeries(99, 22000, 11000, 0.065)
const sumLift = sysSeries.reduce((a, b) => a + b.liftings, 0)
const sumProfit = sysSeries.reduce((a, b) => a + b.profit, 0)
const sysAvgMargin = round(sysSeries.reduce((a, b) => a + b.margin, 0) / sysSeries.length, 4)
const sysAvgLift = Math.round(sumLift / terminals.length)
const sysAvgProfit = Math.round(sumProfit / terminals.length)

const graphRows: any[] = []
const gridRows: any[] = []

terminals.forEach((loc, idx) => {
  const base = buildSeries(4000 + idx * 13, 5500 + idx * 700, 2800 + idx * 320, 0.05 + idx * 0.014)
  base.forEach((pt, i) => {
    const sys = sysSeries[i]
    graphRows.push({
      Date: pt.date,
      DateValue: new Date(pt.iso),
      CellMetrics: { Liftings: pt.liftings, Profit: pt.profit, AverageMargin: pt.margin },
      SystemAverageMetrics: {
        Liftings: Math.round(sys.liftings / terminals.length),
        Profit: Math.round(sys.profit / terminals.length),
        AverageMargin: sys.margin,
      },
      Location: loc.name,
      LocationId: loc.id,
    })
  })
  const totalLift = base.reduce((a, b) => a + b.liftings, 0)
  const totalProfit = base.reduce((a, b) => a + b.profit, 0)
  const locAvgMargin = round(base.reduce((a, b) => a + b.margin, 0) / base.length, 4)
  const trendStart = base.length - 30
  gridRows.push({
    ProfitTrend: base.slice(trendStart).map((p) => p.profit),
    LiftingTrend: base.slice(trendStart).map((p) => p.liftings),
    MarginTrend: base.slice(trendStart).map((p) => p.margin),
    TotalLifted: totalLift,
    TotalProfit: totalProfit,
    AverageMargin: locAvgMargin,
    SystemAverageMargin: sysAvgMargin,
    SystemAverageLiftings: sysAvgLift,
    SystemAverageProfit: sysAvgProfit,
    MarginDiffFromAverage: round(locAvgMargin - sysAvgMargin, 4),
    ProfitDiffFromAverage: totalProfit - sysAvgProfit,
    LiftingsDiffFromAverage: totalLift - sysAvgLift,
    Location: loc.name,
    LocationId: loc.id,
  })
})

export const analyticsByTerminalFixture = {
  GraphRows: graphRows,
  GridRows: gridRows,
  HasData: true,
}
