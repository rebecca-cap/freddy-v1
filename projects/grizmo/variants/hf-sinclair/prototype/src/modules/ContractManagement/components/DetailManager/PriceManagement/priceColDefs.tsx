import {
  CheckCircleFilled,
  DeleteOutlined,
  EditOutlined,
  ExperimentOutlined,
  LockFilled,
  VerticalAlignBottomOutlined,
  WarningFilled,
} from '@ant-design/icons'
import { stopCloseOnEnter } from '@components/shared/Grid/cellEditors'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { dateFormat } from '@components/TheArmory/helpers'
import { BBDTag, Horizontal, NotificationMessage, Texto, validateFloat } from '@gravitate-js/excalibrr'
import {
  ContractDetails,
  ContractManagementMetadata,
  Detail,
  Price,
} from '@modules/ContractManagement/api/types.schema'
import { isDefined } from '@utils/index'
import { ColDef } from 'ag-grid-community'
import { Button, message, Tooltip } from 'antd'
import moment from 'moment/moment'
import React from 'react'

import { ProvisionTypes } from '../../../utils'

interface PriceColumnDefProps {
  metadata?: ContractManagementMetadata
  setProvisionToEdit?: React.Dispatch<React.SetStateAction<Price | undefined>>
  deleteProvision?: (provision: Price) => void
  header?: ContractDetails
  managedDetail?: Detail | null
  canWrite: boolean
}
export function columnDefs({
  metadata,
  setProvisionToEdit,
  deleteProvision,
  header,
  managedDetail,
  canWrite,
}: PriceColumnDefProps) {
  const columns = [
    {
      headerName: '',
      cellRenderer: 'agGroupCellRenderer',
      field: 'Status',
      maxWidth: 40,
      editable: false,
    },
    {
      headerName: '',
      cellRenderer: showPriceProvisionStatus,
      field: 'Status',
      maxWidth: 40,
      editable: false,
    },
    {
      headerName: 'Type',
      field: 'ProvisionType',
      cellRenderer: ProvisionType,
      editable: canWrite,
      cellEditorPopup: true,
      cellEditor: 'agRichSelectCellEditor',
      minWidth: 115,
      cellEditorParams: {
        values: [ProvisionTypes.FIXED, ProvisionTypes.FORMULA, ProvisionTypes.LESSEROF2, ProvisionTypes.LESSEROF3],
      },
      valueGetter: ({ data }) => data.ProvisionType,
      valueSetter: ({ newValue, data }) => {
        data.ProvisionType = newValue

        if ([ProvisionTypes.FORMULA, ProvisionTypes.LESSEROF2, ProvisionTypes.LESSEROF3].includes(newValue))
          setProvisionToEdit({
            ...data,
            Formula: {
              ...data.Formula,
              FormulaVariables: data.Formula?.FormulaVariables?.map((v) => ({
                ...v,
                PriceTypeCvId: v.PriceTypeCvId?.toString() ?? null,
                PriceValuationRuleId: v.PriceValuationRuleId?.toString() ?? null,
              })),
            },
          })
      },
    },
    {
      headerName: 'Effective From',
      valueFormatter: ({ value }) => moment(value).format(dateFormat.DATE_SLASH),
      filter: 'agDateColumnFilter',
      field: 'FromDate',
      editable: canWrite,
      cellEditor: 'GraviDatePicker',
      cellEditorPopup: true,
      valueSetter: ({ data, newValue }) => {
        const isValidPriceDateChoice = moment(newValue).startOf('day').isSameOrBefore(moment(data.ToDate).endOf('day'))
        const isValidDetailDateChoice = moment(newValue)
          .startOf('day')
          .isSameOrAfter(moment(managedDetail?.FromDateTime).startOf('day'))
        const isValidContractDateChoice = moment(newValue)
          .startOf('day')
          .isSameOrAfter(moment(header?.EffectiveDates[0]).startOf('day'))

        if (isValidPriceDateChoice && isValidContractDateChoice && isValidDetailDateChoice) {
          data.FromDate = newValue
          return true
        }

        if (!isValidContractDateChoice) {
          message.error('Price Effective From Date must be after Contract Effective From Date')
          return false
        }

        if (!isValidDetailDateChoice) {
          message.error('Price Effective From Date must be after Detail From Date')
          return false
        }

        if (!isValidPriceDateChoice) {
          message.error('Price Effective From Date must be before Price Effective To Date')
          return false
        }
        return false
      },
    },
    {
      headerName: 'Effective To',
      valueFormatter: ({ value }) => moment(value).format(dateFormat.DATE_SLASH),
      filter: 'agDateColumnFilter',
      field: 'ToDate',
      editable: canWrite,
      cellEditorPopup: true,
      cellEditor: 'GraviDatePicker',
      valueSetter: ({ data, newValue }) => {
        const isValidPriceDateChoice = moment(newValue).endOf('day').isSameOrAfter(moment(data.FromDate).startOf('day'))
        const isValidDetailDateChoice = moment(newValue)
          .endOf('day')
          .isSameOrBefore(moment(header?.EffectiveDates[1]).endOf('day'))

        if (isValidPriceDateChoice && isValidDetailDateChoice) {
          data.ToDate = newValue
          return true
        }
        if (!isValidDetailDateChoice) {
          message.error('Price Effective To Date must be before Contract Effective To Date')
          return false
        }

        if (!isValidPriceDateChoice) {
          message.error('Price Effective To Date must be after Price Effective From Date')
          return false
        }

        return false
      },
    },

    {
      headerName: 'Currency',
      field: 'CurrencyId',
      editable: canWrite,
      cellEditor: SearchableSelect,
      cellEditorPopup: true,
      cellEditorParams: (params) => ({
        onKeyDown: stopCloseOnEnter(params),
        options: metadata?.CurrencyList?.map((option) => {
          return {
            value: option.Value,
            label: option.Text,
          }
        }),
      }),
      valueGetter: (props) => {
        return metadata?.CurrencyList?.find((option) => option.Value == props?.data?.CurrencyId)?.Text
      },
    },
    {
      headerName: 'UOM',
      field: 'UnitOfMeasureId',
      editable: canWrite,
      cellEditor: SearchableSelect,
      cellEditorPopup: true,
      cellEditorParams: (params) => ({
        showSearch: true,
        onKeyDown: stopCloseOnEnter(params),
        options: metadata?.UnitOfMeasureList?.map((option) => {
          return {
            value: option.Value,
            label: option.Text,
          }
        }),
      }),
      valueGetter: (props) => {
        return metadata?.UnitOfMeasureList?.find((option) => option.Value == props?.data?.UnitOfMeasureId)?.Text
      },
    },
    {
      headerName: 'Pay/Receive',
      field: 'PayOrReceiveCodeValueDisplay',
      editable: canWrite,
      cellEditorPopup: true,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: { values: metadata?.PayOrReceiveTypeList?.map((type) => type.Text) },
    },
    {
      headerName: 'Fixed Value',
      field: 'FixedValue',
      type: 'rightAligned',
      editable: ({ data }) => data.ProvisionType === ProvisionTypes.FIXED && canWrite,
      cellEditor: 'number',
      cellRenderer: ({ value, data }) => {
        if (data.ProvisionType === ProvisionTypes.FIXED) {
          if (isDefined(value)) {
            return (
              <Texto category='h5' align='right'>
                {fmt.currency(value)}
              </Texto>
            )
          }
          return (
            <Texto appearance='error' align='right' category='h5' weight='bold'>
              $0.0000
            </Texto>
          )
        }
        return <Texto appearance='medium'> N/A</Texto>
      },
      valueSetter: (params) => {
        if (params.newValue === '') {
          NotificationMessage('Value should be a number', 'Please enter a valid number.')
          return
        }
        validateFloat(params, 0)
      },
      valueGetter: ({ data }) => (data.ProvisionType === ProvisionTypes.FIXED ? data.FixedValue : null),
    },
  ]

  const actionsColumn = {
    headerName: 'Actions',
    field: 'ProvisionType',
    editable: false,
    width: 200,
    flex: 0,
    cellRenderer: ({ value, data }) => {
      return (
        <Horizontal verticalCenter justifyContent='right'>
          {value !== ProvisionTypes.FIXED && (
            <Button
              icon={<EditOutlined />}
              onClick={() =>
                setProvisionToEdit({
                  ...data,
                  Formula: {
                    ...data.Formula,
                    FormulaVariables: data.Formula?.FormulaVariables?.map((v) => ({
                      ...v,
                      PriceTypeCvId: v.PriceTypeCvId?.toString() ?? null,
                      PriceValuationRuleId: v.PriceValuationRuleId?.toString() ?? null,
                    })),
                  },
                })
              }
              style={{ color: 'var(--gray-500)', padding: '0', height: 'min-content', marginRight: '2rem' }}
              type='link'
            >
              Edit
            </Button>
          )}
          <Button danger onClick={() => deleteProvision(data)} type='text' icon={<DeleteOutlined />} />
        </Horizontal>
      )
    },
  }

  if (canWrite) {
    columns.push(actionsColumn)
  }

  return columns as ColDef[]
}

export function ProvisionType({ value }) {
  const displayIcon = () => {
    switch (value) {
      case ProvisionTypes.FIXED:
        return <LockFilled className='pr-1' />
      case ProvisionTypes.FORMULA:
        return <ExperimentOutlined className='pr-1' />
      case ProvisionTypes.LESSEROF2:
      case ProvisionTypes.LESSEROF3:
        return <VerticalAlignBottomOutlined className='pr-1' />
      default:
        return null
    }
  }
  if (value)
    return (
      <Horizontal>
        <BBDTag theme1={value !== 'Fixed'} className='px-2' style={{ width: 'fit-content' }}>
          {displayIcon()} {value}
        </BBDTag>
      </Horizontal>
    )

  return null
}

export function showPriceProvisionStatus({ data }) {
  if (data.Status === 'Needs Configuration') {
    return (
      <Tooltip title={data.Status}>
        <div>
          <Texto category='h6' appearance='warning'>
            <WarningFilled />
          </Texto>
        </div>
      </Tooltip>
    )
  }
  if (data.Status === 'Invalid Volume Basis') {
    return (
      <Tooltip title={data.Status}>
        <div>
          <Texto category='h6' appearance='warning'>
            <WarningFilled />
          </Texto>
        </div>
      </Tooltip>
    )
  }
  if (data.Status !== 'Valid') {
    return (
      <Tooltip title={data.Status}>
        <div>
          <Texto category='h6' appearance='error'>
            <WarningFilled />
          </Texto>
        </div>
      </Tooltip>
    )
  }

  return (
    <Tooltip title={data.Status}>
      <div>
        <Texto category='h4' appearance='success'>
          <CheckCircleFilled />
        </Texto>
      </div>
    </Tooltip>
  )
}
