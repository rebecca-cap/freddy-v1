import { useUser } from '@contexts/UserContext'
import { GraviGrid, Horizontal, NotificationMessage } from '@gravitate-js/excalibrr'
import { GridApi } from 'ag-grid-community'
import { MutableRefObject, useCallback, useMemo, useRef } from 'react'

import { useQuantityDistribution } from './api/useQuantityDistribution'
import { getColumnDefs } from './components/columnDefs'
import { PeriodValueEditor } from './components/PeriodValueEditor'

export function QuantityDistribution() {
  const gridRef = useRef() as MutableRefObject<GridApi>
  const dirtyRef = useRef() as MutableRefObject<any> // eslint-disable-line @typescript-eslint/no-explicit-any

  const { useQuantityDistributionQuery, useUpsertQuantityDistributionMutation } = useQuantityDistribution()
  const { data: quantityData, isLoading, isFetching } = useQuantityDistributionQuery()
  const upsertMutation = useUpsertQuantityDistributionMutation()
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.MarketPlatform?.QuantityDistribution?.Write
  const rows = useMemo(() => quantityData?.Data?.Rows || [], [quantityData])
  const sampleRow = useMemo(() => rows[0] || null, [rows])
  const periodMappings = useMemo(() => quantityData?.Data?.PeriodDisplayMappings || {}, [quantityData])

  const columnDefs = useMemo(() => {
    if (!sampleRow) return []
    return getColumnDefs(sampleRow, canWrite, periodMappings)
  }, [sampleRow, canWrite, periodMappings])

  const agPropOverrides = useMemo(
    () => ({
      rowGroupPanelShow: 'never' as const,
      getRowId: (r) => r.data?.Id,
      rowSelection: 'multiple' as const,
    }),
    []
  )

  const controlBarProps = useMemo(
    () => ({
      title: 'Manage Quantity Distribution',
      hideActiveFilters: false,
      actionButtons: (
        <Horizontal verticalCenter>
          {canWrite && <PeriodValueEditor gridRef={gridRef} dirtyRef={dirtyRef} />}
        </Horizontal>
      ),
    }),
    [canWrite, gridRef, dirtyRef]
  )

  const handleSave = useCallback(
    async (dirtyRows) => {
      try {
        const cellsToUpdate = dirtyRows.dirtyChanges.flatMap((row) =>
          row.Cells.filter((cell) => cell.IsChanged).map((cell) => ({
            ProductId: cell.ProductId,
            LocationId: cell.LocationId,
            PeriodId: cell.PeriodId,
            Weight: cell.Weight,
          }))
        )

        await upsertMutation.mutateAsync(cellsToUpdate)
        NotificationMessage('Changes Saved!', `${cellsToUpdate.length} cells updated`, false)
        gridRef.current.clearRangeSelection()
        return true
      } catch (error) {
        console.error('Error saving quantity distribution weights:', error)
        NotificationMessage('Error saving quantity distribution weights', 'Please try again', true)
      }
    },
    [upsertMutation]
  )

  return (
    <GraviGrid
      storageKey='heating-days-quantity-distribution-weights'
      columnDefs={columnDefs}
      agPropOverrides={agPropOverrides}
      controlBarProps={controlBarProps}
      rowData={rows}
      externalRef={gridRef}
      isDirtyEdit={canWrite}
      dirtyChangesRef={dirtyRef}
      onDirtyChangeSave={handleSave}
      hideSaveDisplay
      loading={isLoading || isFetching}
      updateEP={async () => {
        // Don't remove: need this to make inline cell editing work
      }}
    />
  )
}
