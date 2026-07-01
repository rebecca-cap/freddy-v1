// Freddy mock fixture — fictional
//
// /Admin/CalendarManagement (ManagePriceEngineCalendars)
//   metadata key: PricingEngine/Admin/Calendar/GetMetadata
//   read key:     PricingEngine/Admin/Calendar/Read       (holidays read)
//
// Metadata response shape: APIResponse<CalendarMetadata> with CalendarList
// items {Text, Value, GroupingValue} consumed by ManageCalendarsPage.
// Read response shape: { TotalRecords, Data: holiday rows }; the holiday grid
// reads CalendarName / PeriodName / PeriodFromDate. The DTO type also
// declares Name / PeriodToDate / etc. — we include both so either consumer
// path renders.
//
// Calendars 200–220, Periods 300–500. Spans 2025-01 → 2027-12.

const CALENDARS = [
  { Value: '200', Text: 'Demo NYMEX-style Calendar' },
  { Value: '201', Text: 'Demo Houston Refining Calendar' },
  { Value: '202', Text: 'Demo Cascade Logistics Calendar' },
  { Value: '203', Text: 'Demo Prairie Trading Calendar' },
  { Value: '204', Text: 'Demo Frontier Fuel Calendar' },
  { Value: '205', Text: 'Demo Salt Lake Rack Calendar' },
] as const

// Fictional holiday catalog — deterministic.
const HOLIDAYS_PER_YEAR = [
  { date: '01-01', name: 'New Year Holiday' },
  { date: '01-20', name: 'MLK Day Observance' },
  { date: '02-17', name: 'Presidents Day' },
  { date: '05-26', name: 'Memorial Day Observance' },
  { date: '07-04', name: 'Independence Day' },
  { date: '09-01', name: 'Labor Day Observance' },
  { date: '11-27', name: 'Thanksgiving Holiday' },
  { date: '12-25', name: 'Christmas Holiday' },
]

type HolidayRow = {
  CalendarPeriodId: number
  CalendarId: number
  CalendarName: string
  PeriodId: number
  PeriodName: string
  Name: string
  PeriodFromDate: string
  PeriodToDate: string
  PeriodTypeCvId: number
  IsActive: boolean
}

const buildHolidays = (): HolidayRow[] => {
  const rows: HolidayRow[] = []
  let id = 300
  for (const cal of CALENDARS) {
    for (const year of [2025, 2026, 2027]) {
      for (const h of HOLIDAYS_PER_YEAR) {
        if (id > 500) return rows
        rows.push({
          CalendarPeriodId: id,
          CalendarId: parseInt(cal.Value, 10),
          CalendarName: cal.Text,
          PeriodId: id,
          PeriodName: `${h.name} ${year}`,
          Name: `${h.name} ${year}`,
          PeriodFromDate: `${year}-${h.date}T00:00:00Z`,
          PeriodToDate: `${year}-${h.date}T23:59:59Z`,
          PeriodTypeCvId: 1,
          IsActive: true,
        })
        id++
      }
    }
  }
  return rows
}

export const calendarManagementMetadataFixture = {
  Data: {
    CalendarList: CALENDARS.map((c) => ({ Text: c.Text, Value: c.Value, GroupingValue: null })),
  },
  Query: null,
  Validations: [],
}

const holidays = buildHolidays()

export const calendarManagementReadFixture = {
  TotalRecords: holidays.length,
  Data: holidays,
  Query: null,
  Validations: [],
}
