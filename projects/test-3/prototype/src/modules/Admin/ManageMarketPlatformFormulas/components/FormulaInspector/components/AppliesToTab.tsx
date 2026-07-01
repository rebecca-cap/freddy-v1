import './grid-overrides.css'

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { MarketPlatformFormulaMetadata, MarketPlatformFormulasResponse } from '@api/useMarketPlatformFormulas/types'
import { GraviButton, GraviGrid, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Popover } from 'antd'
import React, { useMemo } from 'react'

import { NewMappingForm } from '../../NewMappingForm'

interface ITabProps {
  selectedFormula: MarketPlatformFormulasResponse['Data'][number]
  onSubmit: typeof NewMappingForm.defaultProps.onSubmit
  onDelete: (
    id: MarketPlatformFormulasResponse['Data'][number]['AppliesTo'][number]['FormulaReferenceDataMappingId']
  ) => void
  metadata: MarketPlatformFormulaMetadata
  canWrite: boolean
}

type PopoverProps = Pick<ITabProps, 'selectedFormula'> & {
  handleSubmit: typeof NewMappingForm.defaultProps.onSubmit
  metadata: MarketPlatformFormulaMetadata
}

const CreateMappingPopover: React.FC<PopoverProps> = ({ selectedFormula, handleSubmit, metadata }) => {
  const [isPopoverVisible, setIsPopoverVisible] = React.useState(false)

  return (
    <Popover
      visible={isPopoverVisible}
      trigger='click'
      onVisibleChange={(visible) => setIsPopoverVisible(visible)}
      content={
        <NewMappingForm
          onSubmit={(values) => {
            handleSubmit(values)
            setIsPopoverVisible(false)
          }}
          locationOptions={metadata?.Locations}
          productOptions={metadata?.Products}
          formula={selectedFormula}
        />
      }
      placement='bottomRight'
    >
      <GraviButton
        buttonText='New Mapping'
        theme2
        size='small'
        icon={<PlusOutlined />}
        onClick={() => {
          setIsPopoverVisible(true)
        }}
      />
    </Popover>
  )
}

export const AppliesToTab: React.FC<ITabProps> = ({ selectedFormula, onSubmit, onDelete, metadata, canWrite }) => {
  const columnDefs = useMemo(() => {
    const columns = [
      {
        headerName: 'Product',
        field: 'ProductId',
        valueGetter: (params) => metadata?.Products?.find((p) => p.Value == params.data?.ProductId)?.Text,
      },
      {
        headerName: 'Location',
        field: 'LocationId',
        valueGetter: (params) => metadata?.Locations?.find((p) => p.Value == params.data?.LocationId)?.Text,
      },
    ]
    if (canWrite) {
      columns.push({
        headerName: '',
        type: 'rightAligned',
        maxWidth: 50,
        cellRenderer: (params) => {
          return (
            <Horizontal justifyContent='end' verticalCenter>
              <DeleteOutlined
                className='py-2'
                style={{ width: 30, color: 'var(--theme-error)' }}
                onClick={() => onDelete(params.data.FormulaReferenceDataMappingId)}
              />
            </Horizontal>
          )
        },
      })
    }
    return columns
  }, [metadata, onDelete, canWrite])

  return (
    <div style={{ minHeight: '81vh', height: 0 }} id='appliesToWrapper'>
      <GraviGrid
        suppressDragLeaveHidesColumns
        agPropOverrides={{
          rowGroupPanelShow: 'never',
          getRowId: (row) => row.data?.FormulaReferenceDataMappingId,
          rowHeight: 40,
        }}
        showColumnsToolbar={false}
        controlBarProps={{
          actionButtons: canWrite && (
            <CreateMappingPopover selectedFormula={selectedFormula} handleSubmit={onSubmit} metadata={metadata} />
          ),
          title: <Texto style={{ fontSize: 12 }}>Applies To</Texto>,
          customSearchBar: () => <></>,
        }}
        columnDefs={columnDefs}
        rowData={selectedFormula?.AppliesTo}
      />
    </div>
  )
}
