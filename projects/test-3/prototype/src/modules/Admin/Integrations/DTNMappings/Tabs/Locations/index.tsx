import { CreateOrUpdateMappingsPayload } from '@api/useDTNMappings/types'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { UpdateNotificationMessage } from '@components/shared/Grid/Messages/UpdateNotificationMessage'
import { GraviGrid, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Switch } from 'antd'
import React, { useMemo, useRef, useState } from 'react'

import { DTNMappingsPageProps } from '../../page'
import { dtnLocationColumnDefs } from './columnDefs'

export const DTNLocationsTab: React.FC<DTNMappingsPageProps> = ({
  metadata,
  isLoading,
  mappings,
  updateMutation,
  canWrite,
  fixPayload,
}) => {
  const gridApiRef = useRef()

  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState(false)
  const [showHidden, setShowHidden] = useState(false)
  const handleMappingUpdate = async (row: CreateOrUpdateMappingsPayload['LocationRules'][number]) => {
    const payload = fixPayload(row)
    const response = await updateMutation.mutateAsync({ LocationRules: payload })
    UpdateNotificationMessage({ response, numberOfRecords: response?.Data?.LocationRules?.length })
  }

  const columnDefs = useMemo(() => dtnLocationColumnDefs({ metadata, canWrite }), [canWrite, metadata])

  const filteredData = useMemo(
    () => (showHidden ? mappings?.Data?.LocationRules : mappings?.Data?.LocationRules?.filter((x) => !x.IsHidden)),
    [showHidden, mappings]
  )
  const agPropOverrides = useMemo(
    () => ({
      rowGroupPanelShow: 'never' as const,
      frameworkComponents: { SearchableSelect },
      getRowId: (row) => row.data.DataTranslationRuleId,
      rowSelection: 'multiple' as const,
      rowMultiSelectWithClick: true,
    }),
    []
  )
  const controlBarProps = useMemo(
    () => ({
      title: 'Locations',
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
      rowData={filteredData}
      loading={isLoading}
      updateEP={canWrite && handleMappingUpdate}
      controlBarProps={controlBarProps}
      isBulkChangeVisible={isBulkChangeVisible}
      setIsBulkChangeVisible={canWrite ? setIsBulkChangeVisible : undefined}
      storageKey='Integrations-PriceImportMappings-Locations'
      onSelectionChanged={() => {}}
      hideSaveDisplay
    />
  )
}
