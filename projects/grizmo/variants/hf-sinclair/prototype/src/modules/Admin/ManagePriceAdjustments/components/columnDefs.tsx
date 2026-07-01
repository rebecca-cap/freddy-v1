import { DeleteFilled } from '@ant-design/icons'
import { stopCloseOnEnter, suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'
import { GraviButton } from '@gravitate-js/excalibrr'
import { message } from 'antd'
import React from 'react'

export function getColumnDefs(metadata, handleDelete, canWrite) {
  return [
    {
      field: '',
      cellRenderer: 'agGroupCellRenderer',
      headerName: '',
      maxWidth: 50,
      editable: false,
      suppressMenu: true,
      sortable: false,
    },
    {
      headerName: 'Market Instrument',
      field: 'MarketPlatformInstrumentId',
      editable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        allowClear: true,
        showSearch: true,
        options: [
          {
            value: null,
            label: 'None',
          },
        ].concat(
          metadata?.MarketPlatformInstrumentList?.map((option) => ({
            value: option.Value,
            label: option.Text,
          }))
        ),
      },
      flex: 1,
      valueGetter: (params) =>
        metadata?.MarketPlatformInstrumentList?.find(
          (option) => option.Value === params?.data?.MarketPlatformInstrumentId?.toString()
        )?.Text || 'None',
    },
    {
      headerName: 'Product',
      field: 'ProductId',
      editable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        allowClear: true,
        showSearch: true,
        options: [
          {
            value: null,
            label: 'None',
          },
        ].concat(
          metadata?.ProductList?.map((option) => ({
            value: option.Value,
            label: option.Text,
          }))
        ),
      },
      flex: 1,
      valueGetter: (params) =>
        metadata?.ProductList?.find((option) => option.Value === params?.data?.ProductId?.toString())?.Text || 'None',
    },
    {
      headerName: 'Location',
      field: 'LocationId',
      editable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        allowClear: true,
        showSearch: true,
        options: [
          {
            value: null,
            label: 'None',
          },
        ].concat(
          metadata?.LocationList?.map((option) => ({
            value: option.Value,
            label: option.Text,
          }))
        ),
      },
      flex: 1,
      valueGetter: (params) =>
        metadata?.LocationList?.find((option) => option.Value === params?.data?.LocationId.toString())?.Text || 'None',
    },
    {
      headerName: '',
      field: 'MarketPlatformPriceAdjustmentHeaderId',
      maxWidth: 40,
      pinned: 'right',
      editable: false,
      sortable: false,
      suppressMenu: true,
      cellRenderer: ({ value }) => (
        <GraviButton
          className='ghost-gravi-button'
          icon={<DeleteFilled style={{ color: 'var(--theme-error)', fontSize: 15 }} />}
          onClick={() => handleDelete(value)}
          disabled={!canWrite}
        />
      ),
    },
  ]
}

export const getAdjustmentDetailsColumnDefs = (metadata, setHasChanges, handleDeleteDetail, canWrite) => {
  const columns: any[] = []

  const defaultColumnProps = {
    rowHeight: 10,
    enableRowGroup: false,
    suppressMenu: true,
    suppressMovable: true,
    sortable: false,
  }
  columns.push(
    {
      headerName: 'Duration (days)',
      field: 'Duration',
      valueFormatter: ({ value }) => fmt.decimal(value, 0),
      editable: canWrite,
      flex: 1,
      ...defaultColumnProps,
      valueSetter: (params) => {
        const { newValue } = params
        if (params.newValue < 1) {
          message.error('Duration cannot be less than 1')
          return false
        }
        setHasChanges(true)
        params.data.Duration = newValue
        return true
      },
    },
    {
      headerName: 'Quantity From',
      field: 'QuantityFrom',
      valueFormatter: ({ value }) => fmt.decimal(value, 0),
      editable: canWrite,
      flex: 1,
      ...defaultColumnProps,
    },
    {
      headerName: 'Quantity To',
      field: 'QuantityTo',
      valueFormatter: ({ value }) => fmt.decimal(value, 0),
      editable: canWrite,
      flex: 1,
      ...defaultColumnProps,
    },
    {
      flex: 1,
      headerName: 'Price Adj.',
      field: 'Price',
      editable: canWrite,
      valueFormatter: fmt.currency,
      cellStyle: { textAlign: 'right' },
      ...defaultColumnProps,
    },
    {
      headerName: 'UOM',
      field: 'UnitOfMeasureId',
      editable: canWrite,
      cellEditor: SearchableSelect,
      cellEditorPopup: true,
      cellEditorParams: (params) => ({
        onKeyDown: stopCloseOnEnter(params),
        allowClear: true,
        showSearch: true,
        closeOnBlur: true,
        options: metadata?.UnitOfMeasureList?.map((option) => ({
          value: option.Value,
          label: option.Text,
        })),
      }),
      flex: 1,
      valueGetter: (params) =>
        metadata?.UnitOfMeasureList?.find((option) => option.Value === params?.data?.UnitOfMeasureId?.toString())
          ?.Text || 'None',
      ...defaultColumnProps,
    },
    {
      headerName: '',
      field: 'MarketPlatformPriceAdjustmentDetailId',
      maxWidth: 40,
      editable: false,
      cellRenderer: (params) => {
        const { value } = params
        if (!params?.data?.$inserted)
          return (
            <GraviButton
              className='ghost-gravi-button'
              icon={<DeleteFilled style={{ color: 'var(--theme-error)', fontSize: 15 }} />}
              onClick={() => handleDeleteDetail(value)}
              disabled={!canWrite}
            />
          )
      },
      ...defaultColumnProps,
    }
  )

  return columns
}
