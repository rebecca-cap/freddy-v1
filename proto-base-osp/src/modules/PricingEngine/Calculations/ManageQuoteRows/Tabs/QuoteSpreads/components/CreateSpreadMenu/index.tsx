import { LinkOutlined } from '@ant-design/icons'
import { GraviButton, GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { GetMappingsRow } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/types.schema'
import { useQuoteRowsTyped } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/useQuoteRowsTyped'
import type { GridApi } from 'ag-grid-community'
import { Switch } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { getColumnDefs } from './columnDefs'

interface Props {
  mappings: GetMappingsRow[]
  defaultTerminalFilter: string
  onClose: () => void
  spreadGridRef: React.MutableRefObject<GridApi>
  firstSelectedWithSpread: GetMappingsRow | undefined
  selectedSpreadRows: GetMappingsRow[]
}

export const CreateSpreadMenu: React.FC<Props> = ({
  mappings,
  defaultTerminalFilter,
  onClose,
  spreadGridRef,
  firstSelectedWithSpread,
  selectedSpreadRows,
}) => {
  const { assignSpreadMutation } = useQuoteRowsTyped()
  const [filterToTerminal, setFilterToTerminal] = useState(true)
  const [parentId, setParentId] = useState<number>()
  const columnDefs = useMemo(() => getColumnDefs(), [parentId])
  const gridRef = React.useRef<GridApi>() as React.MutableRefObject<GridApi>
  const cleanupGrid = useCallback(() => {
    spreadGridRef.current?.deselectAll()
    gridRef.current?.deselectAll()
    setParentId(undefined)
  }, [])

  useEffect(() => {
    if (!assignSpreadMutation.isSuccess) return
    cleanupGrid()
    onClose()
  }, [assignSpreadMutation.isSuccess])

  const handleRowSelection = useCallback(({ api }: { api: GridApi }) => {
    const rows = api?.getSelectedRows()
    const ids = rows?.map((row) => row?.QuoteConfigurationMappingId)
    setParentId(ids[0])
  }, [])

  const gridRows = useMemo(() => {
    return mappings.filter((mapping) => mapping.LocationName === defaultTerminalFilter)
  }, [mappings, defaultTerminalFilter])

  const handleSpreadConfirm = useCallback(() => {
    if (!parentId) return

    const updates = selectedSpreadRows.map((spreadRow) => {
      return {
        QuoteConfigurationMappingId: spreadRow.QuoteConfigurationMappingId,
        SpreadParentMappingId: parentId,
        SpreadAmount: spreadRow.SpreadAmount ?? 0,
      }
    })

    assignSpreadMutation.mutate({ SpreadUpdates: updates })
  }, [assignSpreadMutation, parentId, selectedSpreadRows])

  const agPropOverrides = useMemo(
    () => ({
      rowGroupPanelShow: 'never' as const,
      onRowSelected: handleRowSelection,
      getRowId: (row) => row?.data?.QuoteConfigurationMappingId,
      rowSelection: 'single' as const,
      onFirstDataRendered: (params) => {
        params.api.sizeColumnsToFit()
        if (firstSelectedWithSpread) {
          const node = params.api.getRowNode(firstSelectedWithSpread.SpreadParentMappingId)
          node?.setSelected(true)
          params.api.ensureNodeVisible(node)
        }
      },
    }),
    [firstSelectedWithSpread, handleRowSelection]
  )

  return (
    <Vertical>
      <GraviGrid
        enableFilterContextMenu
        externalRef={gridRef}
        controlBarProps={{
          title: 'Source Rows',
          actionButtons: (
            <Switch checkedChildren='Same Terminal' checked={filterToTerminal} onChange={setFilterToTerminal} />
          ),
        }}
        suppressSaveMessage
        showColumnsToolbar={false}
        toolPanelWidth={0}
        sideBar={false}
        agPropOverrides={agPropOverrides}
        rowData={filterToTerminal ? gridRows : mappings}
        columnDefs={columnDefs}
      />
      {parentId && (
        <Horizontal className='bg-theme1 p-4' justifyContent='space-between'>
          <Texto appearance='white' category='h5'>
            <LinkOutlined className='mr-2' />
            Spread the {selectedSpreadRows.length} rows you have selected on to the quote above?
          </Texto>
          <Horizontal gap='0.5rem'>
            <GraviButton
              buttonText='Cancel'
              onClick={() => {
                setParentId(undefined)
                gridRef.current?.deselectAll()
              }}
            />
            <GraviButton
              buttonText='Confirm'
              theme2
              onClick={handleSpreadConfirm}
              loading={assignSpreadMutation.isPending}
            />
          </Horizontal>
        </Horizontal>
      )}
    </Vertical>
  )
}
