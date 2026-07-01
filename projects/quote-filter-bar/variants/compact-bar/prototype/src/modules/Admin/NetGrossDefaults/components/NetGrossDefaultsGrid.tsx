import { FileSearchOutlined } from '@ant-design/icons'
import { NetGrossMetadataResponse, NetGrossRulesItem } from '@api/useNetGross/types'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviButton, GraviGrid, Horizontal } from '@gravitate-js/excalibrr'
import { RowDragEndEvent } from 'ag-grid-community'
import React, { useMemo, useRef } from 'react'

import { getColumnDefs } from './columns'
import { newNetGrossRuleCreateConfig } from './createConfig'
import { DownloadButton } from './DownloadButton'

type NetGrossDefaultsGridProps = {
  rowData: NetGrossRulesItem[] | undefined
  metadata: NetGrossMetadataResponse | undefined
  netOrGrossDefaultTypeCvId: string
  createUpdateNetGrossRulesMutation: any
  deleteRuleMutation: any
  moveRuleMutation: any
  isNetGrossRulesLoading: boolean
  tabTitle: string
}

export function NetGrossDefaultsGrid({
  rowData,
  metadata,
  netOrGrossDefaultTypeCvId,
  createUpdateNetGrossRulesMutation,
  deleteRuleMutation,
  moveRuleMutation,
  isNetGrossRulesLoading,
  tabTitle,
}: NetGrossDefaultsGridProps) {
  const gridAPIRef = useRef()

  const handleDelete = (id) => {
    deleteRuleMutation.mutateAsync([id])
  }

  const columnDefs = useMemo(
    () => getColumnDefs(metadata, netOrGrossDefaultTypeCvId, handleDelete),
    [netOrGrossDefaultTypeCvId]
  )

  const handleCreate = (formData) => {
    const CounterPartyId = metadata?.CounterPartyList.find((item) => item.Text === formData?.Counterparty)?.Value
    const LocationId = metadata?.LocationList.find((item) => item.Text === formData?.Location)?.Value
    const NetOrGrossCvId = metadata?.NetOrGrossTypeList.find((item) => item.Text === formData?.NetGross)?.Value
    const ProductId = metadata?.ProductList.find((item) => item.Text === formData?.Product)?.Value
    const QuoteConfigurationId = metadata?.QuoteConfigurationList.find(
      (item) => item.Text === formData?.QuoteConfiguration
    )?.Value
    const TradeEntryTypeCvId = metadata?.TradeEntryTypeList.find(
      (item) => item.Text === formData?.TradeEntryType
    )?.Value
    const Order = (rowData?.length || 0) + 1

    const newRule = {
      CounterPartyId,
      LocationId,
      NetGrossDefaultTypeCvId: netOrGrossDefaultTypeCvId,
      NetOrGrossCvId,
      Order,
      ProductId,
      QuoteConfigurationId,
      TradeEntryTypeCvId,
    }
    return createUpdateNetGrossRulesMutation.mutateAsync([newRule])
  }

  const handleUpdate = (updatedRow) => {
    return createUpdateNetGrossRulesMutation.mutateAsync([updatedRow])
  }

  const handleDrag = (e: RowDragEndEvent) => {
    const NewIndex = e.overIndex + 1
    const NetGrossDefaultId = e.node?.data?.NetGrossDefaultId

    if (NewIndex !== e.node?.data?.Order) {
      moveRuleMutation.mutateAsync({ NetGrossDefaultId, NewIndex })
    }
  }

  return (
    <div style={{ height: '87vh' }}>
      <GraviGrid
        externalRef={gridAPIRef}
        controlBarProps={{
          title: 'Quote Rules',
          actionButtons: (
            <Horizontal>
              <GraviButton buttonText='Rule Inspector' icon={<FileSearchOutlined />} />
              <DownloadButton gridAPIRef={gridAPIRef} pageTitle='NetGrossDefaults' tabTitle={tabTitle} />
            </Horizontal>
          ),
        }}
        agPropOverrides={{
          getRowId: (row) => row.data?.NetGrossDefaultId,
          frameworkComponents: { SearchableSelect },
          rowSelection: 'multiple',
          columnDefs,
          suppressRowClickSelection: true,
          onRowDragEnd: handleDrag,
          rowDragManaged: true,
        }}
        storageKey='PricingEngine/NetGrossDefaults'
        createConfig={newNetGrossRuleCreateConfig}
        createSelectOptions={{ ...metadata, netOrGrossDefaultTypeCvId }}
        createEP={handleCreate}
        updateEP={handleUpdate}
        rowData={rowData}
        loading={isNetGrossRulesLoading}
      />
    </div>
  )
}
