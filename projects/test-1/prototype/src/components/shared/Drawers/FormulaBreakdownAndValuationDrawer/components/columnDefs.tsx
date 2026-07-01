import { dateFormat } from '@components/TheArmory/helpers'
import { Texto } from '@gravitate-js/excalibrr'
import { CellClassParams, ColDef } from 'ag-grid-community'
import moment from 'moment/moment'
import React from 'react'

export type PriceStatusFlag = 'O' | 'M' | 'A' | 'E'

export function columnDefs() {
  return [
    {
      field: 'ComponentDisplayName',
      headerName: 'Display',
      cellRenderer: ({ value }) => <Texto className='text-truncate'>{value}</Texto>,
    },
    {
      field: 'ComponentName',
      headerName: 'Name',
    },
    {
      field: 'ComponentResult',
      headerName: 'Value',
      formatter: fmt.decimal,
      cellRenderer: (params) => {
        if (!params.data.IsRequired && params.data.IsMissing) {
          // if a variable is missing and not required, show 'Optional Variable'
          return 'Optional Variable'
        }
        return fmt.decimal(params.value)
      },
      cellStyle: getCellStyle,
    },
    {
      field: 'ComponentStatus',
      headerName: 'Status',
      cellStyle: getCellStyle,
    },
    {
      field: 'PriceTypeCodeValueDisplay',
      headerName: 'Type',
    },
    {
      field: 'PriceInstrumentName',
      headerName: 'Description',
    },
    {
      field: 'EffectiveAsOfDate',
      headerName: 'As of Date',
      cellRenderer: ({ value }) => (value ? moment(value)?.format(dateFormat.MONTH_DATE_YEAR_TIME) : ''),
    },
  ] as ColDef[]
}

function getCellStyle(params: CellClassParams) {
  switch (params.data?.ComponentStatus as PriceStatusFlag) {
    case 'M':
      return { backgroundColor: 'var(--theme-error-trans)' }
    case 'O':
      return { backgroundColor: 'var(--theme-optimal-dim)' }
    case 'A':
      return { backgroundColor: 'var(--theme-success-dim)' }
    case 'E':
      return { backgroundColor: 'var(--theme-color-1-dim)' }
    default:
      return {}
  }
}
