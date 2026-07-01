import { DeleteOutlined, EllipsisOutlined, SettingFilled } from '@ant-design/icons'
import { MarketPlatformFormulaMetadata, VariablesItem } from '@api/useMarketPlatformFormulas/types'
import { IFormulaVariable } from '@api/usePriceEngineFormulas/types'
import { stopCloseOnEnter } from '@components/shared/Grid/cellEditors'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import { Dropdown, Menu, message, Modal, Tooltip } from 'antd'
import React from 'react'

interface IProps {
  metadata?: MarketPlatformFormulaMetadata
  handleDeleteVariable: (FormulaVariableId: VariablesItem['FormulaVariableId']) => void
  configureProductLocation: (FormulaVariableId: VariablesItem['FormulaVariableId']) => void
  configureAdditionalOptions: (FormulaVariableId: VariablesItem['FormulaVariableId']) => void
  needsValueColumn: boolean
  selectedFormulaValue: any
  canWrite: boolean
}

export const PriceStatusColors = {
  Old: 'var(--theme-warning-dim)',
  Estimated: '#D2DCF9',
}

export const getMarketPlatformFormulasVariableColumnDefs = ({
  metadata,
  handleDeleteVariable,
  configureProductLocation,
  configureAdditionalOptions,
  needsValueColumn,
  selectedFormulaValue,
  canWrite,
}: IProps) => {
  const placeHolderTooltipText = 'Not Applicable to Placeholder Variables'
  const getProductLocationText = (row: IFormulaVariable) => {
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

  const actionColumn = canWrite
    ? [
        {
          maxWidth: 80,
          editable: false,
          cellRenderer: (params) => {
            return (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Dropdown
                  trigger={['click']}
                  placement='bottomRight'
                  overlay={
                    <Menu
                      items={[
                        {
                          key: 'Configure',
                          icon: <SettingFilled />,
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
        },
      ]
    : []

  const valueColumnDef = needsValueColumn
    ? [
        {
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
        },
      ]
    : []

  const columnDefs: ColDef[] = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
      field: 'IsRequired',
      headerName: 'Required',
      editable: ({ data }) => !data?.IsPlaceholder && canWrite,
      maxWidth: 125,
      cellEditor: SearchableSelect,
      cellEditorPopup: true,
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
      cellRenderer: ({ value, data }) => {
        return (
          <Horizontal verticalCenter justifyContent='center'>
            <Tooltip title={data?.IsPlaceholder && placeHolderTooltipText}>
              <BBDTag success={value} style={{ textAlign: 'center', maxWidth: 40 }}>
                {value ? 'Yes' : 'No'}
              </BBDTag>
            </Tooltip>
          </Horizontal>
        )
      },
    },
    {
      field: 'IsCost',
      headerName: 'Cost Component',
      cellEditor: SearchableSelect,
      cellEditorPopup: true,
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
    },
    {
      maxWidth: 180,
      field: 'ValueEffectiveDateRuleCvId',
      headerName: 'Date Rule',
      editable: ({ data }) => !data?.IsPlaceholder && canWrite,
      valueFormatter: (params) => {
        const dateRuleDisplay = metadata?.DateRules?.find(
          (option) => option.Value == params?.data?.ValueEffectiveDateRuleCvId
        )?.Text
        return dateRuleDisplay || 'Date Rule is Required'
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
      cellRenderer: ({ value, data }) => {
        const dateRuleDisplay = metadata?.DateRules?.find(
          (option) => option.Value == data?.ValueEffectiveDateRuleCvId
        )?.Text

        const styling = dateRuleDisplay ? {} : { color: 'var(--theme-warning)', fontWeight: 'bold' }

        return (
          <Horizontal verticalCenter style={{ ...styling }}>
            <Tooltip title={data?.IsPlaceholder && placeHolderTooltipText}>{value}</Tooltip>
          </Horizontal>
        )
      },
    },
    {
      editable: ({ data }) => !data?.IsPlaceholder && canWrite,
      headerName: 'Lookup Method',
      cellRenderer: (params) => (
        <Tooltip title={params?.data?.IsPlaceholder && placeHolderTooltipText}>
          <span
            onClick={() => {
              if (canWrite && !params?.data?.IsPlaceholder) configureProductLocation(params?.data?.FormulaVariableId)
            }}
          >
            {getProductLocationText(params?.data)}
          </span>
        </Tooltip>
      ),
      cellStyle: (params) => {
        if (canWrite && !params?.data?.IsPlaceholder) {
          return {
            textDecoration: 'underline',
            cursor: 'pointer',
          }
        }
        return undefined
      },
    },
  ]

  return [...columnDefs, ...actionColumn, ...valueColumnDef]
}
