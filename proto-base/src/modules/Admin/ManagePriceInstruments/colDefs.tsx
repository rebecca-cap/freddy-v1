import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import { Badge } from 'antd'
import React from 'react'

function SuccessTag() {
  return (
    <Horizontal className='round-border bg-success p-2' verticalCenter horizontalCenter>
      <CheckCircleFilled style={{ color: 'white', paddingRight: 5, fontSize: 15 }} />
      <Texto style={{ color: 'white', fontSize: 15 }}>Success</Texto>
    </Horizontal>
  )
}

function ErrorTag({ onClick }) {
  return (
    <Horizontal className='round-border bg-error p-2' verticalCenter horizontalCenter onClick={onClick}>
      <ExclamationCircleFilled style={{ color: 'white', paddingRight: 5, fontSize: 15 }} />
      <Texto style={{ color: 'white', fontSize: 15 }}>ERROR</Texto>
    </Horizontal>
  )
}

export const getColumnDefs = (setRowErrors, useOriginLocation) => {
  const columns: ColDef[] = []
  columns.push(
    {
      field: 'HasValidationErrors',
      headerName: 'Status',
      filterParams: {
        valueFormatter: (params) => (!params.value ? "Success" : "ERROR"),
      },
      cellRenderer: ({ data }) => {
        const errorCount = data?.ValidationMessages?.length
        if (!data || errorCount > 0) {
          return (
            <Badge count={data?.ValidationMessages?.length}>
              <ErrorTag onClick={() => setRowErrors(data?.ValidationMessages)} />
            </Badge>
          )
        }

        return <SuccessTag />
      },
    },
    {
      field: 'CounterPartyName',
    }
  )

  columns.push(
    {
      field: 'OriginLocationName',
      hide: !useOriginLocation,
    },
    {
      field: 'LocationName',
      headerName: useOriginLocation ? 'Destination Location Name' : 'Location Name',
    },
    {
      field: 'ProductName',
    },
    {
      field: 'Name',
    },
    {
      field: 'Abbreviation',
    },
    {
      field: 'PricePublisherName',
    },
    {
      field: 'ExchangeSymbol',
    },
    {
      field: 'ExchangeSymbolConversionFactor',
    },
    {
      field: 'ExternalReferenceNumber',
    },
    {
      field: 'CurrencyName',
    },
    {
      field: 'UnitOfMeasureName',
    },
    {
      field: 'IsActive',
      filterParams: {
        valueFormatter: (params) => (params.value ? 'Yes' : 'No'),
      },
    }
  )

  return columns
}
