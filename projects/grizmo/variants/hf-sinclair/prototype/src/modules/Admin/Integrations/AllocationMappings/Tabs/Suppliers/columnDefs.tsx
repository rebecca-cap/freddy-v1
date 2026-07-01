import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'

export const allocationSuppliersColumnDefs = ({ metadata, canWrite }) => [
  {
    editable: false,
    field: 'SourceValue',
  },
  {
    editable: false,
    field: 'SourceDisplay',
    headerName: 'Display',
  },
  {
    field: 'CounterPartyId',
    headerName: 'Counterparty',
    editable: canWrite,
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    filter: true,
    minWidth: 500,
    flex: 2,
    cellEditorParams: {
      placeholder: 'Select Counterparty',
      options: metadata?.CounterParties?.map((option) => ({
        value: option.Value,
        label: option.Text,
      })),
      showSearch: true,
      allowClear: true,
    },
    valueGetter: (params) =>
      metadata?.CounterParties?.find((option) => option.Value?.toString() === params?.data?.CounterPartyId?.toString())
        ?.Text || 'None',
  },
]
