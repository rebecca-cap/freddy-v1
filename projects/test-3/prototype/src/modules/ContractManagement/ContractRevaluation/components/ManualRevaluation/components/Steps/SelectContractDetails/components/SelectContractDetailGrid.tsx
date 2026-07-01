import { checkRowSelectionLimit } from '@components/shared/Grid/limitedRowSelectionUtil/limitedRowSelectionUtil'
import { GraviGrid } from '@gravitate-js/excalibrr'
import { useGridViewManager } from '@hooks/useGridViewManager/useGridViewManager'
import { ContractValuation, GetMetaDataResponse } from '@modules/ContractManagement/ContractRevaluation/api/types'
import { ColDef, GridApi, SelectionChangedEvent } from 'ag-grid-community'
import { Form, FormInstance } from 'antd'
import React, { useEffect, useMemo } from 'react'

import { SelectContractDetailColumnDefs } from './SelectContractDetailColumnDefs'
import { SelectContractDetailGridMasterDetail } from './SelectContractDetailGridMasterDetail'

interface SelectContractDetailGridProps {
  data: ContractValuation[] | []
  selectedRows: ContractValuation[]
  setSelectedRows: React.Dispatch<React.SetStateAction<ContractValuation[]>>
  form: FormInstance
  isValuationFetching: boolean
  metadata: GetMetaDataResponse['Data']
}

export function SelectContractDetailGrid({
  data,
  selectedRows,
  setSelectedRows,
  form,
  isValuationFetching,
  metadata,
}: SelectContractDetailGridProps) {
  const storageKey = 'ManualRevaluation::SelectContractDetailsGrid'
  const gridViewManager = useGridViewManager(storageKey)

  const gridRef = React.useRef<GridApi>() as React.MutableRefObject<GridApi>

  const columnDefs: ColDef[] = useMemo(() => SelectContractDetailColumnDefs(metadata), [metadata])

  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (params: { data: ContractValuation }) =>
        `${params?.data?.TradeEntryDetailId}-${params?.data?.TradeEntryId}`,
      rowSelection: 'multiple' as const,
      suppressDragLeaveHidesColumns: true,
      rowHeight: 40,
    }
  }, [])

  const onSelectionChanged = (e: SelectionChangedEvent) => {
    const newSelection = checkRowSelectionLimit(e, selectedRows, setSelectedRows, 'CurvePointId', 5)
    form.setFieldsValue({
      selectContractDetails: newSelection,
    })
  }
  const controlBarProps = useMemo(() => {
    return {
      title: '',
      hideActiveFilters: false,
      showSelectedCount: true,
    }
  }, [])
  useEffect(() => {
    if (selectedRows.length > 0) {
      gridRef.current?.forEachNodeAfterFilterAndSort((node) => {
        if (selectedRows.some((row) => row.CurvePointId === node.data.CurvePointId)) {
          node.setSelected(true)
        }
      })
    }
  }, [gridRef.current])

  return (
    <>
      <div style={{ width: '100%', height: 400 }}>
        <GraviGrid
          storageKey={storageKey}
          gridViewManager={gridViewManager}
          controlBarProps={controlBarProps}
          agPropOverrides={agPropOverrides}
          externalRef={gridRef}
          columnDefs={columnDefs}
          rowData={data}
          loading={isValuationFetching}
          onSelectionChanged={onSelectionChanged}
          masterDetail
          detailRowAutoHeight
          detailCellRenderer={SelectContractDetailGridMasterDetail}
        />
      </div>
      <Form.Item
        name='selectContractDetails'
        rules={[{ required: true, message: 'Please select at least one contract detail' }]}
        style={{ height: 0 }}
      ></Form.Item>
    </>
  )
}
