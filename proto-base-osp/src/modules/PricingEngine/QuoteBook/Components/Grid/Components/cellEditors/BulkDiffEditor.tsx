import { HighlightOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { isDefinedAndNotNull } from '@utils/index'
import { ICellEditorParams } from 'ag-grid-community'
import { InputNumber, Tooltip } from 'antd'
import React, { forwardRef, useMemo, useState } from 'react'

type ChangeFunction = (row: Quote) => Quote

export type BulkDiffEditorParams = ICellEditorParams & {
  refreshBulkDrawerUI: () => void
  executeChange: (change: ChangeFunction) => void
  isBulkChangeCompactMode?: boolean
}
export const BulkDiffEditor: React.FC<BulkDiffEditorParams> = forwardRef((props, ref) => {
  const [Adjustment, setAdjustment] = useState<number | null>(null)
  function add(row: Quote) {
    if (row?.SpreadParentMappingId || !row?.QuoteConfigurationMappingId) {
      return { ...row }
    }
    const newAdjustment = Number(row.Adjustment ?? 0) + Number(Adjustment ?? 0)
    return {
      ...row,
      Adjustment: newAdjustment,
      ProposedPrice: Number(row?.ProposedPrice ?? 0) + Number(Adjustment ?? 0),
    }
  }

  function subtract(row: Quote) {
    if (row?.SpreadParentMappingId || !row?.QuoteConfigurationMappingId) {
      return { ...row }
    }
    const newAdjustment = Number(row.Adjustment ?? 0) - Number(Adjustment ?? 0)
    return {
      ...row,
      Adjustment: newAdjustment,
      ProposedPrice: Number(row?.ProposedPrice ?? 0) - Number(Adjustment ?? 0),
    }
  }

  const replace = (row) => {
    if (row?.SpreadParentMappingId || !row?.QuoteConfigurationMappingId) {
      return { ...row }
    }
    return {
      ...row,
      Adjustment: Number(Adjustment),
      ProposedPrice: Number(row?.ProposedPrice ?? 0) + Number(Adjustment ?? 0),
    }
  }

  const isEditable = useMemo(() => isDefinedAndNotNull(Adjustment), [Adjustment])
  return (
    <Horizontal flex={1} gap='1rem' alignItems='center' justifyContent='flex-end'>
      <InputNumber value={Adjustment} onChange={(value) => setAdjustment(value)} style={{ width: 180 }} />
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
