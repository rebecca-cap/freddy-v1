import { DeleteOutlined } from '@ant-design/icons'
import { NetGrossMetadataResponse } from '@api/useNetGross/types'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { Horizontal } from '@gravitate-js/excalibrr'
import { Input, Popconfirm } from 'antd'
import React from 'react'

export const getColumnDefs = (
  metadata: NetGrossMetadataResponse | undefined,
  netOrGrossDefaultTypeCvId: string,
  handleDelete
) => {
  const columns: any[] = []
  const NetGrossDefaultType = metadata?.NetOrGrossDefaultTypeList.find(
    (option) => option.Value === netOrGrossDefaultTypeCvId
  )

  const LocationOptions = metadata?.LocationList.map((option) => ({
    value: option.Value,
    label: option.Text,
  }))

  const ProductOptions = metadata?.ProductList.map((option) => ({
    value: option.Value,
    label: option.Text,
  }))

  const CounterPartyOptions = metadata?.CounterPartyList.map((option) => ({
    value: option.Value,
    label: option.Text,
  }))

  const NetOrGrossTypeOptions = metadata?.NetOrGrossTypeList.map((option) => ({
    value: option.Value,
    label: option.Text,
  }))

  const QuoteConfigurationOptions = metadata?.QuoteConfigurationList.map((option) => ({
    value: option.Value,
    label: option.Text,
  }))

  const TradeEntryTypeOptions = metadata?.TradeEntryTypeList.map((option) => ({
    value: option.Value,
    label: option.Text,
  }))

  const PriorityColumn = {
    headerName: 'Priority',
    field: 'Order',
    rowDrag: true,
    sortable: false,
    editable: false,
    cellRenderer: (params) => (
      <Input
        disabled
        value={params?.data?.Order}
        style={{
          width: `${params?.data?.Order.toString()?.length + 60}px`,
          textAlign: 'center',
        }}
      />
    ),
  }

  columns.push(PriorityColumn)

  columns.push(
    {
      headerName: 'Location',
      field: 'LocationId',
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      editable: true,
      sortable: false,
      cellEditorParams: {
        showSearch: true,
        allowClear: true,
        closeOnBlur: true,
        options: LocationOptions,
      },
      valueGetter: (params) => valueGetter(params?.data?.LocationId, metadata?.LocationList),
    },
    {
      headerName: 'Product',
      field: 'ProductId',
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      sortable: false,
      editable: true,
      filter: true,
      cellEditorParams: {
        showSearch: true,
        allowClear: true,
        closeOnBlur: true,
        options: ProductOptions,
      },
      valueGetter: (params) => valueGetter(params?.data?.ProductId, metadata?.ProductList),
    },
    {
      headerName: 'Counter Party',
      field: 'CounterPartyId',
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      sortable: false,
      editable: true,
      filter: true,
      cellEditorParams: {
        showSearch: true,
        allowClear: true,
        closeOnBlur: true,
        options: CounterPartyOptions,
      },
      valueGetter: (params) => valueGetter(params?.data?.CounterPartyId, metadata?.CounterPartyList),
    }
  )

  if (NetGrossDefaultType?.Text === 'Contract') {
    columns.push({
      headerName: 'Deal Type',
      field: 'TradeEntryTypeCvId',
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      editable: true,
      sortable: false,
      filter: true,
      cellEditorParams: {
        showSearch: true,
        allowClear: true,
        closeOnBlur: true,
        options: TradeEntryTypeOptions,
      },
      valueGetter: (params) => valueGetter(params?.data?.TradeEntryTypeCvId, metadata?.TradeEntryTypeList),
    })
  }
  if (NetGrossDefaultType?.Text === 'Quote Entry') {
    columns.push({
      headerName: 'Quote Config',
      field: 'QuoteConfigurationId',
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      editable: true,
      sortable: false,
      filter: true,
      cellEditorParams: {
        showSearch: true,
        allowClear: true,
        closeOnBlur: true,
        options: QuoteConfigurationOptions,
      },
      valueGetter: (params) => valueGetter(params?.data?.QuoteConfigurationId, metadata?.QuoteConfigurationList),
    })
  }

  columns.push({
    headerName: 'Net / Gross',
    field: 'NetOrGrossCvId',
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    editable: true,
    filter: true,
    sortable: false,
    cellEditorParams: {
      showSearch: true,
      allowClear: true,
      closeOnBlur: true,
      options: NetOrGrossTypeOptions,
    },
    valueGetter: (params) => valueGetter(params?.data?.NetOrGrossCvId, metadata?.NetOrGrossTypeList),
  })

  columns.push({
    field: '',
    headerName: 'Actions',
    suppressMovable: true,
    maxWidth: 100,
    pinned: 'right',
    sortable: false,
    cellRenderer: (params) => {
      return (
        <Horizontal horizontalCenter>
          <Popconfirm
            title='Are you sure you want to delete this quote?'
            onConfirm={() => handleDelete(params?.data?.NetGrossDefaultId)}
            okText='Yes'
            cancelText='No'
          >
            <DeleteOutlined style={{ color: 'var(--theme-error)' }} />
          </Popconfirm>
        </Horizontal>
      )
    },
  })

  return columns
}

function valueGetter(value, list) {
  return list?.find((option) => option.Value?.toString() === value?.toString())?.Text || 'None'
}
