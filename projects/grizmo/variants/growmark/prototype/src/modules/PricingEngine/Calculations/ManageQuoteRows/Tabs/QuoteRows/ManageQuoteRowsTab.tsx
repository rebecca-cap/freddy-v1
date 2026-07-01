import './styles.css'

import { FolderAddOutlined } from '@ant-design/icons'
import { NumberCellEditor } from '@components/shared/Grid/cellEditors/NumberCellEditor'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviButton, GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { useQuoteRows } from '@modules/PricingEngine/Calculations/ManageQuoteRows/api/useQuoteRows'
import { QuoteDetailRow } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteRows/components/Grid/QuoteCompetitorDetails/QuoteDetailRow'
import { GridApi, IsGroupOpenByDefaultParams } from 'ag-grid-community'
import { Drawer } from 'antd'
import React, { MutableRefObject, useCallback, useMemo, useRef, useState } from 'react'

import { createColumnDefs } from './components/Grid/columns/columnDefs'
import { QuoteRowGroupsDrawer } from './components/QuoteRowGroupsDrawer'

export function ManageQuoteRowsTab({ canWrite }: { canWrite: boolean }) {
  const { useMappings, useMappingMetadata, upsertMapping, useGroups } = useQuoteRows()
  const [isBulkChangeVisible, setIsBulkChangeVisible] = React.useState(false)
  const { data: mappings, isFetching: mappingsFetching } = useMappings()
  const { data: metadata, isFetching: metadataFetching } = useMappingMetadata()
  const { data: groups } = useGroups()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const gridAPIRef = useRef() as MutableRefObject<GridApi>

  const upsertRef = useRef(upsertMapping)

  const columnDefs = useMemo(
    () =>
      createColumnDefs({
        metadata,
        mutationRef: upsertRef,
        canWrite,
      }),
    [metadata, canWrite, upsertRef]
  )

  const updateWrapper = (row) => {
    const rowList = Array.isArray(row) ? row : [row]
    const rowsThatArentGroupRows = rowList.filter((r) => !!r?.QuoteConfigurationId)
    upsertMapping.mutate({ rowOrRows: rowsThatArentGroupRows })
  }
  const storageKey = 'QuoteRowsData'
  const gridViewManager = useGridViewManager(storageKey)
  const rowData = useMemo(() => mappings?.Data, [mappings?.Data])
  const loading = useMemo(() => mappingsFetching || metadataFetching, [mappingsFetching, metadataFetching])
  const controlBarProps = useMemo(
    () => ({
      title: 'Quote Rows',
      hideActiveFilters: false,
      actionButtons: canWrite && (
        <Horizontal>
          <GraviButton
            className='mr-3'
            buttonText='Add Quote Groups'
            onClick={() => setIsDrawerOpen(true)}
            icon={<FolderAddOutlined />}
          />
        </Horizontal>
      ),
    }),
    [canWrite]
  )
  const agPropOverrides = useMemo(
    () => ({
      getRowId: (row) => row?.data?.QuoteConfigurationMappingId,
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      frameworkComponents: { SearchableSelect, number: NumberCellEditor },
    }),
    []
  )
  const isGroupOpenByDefault = useCallback((params: IsGroupOpenByDefaultParams) => {
    return params.field === 'QuoteConfigurationName'
  }, [])
  return (
    <Vertical>
      <Drawer
        title='Manage Quote Row Groups'
        placement='right'
        onClose={() => setIsDrawerOpen(false)}
        visible={isDrawerOpen}
      >
        <QuoteRowGroupsDrawer groups={groups?.Data || []} closeDrawer={() => setIsDrawerOpen(false)} />
      </Drawer>
      <Vertical flex='1'>
        <GraviGrid
          externalRef={gridAPIRef}
          isBulkChangeVisible={isBulkChangeVisible}
          setIsBulkChangeVisible={canWrite ? setIsBulkChangeVisible : undefined}
          controlBarProps={controlBarProps}
          loading={loading}
          masterDetail
          detailCellRenderer={QuoteDetailRow}
          detailRowAutoHeight
          agPropOverrides={agPropOverrides}
          updateEP={canWrite ? updateWrapper : undefined}
          storageKey={storageKey}
          rowData={rowData || []}
          columnDefs={columnDefs}
          gridViewManager={gridViewManager}
          isGroupOpenByDefault={isGroupOpenByDefault}
        />
      </Vertical>
    </Vertical>
  )
}
