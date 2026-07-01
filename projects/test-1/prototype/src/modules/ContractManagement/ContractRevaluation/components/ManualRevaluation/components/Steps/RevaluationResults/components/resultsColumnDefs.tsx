import { ColDef } from 'ag-grid-community'
import moment from 'moment'

export function ResultsColumnDefs() {
  return [
    { headerName: 'Contract ID', field: 'TradeEntryId' },
    { headerName: 'Detail ID', field: 'TradeEntryDetailId' },
    { headerName: 'Counterparty', field: 'CounterPartyName' },
    { headerName: 'Product', field: 'ProductName' },
    { headerName: 'Origin Location', field: 'OriginLocationName' },
    {
      headerName: 'Pricing Period',
      field: 'PricingPeriodStart',
      cellRenderer: ({ data }) =>
        `${moment(data.PricingPeriodStart).format('MM/DD')} - ${moment(data.PricingPeriodEnd).format('MM/DD')}`,
      filter: 'agDateColumnFilter',
    },
  ] as ColDef[]
}
