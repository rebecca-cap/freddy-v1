import { ColDef } from 'ag-grid-community'

export function colDefs() {
  return [
    {
      headerName: 'Calendar ID',
      field: 'Value',
    },
    {
      headerName: 'Calendar Name',
      field: 'Text',
    },
  ] as ColDef[]
}
