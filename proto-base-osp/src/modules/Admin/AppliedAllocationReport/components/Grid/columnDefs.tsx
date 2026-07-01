import { dateFormat } from '@components/TheArmory/helpers'
import { ColDef } from 'ag-grid-community'
import moment from 'moment/moment'

export function columnDefs(): ColDef[] {
  return [
    OrderId(),
    TradeEntryDetailId(),
    OrderCreatedDateTime(),
    ProductName(),
    ToLocationName(),
    MarketPlatformInstrumentName(),
    Quantity(),
    TradeEntryFromDateTime(),
    TradeEntryToDateTime(),
    ExternalCounterPartyName(),
    OrderStatusCodeValueMeaning(),
    AllocationType(),
    AllocationAppliedProcessStatus(),
    AppliedStatusMessage(),
  ] as ColDef[]
}

function OrderId() {
  return {
    field: 'OrderId',
    headerName: 'Order ID',
  }
}

function TradeEntryDetailId() {
  return {
    field: 'TradeEntryDetailId',
    headerName: 'Detail ID',
  }
}

function OrderCreatedDateTime() {
  return {
    field: 'OrderCreatedDateTime',
    headerName: 'Created Date & Time',
    filter: 'agDateColumnFilter',
    valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.DATE_TIME) : value),
  }
}

function ProductName() {
  return {
    field: 'ProductName',
    headerName: 'Product',
  }
}

function ToLocationName() {
  return {
    field: 'ToLocationName',
    headerName: 'Location',
  }
}

function MarketPlatformInstrumentName() {
  return {
    field: 'MarketPlatformInstrumentName',
    headerName: 'Instrument Type',
  }
}

function Quantity() {
  return {
    field: 'Quantity',
    headerName: 'Quantity',
    filter: 'agNumberColumnFilter',
    valueFormatter: ({ value }) => fmt.integer(value, 0),
  }
}

function TradeEntryFromDateTime() {
  return {
    field: 'TradeEntryFromDateTime',
    headerName: 'Order From',
    filter: 'agDateColumnFilter',
    valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.DATE_TIME) : value),
  }
}

function TradeEntryToDateTime() {
  return {
    field: 'TradeEntryToDateTime',
    headerName: 'Order To',
    filter: 'agDateColumnFilter',
    valueFormatter: ({ value }) => (value ? moment(value).format(dateFormat.DATE_TIME) : value),
  }
}

function ExternalCounterPartyName() {
  return {
    field: 'ExternalCounterPartyName',
    headerName: 'Counterparty',
  }
}

function OrderStatusCodeValueMeaning() {
  return {
    field: 'OrderStatusCodeValueMeaning',
    headerName: 'Status',
  }
}

function AllocationType() {
  return {
    field: 'AllocationType',
    headerName: 'Allocation Type',
  }
}

function AllocationAppliedProcessStatus() {
  return {
    field: 'AllocationAppliedProcessStatus',
    headerName: 'Allocation Status',
  }
}

function AppliedStatusMessage() {
  return {
    field: 'AppliedStatusMessage',
    headerName: 'Allocation Message',
  }
}
