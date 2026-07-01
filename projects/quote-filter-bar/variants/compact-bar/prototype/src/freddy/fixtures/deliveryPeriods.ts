// Freddy mock fixture — fictional
//
// /Admin/DeliveryPeriods (ManageDeliveryPeriods)
//   metadata key: DeliveryPeriodManagement/GetMetaData
//   read key:     DeliveryPeriodManagement/GetDeliveryPeriodConfigurations
//
// Metadata is consumed at TOP LEVEL (no .Data wrapper):
//   metadata.MarketPlatformInstrumentList — drives the tabs
//   metadata.DeliveryPeriodGroupList     — option list filtered by GroupingValue
// Read returns { Data: rows }; columnDefs read EffectiveFromDateTime,
// EffectiveToDateTime, DeliveryPeriodName, DeliveryPeriodFromDateTime,
// DeliveryPeriodToDateTime, FutureMonth, DeliveryPeriodGroupId, IsActive,
// ConfigurationId.
//
// Periods span 2025-01 → 2027-12.

const INSTRUMENTS = [
  {
    Value: '1',
    Text: 'NYMEX HO Futures',
    GroupingValue: null,
    TradeTypeMeaning: 'Forward',
    HasDeliveryPeriodGroups: true,
  },
  {
    Value: '2',
    Text: 'NYMEX RBOB Futures',
    GroupingValue: null,
    TradeTypeMeaning: 'Forward',
    HasDeliveryPeriodGroups: true,
  },
  {
    Value: '3',
    Text: 'OPIS Spot',
    GroupingValue: null,
    TradeTypeMeaning: 'Spot',
    HasDeliveryPeriodGroups: false,
  },
] as const

const GROUPS = [
  { Text: 'Front Month', Value: '900', GroupingValue: '1' },
  { Text: 'Prompt Quarter', Value: '901', GroupingValue: '1' },
  { Text: 'Calendar Strip', Value: '902', GroupingValue: '1' },
  { Text: 'Front Month', Value: '910', GroupingValue: '2' },
  { Text: 'Prompt Quarter', Value: '911', GroupingValue: '2' },
  { Text: 'Calendar Strip', Value: '912', GroupingValue: '2' },
]

const pad = (n: number) => n.toString().padStart(2, '0')

type Row = {
  ConfigurationId: number
  MarketPlatformInstrumentId: number
  DeliveryPeriodGroupId: number | null
  DeliveryPeriodName: string
  DeliveryPeriodFromDateTime: string
  DeliveryPeriodToDateTime: string
  EffectiveFromDateTime: string
  EffectiveToDateTime: string
  FutureMonth: string
  IsActive: boolean
}

const buildRows = (): Row[] => {
  const rows: Row[] = []
  let id = 6000
  for (const inst of INSTRUMENTS) {
    for (let year = 2025; year <= 2027; year++) {
      for (let month = 1; month <= 12; month++) {
        const groupId = inst.HasDeliveryPeriodGroups
          ? parseInt(GROUPS.find((g) => g.GroupingValue === inst.Value)!.Value, 10)
          : null
        rows.push({
          ConfigurationId: id,
          MarketPlatformInstrumentId: parseInt(inst.Value, 10),
          DeliveryPeriodGroupId: groupId,
          DeliveryPeriodName: `${inst.Text.split(' ')[1] || inst.Text} ${year}-${pad(month)}`,
          DeliveryPeriodFromDateTime: `${year}-${pad(month)}-01T00:00:00Z`,
          DeliveryPeriodToDateTime: `${year}-${pad(month)}-28T23:59:59Z`,
          EffectiveFromDateTime: `${year}-${pad(month)}-01T00:00:00Z`,
          EffectiveToDateTime: `${year}-${pad(month)}-28T23:59:59Z`,
          FutureMonth: `${year}-${pad(month)}-01T00:00:00Z`,
          IsActive: true,
        })
        id++
      }
    }
  }
  return rows
}

export const deliveryPeriodsMetadataFixture = {
  MarketPlatformInstrumentList: INSTRUMENTS.map((i) => ({
    Text: i.Text,
    Value: i.Value,
    GroupingValue: i.GroupingValue,
    TradeTypeMeaning: i.TradeTypeMeaning,
    HasDeliveryPeriodGroups: i.HasDeliveryPeriodGroups,
  })),
  DeliveryPeriodGroupList: GROUPS,
  Query: null,
  Validations: [],
}

const rows = buildRows()

export const deliveryPeriodsReadFixture = {
  TotalRecords: rows.length,
  Data: rows,
  Query: null,
  Validations: [],
}
