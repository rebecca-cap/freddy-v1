import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types'
import { toAntOption } from '@utils/index'
import { Select } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type CellEditorParams = {
  metadata: any
  refreshBulkDrawerUI: () => void
}

export const BulkAuthenticationEditor = forwardRef<BulkCellEditorHandle<any>, CellEditorParams>((props, ref) => {
  const [IdentityProviderId, setValue] = useState<string>()

  useImperativeHandle(ref, () => ({
    getChanges: () => ({ IdentityProviderId }),
    isChangeReady: () => !!IdentityProviderId,
  }))

  useEffect(props.refreshBulkDrawerUI, [IdentityProviderId])

  return (
    <Select
      placeholder='Select Authentication'
      size='large'
      showSearch
      style={{ width: 200 }}
      value={IdentityProviderId}
      onChange={setValue}
      options={props?.metadata?.Data?.IdentityProvidersList?.map(toAntOption) ?? []}
    />
  )
})
