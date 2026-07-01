import { dateFormat } from '@components/TheArmory/helpers'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import { Popover } from 'antd'
import moment from 'moment'
import React from 'react'

export function columnDefs(): ColDef[] {
  return [
    TransmissionId(),
    SupplierId(),
    TerminalId(),
    ProductId(),
    ImportedDateTime(),
    PostedPrice(),
    AdjustedPrice(),
    LastProcessedDateTime(),
    ParsedEffectiveStartDate(),
    NumberOfErrors(),
    Validations(),
  ] as ColDef[]
}

function TransmissionId() {
  return {
    field: 'TransmissionId',
    headerName: 'Transmission Id',
  }
}

function SupplierId() {
  return {
    field: 'SupplierId',
    headerName: 'Supplier',
  }
}

function TerminalId() {
  return {
    field: 'TerminalId',
    headerName: 'Terminal',
  }
}

function ProductId() {
  return {
    field: 'ProductId',
    headerName: 'Product',
  }
}

function ImportedDateTime() {
  return {
    field: 'ImportedDateTime',
    headerName: 'Imported',
    valueFormatter: ({ value }) => moment(value).format(dateFormat.SHORT_DATE_YEAR_TIME),
    filter: 'agDateColumnFilter',
  }
}

function PostedPrice() {
  return {
    field: 'PostedPrice',
    headerName: 'Posted Price',
    valueFormatter: fmt.currency,
  }
}

function AdjustedPrice() {
  return {
    field: 'AdjustedPrice',
    headerName: 'Adjusted',
    valueFormatter: fmt.currency,
  }
}

function LastProcessedDateTime() {
  return {
    field: 'LastProcessedDateTime',
    headerName: 'Last Processed',
    valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.SHORT_DATE_YEAR_TIME) : ''),
    filter: 'agDateColumnFilter',
  }
}

function ParsedEffectiveStartDate() {
  return {
    field: 'ParsedEffectiveStartDate',
    headerName: 'Effective Date',
    valueFormatter: ({ value }) => moment(value).format(dateFormat.SHORT_DATE_YEAR_TIME),
    filter: 'agDateColumnFilter',
  }
}

function Validations() {
  return {
    field: 'Validations',
    headerName: 'Errors',

    valueGetter: (params) => {
      if (params?.data?.Validations?.Validations.length > 0) {
        return params?.data?.Validations?.Validations.map((validationRecord) => validationRecord.Name)
      }
      return ''
    },

    cellRenderer: (params) => {
      const validationMessages = params?.data?.Validations?.Validations
      return <CellHoverPopOver list={validationMessages} title='Multiple Errors' />
    },
  }
}
function NumberOfErrors() {
  return {
    field: 'ValidationsCount',
    headerName: '# of Errors',
  }
}

export function CellHoverPopOver({ list, title }) {
  if (!list?.length) {
    return <Texto>None</Texto>
  }
  if (list?.length === 1) {
    return <Texto>{list.map((item) => item.Name)}</Texto>
  }
  return (
    <Popover
      placement='bottomLeft'
      content={
        <Vertical>
          {list?.map((item) => (
            <Horizontal key={item.ValidationId}>
              <Texto>{item.Name}</Texto>
            </Horizontal>
          ))}
        </Vertical>
      }
    >
      {title}
    </Popover>
  )
}
