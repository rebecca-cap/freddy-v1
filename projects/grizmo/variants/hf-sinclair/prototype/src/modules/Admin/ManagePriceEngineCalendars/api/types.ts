import { Validation } from '@api/globalTypes'

export interface CalendarListItem {
  Text: string
  Value: string
  GroupingValue: string | null
}

export interface CalendarMetadata {
  Data: {
    CalendarList: CalendarListItem[]
  }
  Validations: Validation[]
}
export interface CalendarPeriodDTO {
  CalendarPeriodId: number
  CalendarId: number
  PeriodId: number
  Name: string
  PeriodFromDate: string
  PeriodToDate: string
  PeriodTypeCvId: number
  IsActive: boolean
}

export interface InactivateCalendarRequest {
  CalendarPeriodIds: number[]
}

export interface ReadCalendarsRequest {
  StartDate: string
  EndDate: string
}

export interface CalendarUploadResponseData {
  TotalRecords: number
  Data: CalendarHolidayItem[]
  Query: string
  Validations: Validation[]
}

export interface CalendarHolidayItem {
  CalendarName: string
  HolidayId: number
  HolidayName: string
  HolidayDate: string
}

export interface ValidationMessageItem {
  RowNumber: number
  Message: string
}

export interface SubmitUploadedHolidaysRequest {
  CalendarId: number
  UploadId?: string
  [key: string]: unknown
}

export interface UpsertCalendarsRequest {
  CalendarName: string
  SourceExtractedDateTime: string
}
