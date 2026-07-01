import './grid-overrides.css'

import { IAffectedQuoteRowsResponse } from '@api/usePriceEngineFormulas/types'
import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { GridApi } from 'ag-grid-community'
import React, { useMemo } from 'react'

export interface QuoteRow {
  QuoteConfigurationMappingId: number
  ProductName: string
  LocationName: string
  CounterPartyName: string
  QuoteConfigurationName: string
  QuoteConfigurationId: number
  MarketName: string
  ProductGroup: string
}
interface IProps {
  gridRef: React.RefObject<GridApi | null>
  affectedQuoteRows: IAffectedQuoteRowsResponse
  isAffectedQuoteRowsLoading: boolean
  onSelectQuoteRow?: (_selectedRow: QuoteRow) => void
}

const getColumnDefs = () => [
  {
    autoHeight: true,
    headerName: 'Product',
    field: 'ProductName',
    getQuickFilterText: (params) => `${params?.data?.ProductGroup || ''} ${params?.data?.ProductName || ''}`,
    cellRenderer: (params) => {
      return (
        <Vertical>
          <Texto weight='bold'>{params?.data?.ProductName}</Texto>
          <Texto>{params?.data?.ProductGroup || ''}</Texto>
        </Vertical>
      )
    },
  },
  {
    autoHeight: true,
    headerName: 'Location',
    field: 'LocationName',
    getQuickFilterText: (params) => `${params?.data?.LocationName || ''} ${params?.data?.MarketName || ''}`,
    cellRenderer: (params) => {
      return (
        <Vertical>
          <Texto weight='bold'>{params?.data?.LocationName}</Texto>
          <Texto>{params?.data?.MarketName || ''}</Texto>
        </Vertical>
      )
    },
  },
  {
    autoHeight: true,
    headerName: 'Counterparty',
    field: 'CounterPartyName',
    getQuickFilterText: (params) => `${params?.data?.CounterPartyName || ''}`,
    cellRenderer: (params) => {
      return (
        <Vertical>
          <Texto weight='bold'>{params?.data?.CounterPartyName}</Texto>
        </Vertical>
      )
    },
  },
]

export const AffectedQuotesTab: React.FC<IProps> = ({
  gridRef,
  affectedQuoteRows,
  isAffectedQuoteRowsLoading,
  onSelectQuoteRow = (_selectedRow) => {},
}) => {
  const rowData = useMemo(() => affectedQuoteRows?.Data ?? [], [affectedQuoteRows?.Data])
  const columnDefs = useMemo(() => getColumnDefs(), [])

  const handleChangeQuoteGridSelection = ({ api }) => {
    const selectedRows = api.getSelectedRows()
    const firstSelectedRow = selectedRows.length ? selectedRows[0] : null
    onSelectQuoteRow(firstSelectedRow)
  }

  return (
    <div style={{ minHeight: '90vh', height: 0 }} id='affectedQuotesWrapper'>
      <Horizontal className='p-1 text-size-3 justify-center text-medium'>
        Select a quote to see its current value
      </Horizontal>
      <GraviGrid
        externalRef={gridRef}
        suppressDragLeaveHidesColumns
        controlBarProps={{}} // needed to show quick search bar
        agPropOverrides={{
          columnDefs,
          getRowId: (row) => row.data?.QuoteConfigurationMappingId,
          rowGroupPanelShow: 'never',
        }}
        showColumnsToolbar={false}
        rowData={rowData}
        rowSelection='single'
        onSelectionChanged={handleChangeQuoteGridSelection}
        loading={isAffectedQuoteRowsLoading || !rowData || typeof rowData === 'undefined' || rowData === null}
      />
    </div>
  )
}
