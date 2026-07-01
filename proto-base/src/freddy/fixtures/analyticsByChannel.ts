// Freddy mock fixture — fictional

const channels = [
  { id: 1, name: 'Wholesale' },
  { id: 2, name: 'Rack' },
  { id: 3, name: 'Retail' },
  { id: 4, name: 'Bulk' },
] as const

const customers = [
  { id: 9001, name: 'Demo Trucking Co.' },
  { id: 9002, name: 'Frontier Fuel Services' },
  { id: 9003, name: 'Cascade Logistics' },
  { id: 9004, name: 'Prairie Trading Co.' },
  { id: 9005, name: 'Summit Transport Group' },
  { id: 9006, name: 'Coastal Distribution LLC' },
  { id: 9007, name: 'Heartland Carriers' },
  { id: 9008, name: 'Ridgeline Petroleum' },
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

const sysSeries = buildSeries(7, 30000, 16000, 0.07)
const sumLift = sysSeries.reduce((a, b) => a + b.liftings, 0)
const sumProfit = sysSeries.reduce((a, b) => a + b.profit, 0)
const sysAvgMargin = round(sysSeries.reduce((a, b) => a + b.margin, 0) / sysSeries.length, 4)
const sysAvgLift = Math.round(sumLift / channels.length)
const sysAvgProfit = Math.round(sumProfit / channels.length)

const graphRows: any[] = []
const gridRows: any[] = []
const customerGraphRows: any[] = []
const customerGridRows: any[] = []

channels.forEach((ch, idx) => {
  const base = buildSeries(2000 + idx * 11, 9000 + idx * 1500, 4500 + idx * 700, 0.045 + idx * 0.018)
  base.forEach((pt, i) => {
    const sys = sysSeries[i]
    graphRows.push({
      Date: pt.date,
      DateValue: new Date(pt.iso),
      CellMetrics: { Liftings: pt.liftings, Profit: pt.profit, AverageMargin: pt.margin },
      SystemAverageMetrics: {
        Liftings: Math.round(sys.liftings / channels.length),
        Profit: Math.round(sys.profit / channels.length),
        AverageMargin: sys.margin,
      },
      Channel: ch.name,
      ChannelId: ch.id,
    })
  })
  const totalLift = base.reduce((a, b) => a + b.liftings, 0)
  const totalProfit = base.reduce((a, b) => a + b.profit, 0)
  const chAvgMargin = round(base.reduce((a, b) => a + b.margin, 0) / base.length, 4)
  const trendStart = base.length - 30
  gridRows.push({
    ProfitTrend: base.slice(trendStart).map((p) => p.profit),
    LiftingTrend: base.slice(trendStart).map((p) => p.liftings),
    MarginTrend: base.slice(trendStart).map((p) => p.margin),
    TotalLifted: totalLift,
    TotalProfit: totalProfit,
    AverageMargin: chAvgMargin,
    SystemAverageMargin: sysAvgMargin,
    SystemAverageLiftings: sysAvgLift,
    SystemAverageProfit: sysAvgProfit,
    MarginDiffFromAverage: round(chAvgMargin - sysAvgMargin, 4),
    ProfitDiffFromAverage: totalProfit - sysAvgProfit,
    LiftingsDiffFromAverage: totalLift - sysAvgLift,
    Channel: ch.name,
    ChannelId: ch.id,
  })

  // Customer-by-channel breakdown: pair first 6 customers with each channel
  customers.slice(0, 6).forEach((cp, ci) => {
    const cbase = buildSeries(3000 + idx * 31 + ci * 5, 1500 + ci * 250, 800 + ci * 150, 0.04 + ci * 0.01)
    cbase.forEach((pt, i) => {
      const sys = sysSeries[i]
      customerGraphRows.push({
        Date: pt.date,
        DateValue: new Date(pt.iso),
        CellMetrics: { Liftings: pt.liftings, Profit: pt.profit, AverageMargin: pt.margin },
        SystemAverageMetrics: {
          Liftings: Math.round(sys.liftings / (channels.length * 6)),
          Profit: Math.round(sys.profit / (channels.length * 6)),
          AverageMargin: sys.margin,
        },
        Channel: ch.name,
        ChannelId: ch.id,
        CounterParty: cp.name,
        CounterPartyId: cp.id,
      })
    })
    const cTotalLift = cbase.reduce((a, b) => a + b.liftings, 0)
    const cTotalProfit = cbase.reduce((a, b) => a + b.profit, 0)
    const cAvgMargin = round(cbase.reduce((a, b) => a + b.margin, 0) / cbase.length, 4)
    const cTrendStart = cbase.length - 30
    customerGridRows.push({
      ProfitTrend: cbase.slice(cTrendStart).map((p) => p.profit),
      LiftingTrend: cbase.slice(cTrendStart).map((p) => p.liftings),
      MarginTrend: cbase.slice(cTrendStart).map((p) => p.margin),
      TotalLifted: cTotalLift,
      TotalProfit: cTotalProfit,
      AverageMargin: cAvgMargin,
      SystemAverageMargin: sysAvgMargin,
      SystemAverageLiftings: Math.round(sysAvgLift / 6),
      SystemAverageProfit: Math.round(sysAvgProfit / 6),
      MarginDiffFromAverage: round(cAvgMargin - sysAvgMargin, 4),
      ProfitDiffFromAverage: cTotalProfit - Math.round(sysAvgProfit / 6),
      LiftingsDiffFromAverage: cTotalLift - Math.round(sysAvgLift / 6),
      Channel: ch.name,
      ChannelId: ch.id,
      CounterParty: cp.name,
      CounterPartyId: cp.id,
    })
  })
})

export const analyticsByChannelFixture = {
  GraphRows: graphRows,
  GridRows: gridRows,
  CustomerPricePerformanceWithChannel: {
    GraphRows: customerGraphRows,
    GridRows: customerGridRows,
  },
  HasData: true,
}
