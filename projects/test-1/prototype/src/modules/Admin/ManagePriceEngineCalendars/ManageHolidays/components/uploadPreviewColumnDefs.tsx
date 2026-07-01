import { dateFormat } from '@components/TheArmory/helpers'
import { ColDef } from 'ag-grid-community'
import moment from 'moment'

import { StatusTag } from './StatusTag'
import { HolidayValidationResult } from './validation'

export function getUploadPreviewColumnDefs(setUploadErrors: React.Dispatch<React.SetStateAction<string[]>>): ColDef[] {
  return [
    {
      headerName: 'Status',
      field: 'status',
      width: 130,
      cellRenderer: ({ data }: { data: HolidayValidationResult }) => (
        <StatusTag
          hasErrors={data.validationErrors?.length > 0}
          errors={data.validationErrors}
          onErrorClick={() => setUploadErrors(data.validationErrors)}
        />
      ),
    },
    {
      headerName: 'Row',
      field: 'rowIndex',
      width: 80,
      valueGetter: ({ data }) => data.rowIndex,
    },
    {
      headerName: 'Calendar Name',
      field: 'originalData.CalendarName',
      valueGetter: ({ data }) => data.originalData?.CalendarName || '',
    },
    {
      headerName: 'Holiday Name',
      field: 'originalData.HolidayName',
      valueGetter: ({ data }) => data.originalData?.HolidayName || '',
    },
    {
      headerName: 'Date',
      field: 'originalData.HolidayDate',
      valueGetter: ({ data }) =>
        data.originalData?.HolidayDate ? moment(data.originalData.HolidayDate).format(dateFormat.MONTH_DATE_YEAR) : '',
    },
  ] as ColDef[]
}
