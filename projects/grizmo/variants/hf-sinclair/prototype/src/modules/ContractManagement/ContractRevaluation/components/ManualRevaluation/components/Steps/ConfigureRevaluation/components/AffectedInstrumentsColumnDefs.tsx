import { ColDef } from 'ag-grid-community'

export function AffectedInstrumentsColumnDefs(): ColDef[] {
  return [
    {
      headerName: '',
      field: 'Value',
      maxWidth: 120,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      pinned: 'left',
      sortable: false,
      filter: 'agSetColumnFilter',
      filterParams: {
        values: ['Selected', 'Unselected'],
      },
      valueGetter: (params) => (params.node?.isSelected() ? 'Selected' : 'Unselected'),
      filterValueGetter: (params) => (params.node?.isSelected() ? 'Selected' : 'Unselected'),
    },
    { headerName: 'Id', field: 'Value', maxWidth: 100 },
    { headerName: 'Instrument Name', field: 'Text' },
    { headerName: 'Product', field: 'ProductName' },
    { headerName: 'Location', field: 'LocationName' },
    { headerName: 'Counterparty', field: 'CounterPartyName' },
    { headerName: 'Symbol', field: 'ExchangeSymbol' },
  ] as ColDef[]
}
