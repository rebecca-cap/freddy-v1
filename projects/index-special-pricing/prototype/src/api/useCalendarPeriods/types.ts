export interface CalendarPeriodOverviewResponse {
  TotalRecords: number
  Data: CalendarPeriodOverviewData[]
}

export interface CalendarPeriodOverviewData {
  CalendarPeriodId: number
  CalendarId?: number
  PeriodId?: number
  Name: string
  PeriodFromDate: Date
  PeriodToDate: Date
  PeriodTypeCvId: number
  IsActive: boolean
}

export interface CalendarPeriodMetadataResponse {
  Data: CalendarPeriodMetadata
  Query: null
  Validations: any[]
}

export interface CalendarPeriodMetadata {
  CalendarList: ListItem[]
  PeriodTypeList: ListItem[]
}

export interface ListItem {
  Text: string
  Value: string
  GroupingValue: null
}
