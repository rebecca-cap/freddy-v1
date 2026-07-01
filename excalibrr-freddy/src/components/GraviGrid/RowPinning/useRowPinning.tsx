import { GetRowIdFunc } from 'ag-grid-community'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { CallableGetRowId } from '../index.types'
import { autosizePinnedRows } from './util'

type UseRowPinningProps<T extends Record<string, any>> = {
  enableRowPinning: boolean
  pinnedRowPosition: 'top' | 'bottom'
  getRowId: GetRowIdFunc<T>
  rowData: T[] | undefined
}

export function useRowPinning<T extends Record<string, any>>({
  enableRowPinning,
  pinnedRowPosition,
  getRowId,
  rowData,
}: UseRowPinningProps<T>) {
  const [pinnedRowIds, setPinnedRowIds] = useState<(keyof T)[]>([])

  const autosizeInterval = autosizePinnedRows()

  useEffect(() => {
    return () => {
      if (autosizeInterval) {
        clearInterval(autosizeInterval)
      }
    }
  })

  const pinnedRows = useMemo(() => {
    if (!enableRowPinning) return []
    if (!pinnedRowIds) return []
    return rowData
      ?.filter((r) =>
        pinnedRowIds.includes((getRowId as CallableGetRowId<T>)({ data: r }))
      )
      .sort((a, b) => {
        const aIndex = pinnedRowIds.indexOf(
          (getRowId as CallableGetRowId<T>)({ data: a })
        )
        const bIndex = pinnedRowIds.indexOf(
          (getRowId as CallableGetRowId<T>)({ data: b })
        )
        return aIndex - bIndex
      })
  }, [pinnedRowIds])

  // If any rows are pinned, we need to exclude those rows from the original data set so they're not duplicated in the grid
  const rowDataWithoutPinned = useMemo(() => {
    if (!enableRowPinning || !pinnedRowIds?.length) return rowData
    return rowData?.filter(
      (r) =>
        !pinnedRowIds.includes((getRowId as CallableGetRowId<T>)({ data: r }))
    )
  }, [rowData, pinnedRowIds])

  const pinnedRowData = useMemo(() => {
    return {
      top: pinnedRowPosition === 'top' ? pinnedRows : [],
      bottom: pinnedRowPosition === 'bottom' ? pinnedRows : [],
    }
  }, [pinnedRows, pinnedRowPosition])

  const unpinRow = useCallback((id: keyof T) => {
    setPinnedRowIds((prev) => prev.filter((pinnedRow) => pinnedRow !== id))
  }, [])

  const unpinAllRows = () => setPinnedRowIds([])

  const pinRow = useCallback(
    (id: keyof T) => {
      if (!pinnedRowIds.includes(id)) {
        setPinnedRowIds((prev) => [id, ...prev])
      }
    },
    [pinnedRowIds]
  )

  return {
    pinnedRowIds,
    pinnedRows,
    pinnedRowData,
    rowDataWithoutPinned,
    pinRow,
    unpinRow,
    unpinAllRows,
  }
}
