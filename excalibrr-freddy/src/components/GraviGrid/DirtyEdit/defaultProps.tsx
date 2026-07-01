import { type Filter } from '@components/Grid/SearchGridHeader/DynamicFilterForm/types'
import { CellClassParams, GetRowIdFunc } from 'ag-grid-community'
import _ from 'lodash'

import { useDirtyGridChanges } from '../hooks/useDirtyGrid'
import { CallableGetRowId, GraviGridProps } from '../index.types'

export const getDirtyCellClass =
  <T extends Record<string, any>, F extends Filter>(
    isDirtyEdit: GraviGridProps<T, F>['isDirtyEdit'],
    dirtyChangesRef: GraviGridProps<T, F>['dirtyChangesRef'],
    dirtyGridApi: ReturnType<typeof useDirtyGridChanges<T>>,
    getRowId: GetRowIdFunc<T>
  ) =>
  (params: CellClassParams<T>) => {
    if (!isDirtyEdit || !params?.column?.getColDef()?.editable) return ''
    if (params?.data?.$inserted) return 'dirty-grid-edited'

    const originalRow = dirtyGridApi.originalRows.find(
      (r) =>
        (getRowId as CallableGetRowId<T>)({ data: r }) ===
        (getRowId as CallableGetRowId<T>)({
          data: params.data!,
        })
    )

    if (!originalRow) return ''

    const predicate = (params.colDef as any).$isCellDirty

    if (predicate && typeof predicate === 'function') {
      return predicate({
        ...params,
        isDirtyEdit,
        dirtyChangesRef,
        originalRow,
      })
        ? 'dirty-grid-edited'
        : ''
    }

    const currentRow = dirtyGridApi.dirtyChanges.find(
      (row) =>
        (getRowId as CallableGetRowId<T>)({ data: row }) ===
        (getRowId as CallableGetRowId<T>)({
          data: originalRow,
        })
    )
    const colId = params?.column?.getColId()
    const oldValue = originalRow[colId]
    const newValue = currentRow?.[colId]

    if (!_.isEqual(oldValue, newValue)) {
      return 'dirty-grid-edited'
    }
    return ''
  }
