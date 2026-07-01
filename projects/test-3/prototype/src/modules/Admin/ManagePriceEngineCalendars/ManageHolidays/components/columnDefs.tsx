import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { CalendarMetadata } from '@modules/Admin/ManagePriceEngineCalendars/api/types'
import { ColDef } from 'ag-grid-community'
import { Popconfirm } from 'antd'
import moment from 'moment'

export function getColumnDefs(handleDelete: (data: any) => void): ColDef[] {
  return [
    {
      headerName: 'Calendar',
      field: 'CalendarName',
    },
    {
      headerName: 'Name',
      field: 'PeriodName',
    },
    {
      headerName: 'Date',
      field: 'PeriodFromDate',
      valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.MONTH_DATE_YEAR) : ''),
    },

    {
      headerName: 'Actions',
      field: 'Actions',
      cellRenderer: ({ data }) => (
        <Horizontal horizontalCenter className='gap-10'>
          <Popconfirm
            icon={<QuestionCircleOutlined style={{ color: 'var(--theme-error)' }} />}
            trigger='click'
            title={`Are you sure you want to delete ${data.PeriodName}?`}
            onConfirm={() => handleDelete(data)}
            okText='Delete'
            cancelText='Cancel'
          >
            <GraviButton icon={<DeleteOutlined />} />
          </Popconfirm>
        </Horizontal>
      ),
    },
  ] as ColDef[]
}
