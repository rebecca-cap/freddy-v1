import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'

export const allocationLocationColumnDefs = ({ metadata, canWrite }) => [
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
    field: 'LocationId',
    headerName: 'Location',
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    editable: canWrite,
    filter: true,
    minWidth: 500,
    flex: 2,
    cellEditorParams: {
      placeholder: 'Select Counterparty',
      options: metadata?.Locations?.map((option) => ({
        value: option.Value,
        label: option.Text,
      })),
      showSearch: true,
      allowClear: true,
    },
    valueGetter: (params) =>
      metadata?.Locations?.find((option) => option.Value?.toString() === params?.data?.LocationId?.toString())?.Text ||
      'None',
  },
]
