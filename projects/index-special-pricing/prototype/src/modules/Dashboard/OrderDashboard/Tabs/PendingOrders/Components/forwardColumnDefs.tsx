import { dateFormat } from '@components/TheArmory/helpers'
import { Texto } from '@gravitate-js/excalibrr'
import { typeFilterParams } from '@modules/Dashboard/Shared/ColumnDefs/columnUtil'
import {
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

export function getForwardColumnDefs(
  setSelectedOrderId: (id: number) => void,
  setIsInfoModalOpen: (open: boolean) => void
): ColDef[] {
  return [
    Details(setSelectedOrderId, setIsInfoModalOpen),
    TradeEntryId(),
    Instrument(),
    OrderOrigin(),
    PurchaseType(),
    Product(),
    Subtype(),
    LocationCol(),
    Quantity(),
    Price(),
    Currency(),
    UnitOfMeasure(),
    EffectiveFrom(),
    EffectiveTo(),
  ]
}

function PurchaseType(): ColDef {
  return {
    headerName: 'Purchase Type',
    field: 'IsBidOrOffer',
    filter: 'agTextColumnFilter',
    filterParams: typeFilterParams,
    valueFormatter: (params) => (params?.data?.IsBidOrOffer ? 'Bid' : 'Market'),
    cellRenderer: ({ value }) => (value ? <Texto>Bid</Texto> : <Texto>Market</Texto>),
  }
}

function Subtype(): ColDef {
  return {
    headerName: 'Subtype',
    field: 'ContractPricingMethodCodeValueMeaning',
  }
}

function Price(): ColDef {
  return {
    headerName: 'Price',
    field: 'Price',
    valueFormatter: ({ value }) => fmt.currency(value),
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
function EffectiveFrom(): ColDef {
  return {
    headerName: 'Effective From',
    field: 'FromDateTime',
    valueFormatter: (params) =>
      formatDateWithTimezone(params?.data?.FromDateTime, undefined, params?.data?.TimeZoneAlias),
  }
}

function EffectiveTo(): ColDef {
  return {
    headerName: 'Effective To',
    field: 'ToDateTime',
    valueFormatter: (params) =>
      formatDateWithTimezone(params?.data?.ToDateTime, undefined, params?.data?.TimeZoneAlias),
  }
}
