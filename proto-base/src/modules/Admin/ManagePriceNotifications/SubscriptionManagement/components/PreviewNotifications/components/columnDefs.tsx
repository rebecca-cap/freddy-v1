import { dateFormat } from '@components/TheArmory/helpers'
import { addCommasToNumber, BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import moment from 'moment'
import React from 'react'

export const getColumnDefs = (): ColDef[] => {
  return [
    CheckBoxColumn(),
    QuoteConfigColumn(),
    LocationColumn(),
    ProductColumn(),
    EffectiveColumn(),
    PriceColumn(),
    PriceDeltaColumn(),
    CustomerCountColumn(),
    StatusColumn(),
    LastNotificationColumn(),
  ] as ColDef[]
}

// Add column def function below this line

function CheckBoxColumn(): ColDef {
  return {
    headerName: '',
    field: 'QuoteConfigurationMappingId',
    maxWidth: 110,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    pinned: 'left',
    filterValueGetter: (params) => {
      return params.node?.selected ? 'Selected' : 'Not Selected'
    },
    comparator: (valueA, valueB, nodeA, nodeB) => {
      return nodeA?.selected ? -1 : 1
    },
  }
}

function QuoteConfigColumn(): ColDef {
  return {
    headerName: 'Quote Config',
    field: 'QuoteConfigName',
    minWidth: 150,
  }
}

function LocationColumn(): ColDef {
  return {
    headerName: 'Location',
    field: 'LocationName',
    minWidth: 150,
  }
}

function ProductColumn(): ColDef {
  return {
    headerName: 'Product',
    field: 'ProductName',
    minWidth: 150,
  }
}

function EffectiveColumn(): ColDef {
  return {
    headerName: 'Effective',
    field: 'EffectiveTime',
    minWidth: 120,
    cellRenderer: (params) => {
      return params.value ? moment(params.value).format(dateFormat.MONTH_DATE_TIME) : ''
    },
    filter: 'agDateColumnFilter',
  }
}

function PriceColumn(): ColDef {
  return {
    headerName: 'Price',
    field: 'Price',
    minWidth: 120,
    cellRenderer: (params) => {
      if (!params.value) {
        return <Texto appearance='error'>(M)</Texto>
      }
      return fmt.currency(params.value)
    },
    filter: 'agNumberColumnFilter',
  }
}

function PriceDeltaColumn(): ColDef {
  return {
    headerName: 'Price Delta',
    field: 'PriceDelta',
    minWidth: 120,
    cellRenderer: (params) => {
      if (!params.value) {
        return '-'
      }

      const { value } = params
      const isPositive = value > 0
      const color = isPositive ? 'var(--theme-success)' : value < 0 ? 'var(--theme-error)' : 'inherit'

      return (
        <span style={{ color }}>
          {isPositive ? '+' : ''}
          {fmt.decimal(value)}
        </span>
      )
    },
    filter: 'agNumberColumnFilter',
  }
}

function CustomerCountColumn(): ColDef {
  return {
    headerName: 'Customer Count',
    field: 'CustomerCount',
    minWidth: 170,
    cellRenderer: (params) => {
      const count = params.value || 0
      return (
        <Horizontal>
          <Texto appearance={count > 0 ? 'default' : 'error'}>{addCommasToNumber(count)}</Texto>
        </Horizontal>
      )
    },
    filter: 'agNumberColumnFilter',
  }
}

function StatusColumn(): ColDef {
  return {
    headerName: 'Status',
    field: 'HasBeenSent',
    minWidth: 120,
    valueGetter: (params) => {
      return params.data.HasBeenSent ? 'Sent' : 'Not Sent'
    },
    cellRenderer: (params) => {
      const hasBeenSent = params.data.HasBeenSent
      return (
        <Horizontal>
          <BBDTag success={hasBeenSent} warning={!hasBeenSent}>
            {hasBeenSent ? 'Sent' : 'Not Sent'}
          </BBDTag>
        </Horizontal>
      )
    },
  }
}

function LastNotificationColumn(): ColDef {
  return {
    headerName: 'Last Notification',
    field: 'LastNotificationTime',
    minWidth: 170,
    cellRenderer: (params) => {
      if (params.value && moment(params.value).isValid()) {
        return moment(params.value).format(dateFormat.MONTH_DATE_TIME)
      }
      return '-'
    },
    filter: 'agDateColumnFilter',
  }
}
