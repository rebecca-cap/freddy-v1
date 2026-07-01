import { BarChartOutlined, FileOutlined, FunctionOutlined } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types'
import { QuoteMappingMetadata } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/types.schema'
import { searchFilter, toAntOption } from '@utils/index'
import { Cascader, Select } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'

type CellEditorParams = {
  metadata: QuoteMappingMetadata
  refreshBulkDrawerUI: () => void
  selectedRows: any[]
}

export const CostTypeEditor = forwardRef<BulkCellEditorHandle<any>, CellEditorParams>((props, ref) => {
  const [costType, setCostType] = useState<string>()
  const [instrumentId, setSelectedInstrumentId] = useState<string>()
  const normalizedCostType = useMemo(() => costType?.toLowerCase(), [costType])

  const canEdit = useMemo(
    () =>
      props.selectedRows?.some(
        (row) => !row.QuoteConfigurationHasGeneratedMappings && !row.HasValuationsOrPublications
      ),
    [props.selectedRows]
  )

  useImperativeHandle(ref, () => ({
    getChanges: () => {
      switch (normalizedCostType) {
        case 'instrument':
          return {
            CostSourceType: 'Instrument',
            CostSourceExplicitPriceInstrumentId: instrumentId,
            CostSourceMarkerId: null,
            CostSourceMarker: null,
            CostSourceTradeEntryDetailId: null,
          }
        default:
          return {
            CostSourceType: 'Marker',
            CostSourceMarker: 'N/A',
            CostSourceMarkerId: costType,
            CostSourceTradeEntryDetailId: null,
            CostSourceExplicitPriceInstrumentId: null,
          }
      }
    },

    isChangeReady: () => {
      if (!canEdit) return false
      if (!normalizedCostType) return false
      if (normalizedCostType === 'instrument') return !!instrumentId
      return true
    },
  }))

  const getOptionIcon = (option) => {
    if (option?.IsMarker) return <FunctionOutlined />
    if (option.Value === 'Contract') return <FileOutlined />
    if (option.Value === 'Instrument') return <BarChartOutlined />
    return null
  }

  useEffect(props.refreshBulkDrawerUI, [costType, instrumentId])

  return (
    <Horizontal flex={1} gap='1rem' alignItems='center' justifyContent='flex-start'>
      <Select
        disabled={!canEdit}
        size='large'
        placeholder='Select a Cost Type'
        value={costType}
        onChange={(value) => setCostType(value)}
        showSearch
        style={{ width: 260 }}
        filterOption={searchFilter}
        options={props.metadata?.Data?.CostSourceTypes.filter((cst) => cst.Text !== 'Contract').map((option) => ({
          key: option.Value,
          value: option.Value,
          label: (
            <>
              {getOptionIcon(option)} {option.Text}
            </>
          ),
        }))}
      />
      {!canEdit && <Texto appearance='error'>Cannot edit cost type for rows that have generated mappings</Texto>}
      {costType?.toLowerCase() === 'instrument' && (
        <Vertical style={{ flexGrow: 1 }}>
          <Cascader
            size='large'
            placeholder='Select a Price Instrument'
            showSearch
            onChange={([_publisher, instrument]) => {
              setSelectedInstrumentId(instrument as string)
            }}
            style={{ width: '100%' }}
            popupMatchSelectWidth
            options={props.metadata.Data.PricePublishers.filter(
              (pp) => Object.keys(props.metadata.Data.PublisherPriceInstruments).includes(pp.Value) // only show publishers that have at least one instrument
            ).map((o) => {
              return {
                value: o.Value,
                label: o.Text,
                children: props.metadata.Data.PublisherPriceInstruments?.[o.Value.toString()]?.map(toAntOption) ?? [],
              }
            })}
          />
        </Vertical>
      )}
    </Horizontal>
  )
})
