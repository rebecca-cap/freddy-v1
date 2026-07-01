import { CheckboxColumn } from '@components/shared/Grid/sharedColumnDefs/CheckboxColumn'
import { ColDef } from 'ag-grid-community'

export function CustomerSelectColumnDefs() {
  return [CheckboxColumn('Value'), NameColumn()] as ColDef[]
}
function NameColumn(): ColDef {
  return {
    headerName: 'Counterparty',
    field: 'Text',
  }
}
