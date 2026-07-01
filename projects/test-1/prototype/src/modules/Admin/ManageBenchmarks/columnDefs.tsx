import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { BBDTag, Texto } from '@gravitate-js/excalibrr'
import React from 'react'

export const createColumnDefs = ({ metadata }) => {
  const MarkerOptions = metadata?.Markers?.map((option) => ({
    value: option.Value,
    label: option.Text,
  }))

  return [
    {
      field: 'Name',
      headerName: 'Name',
      cellRenderer: (params) => <Texto>{params?.data?.Name}</Texto>,
      editable: true,
    },
    {
      field: 'IsActive',
      headerName: 'Active',
      maxWidth: 150,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      editable: true,
      filterParams: {
        valueFormatter: (params) => (params.value ? "Yes" : "No"),
      },
      cellEditorParams: {
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
      },
      cellRenderer: ({ value }) =>
        value ? (
          <BBDTag success style={{ textAlign: 'center' }}>
            Yes
          </BBDTag>
        ) : (
          <BBDTag error style={{ textAlign: 'center' }}>
            No
          </BBDTag>
        ),
    },
    {
      headerName: 'Marker',
      field: 'MarkerId',
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      editable: true,
      sortable: false,
      cellEditorParams: {
        showSearch: true,
        allowClear: true,
        closeOnBlur: true,
        options: MarkerOptions,
      },
      valueGetter: (params) => valueGetter(params?.data?.MarkerId, metadata?.Markers),
    },
    {
      headerName: 'Quote Configuration',
      field: 'QuoteBenchmarkAssociations',
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      editable: true,
      sortable: false,
      cellEditorParams: (params) => {
        const value = params?.data?.QuoteBenchmarkAssociations
        return {
          mode: 'multiple',
          options: metadata?.QuoteConfigurations?.map((option) => ({
            value: parseInt(option.Value),
            label: option.Text,
          })),
          value: value?.map((item) => item.QuoteConfigurationId),
        }
      },
      valueFormatter: (params) => {
        return params.data?.QuoteBenchmarkAssociations?.map((idObject) =>
          valueGetter(idObject.QuoteConfigurationId, metadata?.QuoteConfigurations)
        ).join(', ')
      },
      valueSetter: (params) => {
        params.data.QuoteBenchmarkAssociations = params.newValue.map((value) => ({
          QuoteConfigurationId: value,
        }))
        return true
      },
      valueGetter: (params) => {
        return params?.data?.QuoteBenchmarkAssociations?.map(
          (item) =>
            metadata?.QuoteConfigurations?.find((role) => role.Value === item.QuoteConfigurationId.toString())?.Text
        ).toString()
      },
    },
  ]
}

function valueGetter(value, list) {
  return list?.find((option) => option.Value?.toString() === value?.toString())?.Text || 'None'
}
