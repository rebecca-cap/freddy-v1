import { CopyOutlined, DeleteOutlined, UserOutlined, WarningFilled } from '@ant-design/icons'
import { PriceTranslationUpdatePayload } from '@api/usePriceTranslations'
import { PriceTranslationMetadata } from '@api/usePriceTranslations/types'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { Horizontal } from '@gravitate-js/excalibrr'
import { UseMutationResult } from '@tanstack/react-query'
import { toAntOption } from '@utils/index'
import { Button, Checkbox, Popconfirm, Switch } from 'antd'
import React from 'react'

type MutateFn = UseMutationResult<any, unknown, PriceTranslationUpdatePayload, unknown>

interface PriceTranslationColumnDefs {
  enableTranslation: MutateFn
  disableTranslation: MutateFn
  ignoreConflictsTranslation: MutateFn
  respectConflictsTranslation: MutateFn
  deleteTranslation: MutateFn
  filterChecked: boolean
  duplicateRow: (existingRow: any) => void
  removeDuplicatedRow: (row: any) => void
  metadata: PriceTranslationMetadata
  canWrite: boolean
}

function DuplicatedTargetDropdown(options, idField, nameField) {
  return {
    field: idField,

    editable: ({ data }) => !!data?.IsDuplicated,
    cellEditor: SearchableSelect,
    cellEditorParams: {
      showSearch: true,
      closeOnBlur: true,
      options: options?.map(toAntOption) || [],
    },
    valueGetter: ({ data }) =>
      options?.find((option) => option.Value?.toString() === data?.[idField]?.toString())?.Text || '',
    valueSetter: ({ data, newValue }) => {
      data[idField] = parseInt(newValue)
      data[nameField] = options.find((option) => option.Value?.toString() === newValue)?.Text || ''
      return true
    },
  }
}

function DuplicatedSourceDropdown(options, idField, nameField, show: 'id' | 'display' = 'id') {
  return {
    field: show === 'id' ? idField : nameField,
    editable: ({ data }) => !!data?.IsDuplicated,
    cellEditor: SearchableSelect,
    cellEditorParams: {
      showSearch: true,
      closeOnBlur: true,
      options: options?.map(toAntOptionWithValue) || [],
    },
    valueSetter: ({ data, newValue }) => {
      data[idField] = newValue
      data[nameField] = options.find((option) => option.Value?.toString() === newValue)?.Text || ''
      return true
    },
  }
}

function SourceColumn(name, fieldName, options, rowGroup, rowGroupIndex) {
  return {
    field: `${name}SourceIdentifier`,
    editable: false,
    headerName: name,
    children: [
      {
        headerName: 'ID',
        maxWidth: 120,
        ...DuplicatedSourceDropdown(options, `${fieldName}SourceIdentifier`, `${fieldName}SourceDisplay`, 'id'),
      },
      {
        headerName: 'Display',
        rowGroup,
        rowGroupIndex,
        ...DuplicatedSourceDropdown(options, `${fieldName}SourceIdentifier`, `${fieldName}SourceDisplay`, 'display'),
      },
    ],
  }
}

const toAntOptionWithValue = <T extends { Text: string; Value: any }>(item: T) => ({
  value: item.Value,
  label: item.Value === item.Text ? item.Text : `${item.Value} - ${item.Text}`,
})

export const getPriceTranslationColumnDefs = ({
  enableTranslation,
  disableTranslation,
  ignoreConflictsTranslation,
  respectConflictsTranslation,
  deleteTranslation,
  filterChecked,
  duplicateRow,
  removeDuplicatedRow,
  metadata,
  canWrite,
}: PriceTranslationColumnDefs) => {
  const columns = [
    {
      headerName: 'Source',

      children: [
        {
          lockPosition: 'left',
          headerName: 'Conflict',
          filterValueGetter: (params) => {
            return params?.data?.HasConflict ? 'Conflict' : 'No Conflict'
          },
          maxWidth: 120,
          comparator: (_, __, rowA, rowB) => {
            return rowA?.data?.HasConflict ? -1 : 1
          },
          cellRenderer: ({ data }) => {
            if (!data.HasConflict) return ''
            return <WarningFilled style={{ color: 'var(--theme-error)' }} />
          },
        },
        {
          field: 'IsUserEntered',
          editable: false,
          headerName: 'Type',
          maxWidth: 110,
          cellRenderer: ({ data }) => {
            if (data.IsUserEntered) return <UserOutlined style={{ color: 'var(--theme-warning)' }} />
            return ''
          },
          valueGetter: ({ data }) => (data.IsUserEntered ? 'User' : 'System'),
        },
      ],
    },
    SourceColumn('Counterparty', 'CounterParty', metadata?.SupplierSourceValues, filterChecked, 1),
    SourceColumn('Product', 'Product', metadata?.ProductSourceValues, filterChecked, 2),
    SourceColumn('Location', 'Location', metadata?.LocationSourceValues, filterChecked, 3),
    {
      field: 'TargetProductId',
      editable: false,
      headerName: 'Target',
      children: [
        {
          headerName: 'Product',
          ...DuplicatedTargetDropdown(metadata?.Products, 'TargetProductId', 'TargetProductName'),
        },
        {
          headerName: 'Location',
          ...DuplicatedTargetDropdown(metadata?.Locations, 'TargetLocationId', 'TargetLocationName'),
        },
        {
          headerName: 'Counterparty',
          ...DuplicatedTargetDropdown(metadata?.CounterParties, 'TargetCounterPartyId', 'TargetCounterPartyName'),
        },
        {
          headerName: 'Publisher',
          ...DuplicatedTargetDropdown(metadata?.PricePublishers, 'TargetPricePublisherId', 'TargetPricePublisherName'),
        },
      ],
    },
  ]

  const actionColumn = {
    minWidth: 300,
    editable: false,
    headerName: 'Actions',
    cellRenderer: ({ data }) => {
      if (data.IsDuplicated)
        return (
          <Horizontal style={{ gap: '1rem', justifyContent: 'flex-end' }}>
            <Button icon={<DeleteOutlined />} danger size='small' onClick={() => removeDuplicatedRow(data)} />
          </Horizontal>
        )

      return (
        <Horizontal style={{ gap: '1rem', justifyContent: 'flex-end' }}>
          <Switch
            unCheckedChildren='Disabled'
            checkedChildren='Enabled'
            checked={data.StatusMeaning === 'Active'}
            onChange={(checked) => {
              if (checked) {
                enableTranslation.mutate({ IdentifierId: data.PriceImportTranslatedIdentifierId })
              } else {
                disableTranslation.mutate({ IdentifierId: data.PriceImportTranslatedIdentifierId })
              }
            }}
            style={{ width: 100 }}
          />
          <Checkbox
            className='mr-2'
            checked={data.IgnoreConflicts}
            onChange={(e) => {
              if (e.target.checked) {
                ignoreConflictsTranslation.mutate({ IdentifierId: data.PriceImportTranslatedIdentifierId })
              } else {
                respectConflictsTranslation.mutate({ IdentifierId: data.PriceImportTranslatedIdentifierId })
              }
            }}
          >
            Ignore Conflicts
          </Checkbox>
          <Button icon={<CopyOutlined />} onClick={() => duplicateRow(data)} size='small' />
          <Popconfirm
            title='Delete translation'
            onConfirm={() => deleteTranslation.mutate({ IdentifierId: data.PriceImportTranslatedIdentifierId })}
            okText='Yes'
            cancelText='No'
          >
            <Button icon={<DeleteOutlined />} danger size='small' />
          </Popconfirm>
        </Horizontal>
      )
    },
  }

  if (canWrite) {
    columns.push(actionColumn)
  }
  return columns
}
