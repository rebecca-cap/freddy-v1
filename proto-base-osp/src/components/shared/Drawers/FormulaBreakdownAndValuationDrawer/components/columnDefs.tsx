import { LoadingOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { Texto } from '@gravitate-js/excalibrr'
import { CellClassParams, ColDef } from 'ag-grid-community'
import dayjs from '@utils/dayjs'
import React from 'react'

export type PriceStatusFlag = 'O' | 'M' | 'A' | 'E'

export function columnDefs(isLoading: boolean = false, variableColorMap: Map<number, string> = new Map()) {
  return [
    {
      colId: 'Name',
      headerName: 'Name',
      valueGetter: ({ data }) => data?.ComponentDisplayName || data?.PriceInstrumentName || data?.ComponentName,
      cellRenderer: ({ value, data }) => {
        const id = data?.FormulaResultComponentId
        const color = id != null ? variableColorMap.get(id) : undefined
        return (
          <Texto className='text-truncate' style={{ color, fontWeight: color ? 600 : undefined }}>
            {value}
          </Texto>
        )
      },
    },
    {
      field: 'ComponentResult',
      headerName: 'Value',
      valueFormatter: ({ value }) => (value != null ? fmt.decimal(value) : ''),
      cellRenderer: (params) => {
        if (isLoading) return <LoadingOutlined />
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
      headerName: 'Price Instrument',
    },
    {
      field: 'EffectiveAsOfDate',
      headerName: 'As of Date',
      cellRenderer: ({ value }) => (value ? dayjs(value)?.format(dateFormat.MONTH_DATE_YEAR_TIME) : ''),
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
