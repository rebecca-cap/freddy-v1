import { ArrowsAltOutlined, BarChartOutlined, ShrinkOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { ScoutTourTrigger, ScoutTrigger } from '@modules/Scout'
import { PublicationModes, Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { LastEOD, PublicationModeOptions } from '@modules/PricingEngine/QuoteBook/type.schema'
import { isDefinedAndNotNull } from '@utils/index'
import { GridApi } from 'ag-grid-community'
import { Select, Switch, Tooltip } from 'antd'
import React, { MutableRefObject, useMemo } from 'react'

interface QuoteBookActionButtonsProps {
  canWrite: boolean
  publicationMode: PublicationModes
  setPublicationMode: (value: PublicationModes) => void
  setLastEOD: (mode: LastEOD) => void
  showSpreadRows: boolean | null
  setShowSpreadRows: React.Dispatch<React.SetStateAction<boolean | null>>
  showAnalytics: boolean
  setShowAnalytics: (value: boolean) => void
  publishMode: boolean
  isBulkChangeVisible: boolean
  setSelectedAnalyticsRow: (value: Quote) => void
  getRefKey: (value: PublicationModes) => MutableRefObject<GridApi<any>>
  lastSavedAdjustment: string | null
}
export function QuoteBookActionButtons({
  canWrite,
  publicationMode,
  setPublicationMode,
  setLastEOD,
  showSpreadRows,
  setShowSpreadRows,
  showAnalytics,
  setShowAnalytics,
  publishMode,
  isBulkChangeVisible,
  setSelectedAnalyticsRow,
  getRefKey,
  lastSavedAdjustment,
}: QuoteBookActionButtonsProps) {
  const tooltipTitle = useMemo(() => {
    if (!publishMode) {
      return 'Show analytics'
    }
    return 'Cannot show analytics while publishing'
  }, [publishMode, isBulkChangeVisible])

  const handleSelectedRowFocus = (value, gridApi, selectedRow) => {
    if (!selectedRow) return

    const isSpreadRow = isDefinedAndNotNull(selectedRow?.SpreadParentMappingId)
    const shouldFocusParent = isSpreadRow && value === false

    const targetNodeId = shouldFocusParent ? selectedRow.SpreadParentMappingId : selectedRow.QuoteConfigurationMappingId
    const rowNode = gridApi.getRowNode(targetNodeId)

    if (rowNode) {
      gridApi.ensureNodeVisible(rowNode, 'middle')

      if (!isBulkChangeVisible) {
        gridApi.deselectAll()
        rowNode.setSelected(true)
      }
    }
  }

  return (
    // GraviGrid renders its Bulk Change button immediately before this node
    // inside a right-aligned (`justify-end`) flex row. The tour trigger is a
    // direct sibling of that flex row (NOT nested in the Horizontal) so its
    // CSS `order: -1` can place it to the LEFT of Bulk Change. Because the
    // row is right-aligned, the trigger appearing/disappearing extends the
    // left edge and leaves Bulk Change (and everything to its right) put.
    <>
      <ScoutTourTrigger />
      <Horizontal verticalCenter style={{ gap: '1rem' }}>
      {canWrite && publicationMode !== 'IntraDay' && (
        <Horizontal alignItems='center' style={{ gap: '0.5rem' }}>
          <Texto>Publishing For</Texto>
          <Select
            options={[
              { value: PublicationModeOptions.EndOfDay, label: 'EOD' },
              { value: PublicationModeOptions.EndOfDayCurrentPeriod, label: 'Current Period' },
            ]}
            onSelect={(value) => {
              setPublicationMode(value as PublicationModes)
              setLastEOD(value as LastEOD)
            }}
            value={publicationMode}
            style={{ width: 150 }}
            defaultValue='eod'
          />
        </Horizontal>
      )}
      <Tooltip title='Show spread rows'>
        <Switch
          checked={!!showSpreadRows}
          onChange={(value) => {
            const gridApi = getRefKey(publicationMode).current
            const selectedRow = gridApi?.getSelectedRows()?.[0]

            setShowSpreadRows(value)
            setTimeout(() => {
              handleSelectedRowFocus(value, gridApi, selectedRow)
            }, 500)
          }}
          checkedChildren={<ShrinkOutlined />}
          unCheckedChildren={<ArrowsAltOutlined />}
          className='mr-4'
        />
      </Tooltip>
      <Tooltip title={tooltipTitle}>
        <Switch
          checked={showAnalytics}
          onClick={(value) => {
            setShowAnalytics(value)
            if (value && !isBulkChangeVisible) {
              const selectedRow = getRefKey(publicationMode).current?.getSelectedRows()?.[0]
              setSelectedAnalyticsRow(selectedRow)
            }
          }}
          checkedChildren={<BarChartOutlined />}
          unCheckedChildren={<BarChartOutlined />}
          className='mr-4'
          disabled={publishMode}
        />
      </Tooltip>
      <Tooltip title='Open Scout (⌘G)'>
        <ScoutTrigger />
      </Tooltip>
      <Horizontal className='mr-4' style={{ minWidth: 0 }}>
        {lastSavedAdjustment && (
          <Tooltip title={`Last Save: ${lastSavedAdjustment}`}>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <Texto
                appearance='secondary'
                style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                Last Save: {lastSavedAdjustment}
              </Texto>
            </div>
          </Tooltip>
        )}
      </Horizontal>
      </Horizontal>
    </>
  )
}
