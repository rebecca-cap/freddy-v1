import { CreateOrUpdateMappingsPayload } from '@api/useDTNMappings/types'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { UpdateNotificationMessage } from '@components/shared/Grid/Messages/UpdateNotificationMessage'
import { RowSelectionTypes } from '@components/shared/Grid/schema.type'
import { GraviGrid, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Switch } from 'antd'
import React, { useMemo, useRef, useState } from 'react'

import { DTNMappingsPageProps } from '../../page'
import { dtnSupplierColumnDefs } from './columnDefs'

export const DTNSupplierPublishersTab: React.FC<DTNMappingsPageProps> = ({
  metadata,
  isLoading,
  mappings,
  updateMutation,
  canWrite,
  fixPayload,
}) => {
  const gridApiRef = useRef()
  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState<boolean>(false)
  const [showHidden, setShowHidden] = useState<boolean>(false)

  const handleMappingUpdate = async (data: CreateOrUpdateMappingsPayload['SupplierRules']) => {
    const payload = fixPayload(data)
    const response = await updateMutation.mutateAsync({ SupplierRules: payload })
    UpdateNotificationMessage({ response, numberOfRecords: response?.Data?.SupplierRules?.length })
    return true
  }

  const columnDefs = useMemo(() => dtnSupplierColumnDefs({ metadata, canWrite }), [canWrite, metadata])

  const filteredData = useMemo(
    () => (showHidden ? mappings?.Data?.SupplierRules : mappings?.Data?.SupplierRules?.filter((x) => !x.IsHidden)),
    [showHidden, mappings]
  )
  const agPropOverrides = useMemo(
    () => ({
      rowGroupPanelShow: 'never' as const,
      frameworkComponents: { SearchableSelect },
      getRowId: (row) => row?.data?.DataTranslationRuleId,
      rowSelection: 'multiple' as RowSelectionTypes,
      rowMultiSelectWithClick: true,
    }),
    []
  )
  const controlBarProps = useMemo(
    () => ({
      title: 'Suppliers/Publishers',
      actionButtons: (
        <Horizontal style={{ gap: '1rem' }}>
          <Switch checked={showHidden} onChange={() => setShowHidden(!showHidden)} />
          <Texto>Show Hidden</Texto>
        </Horizontal>
      ),
    }),
    [showHidden]
  )

  return (
    <GraviGrid
      externalRef={gridApiRef}
      columnDefs={columnDefs}
      controlBarProps={controlBarProps}
      agPropOverrides={agPropOverrides}
      rowData={filteredData}
      loading={isLoading}
      isDirtyEdit
      onDirtyChangeSave={handleMappingUpdate}
      updateEP={canWrite && handleMappingUpdate}
      isBulkChangeVisible={isBulkChangeVisible}
      setIsBulkChangeVisible={canWrite ? setIsBulkChangeVisible : undefined}
      storageKey='Integrations-PriceImportMappings-SuppliersPublishersGrid'
      onSelectionChanged={() => {}} // seems to fix non-selection bug
      hideSaveDisplay
    />
  )
}
