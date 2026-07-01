import { dateFormat } from '@components/TheArmory/helpers'
import { Texto } from '@gravitate-js/excalibrr'
import { showPriceProvisionStatus } from '@modules/ContractManagement/components/DetailManager/PriceManagement/priceColDefs'
import { ValueCellRenderer } from '@modules/ContractManagement/components/DetailsSection/AllDetailsGrid/components/cellRenderers/ValueCellRenderer'
import { ColDef } from 'ag-grid-community'
import moment from 'moment/moment'
import React from 'react'

export function AllDetailsGridMasterDetailColumnDefs({ detailId }) {
  return [
    groupCell(),
    status(),
    formulaName(),
    type(),
    fromDate(),
    toDate(),
    currency(),
    uom(),
    payReceive(),
    valueCell(detailId),
  ] as ColDef[]
}

function groupCell() {
  return {
    headerName: '',
    cellRenderer: 'agGroupCellRenderer',
    maxWidth: 60,
    colId: 'group-column-inner',
  }
}

function status() {
  return {
    headerName: '',
    cellRenderer: showPriceProvisionStatus,
    field: 'Status',
    maxWidth: 40,
  }
}

function formulaName() {
  return {
    headerName: 'Name',
    field: 'Formula.Name',
    valueGetter: ({ data }) => data.Formula?.Name || data.Formula?.Formula,
    cellRenderer: ({ value }) => <Texto className='text-truncate'>{value}</Texto>,
  }
}

function type() {
  return {
    headerName: 'Type',
    field: 'ProvisionType',
  }
}
function fromDate() {
  return {
    headerName: 'Effective From',
    valueFormatter: ({ value }) => moment(value).format(dateFormat.DATE_SLASH),
    filter: 'agDateColumnFilter',
    field: 'FromDate',
  }
}
function toDate() {
  return {
    headerName: 'Effective To',
    valueFormatter: ({ value }) => moment(value).format(dateFormat.DATE_SLASH),
    filter: 'agDateColumnFilter',
    field: 'ToDate',
  }
}
function payReceive() {
  return {
    headerName: 'Pay/Receive',
    field: 'PayOrReceiveCodeValueDisplay',
  }
}

function currency() {
  return {
    headerName: 'Currency',
    field: 'CurrencyName',
  }
}
function uom() {
  return {
    headerName: 'UOM',
    field: 'UnitOfMeasureName',
  }
}
function valueCell(detailId?: number) {
  return {
    headerName: 'Value',
    field: 'FixedValue',
    cellRenderer: ({ data }) => ValueCellRenderer({ detailId, data }),
  }
}
