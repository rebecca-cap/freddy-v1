import { ColDef } from 'ag-grid-community'
import { Radio } from 'antd'

const commonProps = {
  headerName: '',
  pinned: 'left' as const,
  filter: 'agSetColumnFilter',
  filterParams: {
    values: ['Selected', 'Unselected'],
  },
  valueGetter: (params) => (params.node?.isSelected() ? 'Selected' : 'Unselected'),
  filterValueGetter: (params) => (params.node?.isSelected() ? 'Selected' : 'Unselected'),
  sortable: false,
}

export function CheckboxColumn(field = 'checkbox'): ColDef {
  return {
    field,
    maxWidth: 50,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    ...commonProps,
  }
}
export function CheckboxColumnWithFilter(field = 'checkbox'): ColDef {
  return {
    field,
    maxWidth: 120,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    ...commonProps,
  }
}

export function RadioCheckboxColumn(field = 'checkbox'): ColDef {
  return {
    field,
    maxWidth: 35,
    ...commonProps,
    cellRenderer: (params) => {
      const isSelected = params.node?.isSelected()
      return (
        <Radio
          checked={isSelected}
          onClick={() => {
            params.node?.setSelected(!isSelected)
          }}
        />
      )
    },
  }
}
