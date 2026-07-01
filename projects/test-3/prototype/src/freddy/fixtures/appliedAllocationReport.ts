// Freddy mock fixture — fictional
// /Admin/AppliedAllocationReport — bare AppliedAllocationStatusReportRow[].

const PRODUCTS = ['ULSD', 'Gasoline 87', 'Gasoline 91', 'Jet A', 'Biodiesel B5']
const LOCATIONS = ['Houston Terminal', 'Dallas Hub', 'Salt Lake Rack', 'Phoenix Terminal']
const CUSTOMERS = [
  'Demo Counterparty Alpha',
  'Prairie Trading Co.',
  'Summit Distributors',
  'Lone Star Wholesale',
  'Cascade Logistics',
]
const STATUSES = [
  { cv: 501, msg: 'Allocation applied successfully', meaning: 'Applied' },
  { cv: 502, msg: 'Allocation skipped — manual override', meaning: 'Skipped' },
  { cv: 503, msg: 'Insufficient remaining volume', meaning: 'Failed' },
  { cv: 501, msg: 'Allocation applied successfully', meaning: 'Applied' },
]

const pad = (n: number) => String(n).padStart(2, '0')

export const appliedAllocationReportFixture = Array.from({ length: 24 }).map((_, idx) => {
  const day = (idx % 7) + 25 // late April / early May
  const month = day > 30 ? 5 : 4
  const realDay = day > 30 ? day - 30 : day
  const ts = `2026-${pad(month)}-${pad(realDay)}T${pad(8 + (idx % 8))}:${pad((idx * 7) % 60)}:00Z`
  const status = STATUSES[idx % STATUSES.length]
  return {
    OrderId: 70001 + idx,
    TradeEntryDetailId: 80001 + idx,
    OrderCreatedDateTime: ts,
    ProductName: PRODUCTS[idx % PRODUCTS.length],
    ToLocationName: LOCATIONS[idx % LOCATIONS.length],
    MarketPlatformInstrumentName: `${PRODUCTS[idx % PRODUCTS.length]} ${LOCATIONS[idx % LOCATIONS.length]}`,
    Quantity: 5000 + ((idx * 1234) % 25000),
    TradeEntryFromDateTime: ts,
    TradeEntryToDateTime: `2026-${pad(month)}-${pad(realDay)}T23:59:59Z`,
    OrderStatusCodeValueMeaning: idx % 5 === 0 ? 'Pending' : 'Processed',
    ExternalCounterPartyName: CUSTOMERS[idx % CUSTOMERS.length],
    AllocationType: idx % 2 === 0 ? 'Authorization' : 'QuoteBook',
    AppliedStatusCvId: status.cv,
    AppliedDateTime: ts,
    AppliedStatusMessage: status.msg,
  }
})
