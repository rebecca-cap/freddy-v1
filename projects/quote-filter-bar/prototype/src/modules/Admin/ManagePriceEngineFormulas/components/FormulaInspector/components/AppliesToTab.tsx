import './grid-overrides.css'

import { IFormulaMetadataResponse, IFormulaOverviewResponse } from '@api/usePriceEngineFormulas/types'
import { GraviButton, GraviGrid } from '@gravitate-js/excalibrr'
import { Button, Popover } from 'antd'
import React, { useMemo } from 'react'

import { NewMappingForm } from '../../NewMappingForm'

interface ITabProps {
  selectedFormula: IFormulaOverviewResponse['Data'][number]
  onSubmit: typeof NewMappingForm.defaultProps.onSubmit
  onDelete: (id: IFormulaOverviewResponse['Data'][number]['AppliesTo'][number]['FormulaReferenceDataMappingId']) => void
  metadata: IFormulaMetadataResponse
  canWrite: boolean
}

type PopoverProps = Pick<ITabProps, 'selectedFormula'> & {
  handleSubmit: typeof NewMappingForm.defaultProps.onSubmit
  metadata: IFormulaMetadataResponse
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
          counterpartyOptions={metadata?.CounterParties}
          formula={selectedFormula}
        />
      }
      placement='bottomRight'
    >
      <GraviButton
        buttonText='Create Mapping'
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
      {
        headerName: 'Counterparty',
        field: 'CounterPartyId',
        valueGetter: (params) => metadata?.CounterParties?.find((p) => p.Value == params.data?.CounterPartyId)?.Text,
      },
    ]
    if (canWrite) {
      columns.push({
        headerName: '',
        cellRenderer: (params) => (
          <Button type='link' onClick={() => onDelete(params.data.FormulaReferenceDataMappingId)}>
            Remove
          </Button>
        ),
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
        }}
        showColumnsToolbar={false}
        controlBarProps={{
          actionButtons: canWrite && (
            <CreateMappingPopover selectedFormula={selectedFormula} handleSubmit={onSubmit} metadata={metadata} />
          ),
          customSearchBar: () => <></>,
        }}
        columnDefs={columnDefs}
        rowData={selectedFormula?.AppliesTo}
      />
    </div>
  )
}
