import { GraviGrid, NotificationMessage, Vertical } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import type { GridApi } from 'ag-grid-community'
import { useMemo, useRef, useState } from 'react'

import type { GetForConfigurationResponse } from './Api/usePriceExceptionsTyped'
import { usePriceExceptionsTyped } from './Api/usePriceExceptionsTyped'
import { getPriceExceptionColumnDefs } from './Components/Grid/Columns/columnDefs'
import { boundLabels } from './utils/constants'
import { buildNameToCvIdMap, buildSavePayload, findThresholdViolation } from './utils/helpers'

type ThresholdRow = NonNullable<GetForConfigurationResponse['Data']>[number]

export function PriceExceptionsTab({ canWrite }: { canWrite: boolean }) {
  const { useThresholdsQuery, useMetadataQuery, saveThresholdsMutation } = usePriceExceptionsTyped()
  const { data: metaDataResponse } = useMetadataQuery()
  const { data: thresholdsResponse, isFetching: isThresholdsFetching, isRefetching } = useThresholdsQuery()

  const componentMetaData = metaDataResponse?.Components ?? []
  const rowData = thresholdsResponse?.Data ?? []
  const isFetching = isRefetching || isThresholdsFetching

  const nameToCvId = useMemo(() => buildNameToCvIdMap(componentMetaData), [componentMetaData])

  const gridRef = useRef<GridApi>() as React.MutableRefObject<GridApi>
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)

  const storageKey = 'PriceExceptionsGrid'
  const gridViewManager = useGridViewManager(storageKey)

  const columnDefs = useMemo(
    () => getPriceExceptionColumnDefs(canWrite, componentMetaData),
    [canWrite, componentMetaData]
  )

  const handleUpdate = async (rowOrRows: ThresholdRow | ThresholdRow[]): Promise<void | boolean> => {
    try {
      const rows = Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows]
      const dataRows = rows.filter((r) => !!r?.QuoteConfigurationMappingId)
      if (dataRows.length === 0) return true

      for (const row of dataRows) {
        for (const entry of row.Thresholds ?? []) {
          const violation = findThresholdViolation(entry)
          if (violation) {
            NotificationMessage(
              'Validation Failed',
              `${entry.PricingExceptionComponentName}: ${boundLabels[violation.lower]} must be \u2264 ${boundLabels[violation.upper]}`,
              true
            )
            return false
          }
        }
      }

      const savePayload = buildSavePayload(dataRows, nameToCvId)
      await saveThresholdsMutation.mutateAsync(savePayload)
      NotificationMessage('Save Successful', `${dataRows.length} row(s) updated.`, false)
      return true
    } catch {
      return Promise.reject()
    }
  }

  const controlBarProps = useMemo(
    () => ({
      title: 'Price Exceptions',
      hideActiveFilters: false,
    }),
    []
  )

  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row?.data?.QuoteConfigurationMappingId?.toString(),
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      groupDefaultExpanded: -1,
    }),
    []
  )

  return (
    <Vertical flex='1'>
      <GraviGrid
        enableFilterContextMenu
        storageKey={storageKey}
        externalRef={gridRef}
        controlBarProps={controlBarProps}
        agPropOverrides={agPropOverrides}
        columnDefs={columnDefs}
        rowData={rowData ?? []}
        loading={isFetching}
        gridViewManager={gridViewManager}
        updateEP={canWrite ? handleUpdate : undefined}
        hideSaveDisplay
        isBulkChangeVisible={isBulkChangeVisible}
        setIsBulkChangeVisible={canWrite ? setIsBulkChangeVisible : undefined}
      />
    </Vertical>
  )
}
