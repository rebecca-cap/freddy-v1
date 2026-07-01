import { CheckboxColumnWithFilter } from '@components/shared/Grid/sharedColumnDefs/CheckboxColumn'
import { GroupCell } from '@components/shared/Grid/sharedColumnDefs/GroupCell'
import { ColDef } from 'ag-grid-community'

export function SelectContractDetailColumnDefs(metadata): ColDef[] {
  return [
    CheckboxColumnWithFilter('TradeEntryId'),
    GroupCell(),
    { headerName: 'Contract ID', field: 'TradeEntryId' },
    { headerName: 'Detail ID', field: 'TradeEntryDetailId' },
    { headerName: 'Counterparty', field: 'CounterPartyName' },
    { headerName: 'Product', field: 'ProductName' },
    { headerName: 'Location', field: 'OriginLocationName' },
    { headerName: 'Instrument', field: 'TradeInstrumentName' },
    {
      headerName: 'Calendar',
      field: 'ValuationCalendarId',
      hide: true,
      valueGetter: ({ data }) => {
        return (
          metadata?.PricingCalendars?.find((calendar) => calendar.Value === data?.ValuationCalendarId?.toString())
            ?.Text || ''
        )
      },
    },
  ]
}
