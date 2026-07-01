import '../../../../../styles.css'

import { GraviGrid, useLocalStorage } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { QuoteHistoryResponse } from '@modules/PricingEngine/QuoteBook/components/Drawers/HistoryDrawer/api/schema.types'
import { ActionButtons } from '@modules/PricingEngine/QuoteBook/components/Drawers/HistoryDrawer/components/Grid/ActionButtons'
import { getColumnDefs } from '@modules/PricingEngine/QuoteBook/components/Drawers/HistoryDrawer/components/Grid/columnDefs'
import { GridApi } from 'ag-grid-community'
import React, { useMemo, useRef, useState } from 'react'

interface QuoteBookHistoryDrawerProps {
  history?: QuoteHistoryResponse
  metadata?: any
  quoteHistoryHeaderInfo?: Quote
  isFetchingHistory: boolean
}
export function QuoteHistoryGrid({
  quoteHistoryHeaderInfo,
  history,
  metadata,
  isFetchingHistory,
}: QuoteBookHistoryDrawerProps) {
  const gridAPIRef = useRef<GridApi<any> | undefined>()
  const [isLoadingDownload, setIsLoadingDownload] = useState(false)
  const { value: showFullBenchmarkPrice, setValue: setShowFullBenchmarkPrice } = useLocalStorage(
    'QuoteHistoryShowBenchmarkPrice',
    false as boolean
  )
  const columnDefs = useMemo(() => getColumnDefs(showFullBenchmarkPrice, metadata), [showFullBenchmarkPrice, metadata])

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data.StartDate,
      rowHeight: 30,
    }),
    []
  )
  const controlBarProps = useMemo(() => {
    const fileName = `${quoteHistoryHeaderInfo?.LocationName ?? ''}-${quoteHistoryHeaderInfo?.ProductName ?? ''}-${
      quoteHistoryHeaderInfo?.SupplierCounterPartyName ?? ''
    }`
    return {
      actionButtons: (
        <ActionButtons
          showFullBenchmarkPrice={showFullBenchmarkPrice}
          setShowFullBenchmarkPrice={setShowFullBenchmarkPrice}
          gridAPIRef={gridAPIRef}
          fileName={fileName}
          isLoadingDownload={isLoadingDownload}
          setIsLoadingDownload={setIsLoadingDownload}
        />
      ),
    }
  }, [quoteHistoryHeaderInfo])

  return (
    <GraviGrid
      externalRef={gridAPIRef}
      rowData={history?.Data?.Rows || []}
      columnDefs={columnDefs}
      agPropOverrides={agPropOverrides}
      controlBarProps={controlBarProps}
      sideBar={false}
      rowGroupPanelShow='never'
      headerHeight={25}
      loading={isFetchingHistory}
      className='quotebook-history-grid'
    />
  )
}
