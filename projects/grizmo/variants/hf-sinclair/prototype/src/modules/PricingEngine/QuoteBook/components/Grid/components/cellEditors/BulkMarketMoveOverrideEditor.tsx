import { HighlightOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { isDefinedAndNotNull } from '@utils/index'
import { ICellEditorParams } from 'ag-grid-community'
import { InputNumber, Tooltip } from 'antd'
import React, { forwardRef, useMemo, useState } from 'react'

import { getNewSummedPriceFromRow } from '../columns/helpers'

type ChangeFunction = (row: Quote) => Quote

export type BulkMarketMoveEditorParams = ICellEditorParams & {
  refreshBulkDrawerUI: () => void
  executeChange: (change: ChangeFunction) => void
  isBulkChangeCompactMode?: boolean
}
export const BulkMarketMoveOverrideEditor: React.FC<BulkMarketMoveEditorParams> = forwardRef((props) => {
  const [MarketMoveOverride, setMarketMoveOverride] = useState<number | null>(null)
  function add(row: Quote) {
    if (row?.SpreadParentMappingId || !row?.QuoteConfigurationMappingId) {
      return { ...row }
    }

    const newMarketMoveOverride = Number(row.MarketMoveOverride ?? 0) + Number(MarketMoveOverride ?? 0)
    return {
      ...row,
      MarketMoveOverride: newMarketMoveOverride,
      ProposedPrice: Number(row?.ProposedPrice || 0) + Number(MarketMoveOverride ?? 0),
    }
  }

  function subtract(row: Quote) {
    if (row?.SpreadParentMappingId || !row?.QuoteConfigurationMappingId) {
      return { ...row }
    }
    const newMarketMoveOverride = Number(row.MarketMoveOverride ?? 0) - Number(MarketMoveOverride ?? 0)
    return {
      ...row,
      MarketMoveOverride: newMarketMoveOverride,
      ProposedPrice: Number(row?.ProposedPrice || 0) - Number(MarketMoveOverride ?? 0),
    }
  }

  const replace = (row: Quote) => {
    if (row?.SpreadParentMappingId || !row?.QuoteConfigurationMappingId) {
      return { ...row }
    }
    const price = getNewSummedPriceFromRow({ ...row, MarketMoveOverride: Number(MarketMoveOverride) })

    return {
      ...row,
      MarketMoveOverride: Number(MarketMoveOverride),
      ProposedPrice: price,
    }
  }

  const isEditable = useMemo(() => isDefinedAndNotNull(MarketMoveOverride), [MarketMoveOverride])
  return (
    <Horizontal flex={1} style={{ gap: '1rem' }} alignItems='center' justifyContent='flex-end'>
      <InputNumber
        value={MarketMoveOverride}
        onChange={(value) => setMarketMoveOverride(value)}
        style={{ width: 180 }}
      />
      <Horizontal style={{ gap: 4 }}>
        <GraviButton
          size={props.isBulkChangeCompactMode ? 'small' : 'middle'}
          icon={<PlusOutlined />}
          onClick={() => props.executeChange(add)}
          disabled={!isEditable}
        />
        <GraviButton
          size={props.isBulkChangeCompactMode ? 'small' : 'middle'}
          icon={<MinusOutlined />}
          onClick={() => props.executeChange(subtract)}
          disabled={!isEditable}
        />
        <Tooltip title='Replace value' placement='bottomLeft'>
          <GraviButton
            size={props.isBulkChangeCompactMode ? 'small' : 'middle'}
            icon={<HighlightOutlined />}
            onClick={() => props.executeChange(replace)}
            disabled={!isEditable}
          />
        </Tooltip>
      </Horizontal>
    </Horizontal>
  )
})

BulkMarketMoveOverrideEditor.displayName = 'BulkMarketMoveOverrideEditor'
