import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types'
import { Select } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type CellEditorParams = {
  refreshBulkDrawerUI: () => void
}

export const BulkVolumeGroupEditor = forwardRef<BulkCellEditorHandle<any>, CellEditorParams>((props, ref) => {
  const [AvailableVolumeId, setValue] = useState<string>()

  useImperativeHandle(ref, () => ({
    getChanges: () => ({ AvailableVolumeId }),
    isChangeReady: () => !!AvailableVolumeId,
  }))

  useEffect(props.refreshBulkDrawerUI, [AvailableVolumeId])

  return (
    <Select
      size='large'
      placeholder='Select volume group'
      showSearch
      style={{ width: 400 }}
      value={AvailableVolumeId}
      onChange={setValue}
      options={props?.volumeGroupOptions ?? []}
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
    />
  )
})
