import { GraviGrid } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

import { columnDefs } from './columns/columnDefs'

export function QuoteBookPublishConfirmDrawerGrid({
  publicationMode,
  dirtyQuotes,
  isUsingMarketMove,
  showOriginDestinationColumns,
  showLocationColumn,
}) {
  const getColumnDefs = useMemo(
    () =>
      typeof isUsingMarketMove !== 'undefined'
        ? columnDefs(publicationMode, isUsingMarketMove, showOriginDestinationColumns, showLocationColumn)
        : [],
    [dirtyQuotes, isUsingMarketMove, publicationMode, showOriginDestinationColumns, showLocationColumn]
  )
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row.data?.QuoteConfigurationMappingId.toString(),
      groupDefaultExpanded: 1,
      rowHeight: 35,
    }),
    [columnDefs]
  )
  const controlBarProps = useMemo(() => ({ title: '' }), [])
  return (
    <GraviGrid
      enableFilterContextMenu
      hideSaveDisplay
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      rowData={dirtyQuotes}
      sideBar={false}
      rowGroupPanelShow='never'
      columnDefs={getColumnDefs}
    />
  )
}
