import { EllipsisOutlined } from '@ant-design/icons'
import { GraviButton, GraviGrid, Horizontal } from '@gravitate-js/excalibrr'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import React, { useEffect } from 'react'

import { dateFormat } from '../../../components/TheArmory/helpers'
import { useContracts } from '../../ContractManagement/api/useContracts'

export function Contracts() {
  const { getContracts } = useContracts()
  const { data, isLoading } = useQuery([getContracts.name], getContracts)

  return (
    <GraviGrid
      controlBarProps={{
        title: 'Contracts',
      }}
      storageKey='contracts'
      agPropOverrides={{
        columnDefs,
        getRowId: (row) => row.data?.TradeId,
        components: { actionButtons: ActionButtons },
      }}
      rowData={data?.Data}
      loading={isLoading}
    />
  )
}

const columnDefs = [
  {
    headerName: 'Contract #',
    field: 'InternalContractNumber',
    minWidth: 160,
  },
  {
    headerName: 'Deal Date',
    field: 'ProductName',
  },

  {
    headerName: 'Type',
    field: 'TradeTypeCodeValue.Display',
  },
  {
    headerName: 'From',
    field: 'EffectiveFromDateTime',
    valueFormatter: (params) => moment(params.data.EffectiveFromDateTime).format(dateFormat.DATE),
  },
  {
    headerName: 'To',
    field: 'EffectiveToDateTime',
    valueFormatter: (params) => moment(params.data.EffectiveFromDateTime).format(dateFormat.DATE),
  },
  {
    headerName: 'External Contact',
    field: 'InternalColleague.FirstName',
    valueGetter: (params) => `${params.data.ExternalColleague.FirstName} ${params.data.ExternalColleague.LastName}`,
  },
  {
    headerName: 'Internal Contact',
    field: 'InternalColleague.FirstName',
    valueGetter: (params) => `${params.data.InternalColleague.FirstName} ${params.data.InternalColleague.LastName}`,
  },
  {
    headerName: 'Quantity.',
    field: 'VTrade.ContractQuantity',
  },
  {
    headerName: 'Moved',
    field: 'VTrade.LiftedQuantity',
  },
  {
    headerName: 'Remaining',
    field: 'VTrade.LiftedQuantity',
    valueGetter: (params) => params.data.VTrade.ContractQuantity - params.data.VTrade.LiftedQuantity,
  },
  {
    headerName: 'UOM',
    field: 'VTrade.ContractUoM',
  },
  {
    headerName: 'Last Lifting',
    field: 'ProductName',
  },

  {
    headerName: '',
    cellRenderer: 'actionButtons',
  },
]

function ActionButtons() {
  return (
    <Horizontal fullHeight horizontalCenter verticalCenter>
      <GraviButton icon={<EllipsisOutlined />} />
    </Horizontal>
  )
}
