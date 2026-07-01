import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { BBDTag, ManyTag } from '@gravitate-js/excalibrr'
import React from 'react'

export const getColumnDefs = (metadata, canWrite) => {
  const columns: any[] = []

  const AllowProtectedFieldUpdates = metadata?.Data?.AllowProtectedFieldUpdates
  const editable = canWrite && AllowProtectedFieldUpdates

  columns.push(
    {
      headerName: 'Loading Number',
      field: 'LoadNumber',
      flex: 1,
      editable,
      valueSetter: (params) => {
        const newValue = params?.newValue
        if (!newValue) {
          return false
        }
        params.data.LoadNumber = newValue
        return true
      },
    },
    {
      headerName: 'Display',
      field: 'Display',
      flex: 1,
      valueSetter: (params) => {
        const newValue = params?.newValue
        if (!newValue) {
          return false
        }
        params.data.Display = newValue
        return true
      },
    },
    {
      headerName: 'Customer',
      field: 'CustomerCounterPartyId',
      editable,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      minWidth: 180,
      cellEditorParams: {
        closeOnBlur: true,
        options: [
          {
            value: null,
            label: 'None',
          },
        ].concat(
          metadata?.Data?.CounterParties?.map((option) => ({
            value: option.Value,
            label: option.Text,
          }))
        ),
        showSearch: true,
      },
      flex: 1,
      valueGetter: (params) =>
        metadata?.Data?.CounterParties?.find(
          (option) => option.Value === params?.data?.CustomerCounterPartyId?.toString()
        )?.Text || 'None',
    },
    {
      headerName: 'Supplier',
      field: 'SupplierCounterPartyId',
      editable,
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
          metadata?.Data?.CounterParties?.map((option) => ({
            value: option.Value,
            label: option.Text,
          }))
        ),
      },
      flex: 1,
      valueGetter: (params) =>
        metadata?.Data?.CounterParties?.find(
          (option) => option.Value === params?.data?.SupplierCounterPartyId?.toString()
        )?.Text || 'None',
    },
    {
      headerName: 'Carrier',
      field: 'CarrierCounterPartyId',
      editable,
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
          metadata?.Data?.CounterParties?.map((option) => ({
            value: option.Value,
            label: option.Text,
          }))
        ),
      },
      flex: 1,
      valueGetter: (params) =>
        metadata?.Data?.CounterParties?.find(
          (option) => option.Value === params?.data?.CarrierCounterPartyId?.toString()
        )?.Text || 'None',
    },
    {
      headerName: 'Product',
      field: 'ProductId',
      editable,
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
          metadata?.Data?.Products?.map((option) => ({
            value: option.Value,
            label: option.Text,
          }))
        ),
      },
      flex: 1,
      valueGetter: (params) =>
        metadata?.Data?.Products?.find((option) => option.Value === params?.data?.ProductId?.toString())?.Text ||
        'None',
    },
    {
      headerName: 'Origin',
      field: 'OriginLocationId',
      editable,
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
          metadata?.Data?.Locations?.map((option) => ({
            value: option.Value,
            label: option.Text,
          }))
        ),
      },
      flex: 1,
      valueGetter: (params) =>
        metadata?.Data?.Locations?.find((option) => option.Value === params?.data?.OriginLocationId?.toString())
          ?.Text || 'None',
    },
    {
      headerName: 'Destination',
      field: 'DestinationLocationId',
      editable,
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
          metadata?.Data?.Locations?.map((option) => ({
            value: option.Value,
            label: option.Text,
          }))
        ),
      },
      valueGetter: (params) =>
        metadata?.Data?.Locations?.find((option) => option.Value === params?.data?.DestinationLocationId?.toString())
          ?.Text || 'None',
    },
    {
      headerName: 'Tax Destination',
      field: 'TaxLocationId',
      editable,
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
          metadata?.Data?.Locations?.map((option) => ({
            value: option.Value,
            label: option.Text,
          }))
        ),
      },
      flex: 1,
      valueGetter: (params) =>
        metadata?.Data?.Locations?.find((option) => option.Value === params?.data?.TaxLocationId?.toString())?.Text ||
        'None',
    },
    {
      headerName: 'Trade Type',
      field: 'TradeTypeCvId',
      editable,
      maxWidth: 120,
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
          metadata?.Data?.TradeTypes?.map((option) => ({
            value: option.Value,
            label: option.Text,
          }))
        ),
      },
      flex: 1,
      valueGetter: (params) =>
        metadata?.Data?.TradeTypes?.find((option) => option.Value === params?.data?.TradeTypeCvId?.toString())?.Text ||
        'None',
    },
    {
      headerName: 'Instruments',
      field: 'MarketPlatformInstrumentAssociations',
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      required: true,
      minWidth: 300,
      cellEditorParams: (params) => {
        const value = params?.data?.MarketPlatformInstrumentAssociations
        return {
          mode: 'multiple',
          options: metadata?.Data?.MarketPlatformInstruments?.map((option) => ({
            value: parseInt(option.Value),
            label: option.Text,
          })),
          value: value?.map((item) => item.MarketPlatformInstrumentId),
        }
      },
      valueSetter: (params) => {
        params.data[params.colDef.field] = params.newValue?.map((id) => {
          return {
            MarketPlatformInstrumentId: id,
            Name: metadata?.Data?.MarketPlatformInstruments?.find((role) => role.Value === id.toString())?.Text,
          }
        })
      },
      cellRenderer: (params) => {
        const value = params?.data?.MarketPlatformInstrumentAssociations
        if (value?.length) {
          return (
            <ManyTag
              tagItems={value?.map(
                (item) =>
                  metadata?.Data?.MarketPlatformInstruments?.find(
                    (role) => role.Value === item.MarketPlatformInstrumentId.toString()
                  )?.Text
              )}
              maxCount={20}
            />
          )
        }
        return ''
      },
      valueGetter: (params) => {
        return params?.data?.MarketPlatformInstrumentAssociations?.map(
          (item) =>
            metadata?.Data?.MarketPlatformInstruments?.find(
              (role) => role.Value === item.MarketPlatformInstrumentId.toString()
            )?.Text
        ).toString()
      },
      filter: true,
    },
    {
      headerName: 'Notes',
      field: 'Notes',
      flex: 1,
    },
    {
      headerName: 'Is Active',
      field: 'IsActive',
      maxWidth: 100,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      valueFormatter: ({ value }) => (value ? 'Active' : 'Inactive'),
      cellEditorParams: {
        options: [
          {
            value: true,
            label: 'Active',
          },
          {
            value: false,
            label: 'Inactive',
          },
        ],
        showSearch: false,
        allowClear: false,
      },
      cellRenderer: ({ value }) =>
        value ? (
          <BBDTag success style={{ textAlign: 'center', width: 80 }}>
            Active
          </BBDTag>
        ) : (
          <BBDTag error style={{ textAlign: 'center', width: 80 }}>
            Inactive
          </BBDTag>
        ),
    }
  )

  return columns
}

function valueGetter(value, list) {
  return list?.find((option) => option.Value?.toString() === value?.toString())?.Text || 'None'
}
