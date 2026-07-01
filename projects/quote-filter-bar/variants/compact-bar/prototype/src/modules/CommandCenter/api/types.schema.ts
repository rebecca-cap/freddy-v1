import { MetadataListResponseItem } from '@api/globalTypes'
import { GridConfigFilterState, GridView } from '@hooks/useGridViewManager/api/types.schema'
import { WidgetGridSettings } from '@modules/CommandCenter/api/pageViewTypes.schema'
import { ColDef, ColumnState, GridApi } from 'ag-grid-community'
import { MutableRefObject } from 'react'

export interface Metadata {
  LocationHierarchyTypes: MetadataListResponseItem[]
  ProductHierarchyTypes: MetadataListResponseItem[]
  QuoteConfigurations: MetadataListResponseItem[]
  TimeSpans: MetadataListResponseItem[]
  LocationTree: TreeResponseData[]
  ProductTree: TreeResponseData[]
}

export type TreeResponseData = {
  Text: string
  Value: string
  Children: TreeResponseData[]
}

export interface SharedLocationData {
  LocationId: number
  Location: string
  Path: number[]
  ParentLocationId: number
}
export interface IntradayCompetitorMovement extends SharedLocationData {
  MovesToday: number
  AvgMove: number
  LastMove: number
}

export interface MarginSummary extends SharedLocationData {
  MarginColumns: { [key: number]: MarginColumn }
}
export type MarginColumn = {
  WeightedAverageMargin: number
  TotalVolume: number
  QuoteConfigurationName: string
}
export interface StrategyMissReport extends SharedLocationData {
  MissToStrategy: number
  TotalQuantity: number
  RecordCount: number
}
export interface VolumePace extends SharedLocationData {
  MtdTarget: number
  MtdPacePercent: number
  WeeklyTarget: number
  WeeklyPacePercent: number
  DailyTarget: number
  DailyRemaining: number
  DailyAdjustment: number
}

export type DataType = IntradayCompetitorMovement | MarginSummary | StrategyMissReport | VolumePace
export type DataTypeWithStatus = DataType & { Status: string }
export type WidgetTitle =
  | 'Intraday Competitor Movement'
  | 'Strategy Delta Report'
  | 'Margin Summary'
  | 'Volume Pace'
  | null
export type ThresholdTypes = 'Critical Below' | 'Critical Above' | 'Warning Below' | 'Warning Above'

export interface SharedGridSettingFilters {
  filters: {
    DateRange: TimeSpan
    LocationIds: number[]
    ProductIds: number[]
    QuoteConfigurationIds: number[]
  }
}
export interface PageSettingFilters {
  LocationHierarchyTypeCvId: number
  ProductHierarchyTypeCvId: number
}
export type GridConfigSettings = {
  filter: GridConfigFilterState
  column: ColumnState[]
}
export interface UserDefinedPageView {
  widgetSettings: {
    name: string // grid storage key
    gridConfigSettings: GridConfigSettings
    widgetGridSettings: WidgetGridSettings
  }[]
  pageServerSideFilters: PageSettingFilters
  display: string // saved view display name
  userPreferenceId: number
}
export interface WidgetRequestPayload {
  DateRange: TimeSpan
  LocationHierarchyTypeCvId: number
  ProductHierarchyTypeCvId: number
  LocationIds: number[]
  ProductIds: number[]
  QuoteConfigurations: number[]
}
export type TimeSpan = 'LatestPice' | 'OneDay' | 'SevenDays' | 'ThirtyDays'
export type OriginalMarginSummaryData = {
  Rows: MarginSummary[]
  ColumnHeadersByColumnId: { [key: number]: string }
}
export type OriginalVolumePaceData = {
  Rows: VolumePace[]
}
export type OriginalStrategyMissReportData = {
  Rows: StrategyMissReport[]
}

export type OriginalIntradayCompetitorMovementData = {
  Rows: IntradayCompetitorMovement[]
}


export interface GraviGridRef<T> extends GridApi<T> {
  applyGridView: (view: GridView) => void
  resetGridToDefault: () => void
}

export interface WidgetConfig<T = DataTypeWithStatus, S = any> {
  title: WidgetTitle
  columnDefs: () => ColDef[]
  data: T[]
  settings: S
  setSettings: (settings: S) => void
  gridApiRef: MutableRefObject<GraviGridRef<T> | undefined>
  storageKey: string
  isLoading: boolean
  columnHeadersByColumnId?: { [key: number]: string }
}
