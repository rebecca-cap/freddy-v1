import { Texto } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import React from 'react'

import { SiteIdInput } from './SiteIdInput'

interface ColumnDefProps {
  canWrite: boolean
}

export const getColumnDefs = ({ canWrite }: ColumnDefProps): ColDef[] => {
  const defs = [counterpartyColumn(), siteIdColumn(canWrite)]

  return defs as ColDef[]
}

function counterpartyColumn() {
  return {
    headerName: 'Counterparty',
    field: 'CounterPartyName',
    editable: false,
    cellRenderer: (params) => {
      return <Texto category='p2'>{params.value}</Texto>
    },
    comparator: (valueA, valueB) => {
      return (valueA || '').toLowerCase().localeCompare((valueB || '').toLowerCase())
    },
  }
}

function siteIdColumn(canWrite: boolean) {
  return {
    headerName: 'Site ID',
    field: 'SiteIds',
    suppressKeyboardEvent: () => true,
    suppressClickEdit: true,
    autoHeight: true,
    cellRenderer: (params) => <SiteIdInput initialIds={params.value} readOnly={!canWrite} row={params.data} />,
  }
}
