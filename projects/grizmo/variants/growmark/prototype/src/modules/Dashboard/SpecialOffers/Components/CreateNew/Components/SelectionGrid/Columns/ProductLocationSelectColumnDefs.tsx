import { RadioCheckboxColumn } from '@components/shared/Grid/sharedColumnDefs/CheckboxColumn'
import { ColDef } from 'ag-grid-community'

export function ProductLocationSelectColumnDefs() {
  return [
    RadioCheckboxColumn('TradeEntrySetupId'),
    ProductColumn(),
    ProductGroup(),
    Location(),
    LocationGroup(),
  ] as ColDef[]
}

function ProductColumn(): ColDef {
  return {
    headerName: 'Product',
    field: 'ProductName',
  }
}
function ProductGroup(): ColDef {
  return {
    headerName: 'Product Group',
    field: 'ProductGroupName',
  }
}
function Location() {
  return {
    headerName: 'Location',
    field: 'LocationName',
  }
}
function LocationGroup(): ColDef {
  return {
    headerName: 'Location Group',
    field: 'LocationGroupName',
  }
}
