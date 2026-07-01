import { GraviGrid, Vertical } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { useQuoteAnalyticsAllocationTyped } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/AllocationGrid/Api/useQuoteAnalyticsAllocationTyped'
import { transposedColumnDefs } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/AllocationGrid/Components/transposedColumnDefs'
import {
  applySavedOrder,
  onRowDragMove,
} from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/AllocationGrid/utils'
import {
  Loading,
  NoData,
} from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/common/messageAskingUserToSelectAQuoteRow'
import { periods } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/SideBySideView/components/util'
import { isDefinedAndNotNull } from '@utils/index'
import { GridApi, RowDragEndEvent } from 'ag-grid-community'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { columnDefs } from './Components/columnDefs'

interface AllocationGridProps {
  quoteRowId: number
  isTransposed: boolean
  storageKey: string
  gridAPIRef: React.MutableRefObject<GridApi>
}

export function AllocationGrid({ quoteRowId, isTransposed, storageKey, gridAPIRef }: AllocationGridProps) {
  const { getAllocationDataQuery } = useQuoteAnalyticsAllocationTyped()
  const { data: allocationData, isLoading } = getAllocationDataQuery(quoteRowId)
  const getRowId = useCallback((row) => row.data?.AllocationId, [])

  const agPropOverrides = useMemo(
    () => ({
      getRowId,
      rowGroupPanelShow: 'onlyWhenGrouping' as const,
      autoSizeStrategy: { type: 'fitGridWidth', skipHeader: true },
      skipHeaderOnAutoSize: true,
      groupDefaultExpanded: -1,
      rowHeight: 30,
      headerHeight: 25,
      rowDragEntireRow: true,
      isRowDragable: (params) => !params.node.group,
      groupSuppressAutoColumn: true,
      suppressCellSelection: true,
    }),
    [getRowId]
  )

  const transposedData = useMemo(() => {
    if (!isDefinedAndNotNull(allocationData?.Rows)) return []

    const result: any[] = []
    periods.forEach((period) => {
      period.metrics.forEach((metric) => {
        const row: any = {
          ColumnGroup: period.name,
          AllocationId: `${period.name}-${metric}`,
          MetricName: metric,
        }

        allocationData?.Rows?.forEach((allocation) => {
          if (!allocation) return
          const allocationName = allocation.AllocationName
          const periodData = allocation[period.name as keyof typeof allocation]

          if (allocationName) {
            row[allocationName] = periodData ? periodData[metric as keyof typeof periodData] : ''
          }
        })

        result.push(row)
      })
    })
    return result
  }, [allocationData])

  const transposedColDefs = useMemo(() => {
    const allocationNames = allocationData?.Rows?.map((item) => item.AllocationName || '')
    return transposedColumnDefs(isTransposed, allocationNames)
  }, [allocationData])

  const getColumnDefs = useMemo(
    () => (isTransposed ? transposedColDefs : columnDefs()),
    [transposedColDefs, isTransposed]
  )
  const [orderedData, setOrderedData] = useState(transposedData)

  const rowData = useMemo(
    () => (isTransposed ? orderedData : allocationData?.Rows || []),
    [isTransposed, orderedData, allocationData]
  )

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}')
    if (!Object.keys(saved).length) {
      setOrderedData(transposedData)
      return
    }
    const ordered = applySavedOrder(transposedData, saved, 'ColumnGroup')
    setOrderedData(saved ? ordered : transposedData)
  }, [transposedData])

  const gridViewManager = useGridViewManager(storageKey)

  const handleRowDrag = useCallback(
    (event: RowDragEndEvent) => {
      onRowDragMove(event, orderedData, setOrderedData, storageKey)
    },
    [orderedData]
  )

  if (isLoading) return <Loading />
  if (!allocationData) return <NoData />

  return (
    <Vertical flex={1} scroll style={{ height: '100%', minHeight: '250px' }}>
      <GraviGrid
        enableFilterContextMenu
        externalRef={gridAPIRef}
        columnDefs={getColumnDefs}
        rowData={rowData}
        agPropOverrides={agPropOverrides}
        gridViewManager={gridViewManager}
        storageKey={storageKey}
        enableRangeSelection={false}
        // @ts-expect-error onRowDragMove is passed through to AG Grid but not typed on GraviGrid
        onRowDragMove={handleRowDrag}
      />
    </Vertical>
  )
}
