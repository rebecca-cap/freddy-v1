import './grid-overrides.css'

import { MarketPlatformFormulaAffectedSetupsResponse } from '@api/useMarketPlatformFormulas/types'
import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { GridApi } from 'ag-grid-community'
import React, { useMemo } from 'react'

export interface MarketPlatformSetup {
  TradeEntrySetupId: number
  ProductName: string
  LocationName: string
  MarketName: string
  ProductGroup: string
  MarketPlatformInstrumentId: number
}
interface IProps {
  gridRef: React.RefObject<GridApi | null>
  affectedSetups: MarketPlatformFormulaAffectedSetupsResponse | undefined
  isAffectedSetupRowsLoading: boolean
  onSelectMarketPlatformSetupRow?: (_selectedRow: MarketPlatformSetup) => void
}

const getColumnDefs = () => [
  {
    headerName: 'Product',
    field: 'ProductName',
    autoHeight: true,
    getQuickFilterText: (params) => `${params?.data?.ProductGroup || ''} ${params?.data?.ProductName || ''}`,
    cellRenderer: (params) => {
      return (
        <Vertical>
          <Texto>{params?.data?.ProductName}</Texto>
        </Vertical>
      )
    },
  },
  {
    headerName: 'Location',
    field: 'LocationName',
    autoHeight: true,
    getQuickFilterText: (params) => `${params?.data?.LocationName || ''} ${params?.data?.MarketName || ''}`,
    cellRenderer: (params) => {
      return (
        <Vertical>
          <Texto>{params?.data?.LocationName}</Texto>
        </Vertical>
      )
    },
  },
]

export const AffectedSetupsTab: React.FC<IProps> = ({
  gridRef,
  affectedSetups,
  isAffectedSetupRowsLoading,
  onSelectMarketPlatformSetupRow = (_selectedRow) => {},
}) => {
  const rowData = useMemo(() => affectedSetups?.Data ?? [], [affectedSetups?.Data])
  const columnDefs = useMemo(() => getColumnDefs(), [])

  const handleChangeSetupGridSelection = ({ api }) => {
    const selectedRows = api.getSelectedRows()
    const firstSelectedRow = selectedRows.length ? selectedRows[0] : null
    onSelectMarketPlatformSetupRow(firstSelectedRow)
  }

  return (
    <div style={{ minHeight: '90vh', height: 0 }} id='affectedSetupsWrapper'>
      <Horizontal className='p-1 text-size-3 justify-center text-medium'>
        Select a formula to see its current value
      </Horizontal>
      <GraviGrid
        externalRef={gridRef}
        suppressDragLeaveHidesColumns
        // controlBarProps={{}} // needed to show quick search bar
        agPropOverrides={{
          columnDefs,
          getRowId: (row) => row.data?.TradeEntrySetupId,
          rowGroupPanelShow: 'never',
          rowHeight: 30,
        }}
        showColumnsToolbar={false}
        rowData={rowData}
        rowSelection='single'
        onSelectionChanged={handleChangeSetupGridSelection}
        loading={isAffectedSetupRowsLoading || !rowData || typeof rowData === 'undefined' || rowData === null}
        headerHeight={35}
      />
    </div>
  )
}
