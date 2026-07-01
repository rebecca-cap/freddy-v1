import '../../../../../styles.css'

import { ESTIMATED_ROW_BG } from '@constants/colors'
import { GraviGrid, Vertical } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { type CompetitorPricingRecord } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/CompetitorPricesView/api/schema.types'
import { selectedQuoteRowDistinctColor } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/CompetitorPricesView/components/util'
import { GridApi } from 'ag-grid-community'
import React, { MutableRefObject, useCallback, useEffect, useMemo } from 'react'

import { columnDefs } from './columnDefs'

interface PricingTableData extends CompetitorPricingRecord {
  shade?: string
}
interface PricingTableProps {
  pricingData: PricingTableData[] | []
  selectedItem?: string
  selectedRow: Quote
  gridAPIRef: MutableRefObject<GridApi<any>>
  storageKey: string
  useOpisPrices: boolean | undefined
}

export function PricingGrid({
  pricingData,
  selectedItem,
  selectedRow,
  gridAPIRef,
  storageKey,
  useOpisPrices,
}: PricingTableProps) {
  const getRowId = useCallback((row) => row.data?.PriceInstrumentId?.toString(), [])
  const getRowStyleForSelectedQuoteRow = useCallback((params) => {
    if (params.node.data.IsSelectedRow) {
      return { background: selectedQuoteRowDistinctColor, color: 'white' }
    }
    if (params.node.data.IsHighlighted) {
      return { background: ESTIMATED_ROW_BG }
    }
    return undefined
  }, [])
  const gridViewManager = useGridViewManager(storageKey)
  const agPropOverrides = useMemo(
    () => ({
      getRowId,
      getRowStyle: getRowStyleForSelectedQuoteRow,
      suppressDragLeaveHidesColumns: true,
      rowGroupPanelShow: 'onlyWhenGrouping' as const,
      autoSizeStrategy: { type: 'fitGridWidth', skipHeader: true },
      skipHeaderOnAutoSize: true,
      groupDefaultExpanded: -1,
      rowHeight: 30,
    }),
    []
  )
  function captureSelectedItemChangesAndHighlightCorrespondingRow() {
    if (gridAPIRef.current) {
      if (selectedItem) {
        gridAPIRef.current.deselectAll()
        const id =
          pricingData
            .find((item) => item.PriceInstrumentId?.toString() === selectedItem)
            ?.PriceInstrumentId?.toString() || ''
        const node = gridAPIRef.current.getRowNode(id)
        node?.setSelected(true)
        gridAPIRef.current.ensureNodeVisible(node, 'middle')
      } else {
        gridAPIRef.current.deselectAll()
      }
    }
  }
  useEffect(() => {
    captureSelectedItemChangesAndHighlightCorrespondingRow()
  }, [selectedItem, gridAPIRef.current])

  const categories = useMemo(() => {
    if (!pricingData?.length) return null
    if (pricingData.length === 1) return []

    const uniqueCategories = new Map()
    pricingData.forEach((item) => {
      if (!item.IsSelectedRow && !uniqueCategories.has(item.CategoryId)) {
        uniqueCategories.set(item.CategoryId, item)
      }
    })
    return Array.from(uniqueCategories.values())
  }, [pricingData])

  const getColumnDefs = useMemo(
    () => (categories ? columnDefs(categories, selectedRow, useOpisPrices) : []),
    [categories, selectedRow, useOpisPrices]
  )
  const focusSelectedRow = useCallback(
    (api: GridApi<any>) => {
      const id = pricingData.find((item) => item.IsSelectedRow)?.PriceInstrumentId?.toString() || ''
      const node = api.getRowNode(id)
      if (node) {
        api.ensureNodeVisible(node, 'middle')
      }
    },
    [selectedRow]
  )
  return (
    <Vertical flex={1} scroll style={{ height: '100%' }}>
      <GraviGrid
        enableFilterContextMenu
        externalRef={gridAPIRef}
        headerHeight={25}
        columnDefs={getColumnDefs}
        rowData={pricingData}
        agPropOverrides={agPropOverrides}
        storageKey={storageKey}
        className='quotebook-grid'
        gridViewManager={gridViewManager}
        onFirstDataRendered={(params) => {
          focusSelectedRow(params.api)
        }}
        onRowDataUpdated={(params) => {
          focusSelectedRow(params.api)
        }}
      />
    </Vertical>
  )
}
