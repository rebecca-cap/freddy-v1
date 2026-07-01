import { ColDef } from 'ag-grid-community'
import moment from 'moment'

type PriceStatusFlag = 'O' | 'M' | 'A' | 'E'

export const getContractDetailColumnDefs = () =>
  [
    {
      field: 'FromLocationName',
      headerName: 'From',
    },
    {
      field: 'ToLocationName',
      headerName: 'To',
    },
    {
      field: 'ProductName',
      headerName: 'Product',
    },
    {
      field: 'Quantity',
      headerName: 'Volume',
    },
    {
      field: 'FromDateTime',
      headerName: 'Contract From',
      valueFormatter: ({ value }) => moment(value).format('MM/DD/YYYY, h:mm A'),
      filter: 'agDateColumnFilter',
    },
    {
      field: 'ToDateTime',
      headerName: 'Contract To',
      valueFormatter: ({ value }) => moment(value).format('MM/DD/YYYY, h:mm A'),
      filter: 'agDateColumnFilter',
    },
    {
      field: 'EffectiveFromDate',
      headerName: 'As Of Date',
      valueFormatter: ({ value }) => moment(value).format('MM/DD/YYYY, h:mm A'),
      filter: 'agDateColumnFilter',
    },
    {
      field: 'Price',
      headerName: 'Recent Price',
      valueFormatter: fmt.currency,
      cellStyle: { textAlign: 'right' },
    },
    {
      field: 'PriceStatusDisplay',
      headerName: 'Recent Status',
      cellStyle: (params) => {
        switch (params.data?.PriceStatus as PriceStatusFlag) {
          case 'M':
            return { backgroundColor: 'var(--theme-error-trans)' }
          case 'O':
            return { backgroundColor: 'var(--theme-optimal-dim)' }
          case 'A':
            return { backgroundColor: 'var(--theme-success-dim)' }
          case 'E':
            return { backgroundColor: 'var(--theme-color-1-dim)' }
          default:
            return {}
        }
      },
    },
    { headerName: 'Contract Detail ID', colId: 'ContractDetailId', field: 'TradeEntryDetailId', hide: true },
  ] as ColDef[]
