import { ColDef, GetRowIdParams } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import _ from 'lodash'
import { MutableRefObject, useEffect, useMemo, useState } from 'react'

import { ChangeMeta } from '../BulkChangeBar'
import type { CallableGetRowId } from '../index.types'

type HookProps<T extends Record<string, any>> = {
  isEnabled?: boolean
  getRowId: (params: GetRowIdParams<T>) => keyof T
  onDirtyChangeSave?: (params: {
    dirtyChanges: T[]
    dirtyCells: Record<keyof T, T[keyof T]>
    originalRows: T[]
  }) => Promise<boolean>
  onDirtyChangeDiscard?: () => void
  gridRef: MutableRefObject<AgGridReact | null>
  primaryKey?: keyof T
  rowData?: T[]
  colDefs: ColDef<T>[] | null | undefined
}

export const useDirtyGridChanges = <T extends Record<string, any>>({
  getRowId,
  onDirtyChangeSave,
  onDirtyChangeDiscard,
  gridRef,
  primaryKey,
  rowData,
  colDefs,
  isEnabled,
}: HookProps<T>) => {
  const [originalRows, setOriginalRows] = useState<T[]>([])
  const [dirtyChanges, setDirtyChanges] = useState<T[]>([])

  const getRowDiff = (row: T) => {
    const originalRow = originalRows.find(
      (r) =>
        (getRowId as CallableGetRowId<T>)({ data: r }) ===
        (getRowId as CallableGetRowId<T>)({ data: row })
    )

    if (!originalRow && !row.$inserted) return {}
    const diff = Object.entries(row).reduce((acc, [key, value]) => {
      // if a new empty row is inserted by using addDirtyRow, we need to do this for the grid to recognize dirty styling
      if (row.$inserted) {
        return {
          ...acc,
          [key]: { originalValue: crypto.randomUUID(), currentValue: value },
        }
      }

      if (
        originalRow &&
        !_.isEqual(originalRow[key], value) &&
        !key.startsWith('$')
      ) {
        return {
          ...acc,
          [key]: { originalValue: originalRow[key], currentValue: value },
        }
      }
      return acc
    }, {})
    return diff
  }

  const dirtyCells = useMemo(
    () =>
      dirtyChanges.reduce((acc, row) => {
        const rowDiff = getRowDiff(row)
        return { ...acc, [row.$index!]: rowDiff }
      }, {}) as Record<keyof T, T[keyof T]>,
    [dirtyChanges, originalRows]
  )

  const resetChanges = () => {
    setOriginalRows([])
    setDirtyChanges([])
  }

  const handleDirtySave = async () => {
    if (!onDirtyChangeSave || typeof onDirtyChangeSave !== 'function') return
    // The user supplied save callback is expected to return a boolean indicating whether or not the dirty changes were successfully saved.
    // If the callback returns true, we reset the dirty changes.
    const callBackResult = await onDirtyChangeSave({
      dirtyChanges,
      dirtyCells,
      originalRows,
    })

    if (callBackResult) resetChanges()
  }

  const handleDirtyDiscard = () => {
    resetChanges()
    gridRef?.current?.api.applyTransaction({ update: originalRows })
    if (onDirtyChangeDiscard && typeof onDirtyChangeDiscard === 'function') {
      onDirtyChangeDiscard()
    }
  }

  const updateDirtyRow = async (changes: T | T[], meta?: ChangeMeta<T>) => {
    // adding some metadata to the change so we can work with the list later
    const rowChange = {
      ...changes,
      $index: meta?.updatedRowIndex,
      $id: (getRowId as CallableGetRowId<T>)({ data: changes as T }),
    } as T

    const changeExists = dirtyChanges.some((c) => c.$id === rowChange.$id)

    if (changeExists) {
      let newChanges = dirtyChanges.map((r) =>
        r.$id === rowChange.$id ? rowChange : r
      )
      const originalRow = originalRows.find(
        (r) => (getRowId as CallableGetRowId<T>)({ data: r }) === rowChange.$id
      )

      const { $id, $index, ...rowWithoutMeta } = rowChange

      if (originalRow && _.isEqual(originalRow, rowWithoutMeta)) {
        newChanges = newChanges.filter((r) => r.$id !== rowChange.$id)
      }

      setDirtyChanges(newChanges)
    } else {
      setDirtyChanges((curr) => [...curr, rowChange])
      const originalRow = rowData?.find(
        (r) => (getRowId as CallableGetRowId<T>)({ data: r }) === rowChange.$id
      )
      if (originalRow) {
        const clonedRow = structuredClone(originalRow)
        setOriginalRows((c) => [...c, clonedRow]) // rowChange needs to be cloned so that the originalRow isn't modified
      }
    }

    // Nothing is async, but we're wrapping the return in a promise for backwards compatibility with useEditableGrid
    return Promise.resolve(rowChange)
  }

  const removeDirtyRow = async (row: T) => {
    setDirtyChanges((currentChanges) =>
      currentChanges.filter(
        (currentRow) =>
          (getRowId as CallableGetRowId<T>)({ data: currentRow }) !==
          (getRowId as CallableGetRowId<T>)({ data: row })
      )
    )
    return Promise.resolve(row)
  }

  const addDirtyRow = async (row: T) => {
    const _id = crypto.randomUUID()
    const _row = {
      ...row,
      $index: originalRows?.length,
      $inserted: true,
      $id: _id,
      [primaryKey!]: _id,
    }

    setDirtyChanges((currentChanges) => [...currentChanges, _row])

    if (gridRef?.current) {
      const api = gridRef.current?.api
      api.applyTransaction({
        add: [_row],
        addIndex: 0,
      })
    }
    return Promise.resolve(row)
  }

  const unsavedRowCount = useMemo(() => dirtyChanges?.length, [dirtyChanges])

  return {
    originalRows,
    dirtyChanges,
    dirtyCells,
    setDirtyChanges,
    addDirtyRow,
    updateDirtyRow,
    removeDirtyRow,
    handleDirtySave,
    handleDirtyDiscard,
    hasUnsavedChanges: unsavedRowCount > 0,
    unsavedRowCount,
  }
}
