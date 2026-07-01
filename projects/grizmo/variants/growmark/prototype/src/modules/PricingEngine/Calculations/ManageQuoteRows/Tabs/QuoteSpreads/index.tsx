import { GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { GetMappingsRow } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/types.schema'
import { useQuoteRows } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/useQuoteRows'
import { isDefinedAndNotNull } from '@utils/index'
import { GridApi } from 'ag-grid-community'
import { Drawer } from 'antd'
import React, { useMemo, useState } from 'react'

import { getColumnDefs, isSpreadRow } from './columnDefs'
import { CreateSpreadMenu } from './components/CreateSpreadMenu'
import { SpreadSelectionBar } from './components/SpreadSelectionBar'

export function ManageSpreadsTab({ canWrite }: { canWrite: boolean }) {
  const { useMappings, useMappingMetadata, assignSpreadMutation, removeSpreadMutation } = useQuoteRows()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([])
  const [selectedSpreadRows, setSelectedSpreadRows] = useState<GetMappingsRow[]>([])
  const gridRef = React.useRef<GridApi>() as React.MutableRefObject<GridApi>

  const { data: metadata } = useMappingMetadata()
  const { data: mappings } = useMappings()

  const anchorIds = useMemo(
    () => new Set(mappings?.Data?.map((mapping) => mapping.SpreadParentMappingId)?.filter(isDefinedAndNotNull)),
    [mappings]
  )

  const remappedQuotes = useMemo(() => {
    if (!mappings) return []

    const mappedData = mappings.Data
    const mappingsById = {}
    // create a mapping object by QuoteConfigurationMappingId. we're doing this because its faster to
    // access it this way then doing a nested map/find.
    mappedData.forEach((mapping) => {
      mappingsById[mapping.QuoteConfigurationMappingId] = mapping
    })

    // map over the data and remap properties
    const x = mappedData.map((mapping) => {
      const parent = mappingsById[mapping.SpreadParentMappingId]

      // avoid optional chaining and nullish coalescing
      const spreadLocationName = parent && parent.LocationName ? parent.LocationName : mapping.LocationName
      const spreadProductName = parent && parent.ProductName ? parent.ProductName : mapping.ProductName
      const spreadConfig =
        parent && parent.QuoteConfigurationName ? parent.QuoteConfigurationName : mapping.QuoteConfigurationName

      return {
        ...mapping,
        SpreadLocationName: spreadLocationName,
        SpreadProductName: spreadProductName,
        SpreadConfig: spreadConfig,
        SpreadTradeEntryId: parent?.CostSourceTradeEntryId,
        SpreadQuoteConfigurationId: parent?.QuoteConfigurationId,
      }
    })
    return x
  }, [mappings])

  const columnDefs = useMemo(
    () => getColumnDefs({ anchorIds, metadata, removeSpreadMutation, canWrite }),
    [metadata, remappedQuotes]
  )

  const handleRowSelection = ({ api }) => {
    const rows = api?.getSelectedRows()
    const ids = rows?.map((row) => row?.QuoteConfigurationMappingId)
    setSelectedRowIds(ids)
    setSelectedSpreadRows(rows)
  }

  const firstTerminalInSelected = useMemo(() => {
    if (!selectedRowIds.length) return ''
    const firstTerminal = remappedQuotes.find((rq) => rq.QuoteConfigurationMappingId === selectedRowIds[0])
    return firstTerminal?.LocationName ?? ''
  }, [selectedRowIds])
  const firstSelectedWithSpread = useMemo(() => {
    if (!selectedRowIds.length) return undefined
    // of selected rows, find first one with a spread defined, return that row
    return remappedQuotes.find(
      (rq) => selectedRowIds.includes(rq.QuoteConfigurationMappingId) && isSpreadRow({ data: rq })
    )
  }, [selectedRowIds])
  const agPropOverrides = useMemo(
    () => ({
      getRowStyle: () => ({ fontWeight: 'bold' }),
      suppressMovableColumns: true,
      suppressDragLeaveHidesColumns: true,
      isRowSelectable: (row) => !anchorIds.has(row?.data?.QuoteConfigurationMappingId),
      getRowId: (row) => row?.data?.QuoteConfigurationMappingId,
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      groupDefaultExpanded: -1,
    }),
    [anchorIds]
  )
  return (
    <Vertical flex='1'>
      <Drawer
        title={<Horizontal />}
        placement='right'
        onClose={() => setIsDrawerOpen(false)}
        visible={isDrawerOpen}
        width='75vw'
      >
        <CreateSpreadMenu
          defaultTerminalFilter={firstTerminalInSelected}
          mappings={remappedQuotes.filter(
            (rq) => !isSpreadRow({ data: rq }) && !selectedRowIds.includes(rq.QuoteConfigurationMappingId)
          )}
          onClose={() => setIsDrawerOpen(false)}
          spreadGridRef={gridRef}
          firstSelectedWithSpread={firstSelectedWithSpread}
          selectedSpreadRows={selectedSpreadRows}
        />
      </Drawer>
      <GraviGrid
        externalRef={gridRef}
        controlBarProps={{
          title: 'Manage Spreads',
        }}
        agPropOverrides={agPropOverrides}
        updateEP={async (row) => {
          assignSpreadMutation.mutate({
            SpreadUpdates: [row],
          })
        }}
        loading={!mappings || !metadata}
        storageKey='QuoteRowSpreads'
        rowData={remappedQuotes}
        onSelectionChanged={handleRowSelection}
        columnDefs={columnDefs}
      />
      {selectedRowIds?.length > 0 && (
        <SpreadSelectionBar
          selectedRows={selectedRowIds}
          onSubmit={() => setIsDrawerOpen(true)}
          onCancel={() => {
            setSelectedRowIds([])
            setSelectedSpreadRows([])
          }}
        />
      )}
    </Vertical>
  )
}
