// Freddy mock fixture — fictional
// EntityReport/GetSchema and EntityReport/Read are parameterized by ReportName
// in the request body. We dispatch on that name and return a per-report schema
// + dataset. Adding a new entity-report-driven page = add an entry below.
//
// Schema shape follows EntitySchemaResponse in src/utils/api/index.types.ts.
// EntityViewColumn must include EntityViewColumnId/Order/IsVisible.

type Col = {
  ColumnName: string
  DisplayName: string
  EntityViewColumnId: number
  Order: number
  IsVisible: boolean
  DataTypeMeaning?: string
  DataTypeDisplay?: string
  Format?: string
}

const col = (
  id: number,
  ColumnName: string,
  DisplayName: string,
  opts: Partial<Col> = {}
): Col => ({
  ColumnName,
  DisplayName,
  EntityViewColumnId: id,
  Order: id,
  IsVisible: true,
  DataTypeMeaning: 'String',
  ...opts,
})

const buildSchema = (
  name: string,
  display: string,
  primaryKey: string,
  cols: Col[]
) => ({
  DetailViewName: '',
  Display: display,
  EntityView: {
    EntityViewColumns: cols,
    PrimaryKeyField: primaryKey,
  },
  EntityViewName: `${name}View`,
  Name: name,
  PageComponents: [],
  PageSetupDefaults: [],
  PageSetupEntityActions: [],
  PrimaryEntityRegisterEntityName: name,
})

// ---- per-report schemas ----

const onlineOrdersSchema = buildSchema('OnlineOrders', 'Online Orders', 'TradeEntryId', [
  col(1, 'TradeEntryId', 'Order ID'),
  col(2, 'OrderStatusCodeValueDisplay', 'Status'),
  col(3, 'FullTypeName', 'Type'),
  col(4, 'OrderOriginType', 'Origin'),
  col(5, 'ProductName', 'Product'),
  col(6, 'FromLocationName', 'Location'),
  col(7, 'ExternalCounterPartyName', 'Counterparty'),
  col(8, 'Quantity', 'Qty (Gal)', { DataTypeMeaning: 'Decimal' }),
  col(9, 'Price', 'Price', { DataTypeMeaning: 'Decimal' }),
  col(10, 'CreatedDateTime', 'Created', { DataTypeMeaning: 'DateTime' }),
  col(11, 'OrderAcceptedDateTime', 'Accepted', { DataTypeMeaning: 'DateTime' }),
])

// /ContractManagement/Valuations — TradeEntryValuation
const tradeEntryValuationSchema = buildSchema(
  'TradeEntryValuation',
  'Contract Valuations',
  'TradeEntryDetailId',
  [
    col(1, 'TradeEntryId', 'Contract ID'),
    col(2, 'TradeEntryDetailId', 'Detail ID'),
    col(3, 'CounterPartyName', 'Counterparty'),
    col(4, 'ProductName', 'Product'),
    col(5, 'OriginLocationName', 'Origin'),
    col(6, 'DestinationLocationName', 'Destination'),
    col(7, 'EffectiveFromDateTime', 'From', { DataTypeMeaning: 'DateTime' }),
    col(8, 'EffectiveToDateTime', 'To', { DataTypeMeaning: 'DateTime' }),
    col(9, 'Value', 'Value', { DataTypeMeaning: 'Decimal' }),
    col(10, 'ValuationStatus', 'Status'),
  ]
)

// /ContractManagement/MissingPrices — TradeEntryValuationMissingPrices
const missingPricesSchema = buildSchema(
  'TradeEntryValuationMissingPrices',
  'Missing Prices',
  'TradeEntryDetailId',
  [
    col(1, 'TradeEntryId', 'Contract ID'),
    col(2, 'TradeEntryDetailId', 'Detail ID'),
    col(3, 'CounterPartyName', 'Counterparty'),
    col(4, 'ProductName', 'Product'),
    col(5, 'LocationName', 'Location'),
    col(6, 'EffectiveFromDateTime', 'From', { DataTypeMeaning: 'DateTime' }),
    col(7, 'EffectiveToDateTime', 'To', { DataTypeMeaning: 'DateTime' }),
    col(8, 'PriceInstrumentName', 'Instrument'),
    col(9, 'PublisherName', 'Publisher'),
    col(10, 'ValuationStatus', 'Status'),
  ]
)

// Fallback empty schemas for any other reportKey we haven't seeded.
const emptySchema = (name: string) => buildSchema(name, name, 'Id', [])

const SCHEMAS: Record<string, ReturnType<typeof buildSchema>> = {
  OnlineOrders: onlineOrdersSchema,
  TradeEntryValuation: tradeEntryValuationSchema,
  TradeEntryValuationMissingPrices: missingPricesSchema,
}

// /Admin/IntegrationStatus — owned upstream by priceInstrumentUpload fixture (T3),
// but EntityReport/Read is a single endpoint so we dispatch from here.
const integrationStatusSchema = buildSchema(
  'IntegrationStatus',
  'Integration Status',
  'IntegrationLogId',
  [
    col(1, 'IntegrationName', 'Integration'),
    col(2, 'StatusDisplay', 'Status'),
    col(3, 'LastRunDateTime', 'Last Run', { DataTypeMeaning: 'DateTime' }),
    col(4, 'EnvironmentName', 'Environment'),
    col(5, 'ErrorMessage', 'Error'),
  ]
)
SCHEMAS.IntegrationStatus = integrationStatusSchema

// ---- per-report data rows ----

import { calculatedValuesFixture } from './calculatedValueReport'
import { contractsReportFixture } from './contractsReport'
import { integrationStatusReportFixture } from './priceInstrumentUpload'
import { onlineOrdersReadFixture } from './onlineOrders'

// MissingPrices reuses contractsReportFixture rows (each row already has
// Counterparty/Product/Location), but consumers may treat it as a flat row
// list rather than master/detail; the EntityReport grid renders the
// top-level fields we declared in missingPricesSchema columns.
const missingPricesData = {
  TotalRecords: contractsReportFixture.Data.length,
  Data: contractsReportFixture.Data.flatMap((c: any) =>
    c.Details.map((d: any) => ({
      TradeEntryId: c.TradeEntryId,
      TradeEntryDetailId: d.TradeEntryDetailId,
      CounterPartyName: c.ExternalCounterPartyName,
      ProductName: d.ProductName,
      LocationName: d.FromLocationName,
      EffectiveFromDateTime: d.FromDateTime,
      EffectiveToDateTime: d.ToDateTime,
      PriceInstrumentName: 'OPIS Houston ULSD Avg',
      PublisherName: 'OPIS',
      ValuationStatus: 'Missing',
      HideDetails: true,
    }))
  ),
  Query: null,
  Validations: [],
}

const READ_DATA: Record<string, unknown> = {
  TradeEntryValuation: calculatedValuesFixture,
  TradeEntryValuationMissingPrices: missingPricesData,
  IntegrationStatus: integrationStatusReportFixture,
  OnlineOrders: onlineOrdersReadFixture,
}

const parseBody = (init: any): any => {
  if (!init) return {}
  const b = init.body
  if (!b) return {}
  if (typeof b === 'string') {
    try {
      return JSON.parse(b)
    } catch {
      return {}
    }
  }
  return b
}

// Backwards-compat: existing index.ts entry imports `entityReportSchemaFixture`.
// Make it a function the registry calls with (path, init).
export const entityReportSchemaFixture = async (_path?: string, init?: any) => {
  const body = parseBody(init)
  const reportName = body?.ReportName as string | undefined
  const schema = (reportName && SCHEMAS[reportName]) || emptySchema(reportName ?? 'Unknown')
  return {
    Data: { Schema: schema },
    Query: null,
    Validations: [],
  }
}

export const entityReportReadFixture = async (_path?: string, init?: any) => {
  const body = parseBody(init)
  const reportName = body?.ReportName as string | undefined
  const data = (reportName && READ_DATA[reportName]) || {
    TotalRecords: 0,
    Data: [],
    Query: null,
    Validations: [],
  }
  return data
}
