import { CreateOrUpdateMappingsPayload } from '@api/useDTNMappings/types'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { UpdateNotificationMessage } from '@components/shared/Grid/Messages/UpdateNotificationMessage'
import { GraviGrid, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Switch } from 'antd'
import React, { useMemo, useRef, useState } from 'react'

import { DTNMappingsPageProps } from '../../page'
import { dtnProductColumnDefs } from './columnDefs'

export const DTNProductsTab: React.FC<DTNMappingsPageProps> = ({
  mappings,
  metadata,
  isLoading,
  updateMutation,
  canWrite,
  fixPayload,
}) => {
  const gridApiRef = useRef()

  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState<boolean>(false)
  const [showHidden, setShowHidden] = useState(false)
  const handleMappingUpdate = async (row: CreateOrUpdateMappingsPayload['ProductRules'][number]) => {
    const payload = fixPayload(row)
    const response = await updateMutation.mutateAsync({ ProductRules: payload })
    UpdateNotificationMessage({ response, numberOfRecords: response?.Data?.ProductRules?.length })
  }

  const columnDefs = useMemo(() => dtnProductColumnDefs({ metadata, canWrite }), [canWrite, metadata])

  const filteredData = useMemo(
    () => (showHidden ? mappings?.Data?.ProductRules : mappings?.Data?.ProductRules?.filter((x) => !x.IsHidden)),
    [showHidden, mappings, metadata]
  )
  const agPropOverrides = useMemo(
    () => ({
      rowGroupPanelShow: 'never' as const,
      getRowId: (row) => row.data.DataTranslationRuleId,
      frameworkComponents: { SearchableSelect },
      rowSelection: 'multiple' as const,
      rowMultiSelectWithClick: true,
    }),
    []
  )
  const controlBarProps = useMemo(
    () => ({
      title: 'Products',
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
      agPropOverrides={agPropOverrides}
      updateEP={canWrite && handleMappingUpdate}
      controlBarProps={controlBarProps}
      rowData={filteredData}
      loading={isLoading}
      isBulkChangeVisible={isBulkChangeVisible}
      setIsBulkChangeVisible={canWrite ? setIsBulkChangeVisible : undefined}
      storageKey='Integrations-PriceImportMappings-ProductsGrid'
      hideSaveDisplay
      onSelectionChanged={() => {}}
    />
  )
}
