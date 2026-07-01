import { InfoCircleOutlined } from '@ant-design/icons'
import { GraviButton } from '@gravitate-js/excalibrr'
import { orderOriginTypeFilterParams } from '@modules/Dashboard/Shared/ColumnDefs/columnUtil'
import { ColDef } from 'ag-grid-community'
import React from 'react'

export function Details(setSelectedOrderId: (id: number) => void, setIsInfoModalOpen: (open: boolean) => void): ColDef {
  return {
    headerName: 'Details',
    filter: false,
    cellStyle: { display: 'flex', alignItems: 'center' },
    cellRenderer: (params) => (
      <GraviButton
        icon={<InfoCircleOutlined />}
        theme1
        onClick={() => {
          setIsInfoModalOpen(true)
          setSelectedOrderId(params.data.TradeEntryId)
        }}
      />
    ),
  }
}

export function TradeEntryId(): ColDef {
  return {
    headerName: 'ID #',
    field: 'TradeEntryId',
  }
}

export function Instrument(): ColDef {
  return {
    headerName: 'Instrument',
    field: 'FullTypeName',
  }
}

export function OrderOrigin(): ColDef {
  return {
    headerName: 'Order Origin',
    field: 'OrderOriginType',
    filter: 'agTextColumnFilter',
    filterParams: orderOriginTypeFilterParams,
  }
}

export function Product(): ColDef {
  return {
    headerName: 'Product',
    field: 'ProductName',
  }
}

export function LocationCol(): ColDef {
  return {
    headerName: 'Location',
    field: 'FromLocationName',
  }
}

export function Counterparty(): ColDef {
  return {
    headerName: 'Counterparty',
    field: 'ExternalCounterPartyName',
  }
}

export function Quantity(): ColDef {
  return {
    headerName: 'Quantity',
    field: 'Quantity',
    valueFormatter: ({ value }) => fmt.decimal(value, 0),
  }
}
