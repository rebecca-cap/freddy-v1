/* eslint-disable */
import { DeleteOutlined, EllipsisOutlined } from '@ant-design/icons'
import { IFormulaMetadataResponse, IFormulaVariable } from '@api/usePriceEngineFormulas/types'
import { stopCloseOnEnter } from '@components/shared/Grid/cellEditors'
import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Dropdown, Menu, message, Modal } from 'antd'
import React from 'react'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'

interface IProps {
  metadata?: IFormulaMetadataResponse
  handleDeleteVariable: (FormulaVariableId: IFormulaVariable['FormulaVariableId']) => void
  configureProductLocation: (FormulaVariableId: IFormulaVariable['FormulaVariableId']) => void
  configureAdditionalOptions: (FormulaVariableId: IFormulaVariable['FormulaVariableId']) => void
  needsValueColumn: boolean
  selectedFormulaValue: any
  canWrite: boolean
}

export const PriceStatusColors = {
  Old: 'var(--theme-warning-dim)',
  Estimated: '#D2DCF9',
}

export const getPriceEngineFormulaVariableColumnDefs = ({
  metadata,
  handleDeleteVariable,
  configureProductLocation,
  needsValueColumn,
  selectedFormulaValue,
  canWrite,
  configureAdditionalOptions,
}: IProps) => {
  return [
    VariableName(),
    PricePublisherId(metadata),
    PriceTypeCvId(metadata),
    IsRequired(canWrite),
    ValueEffectiveDateRuleCvId(metadata, canWrite),
    LookupMethod(canWrite, configureProductLocation, metadata),
    needsValueColumn ? ValueColumn(selectedFormulaValue) : null,
    canWrite ? Action(handleDeleteVariable, configureAdditionalOptions) : null,
  ].filter((x) => x != null)
}

function VariableName() {
  return {
    field: 'VariableName',
    headerName: 'Name',
    valueFormatter: (params) => params?.data?.VariableName || 'Name is Required',
    cellStyle: (params) => (params?.data?.VariableName ? {} : { color: 'var(--theme-warning)', fontWeight: 'bold' }),
    valueSetter: (params) => {
      if (params?.newValue?.includes(' ')) {
        message.error('Variable names cannot contain spaces')
        return false
      }
      params.data.VariableName = params?.newValue
      return true
    },
  }
}

function PricePublisherId(metadata: IFormulaMetadataResponse | undefined) {
  return {
    field: 'PricePublisherId',
    headerName: 'Price Publisher',
    cellEditor: SearchableSelect,
    cellEditorPopup: true,
    cellEditorParams: (params) => ({
      showSearch: true,
      onKeyDown: stopCloseOnEnter(params),
      options: metadata?.Publishers?.map((option) => ({
        value: option.Value,
        label: option.Text,
      })),
    }),
    valueGetter: (props) => {
      return metadata?.Publishers?.find((option) => option.Value == props?.data?.PricePublisherId)?.Text
    },
  }
}

function PriceTypeCvId(metadata: IFormulaMetadataResponse | undefined) {
  return {
    field: 'PriceTypeCvId',
    headerName: 'Type',
    maxWidth: 200,
    cellEditor: SearchableSelect,
    cellEditorPopup: true,
    cellEditorParams: (params) => {
      const pricePublisherId = +params?.data.PricePublisherId || 0
      const availablePriceTypes = metadata?.PublisherPriceTypes[pricePublisherId]
      return {
        showSearch: true,
        onKeyDown: stopCloseOnEnter(params),
        options: availablePriceTypes?.map((option) => ({
          value: option.Value,
          label: option.Text,
        })),
      }
    },
    valueGetter: (props) => {
      return metadata?.PriceTypes?.find((option) => option.Value == props?.data?.PriceTypeCvId)?.Text
    },
  }
}

function IsRequired(canWrite: boolean) {
  return {
    field: 'IsRequired',
    headerName: 'Required',
    editable: canWrite,
    maxWidth: 125,
    cellEditor: SearchableSelect,
    cellEditorPopup: true,
    filterParams: {
      valueFormatter: (params) => (params.value ? "Yes" : "No"),
    },
    cellEditorParams: (params) => ({
      onKeyDown: stopCloseOnEnter(params),
      options: [
        {
          value: true,
          label: 'Yes',
        },
        {
          value: false,
          label: 'No',
        },
      ],
    }),
    cellRenderer: ({ value }) => {
      return (
        <Horizontal verticalCenter justifyContent='center'>
          <BBDTag success={value} style={{ textAlign: 'center', maxWidth: 40 }}>
            {value ? 'Yes' : 'No'}
          </BBDTag>
        </Horizontal>
      )
    },
  }
}

function ValueEffectiveDateRuleCvId(metadata: IFormulaMetadataResponse | undefined, canWrite: boolean) {
  return {
    maxWidth: 180,
    field: 'ValueEffectiveDateRuleCvId',
    editable: canWrite,
    headerName: 'Date Rule',
    valueFormatter: (params) => {
      const dateRuleDisplay = metadata?.DateRules?.find(
        (option) => option.Value == params?.data?.ValueEffectiveDateRuleCvId
      )?.Text
      return dateRuleDisplay || 'Date Rule is Required'
    },
    cellStyle: (params) => {
      const dateRuleDisplay = metadata?.DateRules?.find(
        (option) => option.Value == params?.data?.ValueEffectiveDateRuleCvId
      )?.Text
      return dateRuleDisplay ? {} : { color: 'var(--theme-warning)', fontWeight: 'bold' }
    },
    cellEditor: SearchableSelect,
    cellEditorPopup: true,
    cellEditorParams: (params) => ({
      showSearch: true,
      onKeyDown: stopCloseOnEnter(params),
      options: metadata?.DateRules?.map((option) => ({
        value: option.Value,
        label: option.Text,
      })),
    }),
    valueGetter: (props) => {
      return metadata?.DateRules?.find((option) => option.Value == props?.data?.ValueEffectiveDateRuleCvId)?.Text
    },
  }
}

function LookupMethod(
  canWrite: boolean,
  configureProductLocation: (FormulaVariableId: IFormulaVariable['FormulaVariableId']) => void,
  metadata: IFormulaMetadataResponse | undefined
) {
  return {
    editable: canWrite,
    headerName: 'Lookup Method',
    filterParams: {
      valueGetter: (params) => getProductLocationText(params?.data),
    },
    cellRenderer: (params) => (
      <span
        onClick={() => {
          if (canWrite) configureProductLocation(params?.data?.FormulaVariableId)
        }}
      >
        {getProductLocationText(params?.data)}
      </span>
    ),
    cellStyle: canWrite
      ? {
          textDecoration: 'underline',
          cursor: 'pointer',
        }
      : null,
  }

  function getProductLocationText(row: IFormulaVariable) {
    // Specific price instrument selected
    if (row?.PriceInstrumentId)
      return metadata?.Instruments?.find((option) => option.Value == row?.PriceInstrumentId?.toString())?.Text

    // Auto product / location
    if (!row?.SpecificProductId && !row?.SpecificLocationId && !row?.SpecificCounterPartyId)
      return 'Given Product @ Given Location'

    // Either a specific product or location (or both) were selected
    const productText = metadata?.Products?.find((option) => option.Value == row?.SpecificProductId?.toString())?.Text
    const locationText = metadata?.Locations?.find(
      (option) => option.Value == row?.SpecificLocationId?.toString()
    )?.Text
    const counterpartyText = metadata?.CounterParties?.find(
      (option) => option.Value == row?.SpecificCounterPartyId?.toString()
    )?.Text
    return `${productText || 'Given Product'} @ ${locationText || 'Given Location'}${
      row?.SpecificCounterPartyId ? ` - ${counterpartyText}` : ''
    }`
  }
}

function ValueColumn(selectedFormulaValue) {
  return {
    field: 'Value',
    headerName: 'Value',
    maxWidth: 100,
    cellRenderer: ({ getValue }) => {
      const value = getValue()
      return typeof value === 'number' ? fmt.currency(value) : value
    },
    cellStyle: ({ value, data }) => {
      const priceStatus = selectedFormulaValue?.Variables?.find(
        (v) => v.VariableName?.toLowerCase() === data?.VariableName?.toLowerCase()
      )?.PriceStatus

      const status = data?.Value === 'Not Required' ? 'Not Required' : priceStatus
      switch (status) {
        case 'Estimate':
          return { backgroundColor: '#D2DCF9', textAlign: 'right' }
        case 'Old':
          return { backgroundColor: 'var(--theme-warning-dim)', textAlign: 'right' }
        case 'Estimated':
          return { backgroundColor: '#D2DCF9', textAlign: 'right' }
        case 'Missing':
          return { backgroundColor: 'var(--theme-error-dim)', textAlign: 'right' }
        case 'Not Required':
        case null:
        case undefined:
          return { textAlign: 'right' }
        default:
          return { backgroundColor: 'var(--theme-success-dim)', textAlign: 'right' }
      }
    },
  }
}

function Action(handleDeleteVariable: (FormulaVariableId: IFormulaVariable['FormulaVariableId']) => void, configureAdditionalOptions) {
  return {
    maxWidth: 80,
    editable: false,
    cellRenderer: (params) => {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Dropdown
            placement='bottomRight'
            overlay={
              <Menu
                items={[
                  {
                    key: 'Configure',
                    label: 'Configure Additional Options',
                    onClick: () => configureAdditionalOptions(params?.data?.FormulaVariableId),
                  },
                  {
                    key: 'Delete',
                    label: 'Delete Variable',
                    icon: <DeleteOutlined />,
                    onClick: () => {
                      Modal.confirm({
                        title: 'Are you sure you want to delete this variable?',
                        content: 'This action cannot be undone.',
                        onOk: () => handleDeleteVariable(params?.data?.FormulaVariableId),
                      })
                    },
                  },
                ]}
              />
            }
          >
            <div>
              <Texto weight='bolder' category='h4' style={{ cursor: 'pointer' }} className='mr-2'>
                <EllipsisOutlined style={{ transform: 'rotate(90deg)' }} />
              </Texto>
            </div>
          </Dropdown>
        </div>
      )
    },
  }
}
