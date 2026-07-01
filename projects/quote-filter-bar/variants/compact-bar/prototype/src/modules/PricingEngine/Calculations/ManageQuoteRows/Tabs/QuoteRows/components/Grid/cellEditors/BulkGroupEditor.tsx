import { Horizontal } from '@gravitate-js/excalibrr'
import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types'
import { QuoteMappingMetadata } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/types.schema'
import { toAntOption } from '@utils/index'
import { Select } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'

type CellEditorParams = {
  metadata: QuoteMappingMetadata
  refreshBulkDrawerUI: () => void
}

export const BulkGroupEditor = forwardRef<BulkCellEditorHandle<any>, CellEditorParams>((props, ref) => {
  const [QuoteConfigurationMappingGroupId, setQuoteConfigurationMappingGroupId] = useState()
  const selectedGroup = useMemo(
    () => props.metadata.Data.QuoteGroups.find((g) => g.Value === QuoteConfigurationMappingGroupId),
    [QuoteConfigurationMappingGroupId]
  )

  useImperativeHandle(ref, () => ({
    getChanges: () => ({ QuoteConfigurationMappingGroupId, QuoteConfigurationMappingGroup: selectedGroup?.Text }),
    isChangeReady: () => !!QuoteConfigurationMappingGroupId,
  }))

  useEffect(props.refreshBulkDrawerUI, [QuoteConfigurationMappingGroupId])

  return (
    <Horizontal flex={1} style={{ gap: '1rem' }} alignItems='center' justifyContent='flex-start'>
      <Select
        placeholder='Select Group'
        size='large'
        showSearch
        style={{ width: 200 }}
        value={QuoteConfigurationMappingGroupId}
        onChange={setQuoteConfigurationMappingGroupId}
        options={props?.metadata?.Data?.QuoteGroups?.map(toAntOption) ?? []}
      />
    </Horizontal>
  )
})
