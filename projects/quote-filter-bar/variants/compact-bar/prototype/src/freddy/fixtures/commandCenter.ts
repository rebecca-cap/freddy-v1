// Freddy mock fixture — fictional

// CommandCenter consumes a `Metadata` shape (LocationTree, ProductTree, etc.)
// per src/modules/CommandCenter/api/types.schema.ts. The Brief's
// Columns/Filters/Sortable/PageView.Layout structure is included alongside as
// a forward-compatible page-view scaffold for other teams to copy.
//
// Widget data envelope (Type B): { Data: { Rows: [...], Columns: [...] }, ... }
// Consumers do `data.Data.Rows.map(...)`, e.g. marginSummaryUtil.ts:53.

// ---------- Cross-team IDs ----------
// T1 Counterparties: 9001..9020
// T2 Locations:      5001..5020
// T2 Products:       7001..7020
// PageViews 100..110, WidgetIds 10..20

const LOC = {
  HoustonTerminal: { id: 5001, name: 'Houston Terminal' },
  DallasHub: { id: 5002, name: 'Dallas Hub' },
  SaltLakeRack: { id: 5003, name: 'Salt Lake Rack' },
  PhoenixDepot: { id: 5004, name: 'Phoenix Depot' },
  DenverRack: { id: 5005, name: 'Denver Rack' },
  AlbuquerqueTerminal: { id: 5006, name: 'Albuquerque Terminal' },
  PortlandTerminal: { id: 5007, name: 'Portland Terminal' },
  BoiseRack: { id: 5008, name: 'Boise Rack' },
}

const PRD = {
  ULSD: { id: 7001, name: 'ULSD' },
  Gas87: { id: 7002, name: 'Gasoline 87' },
  Gas91: { id: 7003, name: 'Gasoline 91' },
  JetA: { id: 7004, name: 'Jet A' },
  BioB5: { id: 7005, name: 'Biodiesel B5' },
}

// ---------- Metadata fixture ----------
// Shape: APIResponse<Metadata>. Includes both the real Metadata fields the
// drawer reads AND a PageView.Layout sketch other teams may reference.
export const commandCenterMetadataFixture = {
  Data: {
    LocationHierarchyTypes: [
      { Key: 1, Value: 'Region' },
      { Key: 2, Value: 'Terminal' },
      { Key: 3, Value: 'Customer Group' },
    ],
    ProductHierarchyTypes: [
      { Key: 1, Value: 'Refined Products' },
      { Key: 2, Value: 'Distillates' },
      { Key: 3, Value: 'Renewables' },
    ],
    QuoteConfigurations: [
      { Key: 101, Value: 'Wholesale Rack — ULSD' },
      { Key: 102, Value: 'Wholesale Rack — Gas 87' },
      { Key: 103, Value: 'Wholesale Rack — Gas 91' },
      { Key: 104, Value: 'Bulk Contracts — ULSD' },
      { Key: 105, Value: 'Bulk Contracts — Jet A' },
    ],
    TimeSpans: [
      { Key: 'LatestPice', Value: 'Latest Price' },
      { Key: 'OneDay', Value: 'One Day' },
      { Key: 'SevenDays', Value: 'Seven Days' },
      { Key: 'ThirtyDays', Value: 'Thirty Days' },
    ],
    LocationTree: [
      {
        Text: 'West Region',
        Value: '1001',
        Children: [
          { Text: LOC.SaltLakeRack.name, Value: String(LOC.SaltLakeRack.id), Children: [] },
          { Text: LOC.PhoenixDepot.name, Value: String(LOC.PhoenixDepot.id), Children: [] },
          { Text: LOC.DenverRack.name, Value: String(LOC.DenverRack.id), Children: [] },
          { Text: LOC.AlbuquerqueTerminal.name, Value: String(LOC.AlbuquerqueTerminal.id), Children: [] },
          { Text: LOC.PortlandTerminal.name, Value: String(LOC.PortlandTerminal.id), Children: [] },
          { Text: LOC.BoiseRack.name, Value: String(LOC.BoiseRack.id), Children: [] },
        ],
      },
      {
        Text: 'South Region',
        Value: '1002',
        Children: [
          { Text: LOC.HoustonTerminal.name, Value: String(LOC.HoustonTerminal.id), Children: [] },
          { Text: LOC.DallasHub.name, Value: String(LOC.DallasHub.id), Children: [] },
        ],
      },
    ],
    ProductTree: [
      {
        Text: 'Refined Products',
        Value: '2001',
        Children: [
          { Text: PRD.ULSD.name, Value: String(PRD.ULSD.id), Children: [] },
          { Text: PRD.Gas87.name, Value: String(PRD.Gas87.id), Children: [] },
          { Text: PRD.Gas91.name, Value: String(PRD.Gas91.id), Children: [] },
          { Text: PRD.JetA.name, Value: String(PRD.JetA.id), Children: [] },
        ],
      },
      {
        Text: 'Renewables',
        Value: '2002',
        Children: [{ Text: PRD.BioB5.name, Value: String(PRD.BioB5.id), Children: [] }],
      },
    ],

    // Forward-compatible page-view scaffold (per BUILD_BRIEF). The current
    // consumer hard-codes its 4 widgets in CommandCenterPage.tsx, but other
    // teams' grids may read this shape.
    Columns: [
      { ColumnId: 1, Field: 'LocationName', HeaderName: 'Location', Sortable: true, Filter: 'agTextColumnFilter' },
      { ColumnId: 2, Field: 'ProductName', HeaderName: 'Product', Sortable: true, Filter: 'agTextColumnFilter' },
      { ColumnId: 3, Field: 'Status', HeaderName: 'Status', Sortable: true, Filter: 'agSetColumnFilter' },
    ],
    Filters: [
      { Field: 'LocationIds', Type: 'multi', Source: 'LocationTree' },
      { Field: 'ProductIds', Type: 'multi', Source: 'ProductTree' },
      { Field: 'QuoteConfigurationIds', Type: 'multi', Source: 'QuoteConfigurations' },
      { Field: 'DateRange', Type: 'single', Source: 'TimeSpans' },
    ],
    Sortable: ['LocationName', 'ProductName', 'Status', 'MovesToday', 'MissToStrategy'],
    PageView: {
      ViewName: 'Default',
      Layout: [
        {
          WidgetId: 10,
          WidgetType: 'IntradayCompetitorMovement',
          Title: 'Intraday Competitor Movement',
          StorageKey: 'CommandCenter-IntradayCompetitorMovement',
          Endpoint: 'CommandCenter/GetIntradayCompetitorMovementData',
          Position: { Row: 0, Col: 0, RowSpan: 1, ColSpan: 1 },
        },
        {
          WidgetId: 11,
          WidgetType: 'StrategyMiss',
          Title: 'Strategy Delta Report',
          StorageKey: 'CommandCenter-StrategyMiss',
          Endpoint: 'CommandCenter/GetStrategyMissData',
          Position: { Row: 0, Col: 1, RowSpan: 1, ColSpan: 1 },
        },
        {
          WidgetId: 12,
          WidgetType: 'MarginSummary',
          Title: 'Margin Summary',
          StorageKey: 'CommandCenter-MarginSummary',
          Endpoint: 'CommandCenter/GetMarginSummaryData',
          Position: { Row: 0, Col: 2, RowSpan: 1, ColSpan: 1 },
        },
        {
          WidgetId: 13,
          WidgetType: 'VolumePace',
          Title: 'Volume Pace',
          StorageKey: 'CommandCenter-VolumePace',
          Endpoint: 'CommandCenter/GetVolumePaceData',
          Position: { Row: 1, Col: 0, RowSpan: 1, ColSpan: 3 },
        },
      ],
    },
  },
  Query: null,
  Validations: [],
}

// ---------- Widget data fixtures (Type B envelope) ----------

// Intraday Competitor Movement — 8 rows
export const intradayCompetitorMovementFixture = {
  Data: {
    Columns: [
      { Field: 'LocationName', HeaderName: 'Location' },
      { Field: 'MovesToday', HeaderName: 'Moves Today' },
      { Field: 'AvgMove', HeaderName: 'Avg Move' },
      { Field: 'LastMove', HeaderName: 'Last Move' },
    ],
    Rows: [
      { LocationId: LOC.HoustonTerminal.id, Location: LOC.HoustonTerminal.name, ParentLocationId: 1002, Path: [1002, LOC.HoustonTerminal.id], MovesToday: 7, AvgMove: 0.0185, LastMove: 0.022 },
      { LocationId: LOC.DallasHub.id, Location: LOC.DallasHub.name, ParentLocationId: 1002, Path: [1002, LOC.DallasHub.id], MovesToday: 5, AvgMove: 0.0142, LastMove: 0.011 },
      { LocationId: LOC.SaltLakeRack.id, Location: LOC.SaltLakeRack.name, ParentLocationId: 1001, Path: [1001, LOC.SaltLakeRack.id], MovesToday: 12, AvgMove: 0.0264, LastMove: 0.031 },
      { LocationId: LOC.PhoenixDepot.id, Location: LOC.PhoenixDepot.name, ParentLocationId: 1001, Path: [1001, LOC.PhoenixDepot.id], MovesToday: 3, AvgMove: 0.0095, LastMove: -0.004 },
      { LocationId: LOC.DenverRack.id, Location: LOC.DenverRack.name, ParentLocationId: 1001, Path: [1001, LOC.DenverRack.id], MovesToday: 9, AvgMove: 0.0211, LastMove: 0.018 },
      { LocationId: LOC.AlbuquerqueTerminal.id, Location: LOC.AlbuquerqueTerminal.name, ParentLocationId: 1001, Path: [1001, LOC.AlbuquerqueTerminal.id], MovesToday: 4, AvgMove: 0.0118, LastMove: 0.009 },
      { LocationId: LOC.PortlandTerminal.id, Location: LOC.PortlandTerminal.name, ParentLocationId: 1001, Path: [1001, LOC.PortlandTerminal.id], MovesToday: 6, AvgMove: 0.0156, LastMove: 0.014 },
      { LocationId: LOC.BoiseRack.id, Location: LOC.BoiseRack.name, ParentLocationId: 1001, Path: [1001, LOC.BoiseRack.id], MovesToday: 2, AvgMove: 0.0072, LastMove: -0.002 },
    ],
  },
  TotalRecords: 8,
  Query: null,
  Validations: [],
}

// Margin Summary — 7 rows. Each row carries multiple MarginColumns keyed by
// QuoteConfiguration column id (matches ColumnHeadersByColumnId).
const marginCol = (qcId: number, qcName: string, weightedAvg: number, volume: number) => ({
  WeightedAverageMargin: weightedAvg,
  TotalVolume: volume,
  QuoteConfigurationName: qcName,
})

export const marginSummaryFixture = {
  Data: {
    ColumnHeadersByColumnId: {
      101: 'Wholesale Rack — ULSD',
      102: 'Wholesale Rack — Gas 87',
      103: 'Wholesale Rack — Gas 91',
      104: 'Bulk Contracts — ULSD',
    },
    Columns: [
      { Field: 'LocationName', HeaderName: 'Location' },
      { Field: 'MarginColumns.101', HeaderName: 'Wholesale Rack — ULSD' },
      { Field: 'MarginColumns.102', HeaderName: 'Wholesale Rack — Gas 87' },
      { Field: 'MarginColumns.103', HeaderName: 'Wholesale Rack — Gas 91' },
      { Field: 'MarginColumns.104', HeaderName: 'Bulk Contracts — ULSD' },
    ],
    Rows: [
      {
        LocationId: LOC.HoustonTerminal.id, Location: LOC.HoustonTerminal.name, ParentLocationId: 1002, Path: [1002, LOC.HoustonTerminal.id],
        MarginColumns: {
          101: marginCol(101, 'Wholesale Rack — ULSD', 0.0354, 22500),
          102: marginCol(102, 'Wholesale Rack — Gas 87', 0.0287, 18400),
          103: marginCol(103, 'Wholesale Rack — Gas 91', 0.0412, 9200),
          104: marginCol(104, 'Bulk Contracts — ULSD', 0.0298, 41000),
        },
      },
      {
        LocationId: LOC.DallasHub.id, Location: LOC.DallasHub.name, ParentLocationId: 1002, Path: [1002, LOC.DallasHub.id],
        MarginColumns: {
          101: marginCol(101, 'Wholesale Rack — ULSD', 0.0341, 19800),
          102: marginCol(102, 'Wholesale Rack — Gas 87', 0.0269, 16200),
          103: marginCol(103, 'Wholesale Rack — Gas 91', 0.0398, 8400),
          104: marginCol(104, 'Bulk Contracts — ULSD', 0.0312, 35500),
        },
      },
      {
        LocationId: LOC.SaltLakeRack.id, Location: LOC.SaltLakeRack.name, ParentLocationId: 1001, Path: [1001, LOC.SaltLakeRack.id],
        MarginColumns: {
          101: marginCol(101, 'Wholesale Rack — ULSD', 0.0421, 15600),
          102: marginCol(102, 'Wholesale Rack — Gas 87', 0.0335, 12100),
          103: marginCol(103, 'Wholesale Rack — Gas 91', 0.0467, 6800),
          104: marginCol(104, 'Bulk Contracts — ULSD', 0.0356, 28200),
        },
      },
      {
        LocationId: LOC.PhoenixDepot.id, Location: LOC.PhoenixDepot.name, ParentLocationId: 1001, Path: [1001, LOC.PhoenixDepot.id],
        MarginColumns: {
          101: marginCol(101, 'Wholesale Rack — ULSD', 0.0312, 11400),
          102: marginCol(102, 'Wholesale Rack — Gas 87', 0.0244, 9300),
          103: marginCol(103, 'Wholesale Rack — Gas 91', 0.0381, 5100),
          104: marginCol(104, 'Bulk Contracts — ULSD', 0.0275, 21000),
        },
      },
      {
        LocationId: LOC.DenverRack.id, Location: LOC.DenverRack.name, ParentLocationId: 1001, Path: [1001, LOC.DenverRack.id],
        MarginColumns: {
          101: marginCol(101, 'Wholesale Rack — ULSD', 0.0378, 13800),
          102: marginCol(102, 'Wholesale Rack — Gas 87', 0.0298, 11000),
          103: marginCol(103, 'Wholesale Rack — Gas 91', 0.0432, 5900),
          104: marginCol(104, 'Bulk Contracts — ULSD', 0.0321, 24500),
        },
      },
      {
        LocationId: LOC.PortlandTerminal.id, Location: LOC.PortlandTerminal.name, ParentLocationId: 1001, Path: [1001, LOC.PortlandTerminal.id],
        MarginColumns: {
          101: marginCol(101, 'Wholesale Rack — ULSD', 0.0289, 10200),
          102: marginCol(102, 'Wholesale Rack — Gas 87', 0.0231, 8100),
          103: marginCol(103, 'Wholesale Rack — Gas 91', 0.0364, 4200),
          104: marginCol(104, 'Bulk Contracts — ULSD', 0.0258, 18500),
        },
      },
      {
        LocationId: LOC.BoiseRack.id, Location: LOC.BoiseRack.name, ParentLocationId: 1001, Path: [1001, LOC.BoiseRack.id],
        MarginColumns: {
          101: marginCol(101, 'Wholesale Rack — ULSD', 0.0265, 7400),
          102: marginCol(102, 'Wholesale Rack — Gas 87', 0.0212, 6000),
          103: marginCol(103, 'Wholesale Rack — Gas 91', 0.0348, 3100),
          104: marginCol(104, 'Bulk Contracts — ULSD', 0.0241, 14200),
        },
      },
    ],
  },
  TotalRecords: 7,
  Query: null,
  Validations: [],
}

// Strategy Miss — 8 rows
export const strategyMissFixture = {
  Data: {
    Columns: [
      { Field: 'LocationName', HeaderName: 'Location' },
      { Field: 'MissToStrategy', HeaderName: 'Miss to Strategy' },
      { Field: 'TotalQuantity', HeaderName: 'Total Quantity' },
      { Field: 'RecordCount', HeaderName: 'Record Count' },
    ],
    Rows: [
      { LocationId: LOC.HoustonTerminal.id, Location: LOC.HoustonTerminal.name, ParentLocationId: 1002, Path: [1002, LOC.HoustonTerminal.id], MissToStrategy: 0.0042, TotalQuantity: 48200, RecordCount: 84 },
      { LocationId: LOC.DallasHub.id, Location: LOC.DallasHub.name, ParentLocationId: 1002, Path: [1002, LOC.DallasHub.id], MissToStrategy: -0.0018, TotalQuantity: 41500, RecordCount: 71 },
      { LocationId: LOC.SaltLakeRack.id, Location: LOC.SaltLakeRack.name, ParentLocationId: 1001, Path: [1001, LOC.SaltLakeRack.id], MissToStrategy: 0.0091, TotalQuantity: 32800, RecordCount: 58 },
      { LocationId: LOC.PhoenixDepot.id, Location: LOC.PhoenixDepot.name, ParentLocationId: 1001, Path: [1001, LOC.PhoenixDepot.id], MissToStrategy: -0.0064, TotalQuantity: 24500, RecordCount: 42 },
      { LocationId: LOC.DenverRack.id, Location: LOC.DenverRack.name, ParentLocationId: 1001, Path: [1001, LOC.DenverRack.id], MissToStrategy: 0.0023, TotalQuantity: 28100, RecordCount: 49 },
      { LocationId: LOC.AlbuquerqueTerminal.id, Location: LOC.AlbuquerqueTerminal.name, ParentLocationId: 1001, Path: [1001, LOC.AlbuquerqueTerminal.id], MissToStrategy: 0.0011, TotalQuantity: 16800, RecordCount: 31 },
      { LocationId: LOC.PortlandTerminal.id, Location: LOC.PortlandTerminal.name, ParentLocationId: 1001, Path: [1001, LOC.PortlandTerminal.id], MissToStrategy: -0.0035, TotalQuantity: 21400, RecordCount: 38 },
      { LocationId: LOC.BoiseRack.id, Location: LOC.BoiseRack.name, ParentLocationId: 1001, Path: [1001, LOC.BoiseRack.id], MissToStrategy: 0.0076, TotalQuantity: 12600, RecordCount: 24 },
    ],
  },
  TotalRecords: 8,
  Query: null,
  Validations: [],
}

// Volume Pace — 7 rows
export const volumePaceFixture = {
  Data: {
    Columns: [
      { Field: 'LocationName', HeaderName: 'Location' },
      { Field: 'MtdTarget', HeaderName: 'MTD Target' },
      { Field: 'MtdPacePercent', HeaderName: 'MTD Pace %' },
      { Field: 'WeeklyTarget', HeaderName: 'Weekly Target' },
      { Field: 'WeeklyPacePercent', HeaderName: 'Weekly Pace %' },
      { Field: 'DailyTarget', HeaderName: 'Daily Target' },
      { Field: 'DailyRemaining', HeaderName: 'Daily Remaining' },
      { Field: 'DailyAdjustment', HeaderName: 'Daily Adjustment' },
    ],
    Rows: [
      { LocationId: LOC.HoustonTerminal.id, Location: LOC.HoustonTerminal.name, ParentLocationId: 1002, Path: [1002, LOC.HoustonTerminal.id], MtdTarget: 1450000, MtdPacePercent: 1.04, WeeklyTarget: 340000, WeeklyPacePercent: 0.98, DailyTarget: 48000, DailyRemaining: 12400, DailyAdjustment: 0.02 },
      { LocationId: LOC.DallasHub.id, Location: LOC.DallasHub.name, ParentLocationId: 1002, Path: [1002, LOC.DallasHub.id], MtdTarget: 1180000, MtdPacePercent: 0.96, WeeklyTarget: 280000, WeeklyPacePercent: 1.02, DailyTarget: 40000, DailyRemaining: 9800, DailyAdjustment: -0.01 },
      { LocationId: LOC.SaltLakeRack.id, Location: LOC.SaltLakeRack.name, ParentLocationId: 1001, Path: [1001, LOC.SaltLakeRack.id], MtdTarget: 920000, MtdPacePercent: 1.12, WeeklyTarget: 220000, WeeklyPacePercent: 1.08, DailyTarget: 32000, DailyRemaining: 6400, DailyAdjustment: 0.04 },
      { LocationId: LOC.PhoenixDepot.id, Location: LOC.PhoenixDepot.name, ParentLocationId: 1001, Path: [1001, LOC.PhoenixDepot.id], MtdTarget: 680000, MtdPacePercent: 0.88, WeeklyTarget: 160000, WeeklyPacePercent: 0.91, DailyTarget: 24000, DailyRemaining: 8800, DailyAdjustment: -0.05 },
      { LocationId: LOC.DenverRack.id, Location: LOC.DenverRack.name, ParentLocationId: 1001, Path: [1001, LOC.DenverRack.id], MtdTarget: 780000, MtdPacePercent: 1.01, WeeklyTarget: 185000, WeeklyPacePercent: 0.99, DailyTarget: 27000, DailyRemaining: 7100, DailyAdjustment: 0.0 },
      { LocationId: LOC.PortlandTerminal.id, Location: LOC.PortlandTerminal.name, ParentLocationId: 1001, Path: [1001, LOC.PortlandTerminal.id], MtdTarget: 590000, MtdPacePercent: 0.94, WeeklyTarget: 140000, WeeklyPacePercent: 0.92, DailyTarget: 20000, DailyRemaining: 6800, DailyAdjustment: -0.02 },
      { LocationId: LOC.BoiseRack.id, Location: LOC.BoiseRack.name, ParentLocationId: 1001, Path: [1001, LOC.BoiseRack.id], MtdTarget: 410000, MtdPacePercent: 1.07, WeeklyTarget: 98000, WeeklyPacePercent: 1.05, DailyTarget: 14000, DailyRemaining: 2600, DailyAdjustment: 0.03 },
    ],
  },
  TotalRecords: 7,
  Query: null,
  Validations: [],
}

// ---------- User defined page views ----------
// pageViewsData: APIResponse<AllPageViewResponseData[]> — Data is an ARRAY.
// Per CommandCenterPage.tsx:286 the page reads pageViewsData?.Data?.length.
export const userDefinedPageViewFixture = {
  Data: [
    {
      userPreferenceId: 100,
      display: 'Default — All Locations',
      pageServerSideFilters: {
        LocationHierarchyTypeCvId: 1,
        ProductHierarchyTypeCvId: 1,
      },
      widgetSettings: [
        {
          name: 'CommandCenter-IntradayCompetitorMovement',
          gridConfigSettings: { filters: [], columns: [] },
          widgetGridSettings: {
            IntradayCompetitorMovement: {
              filters: { LocationIds: [], ProductIds: [], QuoteConfigurationIds: [] },
              thresholds: {
                movementAlertCriticalAbove: 10,
                movementAlertCriticalBelow: null,
                movementAlertWarningAbove: 6,
                movementAlertWarningBelow: null,
                averageMoveCriticalAbove: 0.025,
                averageMoveCriticalBelow: null,
                averageMoveWarningAbove: 0.018,
                averageMoveWarningBelow: null,
              },
            },
          },
        },
        {
          name: 'CommandCenter-StrategyMiss',
          gridConfigSettings: { filters: [], columns: [] },
          widgetGridSettings: {
            StrategyMiss: {
              filters: { DateRange: 'OneDay', LocationIds: [], ProductIds: [], QuoteConfigurationIds: [] },
              thresholds: {
                missToStrategyCriticalAbove: 0.008,
                missToStrategyCriticalBelow: -0.008,
                missToStrategyWarningAbove: 0.004,
                missToStrategyWarningBelow: -0.004,
              },
            },
          },
        },
        {
          name: 'CommandCenter-MarginSummary',
          gridConfigSettings: { filters: [], columns: [] },
          widgetGridSettings: {
            MarginSummary: {
              filters: { DateRange: 'OneDay', LocationIds: [], ProductIds: [], QuoteConfigurationIds: [] },
              thresholds: {
                criticalAbove: 0.05,
                criticalBelow: 0.02,
                warningAbove: 0.045,
                warningBelow: 0.025,
              },
            },
          },
        },
        {
          name: 'CommandCenter-VolumePace',
          gridConfigSettings: { filters: [], columns: [] },
          widgetGridSettings: {
            VolumePace: {
              filters: { LocationIds: [], ProductIds: [], QuoteConfigurationIds: [] },
              thresholds: {
                weeklyCriticalAbove: 1.15,
                weeklyCriticalBelow: 0.85,
                weeklyWarningAbove: 1.08,
                weeklyWarningBelow: 0.92,
                monthlyCriticalAbove: 1.15,
                monthlyCriticalBelow: 0.85,
                monthlyWarningAbove: 1.08,
                monthlyWarningBelow: 0.92,
              },
            },
          },
        },
      ],
    },
    {
      userPreferenceId: 101,
      display: 'West Region Focus',
      pageServerSideFilters: {
        LocationHierarchyTypeCvId: 1,
        ProductHierarchyTypeCvId: 1,
      },
      widgetSettings: [
        {
          name: 'CommandCenter-IntradayCompetitorMovement',
          gridConfigSettings: { filters: [], columns: [] },
          widgetGridSettings: {
            IntradayCompetitorMovement: {
              filters: {
                LocationIds: [LOC.SaltLakeRack.id, LOC.PhoenixDepot.id, LOC.DenverRack.id, LOC.PortlandTerminal.id],
                ProductIds: [PRD.ULSD.id, PRD.Gas87.id],
                QuoteConfigurationIds: [],
              },
              thresholds: {
                movementAlertCriticalAbove: 10,
                movementAlertCriticalBelow: null,
                movementAlertWarningAbove: 6,
                movementAlertWarningBelow: null,
                averageMoveCriticalAbove: 0.025,
                averageMoveCriticalBelow: null,
                averageMoveWarningAbove: 0.018,
                averageMoveWarningBelow: null,
              },
            },
          },
        },
      ],
    },
  ],
  Query: null,
  Validations: [],
}

// Back-compat: keep the legacy export name so any straggling references still
// resolve. Empty Type-B envelope.
export const commandCenterEmptyData = {
  Data: { Rows: [], Columns: [] },
  TotalRecords: 0,
  Query: null,
  Validations: [],
}
