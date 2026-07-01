import { HighlightOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { isDefinedAndNotNull } from '@utils/index'
import { ICellEditorParams } from 'ag-grid-community'
import { InputNumber, Tooltip } from 'antd'
import React, { forwardRef, useMemo, useState } from 'react'

type ChangeFunction = (row: Quote) => Quote

export type BulkPriceEditorParams = ICellEditorParams & {
  refreshBulkDrawerUI: () => void
  executeChange: (change: ChangeFunction) => void
  isBulkChangeCompactMode?: boolean
}
export const BulkPriceEditor = forwardRef<BulkPriceEditorParams>((props: any, _) => {
  const [value, setValue] = useState<number>()

  const add = (row) => {
    if (row?.SpreadParentMappingId || !row?.QuoteConfigurationMappingId) {
      return { ...row }
    }

    return {
      ...row,
      ProposedPrice: Number(row.ProposedPrice) + Number(value ?? 0),
      Adjustment:
        Number(row.ProposedPrice) + Number(value ?? 0) - Number(row.Cost ?? 0) - Number(row.MarketMoveOverride ?? 0),
    }
  }

  const subtract = (row) => {
    if (row?.SpreadParentMappingId || !row?.QuoteConfigurationMappingId) {
      return { ...row }
    }
    return {
      ...row,
      ProposedPrice: Number(row.ProposedPrice) - Number(value ?? 0),
      Adjustment:
        Number(row.ProposedPrice) - Number(value ?? 0) - Number(row.Cost) - Number(row.MarketMoveOverride ?? 0),
    }
  }

  const replace = (row) => {
    if (row?.SpreadParentMappingId || !row?.QuoteConfigurationMappingId) {
      return { ...row }
    }

    return {
      ...row,
      ProposedPrice: Number(value ?? 0),
      Adjustment: Number(value ?? 0) - Number(row.Cost ?? 0),
    }
  }

  const isEditable = useMemo(() => isDefinedAndNotNull(value), [value])

  return (
    <Horizontal flex={1} gap='1rem' alignItems='center' justifyContent='flex-end'>
      <InputNumber value={value} onChange={(value) => setValue(value!)} style={{ width: 180 }} />
      <Horizontal gap={4}>
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
