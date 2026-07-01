import { getSharedColumnDefs } from '@modules/Analytics/PricePerformance/components/Grid/getSharedColumnDefs'
import { mapRowsToData } from '@modules/Analytics/PricePerformance/components/Grid/gridHelpers'
import React, { useCallback, useMemo } from 'react'

import { PricePerformanceGrid } from '../../components/Grid/PricePerformanceGrid'
import { showRowSelectionError } from '../../components/Messages'
import { getColumnDefs } from './getColumnDefs'

export function PricePerformanceByChannelGrid({ gridAPIRef, data, isLoading, selectedRows, setSelectedRows }) {
  const storageKey = 'AnalyticsPricePerformanceByChannelGrid'

  const selectRowsToShowGraphData = (e) => {
    const selectedNodes = e.api.getSelectedNodes()

    if (selectedNodes.length > 5) {
      deselectExtraNodesAndShowError(selectedNodes)
    }
    if (selectedNodes.length > 0 && selectedNodes.length <= 5) {
      mapRowsToData(selectedNodes, setSelectedRows, data, 'Channel')
    }

    if (selectedNodes.length === 0) {
      setSelectedRows([])
    }
  }

  function deselectExtraNodesAndShowError(selectedNodes) {
    const toBeDeselected = selectedNodes.filter((node) => {
      if (node.group) {
        return !selectedRows.find((row) => row.Channel === node.key)
      }
      return !selectedRows.find(
        (row) => row.ChannelId === node.data.ChannelId && row.CounterPartyId === node.data.CounterPartyId
      )
    })
    if (toBeDeselected?.length) {
      toBeDeselected.forEach((node) => node.setSelected(false))
    }
    showRowSelectionError()
  }
  const rowData = useMemo(
    () => data?.CustomerPricePerformanceWithChannel?.GridRows || [],
    [data?.CustomerPricePerformanceWithChannel?.GridRows]
  )
  const getRowId = useCallback(
    (row) => (row.data?.CounterPartyId ? `${row.data.CounterPartyId} - ${row.data.ChannelId}` : row.data.ChannelId),
    [data?.CustomerPricePerformanceWithChannel?.GridRows]
  )
  const getGroupRowData = useCallback(
    (params) => data?.GridRows?.find((row) => row.Channel === params.node.key),
    [data?.GridRows]
  )
  const columnDefs = useMemo(() => {
    const customColumns = getColumnDefs()
    const sharedColumns = getSharedColumnDefs({ includeProfitTrend: false, getGroupRowData })
    return [...sharedColumns, ...customColumns]
  }, [data?.GridRows, getGroupRowData])

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
