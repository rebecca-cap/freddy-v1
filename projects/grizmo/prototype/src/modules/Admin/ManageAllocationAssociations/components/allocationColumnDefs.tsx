import { Texto } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'

export const createAllocationColumnDefs = () => {
  return [
    {
      field: 'AllocationId',
      headerName: 'ID',
      flex: 1,
      maxWidth: 70,
    },
    {
      field: 'AllocationConsigneeName',
      headerName: 'Consignee',
      flex: 1,
    },
    {
      field: 'AllocationTerminalName',
      headerName: 'Terminal',
      flex: 1,
    },
    {
      field: 'AllocationProductName',
      headerName: 'Product Group / Family',
      flex: 1,
    },
    {
      field: 'MappedCount',
      headerName: 'Mapped Count',
      cellRenderer: (params) => {
        const mappedCount = params.data.MappedCount
        return !mappedCount ? <Texto>None</Texto> : <Texto>{mappedCount}</Texto>
      },
      flex: 1,
    },
  ] as ColDef[]
}
