import { getColumnDefs } from '@modules/Analytics/PricePerformance/ByContract/components/getColumnDefs'
import { getSharedColumnDefs } from '@modules/Analytics/PricePerformance/components/Grid/getSharedColumnDefs'
import { mapRowsToData } from '@modules/Analytics/PricePerformance/components/Grid/gridHelpers'
import { PricePerformanceGrid } from '@modules/Analytics/PricePerformance/components/Grid/PricePerformanceGrid'
import { showRowSelectionError } from '@modules/Analytics/PricePerformance/components/Messages'
import React, { useCallback, useMemo } from 'react'

export function PricePerformanceByContractGrid({ gridAPIRef, data, isLoading, selectedRows, setSelectedRows }) {
  const storageKey = 'AnalyticsPricePerformanceByContractGrid'
  const selectRowsToShowGraphData = (e) => {
    const selectedNodes = e.api.getSelectedNodes().filter((node) => {
      if (node.group && (node.field === 'Location' || node.field === 'Product')) {
        node.setSelected(false)
      }
      return node
    })
    if (selectedNodes.length > 5) {
      deselectExtraNodesAndShowError(selectedNodes)
    }

    if (selectedNodes.length > 0 && selectedNodes.length <= 5) {
      mapRowsToData(selectedNodes, setSelectedRows, data, 'TradeEntryId')
    }

    if (selectedNodes.length === 0) {
      setSelectedRows([])
    }
  }

  function deselectExtraNodesAndShowError(selectedNodes) {
    const toBeDeselected = selectedNodes.filter((node) => {
      if (node.group) {
        return !selectedRows.find((row) => row.TradeEntryId == node.key)
      }
      return !selectedRows.find(
        (row) =>
          row.TradeEntryId === node.data.TradeEntryId &&
          row.ProductId === node.data.ProductId &&
          row.LocationId === node.data.LocationId
      )
    })
    if (toBeDeselected?.length) {
      toBeDeselected.forEach((node) => node.setSelected(false))
    }
    showRowSelectionError()
  }

  const getGroupRowData = useCallback(
    (params) => {
      if (params?.node?.field === 'TradeEntryId') {
        return data?.GridRows?.find((row) => `${row?.TradeEntryId ?? ''}` === params.node.key)
      }
      if (params?.node?.data) {
        return data?.GridRows?.find((row) => row?.TradeEntryId === params.node.data.TradeEntryId)
      }
      return null
    },
    [data]
  )

  const columnDefs = useMemo(() => {
    const customColumns = getColumnDefs(getGroupRowData)
    const sharedColumns = getSharedColumnDefs({ includeProfitTrend: false, getGroupRowData })
    return [...customColumns, ...sharedColumns]
  }, [data?.GridRows, getGroupRowData])

  const getRowId = useCallback(
    (row) =>
      row.data?.LocationId || row.data?.ProductId
        ? `${row.data.LocationId} - ${row.data.ProductId} - ${row.data.TradeEntryId}`
        : row.data.TradeEntryId,
    [data]
  )

  const rowData = useMemo(
    () => data?.ContractPricePerformanceWithPriceLocation?.GridRows || [],
    [data?.ContractPricePerformanceWithPriceLocation?.GridRows]
  )

  return (
    <PricePerformanceGrid
      gridAPIRef={gridAPIRef}
      storageKey={storageKey}
      gridData={rowData}
      loading={isLoading}
      columnDefs={columnDefs}
      getRowId={getRowId}
      onRowSelected={selectRowsToShowGraphData}
      groupDisplayType='multipleColumns'
    />
  )
}
