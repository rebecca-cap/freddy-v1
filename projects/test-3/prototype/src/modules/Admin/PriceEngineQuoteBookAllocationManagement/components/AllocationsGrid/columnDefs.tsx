import { addCommasToNumber, BBDTag } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import React from 'react'

export function getColumnDefs() {
  return [
    { headerName: 'Id', field: 'AllocationId' },
    {
      headerName: 'Name',
      field: 'AllocationName',
    },
    {
      headerName: 'Consignee',
      field: 'AllocationConsignee',
    },

    {
      headerName: 'Terminal',
      field: 'AllocationTerminal',
    },
    {
      headerName: 'Product',
      field: 'AllocationProduct',
    },
    {
      headerName: 'Is Linked',
      field: 'AllocationMappings',
      filterValueGetter: ({ data }) => {
        return data.AllocationMappings?.length > 0 ? 'Linked' : 'Not Linked'
      },
      filter: 'agSetColumnFilter',
      cellRenderer: (params) => {
        if (!params.data.AllocationMappings?.length) return ''
        return (
          <BBDTag style={{ width: 'fit-content' }}>
            Linked ({addCommasToNumber(params.data.AllocationMappings?.length)} items)
          </BBDTag>
        )
      },
    },
  ] as ColDef[]
}
