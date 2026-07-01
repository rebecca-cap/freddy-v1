import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types'
import { QuoteMappingMetadata } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/types.schema'
import { Switch } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type CellEditorParams = {
  metadata: QuoteMappingMetadata
  refreshBulkDrawerUI: () => void
}

export const BulkStatusEditor = forwardRef<BulkCellEditorHandle<any>, CellEditorParams>((props, ref) => {
  const [checked, setChecked] = useState(false)

  useImperativeHandle(ref, () => ({
    getChanges: () => ({ StatusCvId: checked ? 100 : 101 }),
    isChangeReady: () => true,
  }))

  useEffect(props.refreshBulkDrawerUI, [checked])

  return (
    <Switch
      onClick={(_, e) => e.stopPropagation()}
      style={{ width: 100 }}
      checkedChildren='Enabled'
      unCheckedChildren='Disabled'
      checked={checked}
      onChange={(value) => {
        setChecked(value)
      }}
    />
  )
})
