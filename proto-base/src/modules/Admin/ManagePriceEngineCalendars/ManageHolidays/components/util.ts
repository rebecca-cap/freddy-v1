import { CalendarPeriodDTO, CalendarUploadResponseData } from '@modules/Admin/ManagePriceEngineCalendars/api/types'
import moment from 'moment/moment'

export function getDisplayErrors(statusResponse: CalendarUploadResponseData, gridRowData: CalendarPeriodDTO[]) {
  if (!statusResponse?.Validations?.length) return []
  return statusResponse.Data.map((dataRow: any, index: number) => ({
    RowNumber: index + 2,
    Id: dataRow.HolidayId || dataRow.HolidayName + index,
    Errors: checkRowForErrors(dataRow, gridRowData),
  })).filter((row) => row.Errors.length > 0)
}

export function checkRowForErrors(dataRow: any, gridRowData?: any[]) {
  const errorsInRow: string[] = []

  // Updated to use single HolidayDate field
  if (!dataRow.HolidayDate || dataRow.HolidayDate.startsWith?.('0') || !isValidDate(dataRow.HolidayDate)) {
    errorsInRow.push('Holiday Date')
  }

  if (!dataRow.HolidayName) {
    errorsInRow.push('Holiday Name')
  }
  // new records have null ids
  // if there is an id and it's not in the grid already, it's wrong
  if (dataRow.HolidayId) {
    if (gridRowData && gridRowData.some((row) => row.HolidayId !== dataRow.HolidayId)) {
      errorsInRow.push('Holiday Id')
    }
  }

  return errorsInRow
}

function isValidDate(date: string) {
  return moment(date).isValid()
}
