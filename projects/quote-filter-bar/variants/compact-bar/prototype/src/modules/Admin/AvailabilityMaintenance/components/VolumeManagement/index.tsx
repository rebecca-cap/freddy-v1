import { HighlightOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { useAvailabilityMaintenance } from '@api/useAvailabilityMaintenance/useAvailabilityMaintenance'
import { GraviButton, GraviGrid, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { ColDef, GridApi } from 'ag-grid-community'
import { InputNumber, Tooltip } from 'antd'
import moment from 'moment'
import React, { MutableRefObject, useCallback, useMemo, useRef, useState } from 'react'

import { AvailabilityMaintenanceRow } from '../../types'
import { getVolumeManagementColumnDefs } from './columnDefs'

type CellAction = 'add' | 'subtract' | 'replace'

interface PeriodValueEditorProps {
  onChange: (value: number | null, action: CellAction) => void
}

const getMutatedCellValue = (
  node: { data: AvailabilityMaintenanceRow },
  cellIndex: number,
  value: number,
  action: CellAction
) => {
  const oldValue = node.data.GridCells[cellIndex].AvailableQuantity
  switch (action) {
    case 'add':
      return { oldValue, newValue: oldValue + value }
    case 'subtract':
      return { oldValue, newValue: oldValue - value }
    case 'replace':
      return { oldValue, newValue: value }
    default:
      return {}
  }
}

function PeriodValueEditor({ onChange }: PeriodValueEditorProps) {
  const [value, setValue] = useState<number | null>(1)

  return (
    <Horizontal style={{ gap: 8 }}>
      <InputNumber value={value} onChange={(v) => setValue(v)} style={{ width: 140 }} />
      <Horizontal style={{ gap: 4 }}>
        <GraviButton icon={<PlusOutlined />} onClick={() => onChange(value, 'add')} disabled={!value} />
        <GraviButton icon={<MinusOutlined />} onClick={() => onChange(value, 'subtract')} disabled={!value} />
        <Tooltip title='Replace value' placement='bottomLeft'>
          <GraviButton icon={<HighlightOutlined />} onClick={() => onChange(value, 'replace')} />
        </Tooltip>
      </Horizontal>
    </Horizontal>
  )
}

export function VolumeManagement({ canWrite }) {
  const gridRef = useRef() as MutableRefObject<GridApi>
  const dirtyRef = useRef<any>()

  const storageKey = 'VolumeManagement'
  const gridViewManager = useGridViewManager(storageKey)

  const { useAvailabilityMaintenanceQuery, useAvailabilityMaintenanceUpsert } = useAvailabilityMaintenance()
  const mutation = useAvailabilityMaintenanceUpsert()
  const { data, isLoading, isFetching } = useAvailabilityMaintenanceQuery()

  const handleSave = useCallback(({ dirtyChanges }) => {
    const rows = dirtyChanges.map(({ $id, $index, ...row }) => ({
      ...row,
      GridCells: row.GridCells.map((cell) => ({ ...cell, IsChanged: true })),
    }))
    mutation.mutate(rows)
    gridRef.current.clearRangeSelection()
    return true
  }, [])

  const handleCellChange = useCallback(
    (value, action) => {
      const gridApi = gridRef.current
      if (!gridApi) return

      const transactions: any[] = []
      const ranges = gridRef.current.getCellRanges()

      if (!ranges || ranges.length < 1) return

      ranges.forEach((range) => {
        // The beginning and end rows of the range selection
        let rowIndexStart = range.startRow!.rowIndex
        let rowIndexEnd = range.endRow!.rowIndex

        // If range selection was bottom to top, reverse the order
        if (rowIndexStart > rowIndexEnd) [rowIndexStart, rowIndexEnd] = [rowIndexEnd, rowIndexStart]

        const selectedCells = range.columns.map((col: any) => ({
          index: col.colDef.$periodIndex,
          id: col.colId,
        }))

        for (let i = rowIndexStart; i <= rowIndexEnd; i++) {
          const node = gridRef.current.getDisplayedRowAtIndex(i)
          if (!node) continue
          const updatedCells = structuredClone(node.data.GridCells)
          const change = {
            ...node.data,
            GridCells: node.data.GridCells.map((cell, cellIndex) => {
              if (selectedCells.some((c) => c.index === cellIndex)) {
                const { newValue } = getMutatedCellValue(node, cellIndex, value, action)
                return { ...cell, AvailableQuantity: newValue }
              }
              return { ...cell }
            }),
          }

          const changePayload = {
            updatedRowIndex: i,
            oldValue: updatedCells,
            newValue: change.GridCells,
            colId: 'GridCells',
          }

          dirtyRef?.current?.updateDirtyRow(change, changePayload)
          transactions.push(change)
        }
      })

      gridRef.current.applyTransaction({ update: transactions })
    },
    [gridRef?.current]
  )

  const columnDefs = useMemo(
    () => getVolumeManagementColumnDefs({ canWrite, sampleRow: data?.Rows?.[0] }) as ColDef[],
    [data?.Rows, canWrite]
  )
  const lastRefreshed = useMemo(
    () =>
      data?.MaxPromptUpdateFromAllocationDateTime
        ? moment(data?.MaxPromptUpdateFromAllocationDateTime).format('M/D, hA')
        : '',
    [data?.MaxPromptUpdateFromAllocationDateTime]
  )
  const rowData = useMemo(() => data?.Rows || [], [data?.Rows])
  const getRowId = useCallback((r) => r.data?.AvailableVolumeId, [])
  const agPropOverrides = useMemo(
    () => ({
      rowGroupPanelShow: 'never' as const,
      getRowId,
    }),
    []
  )
  return (
    <GraviGrid
      externalRef={gridRef}
      hideSaveDisplay
      isDirtyEdit={canWrite}
      dirtyChangesRef={dirtyRef}
      onDirtyChangeSave={handleSave}
      updateEP={async () => {}} // Don't remove: need this to make inline cell editing work
      controlBarProps={{
        title: 'Volume Management',
        hideActiveFilters: false,
        actionButtons: (
          <Horizontal verticalCenter>
            <Horizontal className='mr-4'>
              {lastRefreshed && <Texto appearance='secondary'>Last refreshed: {lastRefreshed}</Texto>}
            </Horizontal>
            {canWrite && <PeriodValueEditor onChange={handleCellChange} />}
          </Horizontal>
        ),
      }}
      agPropOverrides={agPropOverrides}
      rowData={rowData}
      loading={isLoading || isFetching}
      columnDefs={columnDefs}
      storageKey={storageKey}
      gridViewManager={gridViewManager}
    />
  )
}
