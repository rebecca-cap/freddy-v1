// Freddy mock fixture — fictional
//
// Two surfaces share this file:
//   - /Admin/CalendarPeriods (FullCalendar UI)        → useCalendarPeriods
//     metadata key:  MarketPlatform/Admin/Calendar/GetMetadata
//     read key:      MarketPlatform/Admin/Calendar/ReadCalendarPeriods
//
// Metadata.Data has CalendarList + PeriodTypeList (Text/Value/GroupingValue).
// ReadCalendarPeriods returns { TotalRecords, Data: CalendarPeriodOverviewData[] }.
//
// Calendars span 2025-01-01 → 2027-12-31. IDs:
//   Calendars 200–220, Periods 300–500.

const CALENDARS = [
  { Value: '200', Text: 'Demo NYMEX-style Calendar' },
  { Value: '201', Text: 'Demo Houston Refining Calendar' },
  { Value: '202', Text: 'Demo Cascade Logistics Calendar' },
  { Value: '203', Text: 'Demo Prairie Trading Calendar' },
] as const

const PERIOD_TYPES = [
  { Value: '1', Text: 'Daily' },
  { Value: '2', Text: 'Weekly' },
  { Value: '3', Text: 'Monthly' },
  { Value: '4', Text: 'Quarterly' },
  { Value: '5', Text: 'Annual' },
] as const

// Deterministic period generator: months from 2025-01 through 2027-12.
const pad = (n: number) => n.toString().padStart(2, '0')

type Period = {
  CalendarPeriodId: number
  CalendarId: number
  PeriodId: number
  Name: string
  PeriodFromDate: string
  PeriodToDate: string
  PeriodTypeCvId: number
  IsActive: boolean
}

const buildPeriods = (): Period[] => {
  const rows: Period[] = []
  let id = 300
  for (let year = 2025; year <= 2027; year++) {
    for (let month = 1; month <= 12; month++) {
      // Monthly period on calendar 200
      rows.push({
        CalendarPeriodId: id,
        CalendarId: 200,
        PeriodId: id,
        Name: `${year}-${pad(month)} Monthly`,
        PeriodFromDate: `${year}-${pad(month)}-01T00:00:00Z`,
        PeriodToDate: `${year}-${pad(month)}-28T23:59:59Z`,
        PeriodTypeCvId: 3,
        IsActive: true,
      })
      id++
      if (id > 500) return rows
    }
    // One quarterly per year on calendar 201
    for (let q = 1; q <= 4; q++) {
      const startMonth = (q - 1) * 3 + 1
      const endMonth = q * 3
      rows.push({
        CalendarPeriodId: id,
        CalendarId: 201,
        PeriodId: id,
        Name: `${year} Q${q}`,
        PeriodFromDate: `${year}-${pad(startMonth)}-01T00:00:00Z`,
        PeriodToDate: `${year}-${pad(endMonth)}-28T23:59:59Z`,
        PeriodTypeCvId: 4,
        IsActive: true,
      })
      id++
      if (id > 500) return rows
    }
    // One annual per year on calendar 202
    rows.push({
      CalendarPeriodId: id,
      CalendarId: 202,
      PeriodId: id,
      Name: `${year} Annual`,
      PeriodFromDate: `${year}-01-01T00:00:00Z`,
      PeriodToDate: `${year}-12-31T23:59:59Z`,
      PeriodTypeCvId: 5,
      IsActive: true,
    })
    id++
    if (id > 500) return rows
  }
  return rows
}

export const calendarPeriodsMetadataFixture = {
  Data: {
    CalendarList: CALENDARS.map((c) => ({ Text: c.Text, Value: c.Value, GroupingValue: null })),
    PeriodTypeList: PERIOD_TYPES.map((p) => ({ Text: p.Text, Value: p.Value, GroupingValue: null })),
  },
  Query: null,
  Validations: [],
}

const periods = buildPeriods()

export const calendarPeriodsReadFixture = {
  TotalRecords: periods.length,
  Data: periods,
  Query: null,
  Validations: [],
}
