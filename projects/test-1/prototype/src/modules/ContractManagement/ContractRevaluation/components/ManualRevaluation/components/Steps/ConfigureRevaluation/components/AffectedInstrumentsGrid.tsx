import { checkRowSelectionLimit } from '@components/shared/Grid/limitedRowSelectionUtil/limitedRowSelectionUtil'
import { GraviGrid, Texto } from '@gravitate-js/excalibrr'
import { MetadataItem } from '@modules/ContractManagement/ContractRevaluation/api/types'
import { GridApi, SelectionChangedEvent } from 'ag-grid-community'
import { Form, FormInstance } from 'antd'
import { useEffect, useMemo, useRef } from 'react'

import { AffectedInstrumentsColumnDefs } from './AffectedInstrumentsColumnDefs'

interface AffectedInstrumentsGridProps {
  data: MetadataItem[]
  selectedPublisherName: string
  setSelectedPriceInstruments: React.Dispatch<React.SetStateAction<MetadataItem[]>>
  selectedPriceInstruments: MetadataItem[]
  form: FormInstance
}

export function AffectedInstrumentsGrid({
  data,
  selectedPublisherName,
  setSelectedPriceInstruments,
  selectedPriceInstruments,
  form,
}: AffectedInstrumentsGridProps) {
  const gridRef = useRef<GridApi>() as React.MutableRefObject<GridApi>
  const columnDefs = useMemo(() => AffectedInstrumentsColumnDefs(), [])

  const agPropOverrides = useMemo(() => {
    return {
      getRowId: (params: { data: MetadataItem }) => params?.data?.Value?.toString(),
      rowSelection: 'multiple' as const,
      rowGroupPanelShow: 'never' as const,
      suppressDragLeaveHidesColumns: true,
      rowHeight: 40,
    }
  }, [])

  const controlBarProps = useMemo(() => {
    return {
      title: '',
      hideActiveFilters: false,
      showSelectedCount: true,
    }
  }, [])

  const onSelectionChanged = (event: SelectionChangedEvent) => {
    const newSelection = checkRowSelectionLimit(
      event,
      selectedPriceInstruments,
      setSelectedPriceInstruments,
      'Value',
      1000
    )
    form.setFieldsValue({
      PriceInstruments: newSelection,
    })
  }
  useEffect(() => {
    if (selectedPriceInstruments.length > 0 && gridRef.current) {
      gridRef.current?.forEachNodeAfterFilterAndSort((node) => {
        if (selectedPriceInstruments.some((row) => row.Value == node.data.Value)) {
          node.setSelected(true)
        }
      })
    }
  }, [gridRef.current])

  return (
    <div style={{ width: '100%' }}>
      <Texto className={'mt-4'} category={'h4'}>
        Affected Instruments
      </Texto>
      <Texto className={'mb-4'} category={'p2'}>
        Search and select instruments from {selectedPublisherName}
      </Texto>

      <div style={{ width: '100%', height: 300 }}>
        <GraviGrid
          controlBarProps={controlBarProps}
          agPropOverrides={agPropOverrides}
          externalRef={gridRef}
          columnDefs={columnDefs}
          rowData={data || []}
          loading={false}
          sideBar={false}
          onSelectionChanged={onSelectionChanged}
          onGridReady={(params) => {
            if (!gridRef.current) {
              gridRef.current = params.api
              if (selectedPriceInstruments.length > 0) {
                params.api.forEachNodeAfterFilterAndSort((node) => {
                  if (selectedPriceInstruments.some((row) => row.Value == node.data.Value)) {
                    node.setSelected(true)
                  }
                })
              }
            }
          }}
        />
      </div>
      <Form.Item
        name='PriceInstruments'
        rules={[{ required: true, message: 'Please select at least one instrument' }]}
        style={{ height: 0 }}
      ></Form.Item>
    </div>
  )
}
