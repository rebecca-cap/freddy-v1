import { Radio } from 'antd'
import React from 'react'

export const getColumnDefs = () => {
  return [
    {
      maxWidth: 50,
      editable: true,
      cellRenderer: (params) => {
        return <Radio checked={params.node.selected} />
      },
      filter: false,
      pinned: 'left',
    },
    {
      headerName: 'Quote Config Id',
      field: 'QuoteConfigurationId',
      editable: false,
    },
    {
      headerName: 'Trade Entry Id',
      field: 'CostSourceTradeEntryId',
      editable: false,
    },

    {
      field: 'LocationName',
      tooltipField: 'LocationName',
    },
    {
      field: 'ProductName',
    },
    {
      field: 'QuoteConfigurationName',
    },
  ]
}
