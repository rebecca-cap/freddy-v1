import { GraviGrid } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

import { columnDefs } from './columns/columnDefs'

export function QuoteBookPublishConfirmDrawerGrid({ publicationMode, dirtyQuotes, isUsingMarketMove }) {
  const getColumnDefs = useMemo(
    () => (typeof isUsingMarketMove !== 'undefined' ? columnDefs(publicationMode, isUsingMarketMove) : []),
    [dirtyQuotes, isUsingMarketMove, publicationMode]
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
