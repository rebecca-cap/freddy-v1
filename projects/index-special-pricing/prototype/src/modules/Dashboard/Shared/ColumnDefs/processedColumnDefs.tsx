import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag, Texto } from '@gravitate-js/excalibrr'
import { typeFilterParams } from '@modules/Dashboard/Shared/ColumnDefs/columnUtil'
import {
  Counterparty,
  Details,
  Instrument,
  LocationCol,
  OrderOrigin,
  Product,
  Quantity,
  TradeEntryId,
} from '@modules/Dashboard/Shared/ColumnDefs/sharedColumns'
import { formatDateWithTimezone } from '@utils/timezone'
import { ColDef } from 'ag-grid-community'
import React from 'react'

export function getColumnDefs(
  setSelectedOrderId: (id: number) => void,
  setIsInfoModalOpen: (open: boolean) => void
): ColDef[] {
  return [
    Details(setSelectedOrderId, setIsInfoModalOpen),
    TradeEntryId(),
    Instrument(),
    OrderOrigin(),
    PurchaseType(),
    Status(),
    Product(),
    LocationCol(),
    Counterparty(),
    Quantity(),
    Price(),
    Currency(),
    UnitOfMeasure(),
    AcceptedDate(),
  ]
}

function PurchaseType(): ColDef {
  return {
    headerName: 'Purchase Type',
    field: 'IsBidOrOffer',
    filter: 'agTextColumnFilter',
    filterParams: typeFilterParams,
    valueGetter: (params) => {
      if (params?.data?.SourceIndexOfferId != null) return 'Index'
      return params?.data?.IsBidOrOffer ? 'Bid' : 'Market'
    },
    cellRenderer: (params) => {
      if (params?.data?.SourceIndexOfferId != null) return <Texto>Index</Texto>
      return params?.data?.IsBidOrOffer ? <Texto>Bid</Texto> : <Texto>Market</Texto>
    },
  }
}

function Status(): ColDef {
  return {
    headerName: 'Status',
    field: 'OrderStatusCodeValueDisplay',
    cellRenderer: ({ data }) => {
      if (data) return getStatus(data.OrderStatusCodeValueDisplay)
      return ''
    },
  }
}

function Price(): ColDef {
  return {
    headerName: 'Price',
    field: 'Price',
    valueFormatter: ({ value, data }) => {
      if (data?.SourceIndexOfferId != null) return data?.IndexOfferDisplay?.PricingDisplayText
      return fmt.currency(value)
    },
  }
}
function Currency(): ColDef {
  return {
    headerName: 'Currency',
    field: 'CurrencyName',
    hide: true,
  }
}

function UnitOfMeasure(): ColDef {
  return {
    headerName: 'UOM',
    field: 'UnitOfMeasureName',
    hide: true,
  }
}

function AcceptedDate(): ColDef {
  return {
    headerName: 'Accepted Date',
    field: 'OrderAcceptedDateTime',
    valueFormatter: (params) => formatDateWithTimezone(params.data?.OrderAcceptedDateTime),
  }
}

function getStatus(status: string) {
  switch (status) {
    case 'Accepted':
      return (
        <BBDTag success style={{ textAlign: 'center' }}>
          Accepted
        </BBDTag>
      )
    case 'Filled':
      return (
        <BBDTag success style={{ textAlign: 'center' }}>
          Accepted
        </BBDTag>
      )
    case 'Canceled':
      return (
        <BBDTag error style={{ textAlign: 'center' }}>
          Canceled
        </BBDTag>
      )
    case 'Declined':
      return (
        <BBDTag error style={{ textAlign: 'center' }}>
          Declined
        </BBDTag>
      )
    default:
      return <BBDTag style={{ textAlign: 'center' }}> {status} </BBDTag>
  }
}
